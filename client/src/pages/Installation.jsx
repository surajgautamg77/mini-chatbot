import React, { useState } from "react";
import {
  Copy,
  Check,
  Code,
  ExternalLink,
  FileText,
  ClipboardCopy,
  Layout,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useChatbot } from "../context/ChatbotContext";

function Installation() {
  const [copied, setCopied] = useState(false);
  const { selectedChatbot } = useChatbot();

  // URL where the widget JS is hosted (FastAPI Backend)
  const backendUrl = "http://localhost:8000";
  // URL where the React application is hosted
  const appUrl = window.location.origin;

  const scriptCode = `<script 
  src="${backendUrl}/static/widget.js" 
  data-app-url="${appUrl}"
  data-bot-id="${selectedChatbot?.id}" 
  data-bot-name="${selectedChatbot?.name}"
></script>`.trim();

  const handleCopy = () => {
    if (!selectedChatbot) {
      toast.error("Select a chatbot first");
      return;
    }
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    toast.success("Widget script copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedChatbot) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">No Chatbot Selected</h2>
        <p className="text-gray-500 mt-2">
          Select a chatbot to get its integration script.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Embed {selectedChatbot.name}
        </h1>
        <p className="text-gray-600 text-lg">
          A simple one-line script to add AI to your site.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-gray-900">Final Check</h3>
          </div>
          <p className="text-sm text-gray-500">
            Ensure your chatbot has documents uploaded in the Knowledge Base.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-gray-900">Copy Tag</h3>
          </div>
          <p className="text-sm text-gray-500">
            Copy the unique script tag generated for{" "}
            <b>{selectedChatbot.name}</b>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-gray-900">Paste & Live</h3>
          </div>
          <p className="text-sm text-gray-500">
            Paste it anywhere in your site HTML (usually before{" "}
            <code>&lt;/body&gt;</code>).
          </p>
        </div>
      </div>

      <div className="card p-8 bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
              <Code className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Integration Script
            </h2>
          </div>
        </div>

        <div className="relative group">
          <pre className="bg-gray-900 text-primary-300 p-8 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed border-4 border-gray-800 shadow-2xl">
            {scriptCode}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-lg flex items-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <AlertCircle size={18} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-bold">
                Local Development Note
              </p>
              <p className="text-xs text-blue-700">
                Ensure both backend (8000) and frontend (5173) are running for
                the widget to work locally.
              </p>
            </div>
          </div>
          <a
            href={`${appUrl}/embed/chat?chatbotId=${selectedChatbot.id}`}
            target="_blank"
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-all shadow-sm font-bold text-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Standalone Preview</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Installation;
