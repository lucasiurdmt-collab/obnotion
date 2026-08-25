import React, { useState, useEffect, useRef } from 'react';
import { Orbit, X, Mic, Send, Loader2, Sparkles, BrainCircuit } from 'lucide-react';

export default function JarvisWidget({ data, updateSection, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Olá, Senhor. JARVIS online via Gemini Flash. Como posso ajudá-lo hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const messagesEndRef = useRef(null);

  // A chave vem das configurações (via localStorage)
  const apiKey = (data?.settings?.geminiApiKey || '').trim();

  // Setup Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  // Load natural voices from browser
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListen = () => {
    if (!recognition) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick the best natural Brazilian Portuguese voice
    const ptVoices = availableVoices.filter(v => v.lang.startsWith('pt') || v.lang.includes('BR'));
    const preferredVoice = ptVoices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Natural') || 
      v.name.includes('Online') ||
      v.name.includes('Daniel') ||
      v.name.includes('Antonio')
    ) || ptVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

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
        {
          name: 'add_task',
          description: 'Adiciona uma nova tarefa na lista do usuário.',
          parameters: {
            type: 'OBJECT',
            properties: {
              text: { type: 'STRING', description: 'Descrição da tarefa' },
              priority: { type: 'STRING', description: 'Prioridade: alta, media, ou baixa' }
            },
            required: ['text']
          }
        },
        {
          name: 'get_tasks',
          description: 'Retorna a lista de tarefas atuais do usuário.'
        },
        {
          name: 'add_finance_transaction',
          description: 'Adiciona uma transação financeira (receita ou despesa).',
          parameters: {
            type: 'OBJECT',
            properties: {
              description: { type: 'STRING', description: 'Descrição do gasto ou ganho' },
              amount: { type: 'NUMBER', description: 'Valor numérico' },
              type: { type: 'STRING', description: 'income (receita) ou expense (despesa)' }
            },
            required: ['description', 'amount', 'type']
          }
        },
        {
          name: 'get_finances',
          description: 'Retorna o histórico de finanças do usuário.'
        }
      ]
    }];

    // Map history to Gemini API format
    const contents = chatHistory.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash-latest',
      'gemini-2.5-pro',
      'gemini-pro'
    ];

    const callGeminiEndpoint = async (modelIndex = 0) => {
      const model = modelsToTry[modelIndex] || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: contents,
        systemInstruction: {
          parts: [{ text: 'Você é o JARVIS, assistente pessoal virtual inspirado no Homem de Ferro. Você é direto, inteligente, educado e extremamente rápido. Responda sempre em português de forma concisa e natural. Não use markdown excessivo nas respostas faladas.' }]
        },
        tools: tools,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
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
        
        // If model not found or unsupported, try next model in list
        if ((errMsg.includes('not found') || errMsg.includes('not supported') || res.status === 404) && modelIndex < modelsToTry.length - 1) {
          console.warn(`Model ${model} failed, trying next: ${modelsToTry[modelIndex + 1]}...`);
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
      const fnResult = await handleFunctionCall(name, args);

      // Add model's function call & user's function response to contents
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

      // Call Gemini again to get conversational reply
      dataRes = await callGeminiEndpoint(0);
      candidate = dataRes.candidates?.[0]?.content;
      parts = candidate?.parts || [];
    }

    const textPart = parts.find(p => p.text);
    return textPart?.text || 'Ação executada com sucesso!';
  };

  const handleFunctionCall = async (name, args) => {
    if (name === 'get_tasks') {
      return { tasks: data.tasks || [] };
    }
    if (name === 'add_task') {
      const newTask = {
        id: 'task-' + Date.now(),
        text: args.text,
        status: 'todo',
        priority: args.priority || 'media',
        category: 'Geral',
        createdAt: new Date().toISOString()
      };
      const newTasks = [newTask, ...(data.tasks || [])];
      updateSection('tasks', newTasks);
      return { success: true, task: newTask };
    }
    if (name === 'get_finances') {
      return { transactions: data.transactions || [] };
    }
    if (name === 'add_finance_transaction') {
      const newTx = {
        id: 'tx-' + Date.now(),
        description: args.description,
        amount: Number(args.amount),
        type: args.type,
        category: args.type === 'income' ? 'Renda' : 'Outros',
        date: new Date().toISOString().split('T')[0]
      };
      const newTxs = [newTx, ...(data.transactions || [])];
      updateSection('transactions', newTxs);
      return { success: true, transaction: newTx };
    }
    return { error: 'Function not implemented' };
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-20 h-20 bg-blue-500 rounded-full animate-ping opacity-30 absolute"></div>
             <div className="w-24 h-24 bg-cyan-500 rounded-full animate-ping opacity-20 absolute" style={{ animationDelay: '200ms' }}></div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-all relative z-10 ${isSpeaking ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 scale-110 shadow-cyan-500/50' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'}`}
        >
          <BrainCircuit className={`w-7 h-7 ${isSpeaking ? 'animate-pulse text-cyan-100' : 'text-blue-100 group-hover:animate-pulse'}`} />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-80 md:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden border ${darkMode ? 'bg-[#181920] border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-200" />
              <div>
                <h3 className="font-bold text-sm">JARVIS (Gemini Flash)</h3>
                <p className="text-[10px] text-blue-200">Google Gemini • Ultra Rápido & Grátis</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : (darkMode ? 'bg-gray-800 text-gray-200 rounded-bl-none' : 'bg-gray-100 text-gray-800 rounded-bl-none')}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-xs text-gray-500">Processando...</span>
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

          <div className={`p-3 border-t flex items-center gap-2 ${darkMode ? 'border-gray-800 bg-[#15161e]' : 'border-gray-200 bg-gray-50'}`}>
            <button 
              onClick={toggleListen}
              className={`p-2.5 rounded-full flex-shrink-0 transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : (darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Fale ou digite algo..."
              disabled={isLoading || isListening}
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
