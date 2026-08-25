import React, { useState, useEffect, useRef } from 'react';
import { Orbit, X, Mic, Send, Loader2, Sparkles, BrainCircuit, Settings, Volume2, Check, Radio } from 'lucide-react';

export default function JarvisWidget({ data, updateSection, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Olá, Senhor. JARVIS totalmente integrado a todos os seus livros, notas, tarefas e finanças. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [voiceRate, setVoiceRate] = useState(1.05);
  const [voicePitch, setVoicePitch] = useState(1.0);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const handsFreeRef = useRef(handsFreeMode);
  handsFreeRef.current = handsFreeMode;

  const apiKey = (data?.settings?.geminiApiKey || '').trim();

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

      // Detect Wake Word "Olá Jarvis", "Ola Jarvis", "Jarvis"
      if (combined.includes('olá jarvis') || combined.includes('ola jarvis') || combined.includes('jarvis') || combined.includes('ei jarvis')) {
        playWakeSound();
        setIsOpen(true);
        
        // Extract command after wake word if any
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

    recog.onend = () => {
      // If hands-free mode is on, auto-restart
      if (handsFreeRef.current) {
        try {
          recog.start();
        } catch (e) {}
      } else {
        setIsListening(false);
      }
    };

    if (handsFreeMode) {
      try {
        recog.start();
        setIsListening(true);
      } catch (e) {}
    } else {
      try {
        recog.stop();
        setIsListening(false);
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

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const cleanText = text.replace(/[*_#`]/g, '').trim();
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
  };

  const handleSend = async (textToProcess = input) => {
    if (!textToProcess.trim()) return;
    if (!apiKey) {
      alert('Por favor, configure sua Chave de API do Google Gemini (100% grátis) nas Configurações do Obnotion.');
      return;
    }

    const newUserMsg = { role: 'user', text: textToProcess };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
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
        // BOOKS
        {
          name: 'get_books',
          description: 'Retorna a lista completa de livros da biblioteca (lendo, lidos, lista de desejos, páginas, progresso).',
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
              status: { type: 'STRING', description: 'reading (lendo), completed (lido), ou wishlist (desejo)' },
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
        // FINANCES
        {
          name: 'get_finances',
          description: 'Retorna o histórico de finanças, receitas, despesas e saldo.',
          parameters: { type: 'OBJECT', properties: {} }
        },
        {
          name: 'add_finance_transaction',
          description: 'Adiciona uma transação financeira (receita ou despesa).',
          parameters: {
            type: 'OBJECT',
            properties: {
              description: { type: 'STRING', description: 'Descrição do gasto ou ganho' },
              amount: { type: 'NUMBER', description: 'Valor numérico' },
              type: { type: 'STRING', description: 'income (receita) ou expense (despesa)' },
              category: { type: 'STRING', description: 'Categoria da transação' }
            },
            required: ['description', 'amount', 'type']
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
        }
      ]
    }];

    // Map history to Gemini API format (strictly starts with user)
    const validHistory = chatHistory.filter((m, idx) => !(idx === 0 && m.role === 'model'));
    const contents = validHistory.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // Overview of current workspace data for instant context
    const workspaceContext = `
Você é o JARVIS, assistente pessoal supremo e onisciente do usuário no sistema Obnotion.
Você tem controle e acesso total a: Biblioteca de Livros, Notas, Tarefas, Finanças, Hábitos e Calendário.

ESTADO ATUAL DO WORKSPACE:
- Livros Cadastrados (${data.books?.length || 0}): ${JSON.stringify((data.books || []).map(b => ({ title: b.title, author: b.author, status: b.status, progress: `${b.currentPage}/${b.totalPages}` })))}
- Tarefas (${data.tasks?.length || 0}): ${JSON.stringify((data.tasks || []).slice(0, 8).map(t => ({ title: t.title || t.text, status: t.status, priority: t.priority })))}
- Finanças Recentes: ${JSON.stringify((data.transactions || []).slice(0, 5).map(tx => ({ desc: tx.description, val: tx.amount, type: tx.type })))}
- Notas (${data.notes?.length || 0}): ${JSON.stringify((data.notes || []).map(n => ({ title: n.title, folder: n.folder })))}

DIRETRIZES:
1. Responda em português com tom educado, elegante, proativo e dinâmico (estilo JARVIS).
2. Se o usuário perguntar sobre seus livros, notas, tarefas ou saldo, use o contexto acima ou as funções para responder de imediato!
3. Seja conciso e evite formatação excessiva de markdown (como asteriscos) em respostas faladas.
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
          temperature: 0.6,
          maxOutputTokens: 600
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errData = {};
        try {
          errData = await res.json();
        } catch (e) {}
        
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

    // Check for function calls
    let functionCallPart = parts.find(p => p.functionCall);
    if (functionCallPart) {
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
    // BOOKS
    if (name === 'get_books') {
      return { books: data.books || [] };
    }
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
      const newBooks = [newBook, ...(data.books || [])];
      updateSection('books', newBooks);
      return { success: true, book: newBook };
    }
    if (name === 'update_book_progress') {
      const books = [...(data.books || [])];
      const target = books.find(b => b.title.toLowerCase().includes((args.bookTitle || '').toLowerCase()));
      if (target) {
        target.currentPage = Number(args.currentPage);
        if (args.status) target.status = args.status;
        if (target.currentPage >= target.totalPages) target.status = 'completed';
        updateSection('books', books);
        return { success: true, updatedBook: target };
      }
      return { success: false, message: 'Livro não encontrado' };
    }

    // TASKS
    if (name === 'get_tasks') {
      return { tasks: data.tasks || [] };
    }
    if (name === 'add_task') {
      const newTask = {
        id: 'task-' + Date.now(),
        title: args.title,
        status: args.status || 'todo',
        priority: args.priority || 'medium',
        dueDate: args.dueDate || new Date().toISOString().split('T')[0],
        tags: ['JARVIS'],
        notes: 'Criado via assistente de voz'
      };
      const newTasks = [newTask, ...(data.tasks || [])];
      updateSection('tasks', newTasks);
      return { success: true, task: newTask };
    }

    // FINANCES
    if (name === 'get_finances') {
      return { transactions: data.transactions || [] };
    }
    if (name === 'add_finance_transaction') {
      const newTx = {
        id: 'tx-' + Date.now(),
        description: args.description,
        amount: Number(args.amount),
        type: args.type,
        category: args.category || (args.type === 'income' ? 'Renda' : 'Outros'),
        date: new Date().toISOString().split('T')[0],
        status: 'paid'
      };
      const newTxs = [newTx, ...(data.transactions || [])];
      updateSection('transactions', newTxs);
      return { success: true, transaction: newTx };
    }

    // NOTES
    if (name === 'get_notes') {
      return { notes: data.notes || [] };
    }
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
      const newNotes = [newNote, ...(data.notes || [])];
      updateSection('notes', newNotes);
      return { success: true, note: newNote };
    }

    // HABITS
    if (name === 'get_habits') {
      return { habits: data.habits || [] };
    }

    return { error: 'Function not implemented' };
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-20 h-20 bg-blue-500 rounded-full animate-ping opacity-30 absolute"></div>
             <div className="w-24 h-24 bg-cyan-500 rounded-full animate-ping opacity-20 absolute" style={{ animationDelay: '200ms' }}></div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-all relative z-10 ${isSpeaking ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 scale-110 shadow-cyan-500/50' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'} ${handsFreeMode ? 'ring-4 ring-cyan-400/50' : ''}`}
        >
          <BrainCircuit className={`w-7 h-7 ${isSpeaking ? 'animate-pulse text-cyan-100' : 'text-blue-100 group-hover:animate-pulse'}`} />
          {handsFreeMode && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-4 md:right-6 w-[92vw] md:w-96 h-[520px] rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden border ${darkMode ? 'bg-[#181920] border-gray-800' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-200" />
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  JARVIS
                  {handsFreeMode && <span className="text-[10px] bg-emerald-400/20 text-emerald-200 px-1.5 py-0.5 rounded-full font-mono">Mãos Livres</span>}
                </h3>
                <p className="text-[10px] text-blue-200">Acesso Total: Livros, Notas, Tarefas & Finanças</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowVoiceSettings(!showVoiceSettings)} 
                className={`p-1.5 rounded-lg transition-colors ${showVoiceSettings ? 'bg-white/30' : 'hover:bg-white/20'}`}
                title="Configurações de Voz & Áudio"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice Settings Panel Modal */}
          {showVoiceSettings && (
            <div className={`p-4 border-b text-xs space-y-3 animate-fade-in ${darkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5"><Volume2 className="w-4 h-4 text-blue-400" /> Personalizar Voz</span>
                <button onClick={() => speakText("Olá! Esta é uma demonstração da minha voz configurada.")} className="text-[11px] text-blue-400 hover:underline">
                  Testar Voz 🔊
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Selecionar Voz:</label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className={`w-full p-1.5 rounded border text-xs outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                  {availableVoices.map((v, i) => (
                    <option key={i} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                    <span>Velocidade:</span>
                    <span>{voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                    <span>Tom (Pitch):</span>
                    <span>{voicePitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Hands-Free Wake Word Toggle */}
              <div className="pt-2 border-t border-inherit flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[11px] flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    Ativação por "Olá Jarvis"
                  </p>
                  <p className="text-[10px] text-gray-500">Escuta contínua sem precisar clicar</p>
                </div>
                <button
                  onClick={() => setHandsFreeMode(!handsFreeMode)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${handsFreeMode ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {handsFreeMode ? 'Ativado' : 'Desativado'}
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' : (darkMode ? 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700/50' : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm')}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-xs text-gray-500">Consultando o sistema...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!apiKey && (
            <div className="p-3 bg-blue-500/10 border-t border-blue-500/20 text-xs text-blue-400 text-center">
              Adicione a chave grátis do <b>Gemini</b> em Configurações (senha: admin admin).
            </div>
          )}

          {/* Input Footer */}
          <div className={`p-3 border-t flex items-center gap-2 ${darkMode ? 'border-gray-800 bg-[#15161e]' : 'border-gray-200 bg-gray-50'}`}>
            <button 
              onClick={toggleSingleListen}
              className={`p-2.5 rounded-full flex-shrink-0 transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : (darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}`}
              title={isListening ? 'Escutando...' : 'Falar com o microfone'}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={handsFreeMode ? 'Diga "Olá Jarvis" ou digite...' : 'Fale ou digite algo...'}
              disabled={isLoading}
              className={`flex-1 bg-transparent border-none outline-none text-sm px-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-full bg-blue-600 text-white flex-shrink-0 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
