import { useState } from 'react'
import { RotateCcw, AlertTriangle, Trash2, RefreshCw, Database, MessageSquare, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { chatAPI, documentAPI } from '../services/api'

function ResetBot() {
  const [loading, setLoading] = useState(false)
  const [resetType, setResetType] = useState('')

  const resetOptions = [
    {
      id: 'chat',
      title: 'Clear Chat History',
      description: 'Remove all conversation history and start fresh',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: async () => {
        try {
          await chatAPI.clearHistory()
          toast.success('Chat history cleared successfully')
        } catch (error) {
          toast.error('Failed to clear chat history')
        }
      }
    },
    {
      id: 'documents',
      title: 'Delete All Documents',
      description: 'Remove all uploaded documents and their embeddings',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: async () => {
        try {
          const response = await documentAPI.getAll()
          const documents = response.documents || []
          
          for (const doc of documents) {
            await documentAPI.delete(doc.id)
          }
          
          toast.success(`${documents.length} documents deleted successfully`)
        } catch (error) {
          toast.error('Failed to delete documents')
        }
      }
    },
    {
      id: 'all',
      title: 'Reset Everything',
      description: 'Clear all data including chat history and documents',
      icon: RotateCcw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: async () => {
        try {
          // Clear chat history
          await chatAPI.clearHistory()
          
          // Delete all documents
          const response = await documentAPI.getAll()
          const documents = response.documents || []
          
          for (const doc of documents) {
            await documentAPI.delete(doc.id)
          }
          
          toast.success('All data reset successfully')
        } catch (error) {
          toast.error('Failed to reset data')
        }
      }
    }
  ]

  const handleReset = async (option) => {
    if (!confirm(`Are you sure you want to ${option.title.toLowerCase()}? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    setResetType(option.id)
    
    try {
      await option.action()
    } catch (error) {
      console.error('Reset error:', error)
    } finally {
      setLoading(false)
      setResetType('')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Bot</h1>
        <p className="text-gray-600">
          Clear data and reset the chatbot to its initial state
        </p>
      </div>

      {/* Warning */}
      <div className="card p-6 mb-8 border-orange-200 bg-orange-50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-800 mb-1">Warning</h3>
            <p className="text-orange-700 text-sm">
              These actions are irreversible. Please make sure you have backed up any important data before proceeding.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Options */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resetOptions.map((option) => (
          <div key={option.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center flex-shrink-0`}>
                <option.icon className={`w-6 h-6 ${option.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <button
                  onClick={() => handleReset(option)}
                  disabled={loading}
                  className={`btn flex items-center space-x-2 ${
                    option.id === 'all' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'btn-secondary'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && resetType === option.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>
                    {loading && resetType === option.id ? 'Resetting...' : 'Reset'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-8 card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">What gets reset?</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Chat History</span>
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• All conversation records</li>
              <li>• Question and answer pairs</li>
              <li>• Context information</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-red-600" />
              <span>Documents</span>
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• All uploaded PDF and CSV files</li>
              <li>• Generated text chunks</li>
              <li>• Vector embeddings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Database Status */}
      <div className="mt-8 card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5 text-gray-600" />
          <span>Database Status</span>
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Connected</span>
            </div>
            <p className="text-sm text-green-700">PostgreSQL database is running</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-800">pg-vector</span>
            </div>
            <p className="text-sm text-blue-700">Vector extension is active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetBot
