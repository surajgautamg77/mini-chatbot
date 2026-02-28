import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Trash2,
  File,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { documentAPI } from "../services/api";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        await documentAPI.upload(file);
        toast.success(`${file.name} uploaded successfully!`);
      }
      fetchDocuments();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/plain": [".txt"],
    },
    multiple: true
  });

  async function fetchDocuments() {
    setLoading(true);
    try {
      const response = await documentAPI.getAll();
      setDocuments(response || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteDocument(documentId, filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      await documentAPI.delete(documentId);
      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getFileIcon = (contentType) => {
    if (contentType.startsWith("image/"))
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (contentType === "application/pdf")
      return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-green-500" />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
        <p className="text-gray-600">
          Upload documents to train your chatbot. Supported: PDF, Images, Word, Excel, TXT.
        </p>
      </div>

      {/* Explicitly spreading props to a simple div to avoid potential card class issues */}
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ease-in-out bg-white shadow-sm ${
          isDragActive 
            ? "border-primary-500 bg-primary-50 ring-4 ring-primary-50 scale-[1.01]" 
            : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-400"}`}>
            <Upload className="w-8 h-8" />
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">Uploading documents...</p>
              <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-primary-600 animate-progress origin-left"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-900">
                {isDragActive ? "Drop them now!" : "Click or drag files here to upload"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Your files will be processed and indexed automatically
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Uploaded Files ({documents.length})
          </h2>
          <button 
            onClick={fetchDocuments}
            className="text-sm text-primary-600 hover:underline font-medium"
          >
            Refresh list
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading your knowledge base...</div>
        ) : documents.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Your knowledge base is empty</p>
            <p className="text-sm text-gray-400 mt-1">Upload files above to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between hover:shadow-md hover:border-primary-100 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                    {getFileIcon(doc.content_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {doc.filename}
                    </h3>
                    <div className="flex items-center space-x-3 text-[11px] text-gray-400 mt-0.5">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(doc.created_at)}
                      </span>
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-medium uppercase text-[9px]">
                        {doc.content_type.split('/')[1] || doc.content_type}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDocument(doc.id, doc.filename)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Delete document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Documents;
