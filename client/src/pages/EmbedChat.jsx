import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, RefreshCw, X, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../hooks/useChat';

function EmbedChat() {
  const { messages, loading, sendMessage, clearHistory } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
    const content = inputValue;
    setInputValue('');
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  // Function to notify parent to close the iframe
  const handleMinimize = () => {
    window.parent.postMessage('close-chat', '*');
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden border border-gray-100 shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-primary-600 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">AI Assistant</h1>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-primary-100 font-medium">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
             onClick={() => { if(confirm('Clear this conversation?')) clearHistory(); }}
             className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
             title="Reset Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
             onClick={handleMinimize}
             className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
             title="Minimize"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40 px-6">
            <div className="bg-gray-200 p-4 rounded-full mb-4">
              <Bot className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">Hello!</h3>
            <p className="text-xs leading-relaxed">Ask me anything about the documents in our knowledge base.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                m.type === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : m.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-100'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                <div className={`prose prose-sm leading-relaxed ${m.type === 'user' ? 'prose-invert' : ''}`}>
                  {m.type === 'user' ? <p>{m.content}</p> : <ReactMarkdown>{m.content}</ReactMarkdown>}
                </div>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1.5">
                   <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex space-x-2 bg-gray-100 rounded-xl px-4 py-1.5 items-center focus-within:ring-2 focus-within:ring-primary-500 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className="text-primary-600 disabled:opacity-30 p-1 hover:scale-110 transition-transform"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest">
          Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}

export default EmbedChat;
