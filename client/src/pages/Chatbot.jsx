import { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw, User, Bot, MessageSquare, Search, Mic, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'

function Chatbot() {
  const { messages, loading, sendMessage, clearHistory, sessionId } = useChat();
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

  const handleNewSession = () => {
    if (confirm('Start a new session? This will clear the current view.')) {
      clearHistory();
      toast.success('New session started');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user'
    const isError = message.type === 'error'

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
        <div className={`flex max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-primary-600' : isError ? 'bg-red-500' : 'bg-gray-800'
          } ${isUser ? 'ml-3' : 'mr-3'}`}>
            {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
          </div>
          <div className={`rounded-2xl px-5 py-3 ${
            isUser 
              ? 'bg-primary-600 text-white shadow-md' 
              : isError 
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-white text-gray-800 border border-gray-100 shadow-sm'
          }`}>
            <div className={`text-sm leading-relaxed prose prose-sm ${isUser ? 'prose-invert' : ''}`}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              )}
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Verified Sources</p>
                <div className="space-y-1">
                  {message.sources.map((source, index) => (
                    <div key={index} className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 italic">
                       "{source.content.substring(0, 150)}..."
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className={`text-[10px] mt-2 ${isUser ? 'text-primary-100' : 'text-gray-400'}`}>
              {formatDate(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Chatbot</h1>
          <div className="flex items-center space-x-2">
             <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
             <p className="text-xs text-gray-500 font-medium">Session: {sessionId?.substring(0, 8)}...</p>
          </div>
        </div>
        <button onClick={handleNewSession} className="text-gray-400 hover:text-primary-600 p-2 rounded-full hover:bg-gray-50 transition-all">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <Bot className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">How can I help you today?</h3>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
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
      <div className="p-6 bg-white">
        <div className="max-w-3xl mx-auto relative group">
          <div className="flex items-center bg-white border border-[#dfe1e5] rounded-full px-5 py-1 hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:border-transparent focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] focus-within:border-transparent transition-all duration-200">
            <Search className="w-5 h-5 text-[#9aa0a6] mr-3" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[16px] py-3 text-[#202124]"
              disabled={loading}
            />
            <div className="flex items-center space-x-4 ml-2 border-l border-gray-100 pl-4">
               <button className="text-[#70757a] hover:text-primary-600 transition-colors">
                  <Mic className="w-5 h-5" />
               </button>
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
        <p className="text-[11px] text-center text-gray-400 mt-4 font-medium">
          Gemini AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}

export default Chatbot
