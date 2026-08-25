import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Mic, Send, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function JarvisWidget({ data, updateSection, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Olá, Senhor. Sou o JARVIS. Como posso ajudá-lo hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = data?.settings?.geminiApiKey || '';

  // Setup Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListen = () => {
    if (!recognition) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
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

  const handleSend = async (textToProcess = input) => {
    if (!textToProcess.trim()) return;
    if (!apiKey) {
      alert('Por favor, configure sua Chave de API do Gemini nas Configurações do Obnotion primeiro.');
      return;
    }

    const newUserMsg = { role: 'user', text: textToProcess };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await processWithGemini(textToProcess);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
      
      // Text-to-speech for Jarvis response
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response.replace(/\*/g, ''));
        utterance.lang = 'pt-BR';
        utterance.pitch = 0.9;
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, ocorreu um erro ao processar sua solicitação.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processWithGemini = async (userText) => {
    const ai = new GoogleGenAI({ apiKey });
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
          description: 'Retorna a lista de tarefas atuais do usuário.',
        },
        {
          name: 'add_finance_transaction',
          description: 'Adiciona uma transação financeira (receita ou despesa).',
          parameters: {
            type: 'OBJECT',
            properties: {
              description: { type: 'STRING', description: 'Descrição do gasto ou ganho' },
              amount: { type: 'NUMBER', description: 'Valor numérico positivo' },
              type: { type: 'STRING', description: 'income (receita) ou expense (despesa)' }
            },
            required: ['description', 'amount', 'type']
          }
        },
        {
          name: 'get_finances',
          description: 'Retorna o histórico de finanças do usuário.',
        }
      ]
    }];

    // Build chat history
    const history = messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));
    
    // Attempt Pro first, fallback to Flash
    let modelName = 'gemini-2.5-pro';
    let chat;
    
    try {
      chat = ai.chats.create({ 
        model: modelName, 
        config: { tools, systemInstruction: "Você é o JARVIS, assistente pessoal virtual estilo Iron Man. Você é direto, polido e eficiente. Responda em português." },
        history
      });
    } catch (e) {
      console.warn("Pro setup failed, trying Flash", e);
      modelName = 'gemini-2.5-flash';
      chat = ai.chats.create({ 
        model: modelName, 
        config: { tools, systemInstruction: "Você é o JARVIS, assistente pessoal virtual estilo Iron Man. Você é direto, polido e eficiente. Responda em português." },
        history
      });
    }

    let response;
    try {
      response = await chat.sendMessage({ message: userText });
    } catch (e) {
      if (e.status === 429 || e.message?.includes('429') || e.message?.includes('quota')) {
        console.log("Gemini Pro limit reached. Falling back to Gemini Flash.");
        chat = ai.chats.create({ 
          model: 'gemini-2.5-flash', 
          config: { tools, systemInstruction: "Você é o JARVIS, assistente pessoal virtual. Seja polido e eficiente. Responda em português." },
          history
        });
        response = await chat.sendMessage({ message: userText });
      } else {
        throw e;
      }
    }

    if (response.functionCalls && response.functionCalls.length > 0) {
      let functionResponses = [];
      for (const call of response.functionCalls) {
        let result = await handleFunctionCall(call);
        functionResponses.push({
          name: call.name,
          response: result
        });
      }
      // Send the function execution results back to the model
      response = await chat.sendMessage({ message: functionResponses });
    }

    return response.text;
  };

  const handleFunctionCall = async (call) => {
    const { name, args } = call;
    
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform z-50 group"
      >
        <Bot className="w-7 h-7 group-hover:animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-80 md:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden border ${darkMode ? 'bg-[#181920] border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-200" />
              <div>
                <h3 className="font-bold text-sm">JARVIS Cloud</h3>
                <p className="text-[10px] text-blue-200">Alimentado por Gemini Pro</p>
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
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span className="text-xs text-gray-500">Processando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!apiKey && (
            <div className="p-3 bg-red-500/10 border-t border-red-500/20 text-xs text-red-500 text-center">
              Adicione a chave da API do Gemini em <b>Configurações</b> para usar o JARVIS.
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
              className="p-2.5 rounded-full bg-indigo-600 text-white flex-shrink-0 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
