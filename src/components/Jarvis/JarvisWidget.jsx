import React, { useState, useEffect, useRef } from 'react';
import { Orbit, X, Mic, Send, Loader2, Sparkles, BrainCircuit } from 'lucide-react';

export default function JarvisWidget({ data, updateSection, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá, Senhor. Sou o JARVIS. Como posso ajudá-lo hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Audio playback ref
  const audioRef = useRef(null);

  // A chave agora vem das configurações (via localStorage)
  const apiKey = data?.settings?.openAIApiKey || '';

  // Setup Speech Recognition (Browser nativo para escutar)
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
    
    // Stop any current audio playing
    if (audioRef.current) {
      audioRef.current.pause();
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

  const playOpenAIVoice = async (text) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text.replace(/\*/g, ''),
          voice: 'onyx', // 'onyx' or 'echo' sound very cool/masculine like Jarvis
          response_format: 'mp3'
        })
      });

      if (!response.ok) throw new Error('Audio generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      
      await audio.play();
    } catch (err) {
      console.error('TTS Error:', err);
      setIsSpeaking(false);
      // Fallback to native browser TTS
      if (window.speechSynthesis) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));
        utterance.lang = 'pt-BR';
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSend = async (textToProcess = input) => {
    if (!textToProcess.trim()) return;
    if (!apiKey) {
      alert('Por favor, configure sua Chave de API da OpenAI (ChatGPT) nas Configurações do Obnotion primeiro.');
      return;
    }

    const newUserMsg = { role: 'user', content: textToProcess };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const { textResponse, updatedMessages: newChatHistory } = await processWithOpenAI(updatedMessages);
      setMessages(newChatHistory);
      
      // Stop previous audio before starting new one
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Text-to-speech with OpenAI Voice API
      playOpenAIVoice(textResponse);
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Verifique sua chave da OpenAI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processWithOpenAI = async (chatHistory) => {
    const tools = [
      {
        type: 'function',
        function: {
          name: 'add_task',
          description: 'Adiciona uma nova tarefa na lista do usuário.',
          parameters: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Descrição da tarefa' },
              priority: { type: 'string', description: 'Prioridade: alta, media, ou baixa' }
            },
            required: ['text']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_tasks',
          description: 'Retorna a lista de tarefas atuais do usuário.',
        }
      },
      {
        type: 'function',
        function: {
          name: 'add_finance_transaction',
          description: 'Adiciona uma transação financeira (receita ou despesa).',
          parameters: {
            type: 'object',
            properties: {
              description: { type: 'string', description: 'Descrição do gasto ou ganho' },
              amount: { type: 'number', description: 'Valor numérico positivo' },
              type: { type: 'string', description: 'income (receita) ou expense (despesa)' }
            },
            required: ['description', 'amount', 'type']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_finances',
          description: 'Retorna o histórico de finanças do usuário.',
        }
      }
    ];

    const systemPrompt = {
      role: 'system',
      content: 'Você é o JARVIS, um assistente pessoal virtual polido, rápido e altamente eficiente (inspirado no Homem de Ferro). Responda sempre em português. Seja direto nas respostas sem ser robótico.'
    };

    let currentHistory = [systemPrompt, ...chatHistory];

    const callOpenAI = async (msgs) => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: msgs,
          tools: tools,
          tool_choice: 'auto'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'OpenAI API Error');
      }
      return res.json();
    };

    let response = await callOpenAI(currentHistory);
    let message = response.choices[0].message;

    // Handle Function Calling
    if (message.tool_calls) {
      currentHistory.push(message);
      
      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        let result = await handleFunctionCall(functionName, args);
        
        currentHistory.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(result)
        });
      }
      
      // Call again to get the final text response after tool execution
      response = await callOpenAI(currentHistory);
      message = response.choices[0].message;
    }

    currentHistory.push({ role: 'assistant', content: message.content });

    // Filter out system prompt and tool messages for UI rendering cleanly
    const finalUIHistory = currentHistory.filter(m => m.role === 'user' || (m.role === 'assistant' && m.content));
    
    return {
      textResponse: message.content,
      updatedMessages: finalUIHistory
    };
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
             <div className="w-20 h-20 bg-indigo-500 rounded-full animate-ping opacity-30 absolute"></div>
             <div className="w-24 h-24 bg-blue-500 rounded-full animate-ping opacity-20 absolute" style={{ animationDelay: '200ms' }}></div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-all relative z-10 ${isSpeaking ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 scale-110 shadow-cyan-500/50' : 'bg-gradient-to-tr from-blue-600 to-indigo-500'}`}
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
                <h3 className="font-bold text-sm">JARVIS OpenAI</h3>
                <p className="text-[10px] text-blue-200">GPT-4o Mini + Neural Voice</p>
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
                  {m.content}
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
              Adicione a chave da <b>OpenAI (ChatGPT)</b> nas Configurações do Obnotion (senha: admin admin).
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
