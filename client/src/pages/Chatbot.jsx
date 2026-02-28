import { useState, useEffect, useRef } from 'react'
import { Send, RotateCcw, User, Bot, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { chatAPI } from '../services/api'

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize or retrieve session ID
    let sid = localStorage.getItem('chat_session_id')
    if (!sid) {
      // Use crypto.randomUUID (standard in modern browsers)
      sid = crypto.randomUUID()
      localStorage.setItem('chat_session_id', sid)
    }
    setSessionId(sid)
    fetchChatHistory(sid)
  }, [])

  async function fetchChatHistory(sid) {
    if (!sid) return
    try {
      const response = await chatAPI.getHistory(sid)
      // The backend returns a list of history objects directly
      const history = (response || []).reverse().map((chat) => [
        {
          id: chat.id + '-q',
          type: 'user',
          content: chat.query,
          timestamp: chat.timestamp,
        },
        {
          id: chat.id + '-a',
          type: 'bot',
          content: chat.answer,
          timestamp: chat.timestamp,
        },
      ]).flat()

      setMessages(history)
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentQuery = inputValue
    setInputValue('')
    setLoading(true)

    try {
      const response = await chatAPI.query(currentQuery, sessionId)

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')

      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  async function handleClearHistory() {
    if (!confirm('This will clear your local view and generate a new session. Continue?')) return
    
    const newSid = crypto.randomUUID()
    localStorage.setItem('chat_session_id', newSid)
    setSessionId(newSid)
    setMessages([])
    toast.success('Started a new conversation session')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user'
    const isError = message.type === 'error'

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-primary-600' : isError ? 'bg-red-500' : 'bg-gray-600'
          }`}>
            {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
          <div className={`rounded-lg px-4 py-2 max-w-2xl ${
            isUser 
              ? 'bg-primary-600 text-white' 
              : isError 
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-white text-gray-900 border border-gray-200'
          }`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-1">Sources:</p>
                <div className="flex flex-col gap-1">
                  {message.sources.map((source, index) => (
                    <div key={index} className="text-xs text-gray-600 bg-gray-50 p-1 rounded border border-gray-100">
                       {source.content}...
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className={`text-xs mt-2 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
              {formatDate(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot (RAG)</h1>
          <p className="text-gray-600">Powered by Gemini 2.5 Flash</p>
        </div>
        <button onClick={handleClearHistory} className="btn btn-secondary flex items-center space-x-2">
          <RotateCcw className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500">Ask a question about your documents</p>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}

        {loading && (
          <div className="flex items-start space-x-2">
            <Bot className="w-8 h-8 text-gray-500" />
            <div className="bg-white border px-4 py-2 rounded-lg text-gray-500">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything..."
            className="input flex-1"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            className="btn btn-primary px-6"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
