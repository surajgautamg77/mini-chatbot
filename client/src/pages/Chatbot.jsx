import { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw, User, Bot, MessageSquare, Search, Mic, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import { useChatbot } from '../context/ChatbotContext'

function Chatbot() {
  const { selectedChatbot } = useChatbot();
  const { messages, loading, sendMessage, clearHistory, sessionId } = useChat(selectedChatbot?.id);
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return
    const content = inputValue
    setInputValue('')
    try {
      await sendMessage(content)
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  if (!selectedChatbot) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">No Chatbot Selected</h2>
        <p className="text-gray-500 mt-2">Select a chatbot to start a conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{selectedChatbot.name}</h1>
            <div className="flex items-center space-x-2">
               <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
               <p className="text-xs text-gray-500 font-medium">Session: {sessionId?.substring(0, 8)}...</p>
            </div>
          </div>
        </div>
        <button onClick={clearHistory} className="text-gray-400 hover:text-primary-600 p-2 rounded-full hover:bg-gray-50 transition-all">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <Bot className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Chatting with {selectedChatbot.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Ask anything based on the documents you uploaded.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
              <div className={`flex max-w-4xl ${m.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.type === 'user' ? 'bg-primary-600' : m.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
                } ${m.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                  {m.type === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`rounded-2xl px-5 py-3 ${
                  m.type === 'user' 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : m.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm'
                }`}>
                  <div className={`text-sm leading-relaxed prose prose-sm ${m.type === 'user' ? 'prose-invert' : ''}`}>
                    {m.type === 'user' ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    )}
                  </div>
                  
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Verified Sources</p>
                      <div className="space-y-1">
                        {m.sources.map((source, index) => (
                          <div key={index} className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 italic">
                             "{source.content.substring(0, 100)}..."
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-start space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Google Search Style Input */}
      <div className="p-6 bg-white border-t border-gray-50">
        <div className="max-w-3xl mx-auto relative group">
          <div className="flex items-center bg-white border border-[#dfe1e5] rounded-full px-5 py-1 hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:border-transparent focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] focus-within:border-transparent transition-all duration-200">
            <Search className="w-5 h-5 text-[#9aa0a6] mr-3" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${selectedChatbot.name}...`}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[16px] py-3 text-[#202124]"
              disabled={loading}
            />
            <div className="flex items-center space-x-4 ml-2 border-l border-gray-100 pl-4">
               <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || loading}
                  className={`${inputValue.trim() ? 'text-[#4285f4]' : 'text-[#9aa0a6]'} hover:scale-110 transition-all`}
               >
                  <Send className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
