import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Mic,
  Send,
  X,
  Volume2,
  Settings,
  Loader2,
  Sparkles,
  Radio,
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';

export default function JarvisWidget({ 
  data = {}, 
  updateSection, 
  darkMode, 
  actionPrompt, 
  onClearActionPrompt 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Olá, Senhor. JARVIS totalmente operacional. Você pode me enviar mensagens de texto, falar por comando de voz ou me enviar MÚLTIPLAS fotos/prints de boletos, faturas e contas de qualquer ano (2026, 2027, etc.) para eu analisar e organizar todo o seu planejamento!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [attachedImages, setAttachedImages] = useState([]); // [{ id, data: base64, mimeType: string, previewUrl: string, name: string }]

  // Speech & Voice Settings State
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(() => localStorage.getItem('jarvis_voice_uri') || '');
  const [voiceEngine, setVoiceEngine] = useState(() => localStorage.getItem('jarvis_voice_engine') || 'google-neural');
  const [voiceRate, setVoiceRate] = useState(() => Number(localStorage.getItem('jarvis_voice_rate')) || 1.15);
  const [voicePitch, setVoicePitch] = useState(() => Number(localStorage.getItem('jarvis_voice_pitch')) || 1.0);
  const [handsFreeMode, setHandsFreeMode] = useState(() => localStorage.getItem('jarvis_handsfree') === 'true');

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);
  const audioQueueRef = useRef([]);
  const handsFreeRef = useRef(handsFreeMode);
  handsFreeRef.current = handsFreeMode;

  // Real-time data and session accumulators to prevent stale closure bugs during multi-tool execution
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const sessionBillsRef = useRef([]);
  const sessionDebtsRef = useRef([]);
  const sessionTxsRef = useRef([]);

  const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42SlRZTDlzMlNOT3BSWWptNzlsdWVHTzVMS2lnei1hSzBVOXRydVBCUDR1Smc=';
  const getActiveApiKey = () => {
    if (data?.settings?.geminiApiKey && data.settings.geminiApiKey.trim()) return data.settings.geminiApiKey.trim();
    const stored = localStorage.getItem('gemini_api_key');
    if (stored && stored.trim()) return stored.trim();
    try { return atob(DEFAULT_KEY_B64); } catch (e) { return ''; }
  };
  const apiKey = getActiveApiKey();

  // Handle external action prompts (e.g. from FinanceView "Diagnóstico do JARVIS")
  useEffect(() => {
    if (actionPrompt) {
      setIsOpen(true);
      setInput('');
      handleSend(actionPrompt, []);
      if (onClearActionPrompt) onClearActionPrompt();
    }
  }, [actionPrompt]);

  // Web Audio Beep Sound Effect when Jarvis wakes up
  const playWakeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  // Load natural voices from browser
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const ptVoices = voices.filter(v => v.lang.startsWith('pt') || v.lang.includes('BR') || v.lang.includes('PT'));
        setAvailableVoices(ptVoices.length > 0 ? ptVoices : voices);
        
        if (!selectedVoiceURI && ptVoices.length > 0) {
          const best = ptVoices.find(v => 
            v.name.includes('Google') || 
            v.name.includes('Natural') || 
            v.name.includes('Online') ||
            v.name.includes('Luciana') ||
            v.name.includes('Francisca') ||
            v.name.includes('Antonio') ||
            v.name.includes('Maria')
          ) || ptVoices[0];
          setSelectedVoiceURI(best.voiceURI);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceURI]);

  // Setup Continuous Speech Recognition / Wake Word ("Olá Jarvis")
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.lang = 'pt-BR';
    recog.continuous = true;
    recog.interimResults = true;
    recognitionRef.current = recog;

    recog.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const text = event.results[i][0].transcript.toLowerCase();
        if (event.results[i].isFinal) {
          finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }

      const combined = (finalTranscript || interimTranscript).toLowerCase();

      if (combined.includes('olá jarvis') || combined.includes('ola jarvis') || combined.includes('jarvis') || combined.includes('ei jarvis')) {
        playWakeSound();
        setIsOpen(true);
        
        const match = combined.match(/(?:olá jarvis|ola jarvis|jarvis|ei jarvis)\s*,?\s*(.*)/i);
        const command = match && match[1] ? match[1].trim() : '';

        if (command && command.length > 2) {
          setInput(command);
          handleSend(command);
        }
      }
    };

    recog.onerror = (err) => {
      if (err.error !== 'no-speech') {
        console.warn('Recognition error:', err);
      }
    };

    if (handsFreeMode) {
      try {
        recog.start();
      } catch (e) {}
    }

    return () => {
      try {
        recog.stop();
      } catch (e) {}
    };
  }, [handsFreeMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleSingleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening && !handsFreeMode) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const singleRecog = new SpeechRecognition();
      singleRecog.lang = 'pt-BR';
      singleRecog.continuous = false;
      singleRecog.interimResults = false;
      setIsListening(true);

      singleRecog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      singleRecog.onerror = () => setIsListening(false);
      singleRecog.onend = () => setIsListening(false);
      singleRecog.start();
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
      } catch (e) {}
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];
    setIsSpeaking(false);
  };

  const playNextAudioChunk = () => {
    if (audioQueueRef.current.length === 0) {
      setIsSpeaking(false);
      currentAudioRef.current = null;
      return;
    }

    const chunk = audioQueueRef.current.shift();
    const encoded = encodeURIComponent(chunk);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encoded}`;

    const audio = new Audio(url);
    currentAudioRef.current = audio;
    audio.playbackRate = Math.min(2.0, Math.max(0.5, voiceRate));

    audio.onended = () => {
      playNextAudioChunk();
    };

    audio.onerror = () => {
      playNextAudioChunk();
    };

    audio.play().catch(e => {
      console.warn('Audio stream error, falling back to next or browser synth:', e);
      playNextAudioChunk();
    });
  };

  const speakText = (text) => {
    stopSpeaking();
    if (!text) return;

    // Clean text: strip code blocks, markdown symbols, asterisks, urls, emojis for clear human-like pronunciation
    let cleanText = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`.*?`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_#~>]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    if (voiceEngine === 'google-neural') {
      setIsSpeaking(true);
      // Split into small, naturally punctuated sentences of <= 140 characters
      const chunks = [];
      const sentences = cleanText.split(/(?<=[.?!;:\n])\s+/);
      
      sentences.forEach(s => {
        let trimmed = s.trim();
        if (!trimmed) return;
        while (trimmed.length > 140) {
          let splitIdx = trimmed.lastIndexOf(' ', 140);
          if (splitIdx === -1) splitIdx = 140;
          chunks.push(trimmed.slice(0, splitIdx));
          trimmed = trimmed.slice(splitIdx).trim();
        }
        if (trimmed) chunks.push(trimmed);
      });

      if (chunks.length === 0) {
        setIsSpeaking(false);
        return;
      }

      audioQueueRef.current = chunks;
      playNextAudioChunk();
    } else {
      // Fallback: Browser High Definition Speech Synthesis
      if (!window.speechSynthesis) return;
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (selectedVoiceURI) {
        const chosen = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
        if (chosen) utterance.voice = chosen;
      }

      utterance.lang = 'pt-BR';
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle Multi-image Selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target.result;
        const base64Data = result.split(',')[1];
        setAttachedImages(prev => [
          ...prev,
          {
            id: 'img-' + Math.random().toString(36).substr(2, 9),
            data: base64Data,
            mimeType: file.type || 'image/jpeg',
            previewUrl: result,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachedImage = (idToRemove) => {
    setAttachedImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const handleSend = async (textToProcess = input, imgsToSend = attachedImages) => {
    if (!textToProcess.trim() && imgsToSend.length === 0) return;
    if (!apiKey) {
      alert('Chave de API do Google Gemini não configurada.');
      return;
    }

    // Initialize session refs with current latest state
    sessionBillsRef.current = [...(dataRef.current.bills || [])];
    sessionDebtsRef.current = [...(dataRef.current.debts || [])];
    sessionTxsRef.current = [...(dataRef.current.transactions || [])];

    const userText = textToProcess.trim() || (imgsToSend.length > 0 
      ? `Por favor, analise todas as ${imgsToSend.length} fotos/boletos/faturas que anexei e organize cada uma delas no meu sistema financeiro, incluindo faturas futuras de 2026, 2027 e além.` 
      : '');

    const newUserMsg = { 
      role: 'user', 
      text: userText, 
      images: imgsToSend.length > 0 ? [...imgsToSend] : [] 
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setAttachedImages([]);
    setIsLoading(true);

    try {
      const responseText = await processWithGemini(updatedMessages);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      speakText(responseText);
    } catch (error) {
      console.error(error);
      const msg = error.message || 'Erro de conexão.';
      setMessages(prev => [...prev, { role: 'model', text: `Ops! ${msg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processWithGemini = async (chatHistory) => {
    const tools = [{
      functionDeclarations: [
        // FINANCIAL MANAGEMENT (BILLS, DEBTS, SALARY, CARDS)
        {
          name: 'add_multiple_bills',
          description: 'Adiciona uma lista de múltiplas contas/faturas/parcelas de uma só vez (ex: faturas de vários meses como dez/2026, jan/2027, fev/2027, mar/2027...).',
          parameters: {
            type: 'OBJECT',
            properties: {
              bills: {
                type: 'ARRAY',
                description: 'Lista de contas com título, valor numérico e data de vencimento YYYY-MM-DD',
                items: {
                  type: 'OBJECT',
                  properties: {
                    title: { type: 'STRING', description: 'Nome da conta (ex: Fatura Cartão Jan/2027)' },
                    amount: { type: 'NUMBER', description: 'Valor numérico em reais (ex: 264.50)' },
                    dueDate: { type: 'STRING', description: 'Data de vencimento YYYY-MM-DD (ex: 2027-01-14)' },
                    category: { type: 'STRING', description: 'Categoria (ex: Cartão de Crédito, Moradia)' }
                  },
                  required: ['title', 'amount', 'dueDate']
                }
              }
            },
            required: ['bills']
          }
        },
        {
          name: 'add_bill',
          description: 'Adiciona uma única conta ou boleto a pagar no controle financeiro do usuário.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Nome da conta (ex: Aluguel, Luz Enel, Internet Claro)' },
              amount: { type: 'NUMBER', description: 'Valor em reais (ex: 180.50)' },
              dueDate: { type: 'STRING', description: 'Data de vencimento YYYY-MM-DD (ex: 2027-01-14)' },
              category: { type: 'STRING', description: 'Moradia, Alimentação, Transporte, Saúde, Cartão de Crédito, ou Outros' }
            },
            required: ['title', 'amount']
          }
        },
        {
          name: 'pay_bill',
          description: 'Marca uma conta a pagar como quitada/paga.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Nome ou parte do nome da conta a ser marcada como paga' }
            },
            required: ['title']
          }
        },
        {
          name: 'add_debt',
          description: 'Cadastra uma dívida, empréstimo bancário ou parcelamento com valor total e parcelas.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Nome do credor ou dívida (ex: Empréstimo Nubank, Cartão)' },
              totalAmount: { type: 'NUMBER', description: 'Valor total da dívida' },
              installmentAmount: { type: 'NUMBER', description: 'Valor da parcela mensal' },
              totalInstallments: { type: 'NUMBER', description: 'Número total de parcelas' },
              paidInstallments: { type: 'NUMBER', description: 'Número de parcelas já pagas' }
            },
            required: ['title', 'totalAmount']
          }
        },
        {
          name: 'pay_debt_installment',
          description: 'Avança e registra o pagamento de 1 parcela de uma dívida.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Nome ou parte do nome da dívida' }
            },
            required: ['title']
          }
        },
        {
          name: 'update_salary',
          description: 'Atualiza a configuração salarial do usuário (salário mensal ou quinzenal 2x ao mês, dias de recebimento e descontos em folha).',
          parameters: {
            type: 'OBJECT',
            properties: {
              paymentFrequency: { type: 'STRING', description: 'monthly (mensal) ou biweekly (quinzenal)' },
              monthlySalary: { type: 'NUMBER', description: 'Salário líquido mensal total' },
              salaryDay: { type: 'NUMBER', description: 'Dia do pagamento (1 a 31)' },
              firstPaymentAmount: { type: 'NUMBER', description: 'Valor da 1ª quinzena / adiantamento' },
              firstPaymentDay: { type: 'NUMBER', description: 'Dia da 1ª quinzena (ex: 20)' },
              secondPaymentAmount: { type: 'NUMBER', description: 'Valor da 2ª quinzena / saldo final' },
              secondPaymentDay: { type: 'NUMBER', description: 'Dia da 2ª quinzena (ex: 5)' },
              grossSalary: { type: 'NUMBER', description: 'Salário bruto antes dos descontos' }
            }
          }
        },
        {
          name: 'add_finance_transaction',
          description: 'Registra uma entrada ou saída avulsa no extrato financeiro.',
          parameters: {
            type: 'OBJECT',
            properties: {
              description: { type: 'STRING', description: 'Descrição da transação' },
              amount: { type: 'NUMBER', description: 'Valor numérico' },
              type: { type: 'STRING', description: 'income (receita) ou expense (despesa)' },
              category: { type: 'STRING', description: 'Categoria da transação' }
            },
            required: ['description', 'amount', 'type']
          }
        },
        // BOOKS
        {
          name: 'get_books',
          description: 'Retorna a lista completa de livros da biblioteca.',
          parameters: { type: 'OBJECT', properties: {} }
        },
        {
          name: 'add_book',
          description: 'Adiciona um novo livro na biblioteca do Obnotion.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Título do livro' },
              author: { type: 'STRING', description: 'Autor do livro' },
              totalPages: { type: 'NUMBER', description: 'Total de páginas' },
              currentPage: { type: 'NUMBER', description: 'Página atual' },
              status: { type: 'STRING', description: 'reading, completed, ou wishlist' },
              genre: { type: 'STRING', description: 'Gênero literário' }
            },
            required: ['title']
          }
        },
        {
          name: 'update_book_progress',
          description: 'Atualiza o progresso de leitura ou página atual de um livro.',
          parameters: {
            type: 'OBJECT',
            properties: {
              bookTitle: { type: 'STRING', description: 'Título ou parte do nome do livro' },
              currentPage: { type: 'NUMBER', description: 'Nova página atual' },
              status: { type: 'STRING', description: 'reading, completed, ou wishlist' }
            },
            required: ['bookTitle', 'currentPage']
          }
        },
        // TASKS
        {
          name: 'get_tasks',
          description: 'Retorna a lista de tarefas do usuário com status e prioridades.',
          parameters: { type: 'OBJECT', properties: {} }
        },
        {
          name: 'add_task',
          description: 'Adiciona uma nova tarefa na lista do usuário.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Título ou descrição da tarefa' },
              priority: { type: 'STRING', description: 'high, medium, ou low' },
              status: { type: 'STRING', description: 'todo, in_progress, ou done' },
              dueDate: { type: 'STRING', description: 'Data de vencimento YYYY-MM-DD' }
            },
            required: ['title']
          }
        },
        // NOTES
        {
          name: 'get_notes',
          description: 'Retorna todas as notas e anotações criadas no Obnotion.',
          parameters: { type: 'OBJECT', properties: {} }
        },
        {
          name: 'add_note',
          description: 'Cria uma nova nota de texto ou markdown no Obnotion.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Título da nota' },
              content: { type: 'STRING', description: 'Conteúdo em Markdown da nota' },
              folder: { type: 'STRING', description: 'Pasta (ex: Pessoal, Estudos, Projetos)' }
            },
            required: ['title', 'content']
          }
        },
        // HABITS
        {
          name: 'get_habits',
          description: 'Retorna os hábitos cadastrados e os streaks do usuário.',
          parameters: { type: 'OBJECT', properties: {} }
        },
        {
          name: 'add_habit',
          description: 'Cria e adiciona um novo hábito diário no rastreador de hábitos do Obnotion.',
          parameters: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING', description: 'Nome do hábito (ex: Beber 2L de Água, Meditar, Treinar)' },
              icon: { type: 'STRING', description: 'Emoji representativo' },
              color: { type: 'STRING', description: 'Cor hex' }
            },
            required: ['name']
          }
        },
        {
          name: 'toggle_habit',
          description: 'Marca um hábito como feito ou desmarca para o dia de hoje.',
          parameters: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING', description: 'Nome ou parte do nome do hábito' },
              done: { type: 'BOOLEAN', description: 'true para feito, false para não feito' }
            },
            required: ['name']
          }
        },
        // CALENDAR
        {
          name: 'get_calendar_events',
          description: 'Retorna eventos da agenda e calendário.',
          parameters: { type: 'OBJECT', properties: {} }
        },
        {
          name: 'add_calendar_event',
          description: 'Adiciona um novo evento ou compromisso no calendário.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Título do compromisso' },
              date: { type: 'STRING', description: 'Data YYYY-MM-DD' },
              time: { type: 'STRING', description: 'Horário HH:MM' },
              category: { type: 'STRING', description: 'work, personal, health, ou study' }
            },
            required: ['title', 'date']
          }
        }
      ]
    }];

    // Build Gemini contents with Multi-Image Multimodal support
    const validHistory = chatHistory.filter((m, idx) => !(idx === 0 && m.role === 'model'));
    const contents = validHistory.map((m) => {
      const parts = [];
      
      // Inject all images if present in message
      if (m.images && Array.isArray(m.images)) {
        m.images.forEach(img => {
          if (img.data) {
            parts.push({
              inlineData: {
                mimeType: img.mimeType || 'image/jpeg',
                data: img.data
              }
            });
          }
        });
      }

      parts.push({ text: m.text });
      return {
        role: m.role === 'model' ? 'model' : 'user',
        parts: parts
      };
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const profile = dataRef.current?.financeProfile || { monthlySalary: 0, salaryDay: 5 };
    const bills = dataRef.current?.bills || [];
    const debts = dataRef.current?.debts || [];
    const creditCards = dataRef.current?.creditCards || [];

    const totalBills = bills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
    const totalDebtMonthly = debts.reduce((acc, d) => acc + (Number(d.installmentAmount) || 0), 0);
    const totalCards = creditCards.reduce((acc, c) => acc + (Number(c.currentBill) || 0), 0);
    const freeBalance = (Number(profile.monthlySalary) || 0) - (totalBills + totalDebtMonthly + totalCards);

    const workspaceContext = `
Você é o JARVIS, assistente supremo e consultor financeiro de elite do usuário no sistema Obnotion.
Você tem poder de visão computacional multimodal avançada (capaz de analisar MÚLTIPLAS imagens enviadas simultaneamente) e ferramentas executáveis.

RAIO-X FINANCEIRO ATUAL:
- Salário Líquido: R$ ${(Number(profile.monthlySalary) || 0).toFixed(2)} (Recebimento estimado dia ${profile.salaryDay || 5})
- Contas a Pagar / Boletos Cadastrados (${bills.length}): ${JSON.stringify(bills.map(b => ({ title: b.title, valor: b.amount, vencimento: b.dueDate, status: b.status })))}
- Dívidas & Empréstimos (${debts.length}): ${JSON.stringify(debts.map(d => ({ title: d.title, total: d.totalAmount, parcela: d.installmentAmount, parcelasPagas: `${d.paidInstallments}/${d.totalInstallments}` })))}
- Cartões de Crédito (${creditCards.length}): ${JSON.stringify(creditCards.map(c => ({ nome: c.name, fatura: c.currentBill, limite: c.limit })))}
- Saldo Livre Real Projetado: R$ ${freeBalance.toFixed(2)}

REGRAS MANDATÓRIAS DE EXECUÇÃO:
1. Se o usuário enviar UMA OU VÁRIAS FOTOS/PRINTS (boletos, faturas de cartão parceladas, extratos de meses futuros como 2026, 2027, etc.):
   - Analise minuciosamente CADA imagem enviada.
   - Extraia TODAS as contas e faturas de cada mês visível (ex: fatura de 14/12/2026, 14/01/2027, 14/02/2027, 14/03/2027, 14/04/2027, 14/05/2027, etc.).
   - USE A FERRAMENTA 'add_multiple_bills' passando TODAS as contas em um array com a data exata de cada vencimento YYYY-MM-DD!
   - NÃO DEIXE NENHUMA FATURA DE FORA! Se houver 6 faturas nas fotos, cadastre as 6 faturas com suas respectivas datas em 2026 e 2027!
   - Novas contas SEMPRE devem ser cadastradas com status 'pending' (pendente).
   - Ao final, faça um resumo mês a mês (ex: Dezembro/2026: R$ 264,48, Janeiro/2027: R$ 264,50, Fevereiro/2027: R$ 229,29...).
2. Se for um contrato de dívida/empréstimo consolidado: CHAME 'add_debt'.
3. Se o usuário pedir para pagar conta: CHAME 'pay_bill'.
4. Se o usuário informar seu salário: CHAME 'update_salary'.
`;

    const modelsToTry = [
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash'
    ];

    const callGeminiEndpoint = async (modelIndex = 0) => {
      const model = modelsToTry[modelIndex] || 'gemini-flash-lite-latest';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: contents,
        systemInstruction: {
          parts: [{ text: workspaceContext }]
        },
        tools: tools,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1200
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errData = {};
        try { errData = await res.json(); } catch (e) {}
        const errMsg = errData.error?.message || `HTTP ${res.status}`;
        if ((errMsg.includes('not found') || errMsg.includes('not supported') || res.status === 404) && modelIndex < modelsToTry.length - 1) {
          return callGeminiEndpoint(modelIndex + 1);
        }
        throw new Error(errMsg);
      }

      return res.json();
    };

    let dataRes = await callGeminiEndpoint(0);
    let candidate = dataRes.candidates?.[0]?.content;
    let parts = candidate?.parts || [];

    // Handle sequential and batch function calls
    let loopCount = 0;
    while (parts.some(p => p.functionCall) && loopCount < 10) {
      loopCount++;
      const functionCallPart = parts.find(p => p.functionCall);
      const { name, args } = functionCallPart.functionCall;
      const fnResult = await handleFunctionCall(name, args || {});

      contents.push(candidate);
      contents.push({
        role: 'user',
        parts: [{
          functionResponse: {
            name: name,
            response: fnResult
          }
        }]
      });

      dataRes = await callGeminiEndpoint(0);
      candidate = dataRes.candidates?.[0]?.content;
      parts = candidate?.parts || [];
    }

    const textPart = parts.find(p => p.text);
    return textPart?.text || 'Ação executada com sucesso, Senhor!';
  };

  const handleFunctionCall = async (name, args) => {
    // 1. MULTIPLE BILLS BATCH
    if (name === 'add_multiple_bills') {
      const incoming = (args.bills || []).map((b, idx) => ({
        id: 'bill-' + Date.now() + '-' + idx + '-' + Math.random().toString(36).substr(2, 5),
        title: b.title,
        amount: Number(b.amount),
        dueDate: b.dueDate || new Date().toISOString().split('T')[0],
        category: b.category || 'Cartão de Crédito',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      }));
      sessionBillsRef.current = [...incoming, ...sessionBillsRef.current];
      updateSection('bills', sessionBillsRef.current);
      return { success: true, count: incoming.length, message: `${incoming.length} contas cadastradas com sucesso para as datas especificadas.` };
    }

    // 2. SINGLE BILL
    if (name === 'add_bill') {
      const newBill = {
        id: 'bill-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        title: args.title,
        amount: Number(args.amount),
        dueDate: args.dueDate || new Date().toISOString().split('T')[0],
        category: args.category || 'Outros',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };
      sessionBillsRef.current = [newBill, ...sessionBillsRef.current];
      updateSection('bills', sessionBillsRef.current);
      return { success: true, bill: newBill, message: `Conta ${args.title} no valor de R$ ${args.amount} cadastrada.` };
    }

    if (name === 'pay_bill') {
      const target = sessionBillsRef.current.find(b => b.title.toLowerCase().includes((args.title || '').toLowerCase()));
      if (target) {
        target.status = 'paid';
        target.paidAt = new Date().toISOString().split('T')[0];
        updateSection('bills', [...sessionBillsRef.current]);
        return { success: true, paidBill: target.title };
      }
      return { success: false, message: 'Conta não encontrada' };
    }

    // 3. DEBTS
    if (name === 'add_debt') {
      const newDebt = {
        id: 'debt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        title: args.title,
        totalAmount: Number(args.totalAmount),
        installmentAmount: Number(args.installmentAmount) || (Number(args.totalAmount) / (Number(args.totalInstallments) || 1)),
        totalInstallments: Number(args.totalInstallments) || 1,
        paidInstallments: Number(args.paidInstallments) || 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      sessionDebtsRef.current = [newDebt, ...sessionDebtsRef.current];
      updateSection('debts', sessionDebtsRef.current);
      return { success: true, debt: newDebt };
    }

    if (name === 'pay_debt_installment') {
      const target = sessionDebtsRef.current.find(d => d.title.toLowerCase().includes((args.title || '').toLowerCase()));
      if (target) {
        target.paidInstallments = Math.min(target.totalInstallments, (target.paidInstallments || 0) + 1);
        updateSection('debts', [...sessionDebtsRef.current]);
        return { success: true, debt: target.title, paidNow: target.paidInstallments };
      }
      return { success: false, message: 'Dívida não encontrada' };
    }

    // 4. SALARY PROFILE
    if (name === 'update_salary') {
      const current = dataRef.current?.financeProfile || {};
      const isBiweekly = args.paymentFrequency === 'biweekly' || (args.firstPaymentAmount && args.secondPaymentAmount);
      
      let computedNet = Number(args.monthlySalary) || current.monthlySalary || 0;
      if (isBiweekly) {
        const p1 = Number(args.firstPaymentAmount) || current.firstPaymentAmount || 0;
        const p2 = Number(args.secondPaymentAmount) || current.secondPaymentAmount || 0;
        computedNet = p1 + p2;
      }

      const updatedProfile = {
        paymentFrequency: isBiweekly ? 'biweekly' : (args.paymentFrequency || current.paymentFrequency || 'monthly'),
        monthlySalary: computedNet,
        salaryDay: Number(args.salaryDay) || current.salaryDay || 5,
        firstPaymentAmount: Number(args.firstPaymentAmount) || current.firstPaymentAmount || 0,
        firstPaymentDay: Number(args.firstPaymentDay) || current.firstPaymentDay || 20,
        secondPaymentAmount: Number(args.secondPaymentAmount) || current.secondPaymentAmount || 0,
        secondPaymentDay: Number(args.secondPaymentDay) || current.secondPaymentDay || 5,
        grossSalary: Number(args.grossSalary) || current.grossSalary || 0,
        hasDiscounts: current.hasDiscounts || false,
        discounts: current.discounts || []
      };

      updateSection('financeProfile', updatedProfile);
      return { success: true, profile: updatedProfile, message: `Salário atualizado para R$ ${computedNet.toFixed(2)} (${updatedProfile.paymentFrequency === 'biweekly' ? 'Quinzenal' : 'Mensal'}).` };
    }

    // 5. TRANSACTIONS
    if (name === 'add_finance_transaction') {
      const newTx = {
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        description: args.description,
        amount: Number(args.amount),
        type: args.type,
        category: args.category || (args.type === 'income' ? 'Renda' : 'Outros'),
        date: new Date().toISOString().split('T')[0]
      };
      sessionTxsRef.current = [newTx, ...sessionTxsRef.current];
      updateSection('transactions', sessionTxsRef.current);
      return { success: true, transaction: newTx };
    }

    // 6. BOOKS
    if (name === 'get_books') return { books: dataRef.current?.books || [] };
    if (name === 'add_book') {
      const newBook = {
        id: 'book-' + Date.now(),
        title: args.title,
        author: args.author || 'Desconhecido',
        totalPages: Number(args.totalPages) || 100,
        currentPage: Number(args.currentPage) || 0,
        status: args.status || 'reading',
        rating: 0,
        genre: args.genre || 'Geral',
        startDate: new Date().toISOString().split('T')[0],
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        review: ''
      };
      updateSection('books', [newBook, ...(dataRef.current?.books || [])]);
      return { success: true, book: newBook };
    }

    // 7. TASKS
    if (name === 'get_tasks') return { tasks: dataRef.current?.tasks || [] };
    if (name === 'add_task') {
      const newTask = {
        id: 'task-' + Date.now(),
        title: args.title,
        status: args.status || 'todo',
        priority: args.priority || 'medium',
        dueDate: args.dueDate || new Date().toISOString().split('T')[0],
        tags: ['JARVIS'],
        notes: 'Criado via assistente'
      };
      updateSection('tasks', [newTask, ...(dataRef.current?.tasks || [])]);
      return { success: true, task: newTask };
    }

    // 8. NOTES
    if (name === 'get_notes') return { notes: dataRef.current?.notes || [] };
    if (name === 'add_note') {
      const newNote = {
        id: 'note-' + Date.now(),
        title: args.title,
        content: args.content,
        folder: args.folder || 'Geral',
        tags: ['JARVIS'],
        pinned: false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      updateSection('notes', [newNote, ...(dataRef.current?.notes || [])]);
      return { success: true, note: newNote };
    }

    // 9. HABITS
    if (name === 'get_habits') return { habits: dataRef.current?.habits || [] };
    if (name === 'add_habit') {
      const today = new Date().toISOString().split('T')[0];
      const newHabit = {
        id: 'hab-' + Date.now(),
        name: args.name,
        icon: args.icon || '⚡',
        color: args.color || '#8b5cf6',
        history: { [today]: false }
      };
      updateSection('habits', [newHabit, ...(dataRef.current?.habits || [])]);
      return { success: true, habit: newHabit };
    }
    if (name === 'toggle_habit') {
      const today = new Date().toISOString().split('T')[0];
      const habits = [...(dataRef.current?.habits || [])];
      const target = habits.find(h => h.name.toLowerCase().includes((args.name || '').toLowerCase()));
      if (target) {
        if (!target.history) target.history = {};
        const isDone = args.done !== undefined ? args.done : !target.history[today];
        target.history[today] = isDone;
        updateSection('habits', habits);
        return { success: true, habitName: target.name, doneToday: isDone };
      }
      return { success: false, message: 'Hábito não encontrado' };
    }

    // 10. CALENDAR
    if (name === 'get_calendar_events') return { calendarEvents: dataRef.current?.calendarEvents || [] };
    if (name === 'add_calendar_event') {
      const newEvent = {
        id: 'ev-' + Date.now(),
        title: args.title,
        date: args.date,
        time: args.time || '12:00',
        category: args.category || 'work',
        color: '#8b5cf6'
      };
      updateSection('calendarEvents', [newEvent, ...(dataRef.current?.calendarEvents || [])]);
      return { success: true, event: newEvent };
    }

    return { error: 'Function not implemented' };
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-16 h-16 bg-violet-500 rounded-full animate-ping opacity-25 absolute"></div>
             <div className="w-20 h-20 bg-cyan-400 rounded-full animate-ping opacity-15 absolute" style={{ animationDelay: '200ms' }}></div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl backdrop-blur-xl transition-all duration-300 relative z-10 border ${
            isSpeaking 
              ? 'bg-gradient-to-tr from-violet-600 to-cyan-500 scale-105 border-cyan-400/50 shadow-violet-500/40' 
              : 'bg-[#12131b]/90 border-white/[0.12] hover:border-violet-500/50 hover:bg-[#181924]'
          } ${handsFreeMode ? 'ring-2 ring-emerald-400/40' : ''}`}
          title="JARVIS AI"
        >
          <BrainCircuit className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-cyan-200' : 'text-violet-400'}`} />
          {handsFreeMode && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-black rounded-full animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-22 right-4 md:right-6 w-[92vw] md:w-[410px] h-[550px] rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden border backdrop-blur-2xl ${
          darkMode ? 'bg-[#0f1017]/95 border-white/[0.1] text-zinc-100' : 'bg-white/95 border-zinc-200 text-zinc-800'
        }`}>
          {/* Header */}
          <div className="p-3.5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs tracking-tight text-white">JARVIS AI</h3>
                  {handsFreeMode && (
                    <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 px-1.5 py-0.2 rounded">
                      Voz Ativa
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">Multimodal • Multi-Fotos 2026/2027+</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowVoiceSettings(!showVoiceSettings)} 
                className={`p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors ${showVoiceSettings ? 'bg-white/[0.1] text-white' : 'hover:bg-white/[0.06]'}`}
                title="Configurações de Áudio & Voz"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/[0.06] text-zinc-400 hover:text-white p-1.5 rounded-lg transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Settings Panel Modal */}
          {showVoiceSettings && (
            <div className={`p-4 border-b border-white/[0.08] text-xs space-y-3 animate-fade-in ${
              darkMode ? 'bg-[#141520]/90 text-zinc-200' : 'bg-zinc-50 text-zinc-800'
            }`}>
              <div className="flex items-center justify-between font-medium">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Volume2 className="w-3.5 h-3.5 text-violet-400" /> Sintetizador de Voz
                </span>
                <button 
                  onClick={() => speakText("Olá! Esta é uma demonstração da minha voz configurada.")} 
                  className="text-[10px] font-mono text-violet-400 hover:text-violet-300"
                >
                  Testar Voz 🔊
                </button>
              </div>

              {/* Voice Engine Selector */}
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">Motor de Voz (IA):</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceEngine('google-neural');
                      localStorage.setItem('jarvis_voice_engine', 'google-neural');
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      voiceEngine === 'google-neural'
                        ? 'bg-violet-600/20 border-violet-500/50 text-white font-semibold'
                        : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <p className="text-[11px] text-violet-300 font-bold flex items-center gap-1">
                      <span>✨ Google Neural HD</span>
                    </p>
                    <p className="text-[9px] text-zinc-400 mt-0.5">Voz humana ultra-natural (Recomendada)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVoiceEngine('browser-system');
                      localStorage.setItem('jarvis_voice_engine', 'browser-system');
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      voiceEngine === 'browser-system'
                        ? 'bg-violet-600/20 border-violet-500/50 text-white font-semibold'
                        : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <p className="text-[11px] text-zinc-200 font-bold">🎙️ Voz do Sistema</p>
                    <p className="text-[9px] text-zinc-400 mt-0.5">Edge / Chrome sintetizador</p>
                  </button>
                </div>
              </div>

              {voiceEngine === 'browser-system' && (
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">Selecionar Voz do Sistema:</label>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => {
                      setSelectedVoiceURI(e.target.value);
                      localStorage.setItem('jarvis_voice_uri', e.target.value);
                    }}
                    className={`w-full p-1.5 rounded-lg border text-xs outline-none ${
                      darkMode ? 'bg-black/50 border-white/[0.1] text-white' : 'bg-white border-zinc-300 text-zinc-800'
                    }`}
                  >
                    {availableVoices.map((v, i) => (
                      <option key={i} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                    <span>Velocidade:</span>
                    <span>{voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.6"
                    step="0.05"
                    value={voiceRate}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVoiceRate(val);
                      localStorage.setItem('jarvis_voice_rate', String(val));
                    }}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                    <span>Tom (Pitch):</span>
                    <span>{voicePitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={voicePitch}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVoicePitch(val);
                      localStorage.setItem('jarvis_voice_pitch', String(val));
                    }}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
              </div>

              {/* Hands-Free Wake Word Toggle */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <p className="font-medium text-[11px] flex items-center gap-1 text-zinc-200">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    Ativação por "Olá Jarvis"
                  </p>
                  <p className="text-[10px] text-zinc-500">Escuta contínua viva no navegador</p>
                </div>
                <button
                  onClick={() => setHandsFreeMode(!handsFreeMode)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-all ${
                    handsFreeMode 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {handsFreeMode ? 'Ativado' : 'Desativado'}
                </button>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-2 ${
                  m.role === 'user' 
                    ? 'bg-violet-600 text-white rounded-br-xs shadow-sm font-medium' 
                    : (darkMode 
                      ? 'bg-white/[0.05] text-zinc-200 rounded-bl-xs border border-white/[0.08]' 
                      : 'bg-zinc-100 text-zinc-800 rounded-bl-xs shadow-sm')
                }`}>
                  {/* Render attached images grid if user uploaded multiple photos */}
                  {m.images && m.images.length > 0 && (
                    <div className={`grid gap-1.5 ${m.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {m.images.map((img, imgIdx) => (
                        <img 
                          key={imgIdx}
                          src={img.previewUrl} 
                          alt={`Anexo ${imgIdx + 1}`} 
                          className="w-full h-24 rounded-lg object-cover border border-white/[0.2]"
                        />
                      ))}
                    </div>
                  )}
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-3.5 py-2.5 rounded-bl-xs flex items-center gap-2 text-xs ${
                  darkMode ? 'bg-white/[0.04] border border-white/[0.06] text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                  <span className="font-mono text-[11px]">Processando {attachedImages.length > 0 ? `${attachedImages.length} documentos` : 'instrução'}...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Multi-Image Thumbnail Gallery Row */}
          {attachedImages.length > 0 && (
            <div className="px-3 py-2 bg-black/50 border-t border-white/[0.08] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-violet-300">
                  <ImageIcon className="w-3 h-3" /> {attachedImages.length} foto(s) pronta(s) para análise
                </span>
                <button
                  onClick={() => setAttachedImages([])}
                  className="text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  Limpar Todas
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {attachedImages.map(img => (
                  <div key={img.id} className="relative group flex-shrink-0">
                    <img 
                      src={img.previewUrl} 
                      alt="Thumbnail" 
                      className="w-12 h-12 rounded-lg object-cover border border-violet-500/40"
                    />
                    <button
                      onClick={() => removeAttachedImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow-sm hover:bg-rose-500"
                      title="Remover foto"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Quick Add More Photos Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-lg border border-dashed border-white/[0.2] hover:border-violet-400 flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                  title="Adicionar mais fotos"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className={`p-2.5 border-t border-white/[0.08] flex items-center gap-2 ${
            darkMode ? 'bg-black/30' : 'bg-zinc-50'
          }`}>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-white/[0.05] text-zinc-400 hover:text-violet-300 hover:bg-white/[0.1] transition-all flex-shrink-0 relative"
              title="Anexar Várias Fotos de Boletos / Faturas"
            >
              <ImageIcon className="w-4 h-4" />
              {attachedImages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {attachedImages.length}
                </span>
              )}
            </button>

            <button 
              onClick={toggleSingleListen}
              className={`p-2 rounded-xl flex-shrink-0 transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : (darkMode ? 'bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.1]' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300')
              }`}
              title={isListening ? 'Ouvindo comando...' : 'Falar via microfone'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={
                attachedImages.length > 0 
                  ? `${attachedImages.length} foto(s) anexada(s)... Pressione Enter ou Enviar` 
                  : handsFreeMode 
                  ? 'Diga "Olá Jarvis" ou envie fotos...' 
                  : 'Digite ou anexe fotos de boletos...'
              }
              disabled={isLoading}
              className={`flex-1 bg-transparent border-none outline-none text-xs px-2 ${darkMode ? 'text-zinc-100 placeholder-zinc-500' : 'text-zinc-800'}`}
            />

            <button 
              onClick={() => handleSend()}
              disabled={(input.trim().length === 0 && attachedImages.length === 0) || isLoading}
              className="p-2 rounded-xl bg-violet-600 text-white flex-shrink-0 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
