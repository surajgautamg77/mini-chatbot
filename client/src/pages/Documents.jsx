import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Trash2, File, Calendar, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { documentAPI } from '../services/api'

function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
    },
    onDrop: handleFileDrop,
  })

  async function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    try {
      for (const file of acceptedFiles) {
        await documentAPI.upload(file)
        toast.success(`${file.name} uploaded successfully!`)
      }
      fetchDocuments()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function fetchDocuments() {
    setLoading(true)
    try {
      const response = await documentAPI.getAll()
      // The backend returns a list directly
      setDocuments(response || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error('Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteDocument(documentId, filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return

    try {
      await documentAPI.delete(documentId)
      toast.success('Document deleted successfully')
      fetchDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document')
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getFileIcon = (contentType) => {
    if (contentType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />
    if (contentType === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />
    return <File className="w-8 h-8 text-green-500" />
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Documents</h1>
        <p className="text-gray-600">
          Upload images, PDF, Word, Excel, or Text files to build your knowledge base
        </p>
      </div>

      <div className="card p-6 mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {uploading ? (
            <p className="text-lg font-medium text-gray-900">Uploading...</p>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drag & drop files here, or click to select
              </p>
              <p className="text-gray-500 text-sm">Supported: PDF, Images, Word, Excel, TXT</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded Documents</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="p-6 text-center">No documents uploaded yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div key={doc.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getFileIcon(doc.content_type)}
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.filename}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {doc.content_type}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDocument(doc.id, doc.filename)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Documents
