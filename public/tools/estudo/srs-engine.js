/**
 * SRS Engine - Implementação fiel do algoritmo SM-2 do Anki
 * Começa 100% LIMPO (zero cards falsos adicionados).
 */

class SRSEngine {
  constructor(storageKey = 'scriptura_anki_cards_v2') {
    this.storageKey = storageKey;
    this.cards = this.loadCards();
  }

  // Carrega os cards do localStorage (inicia vazio)
  loadCards() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao carregar cards do localStorage:', e);
      return [];
    }
  }

  // Salva no localStorage
  saveCards() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cards));
    } catch (e) {
      console.error('Erro ao salvar cards:', e);
    }
  }

  /**
   * Algoritmo SM-2 (Anki)
   * @param {Object} card 
   * @param {number} grade - 1 (Errei), 2 (Difícil), 3 (Bom), 4 (Fácil)
   * @returns {Object} Card atualizado
   */
  schedule(card, grade) {
    const updated = { ...card };
    const now = Date.now();

    let repetition = updated.repetition || 0;
    let interval = updated.interval || 0; // em dias
    let easeFactor = updated.easeFactor !== undefined ? updated.easeFactor : 2.5;

    // 1: Again / Errei
    if (grade === 1) {
      repetition = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } 
    // 2: Hard / Difícil
    else if (grade === 2) {
      if (repetition === 0) {
        interval = 1;
      } else {
        interval = Math.max(1, Math.round(interval * 1.2));
      }
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      repetition += 1;
    } 
    // 3: Good / Bom
    else if (grade === 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    } 
    // 4: Easy / Fácil
    else if (grade === 4) {
      if (repetition === 0) {
        interval = 4;
      } else if (repetition === 1) {
        interval = 8;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      easeFactor += 0.15;
      repetition += 1;
    }

    const nextDueDate = new Date(now + interval * 24 * 60 * 60 * 1000).toISOString();

    updated.repetition = repetition;
    updated.interval = interval;
    updated.easeFactor = Number(easeFactor.toFixed(2));
    updated.dueDate = nextDueDate;
    updated.lastReviewed = new Date(now).toISOString();
    updated.state = repetition === 0 ? 'learning' : 'review';

    const index = this.cards.findIndex(c => c.id === updated.id);
    if (index !== -1) {
      this.cards[index] = updated;
    } else {
      this.cards.push(updated);
    }
    this.saveCards();

    return updated;
  }

  getIntervalPreviews(card) {
    const rep = card.repetition || 0;
    const interval = card.interval || 0;
    const ef = card.easeFactor || 2.5;

    const again = "< 1 d";
    const hardDays = rep === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    const hard = `${hardDays} d`;

    let goodDays = 1;
    if (rep === 0) goodDays = 1;
    else if (rep === 1) goodDays = 6;
    else goodDays = Math.round(interval * ef);
    const good = `${goodDays} d`;

    let easyDays = 4;
    if (rep === 0) easyDays = 4;
    else if (rep === 1) easyDays = 8;
    else easyDays = Math.round(interval * ef * 1.3);
    const easy = `${easyDays} d`;

    return { again, hard, good, easy };
  }

  getDueCards(language = null) {
    const now = new Date();
    return this.cards.filter(card => {
      if (language && card.language !== language) return false;
      if (!card.dueDate) return true;
      return new Date(card.dueDate) <= now;
    });
  }

  getStats(language = null) {
    const list = language ? this.cards.filter(c => c.language === language) : this.cards;
    const now = new Date();
    const due = list.filter(c => !c.dueDate || new Date(c.dueDate) <= now).length;
    const learned = list.filter(c => c.repetition > 0).length;
    return {
      total: list.length,
      due,
      learned
    };
  }

  createCard({ front, back, hint = '', context = '', example = '', language = 'ru' }) {
    const newCard = {
      id: 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      front,
      back,
      hint,
      context,
      example,
      language,
      repetition: 0,
      interval: 0,
      easeFactor: 2.5,
      state: 'new',
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastReviewed: null
    };
    this.cards.unshift(newCard);
    this.saveCards();
    return newCard;
  }

  addFromStudy({ front, back, context, example, language, reference }) {
    const exists = this.cards.find(c => c.front.trim().toLowerCase() === front.trim().toLowerCase() && c.language === language);
    if (exists) {
      return { success: false, message: 'Este card já está no seu Anki!' };
    }
    const card = this.createCard({
      front,
      back,
      context: reference ? `${reference} — ${context}` : context,
      example,
      language
    });
    return { success: true, card, message: 'Adicionado com sucesso ao seu Anki!' };
  }

  deleteCard(cardId) {
    this.cards = this.cards.filter(c => c.id !== cardId);
    this.saveCards();
  }

  exportCards() {
    return JSON.stringify(this.cards, null, 2);
  }

  importCards(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported)) {
        this.cards = imported;
        this.saveCards();
        return { success: true, count: imported.length };
      }
      return { success: false, message: 'O arquivo não é uma lista válida de cards.' };
    } catch (e) {
      return { success: false, message: 'Erro ao interpretar JSON: ' + e.message };
    }
  }
}

window.SRSEngine = SRSEngine;
