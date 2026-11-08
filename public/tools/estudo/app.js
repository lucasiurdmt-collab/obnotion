/**
 * Scriptura - App Controller Principal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização dos motores
  const srs = new SRSEngine();
  const audio = new AudioEngine();

  // Estado da Aplicação
  let currentLang = localStorage.getItem('scriptura_lang') || 'ru';
  let activeTab = 'verses';
  let currentReviewList = [];
  let currentCardIndex = 0;
  let isAnswerRevealed = false;

  // Elementos do DOM
  const btnLangRu = document.getElementById('btnLangRu');
  const btnLangEn = document.getElementById('btnLangEn');
  const mainTabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const ankiBadge = document.getElementById('ankiBadge');

  // Verses DOM (Os 5 Quadrados do Dia)
  const versesGrid = document.getElementById('versesGrid');
  const versesHeroTitle = document.getElementById('versesHeroTitle');
  const versesHeroDesc = document.getElementById('versesHeroDesc');

  // Modais
  const modalLesson = document.getElementById('modalLesson');
  const modalLessonContent = document.getElementById('modalLessonContent');
  const modalNewCard = document.getElementById('modalNewCard');
  const formNewCard = document.getElementById('formNewCard');

  // Anki DOM
  const statDue = document.getElementById('statDue');
  const statTotal = document.getElementById('statTotal');
  const statLearned = document.getElementById('statLearned');
  const reviewArena = document.getElementById('reviewArena');
  const reviewFront = document.getElementById('reviewFront');
  const reviewHint = document.getElementById('reviewHint');
  const reviewBackArea = document.getElementById('reviewBackArea');
  const reviewBackText = document.getElementById('reviewBackText');
  const reviewExample = document.getElementById('reviewExample');
  const reviewContext = document.getElementById('reviewContext');
  const btnShowAnswer = document.getElementById('btnShowAnswer');
  const ankiGradesGrid = document.getElementById('ankiGradesGrid');
  const btnReviewAudioFront = document.getElementById('btnReviewAudioFront');
  const cardsTableBody = document.getElementById('cardsTableBody');
  const filterLangSelect = document.getElementById('filterLangSelect');

  // Toast
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ================= MODERN DIALOG SETUP (modern-web-guidance) =================
  [modalLesson, modalNewCard].forEach(dialog => {
    if (dialog && !('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) dialog.close();
      });
    }
  });

  document.querySelectorAll('.btn-close-dialog').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dialog = e.target.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  // ================= CONTROLE DE IDIOMA =================
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('scriptura_lang', lang);

    if (lang === 'ru') {
      btnLangRu.classList.add('active');
      btnLangEn.classList.remove('active');
      versesHeroTitle.textContent = 'Versículos em Russo Contemporâneo (НРП)';
      versesHeroDesc.textContent = '5 versículos selecionados do Novo Testamento com acentos tônicos (ударения) e vocabulário vivo. Clique no quadrado para abrir a aula.';
    } else {
      btnLangEn.classList.add('active');
      btnLangRu.classList.remove('active');
      versesHeroTitle.textContent = 'Contemporary English Verses (NLT)';
      versesHeroDesc.textContent = '5 selected New Testament verses in modern 21st-century English without archaisms. Click on any square to open the lesson.';
    }

    renderVerses();
    updateAnkiBadge();
    if (activeTab === 'anki') {
      renderAnkiView();
    }
  }

  btnLangRu.addEventListener('click', () => setLanguage('ru'));
  btnLangEn.addEventListener('click', () => setLanguage('en'));

  // ================= CONTROLE DE ABAS =================
  mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      activeTab = target;

      mainTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tab-${target}`).classList.add('active');

      if (target === 'anki') {
        renderAnkiView();
      } else if (target === 'verses') {
        renderVerses();
      }
    });
  });

  function updateAnkiBadge() {
    const dueCount = srs.getDueCards(currentLang).length;
    if (dueCount > 0) {
      ankiBadge.textContent = dueCount;
      ankiBadge.style.display = 'inline-block';
    } else {
      ankiBadge.style.display = 'none';
    }
  }

  // ================= RENDERIZAR OS 5 QUADRADOS DO DIA =================
  function renderVerses() {
    const list = window.getDailyVerses ? window.getDailyVerses(currentLang) : [];
    versesGrid.innerHTML = '';

    if (list.length === 0) {
      versesGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">Carregando versículos...</p>';
      return;
    }

    list.forEach(v => {
      const card = document.createElement('article');
      card.className = 'verse-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Abrir aula de ${v.reference}`);

      card.innerHTML = `
        <div>
          <div class="card-top">
            <span class="verse-ref">${v.reference}</span>
            <span class="verse-version-tag">${v.version}</span>
          </div>
          <div class="verse-body">${v.text}</div>
          <div class="verse-pt-preview">"${v.translation_pt}"</div>
        </div>
        <div class="card-actions">
          <button class="btn-audio" type="button" data-text="${encodeURIComponent(v.text)}" data-lang="${currentLang}">
            🔊 Ouvir
          </button>
          <span class="btn-study">Abrir Aula ➔</span>
        </div>
      `;

      // Botão de áudio toca a pronúncia
      const btnAudio = card.querySelector('.btn-audio');
      btnAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        const textToSpeak = decodeURIComponent(btnAudio.dataset.text);
        audio.speak(textToSpeak, currentLang);
      });

      // Clicar no quadrado abre a aula instantaneamente
      card.addEventListener('click', () => {
        openLesson(v);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLesson(v);
        }
      });

      versesGrid.appendChild(card);
    });
  }

  // ================= ABRIR AULA DO VERSÍCULO (MODAL) =================
  function openLesson(v) {
    document.getElementById('lessonTitle').textContent = `Aula: ${v.reference} (${v.theme})`;
    
    let expressionsHtml = '';
    v.analysis.expressions.forEach((exp) => {
      expressionsHtml += `
        <div class="expression-box">
          <div class="expression-head">
            <span class="expression-phrase">${exp.phrase}</span>
            <button class="btn-add-anki btn-add-exp" 
              data-front="${encodeURIComponent(exp.anki_front)}" 
              data-back="${encodeURIComponent(exp.anki_back)}"
              data-hint="${encodeURIComponent(exp.anki_hint)}"
              data-ref="${encodeURIComponent(v.reference)}"
              data-lang="${currentLang}">
              + Adicionar ao Anki
            </button>
          </div>
          <div class="expression-meaning">💡 <strong>O que quer dizer:</strong> ${exp.meaning}</div>
          <div class="expression-why">
            <strong>🧩 Entendendo pedaço por pedaço:</strong><br>
            ${exp.how_it_works}
          </div>
        </div>
      `;
    });

    let examplesHtml = '';
    v.analysis.daily_examples.forEach((ex) => {
      examplesHtml += `
        <div class="example-item">
          <div class="example-target">
            <span>${ex.target}</span>
            <button class="btn-audio btn-audio-small" type="button" data-text="${encodeURIComponent(ex.target)}" data-lang="${currentLang}">
              🔊
            </button>
          </div>
          <div class="example-pt">${ex.pt}</div>
          <div class="example-ctx">📍 ${ex.context}</div>
        </div>
      `;
    });

    modalLessonContent.innerHTML = `
      <div class="lesson-verse-banner">
        <div class="card-top">
          <span class="verse-ref">${v.reference}</span>
          <button class="btn-add-anki btn-add-fullverse"
            data-front="${encodeURIComponent(v.text)}"
            data-back="${encodeURIComponent(v.translation_pt)}"
            data-ref="${encodeURIComponent(v.reference)}"
            data-lang="${currentLang}">
            + Guardar Versículo no Anki
          </button>
        </div>
        <div class="lesson-verse-text">${v.text}</div>
        <div class="lesson-verse-trans">"${v.translation_pt}"</div>
        <button class="btn-audio" type="button" data-text="${encodeURIComponent(v.text)}" data-lang="${currentLang}">
          🔊 Ouvir Versículo Completo
        </button>
      </div>

      <div>
        <h3 style="font-size: 1.1rem; margin-bottom: 12px; color: var(--accent-blue);">
          🔍 Expressões & Combinações Vivas (Linguagem Real)
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
          ${v.analysis.intro}
        </p>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${expressionsHtml}
        </div>
      </div>

      <div>
        <h3 style="font-size: 1.1rem; margin-bottom: 12px; color: var(--accent-emerald);">
          💬 Como Falar Isso no Dia a Dia (Exemplos Práticos)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${examplesHtml}
        </div>
      </div>
    `;

    // Conectar botões de áudio
    modalLessonContent.querySelectorAll('.btn-audio').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        const lang = btn.dataset.lang;
        audio.speak(text, lang);
      });
    });

    // Conectar botões de adicionar ao Anki
    modalLessonContent.querySelectorAll('.btn-add-exp').forEach(btn => {
      btn.addEventListener('click', () => {
        const front = decodeURIComponent(btn.dataset.front);
        const back = decodeURIComponent(btn.dataset.back);
        const hint = decodeURIComponent(btn.dataset.hint);
        const ref = decodeURIComponent(btn.dataset.ref);
        const lang = btn.dataset.lang;

        const res = srs.addFromStudy({
          front,
          back,
          context: ref,
          example: hint,
          language: lang,
          reference: ref
        });

        if (res.success) {
          showToast(`✅ "${front}" adicionado ao seu Anki!`);
          btn.textContent = '✓ No seu Anki';
          btn.style.opacity = '0.6';
          updateAnkiBadge();
        } else {
          showToast(res.message);
        }
      });
    });

    modalLessonContent.querySelectorAll('.btn-add-fullverse').forEach(btn => {
      btn.addEventListener('click', () => {
        const front = decodeURIComponent(btn.dataset.front);
        const back = decodeURIComponent(btn.dataset.back);
        const ref = decodeURIComponent(btn.dataset.ref);
        const lang = btn.dataset.lang;

        const res = srs.addFromStudy({
          front,
          back,
          context: `Versículo completo (${ref})`,
          example: '',
          language: lang,
          reference: ref
        });

        if (res.success) {
          showToast(`✅ Versículo de ${ref} adicionado ao Anki!`);
          btn.textContent = '✓ No seu Anki';
          btn.style.opacity = '0.6';
          updateAnkiBadge();
        } else {
          showToast(res.message);
        }
      });
    });

    modalLesson.showModal();
  }

  // ================= SISTEMA ANKI (SRS) =================
  function renderAnkiView() {
    updateAnkiStats();
    loadAnkiReviewSession();
    renderCardsTable();
  }

  function updateAnkiStats() {
    const stats = srs.getStats(currentLang);
    statDue.textContent = stats.due;
    statTotal.textContent = stats.total;
    statLearned.textContent = stats.learned;
    updateAnkiBadge();
  }

  function loadAnkiReviewSession() {
    currentReviewList = srs.getDueCards(currentLang);
    currentCardIndex = 0;
    isAnswerRevealed = false;
    renderCurrentReviewCard();
  }

  function renderCurrentReviewCard() {
    const totalLangCards = srs.cards.filter(c => c.language === currentLang).length;

    // Se o usuário ainda não adicionou nenhum card no baralho
    if (totalLangCards === 0) {
      reviewArena.innerHTML = `
        <div style="text-align: center; margin: auto; padding: 40px 20px;">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">📭</div>
          <h3 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
            Seu Anki está vazio no momento
          </h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 440px; margin: 0 auto 20px;">
            Nenhum card foi adicionado ainda em <strong>${currentLang === 'ru' ? 'Russo' : 'Inglês'}</strong>. 
            Você e sua namorada podem adicionar palavras abrindo os versículos do dia ou clicando no botão abaixo:
          </p>
          <button class="btn-primary" id="btnEmptyCreateCard">
            + Criar Primeiro Card do Zero
          </button>
        </div>
      `;

      const btnEmptyCreate = document.getElementById('btnEmptyCreateCard');
      if (btnEmptyCreate) {
        btnEmptyCreate.addEventListener('click', () => {
          modalNewCard.showModal();
        });
      }
      return;
    }

    // Se já revisou todos os agendados de hoje
    if (currentReviewList.length === 0 || currentCardIndex >= currentReviewList.length) {
      reviewArena.innerHTML = `
        <div style="text-align: center; margin: auto; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
          <h3 style="font-size: 1.4rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
            Parabéns! Todas as revisões concluídas por hoje!
          </h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 440px; margin: 0 auto 24px;">
            Você revisou todos os cartões agendados pelo algoritmo SM-2 para o idioma 
            <strong>${currentLang === 'ru' ? 'Russo' : 'Inglês'}</strong>.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" id="btnRestartReview">
              🔄 Revisar Todos Novamente
            </button>
            <button class="btn-secondary" id="btnOpenNewCard">
              + Criar Novo Card
            </button>
          </div>
        </div>
      `;

      const btnRestart = document.getElementById('btnRestartReview');
      if (btnRestart) {
        btnRestart.addEventListener('click', () => {
          currentReviewList = srs.cards.filter(c => c.language === currentLang);
          currentCardIndex = 0;
          isAnswerRevealed = false;
          restoreReviewArenaMarkup();
          renderCurrentReviewCard();
        });
      }

      const btnNew = document.getElementById('btnOpenNewCard');
      if (btnNew) {
        btnNew.addEventListener('click', () => {
          modalNewCard.showModal();
        });
      }
      return;
    }

    const card = currentReviewList[currentCardIndex];
    reviewFront.textContent = card.front;
    reviewHint.textContent = card.hint ? `💡 Dica: ${card.hint}` : '';
    reviewBackText.textContent = card.back;
    reviewContext.textContent = card.context ? `📖 Contexto: ${card.context}` : '';
    
    if (card.example) {
      reviewExample.style.display = 'block';
      reviewExample.textContent = `💬 Exemplo: ${card.example}`;
    } else {
      reviewExample.style.display = 'none';
    }

    // Estado oculto da resposta
    reviewBackArea.style.display = 'none';
    btnShowAnswer.style.display = 'inline-block';
    ankiGradesGrid.style.display = 'none';

    // Prévias de tempo para os 4 botões do Anki
    const previews = srs.getIntervalPreviews(card);
    document.getElementById('intervalAgain').textContent = previews.again;
    document.getElementById('intervalHard').textContent = previews.hard;
    document.getElementById('intervalGood').textContent = previews.good;
    document.getElementById('intervalEasy').textContent = previews.easy;
  }

  function restoreReviewArenaMarkup() {
    reviewArena.innerHTML = `
      <div class="review-card-face">
        <span class="review-badge" id="reviewBadge">Card de Repetição Espaçada</span>
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
          <h2 class="review-front-text" id="reviewFront">Carregando...</h2>
          <button class="btn-audio btn-audio-small" id="btnReviewAudioFront" type="button" title="Ouvir">🔊</button>
        </div>
        <div class="review-hint" id="reviewHint"></div>

        <div class="review-back-area" id="reviewBackArea" style="display: none;">
          <div class="review-back-text" id="reviewBackText"></div>
          <div class="review-context" id="reviewContext" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;"></div>
          <div class="review-example" id="reviewExample" style="display: none;"></div>
        </div>
      </div>

      <div class="review-actions">
        <button class="btn-show-answer" id="btnShowAnswer">
          Mostrar Resposta (Espaço)
        </button>

        <div class="anki-grades-grid" id="ankiGradesGrid" style="display: none;">
          <button class="grade-btn again" data-grade="1">
            <span class="interval-label" id="intervalAgain">&lt; 1 d</span>
            <span class="name-label">1. Errei</span>
          </button>
          <button class="grade-btn hard" data-grade="2">
            <span class="interval-label" id="intervalHard">1 d</span>
            <span class="name-label">2. Difícil</span>
          </button>
          <button class="grade-btn good" data-grade="3">
            <span class="interval-label" id="intervalGood">3 d</span>
            <span class="name-label">3. Bom</span>
          </button>
          <button class="grade-btn easy" data-grade="4">
            <span class="interval-label" id="intervalEasy">7 d</span>
            <span class="name-label">4. Fácil</span>
          </button>
        </div>
      </div>
    `;
    attachReviewEvents();
  }

  function attachReviewEvents() {
    const showBtn = document.getElementById('btnShowAnswer');
    const gradesGrid = document.getElementById('ankiGradesGrid');
    const backArea = document.getElementById('reviewBackArea');
    const audioBtn = document.getElementById('btnReviewAudioFront');

    if (showBtn) {
      showBtn.addEventListener('click', () => {
        isAnswerRevealed = true;
        showBtn.style.display = 'none';
        backArea.style.display = 'block';
        gradesGrid.style.display = 'grid';
      });
    }

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const text = document.getElementById('reviewFront').textContent;
        audio.speak(text, currentLang);
      });
    }

    document.querySelectorAll('.grade-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const grade = parseInt(btn.dataset.grade, 10);
        submitCardGrade(grade);
      });
    });
  }

  function submitCardGrade(grade) {
    if (currentCardIndex >= currentReviewList.length) return;
    const currentCard = currentReviewList[currentCardIndex];

    srs.schedule(currentCard, grade);

    if (grade === 1) {
      currentReviewList.push(currentCard);
    }

    currentCardIndex++;
    isAnswerRevealed = false;
    updateAnkiStats();
    renderCurrentReviewCard();
    renderCardsTable();
  }

  // Atalhos de teclado no modo estudo
  document.addEventListener('keydown', (e) => {
    if (activeTab !== 'anki') return;
    if (modalLesson.open || modalNewCard.open) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (!isAnswerRevealed) {
        const showBtn = document.getElementById('btnShowAnswer');
        if (showBtn) showBtn.click();
      }
    } else if (isAnswerRevealed) {
      if (e.key === '1') submitCardGrade(1);
      else if (e.key === '2') submitCardGrade(2);
      else if (e.key === '3') submitCardGrade(3);
      else if (e.key === '4') submitCardGrade(4);
    }
  });

  // Tabela de Todos os Cards
  function renderCardsTable() {
    const filter = filterLangSelect ? filterLangSelect.value : 'all';
    const cards = filter === 'all' ? srs.cards : srs.cards.filter(c => c.language === filter);

    cardsTableBody.innerHTML = '';
    if (cards.length === 0) {
      cardsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum cartão cadastrado ainda.</td></tr>';
      return;
    }

    cards.forEach(c => {
      const tr = document.createElement('tr');
      const nextDue = c.dueDate ? new Date(c.dueDate).toLocaleDateString() : 'Hoje';
      tr.innerHTML = `
        <td style="font-weight: 600;">${c.front}</td>
        <td>${c.back}</td>
        <td><span class="badge">${c.language === 'ru' ? '🇷🇺 Russo' : '🇺🇸 Inglês'}</span></td>
        <td style="color: var(--text-muted);">${c.interval || 0} dias</td>
        <td style="color: var(--accent-emerald);">${nextDue}</td>
        <td>
          <button class="btn-delete-card" data-id="${c.id}" style="background: transparent; border: none; color: var(--accent-rose); cursor: pointer; font-size: 1rem;">
            🗑️
          </button>
        </td>
      `;

      tr.querySelector('.btn-delete-card').addEventListener('click', () => {
        if (confirm(`Remover o card "${c.front}"?`)) {
          srs.deleteCard(c.id);
          renderAnkiView();
          showToast('Card removido.');
        }
      });

      cardsTableBody.appendChild(tr);
    });
  }

  if (filterLangSelect) {
    filterLangSelect.addEventListener('change', renderCardsTable);
  }

  // ================= CRIAR NOVO CARD DO ZERO =================
  document.getElementById('btnCreateCardHeader').addEventListener('click', () => {
    modalNewCard.showModal();
  });

  formNewCard.addEventListener('submit', (e) => {
    e.preventDefault();
    const front = document.getElementById('newCardFront').value.trim();
    const back = document.getElementById('newCardBack').value.trim();
    const hint = document.getElementById('newCardHint').value.trim();
    const example = document.getElementById('newCardExample').value.trim();
    const lang = document.getElementById('newCardLang').value;

    if (!front || !back) {
      alert('Por favor, preencha a Frente e o Verso.');
      return;
    }

    srs.createCard({
      front,
      back,
      hint,
      example,
      language: lang,
      context: 'Criado manualmente pelo usuário'
    });

    formNewCard.reset();
    modalNewCard.close();
    showToast(`✅ Card "${front}" criado no seu Anki!`);
    renderAnkiView();
  });

  // ================= CONFIGURAÇÕES & BACKUP =================
  const speedSlider = document.getElementById('audioSpeedSlider');
  const speedDisplay = document.getElementById('audioSpeedDisplay');
  const inputGoogleApiKey = document.getElementById('inputGoogleApiKey');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const btnExportCards = document.getElementById('btnExportCards');
  const btnImportCards = document.getElementById('btnImportCards');
  const inputImportFile = document.getElementById('inputImportFile');

  if (speedSlider) {
    speedSlider.value = audio.speed;
    speedDisplay.textContent = `${audio.speed}x`;

    speedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      speedDisplay.textContent = `${val}x`;
      audio.setSpeed(val);
    });
  }

  if (inputGoogleApiKey) {
    inputGoogleApiKey.value = audio.apiKey;
  }

  if (btnSaveApiKey) {
    btnSaveApiKey.addEventListener('click', () => {
      audio.setApiKey(inputGoogleApiKey.value);
      showToast('Configurações salvas!');
    });
  }

  if (btnExportCards) {
    btnExportCards.addEventListener('click', () => {
      const json = srs.exportCards();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scriptura-anki-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup dos cartões exportado com sucesso!');
    });
  }

  if (btnImportCards && inputImportFile) {
    btnImportCards.addEventListener('click', () => {
      inputImportFile.click();
    });

    inputImportFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = srs.importCards(event.target.result);
        if (res.success) {
          showToast(`Importados ${res.count} cartões com sucesso!`);
          renderAnkiView();
        } else {
          alert('Erro ao importar: ' + res.message);
        }
      };
      reader.readAsText(file);
    });
  }

  // Inicializa visualizações
  attachReviewEvents();
  setLanguage(currentLang);
});
