import React, { useState } from 'react';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

function Installation() {
  const [copied, setCopied] = useState(false);
  const siteUrl = window.location.origin;

  const scriptCode = `
<!-- Gemini RAG Chatbot Widget -->
<script>
  (function() {
    // Helper to generate UUID
    function generateUUID() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    var btn = document.createElement("div");
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    btn.style.position = "fixed";
    btn.style.bottom = "15px";
    btn.style.right = "15px";
    btn.style.width = "60px";
    btn.style.height = "60px";
    btn.style.backgroundColor = "#4f46e5";
    btn.style.color = "white";
    btn.style.borderRadius = "50%";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    btn.style.zIndex = "999999";
    
    var container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "15px";
    container.style.right = "15px";
    container.style.width = "400px";
    container.style.height = "600px";
    container.style.maxWidth = "calc(100vw - 40px)";
    container.style.maxHeight = "calc(100vh - 120px)";
    container.style.zIndex = "999998";
    container.style.display = "none";
    container.style.borderRadius = "16px";
    container.style.overflow = "hidden";
    container.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";

    var iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    
    container.appendChild(iframe);
    document.body.appendChild(btn);
    document.body.appendChild(container);
// Toggle function
function toggleChat() {
  if (container.style.display === "none") {
    // Generate a new session ID every time it opens
    var newSessionId = generateUUID();
    iframe.src = "${siteUrl}/embed/chat?sessionId=" + newSessionId;
    container.style.display = "block";
    btn.style.display = "none"; // Hide button when open
  } else {
    container.style.display = "none";
    btn.style.display = "flex"; // Show button when closed
    iframe.src = "about:blank";
  }
}


    btn.onclick = toggleChat;

    window.addEventListener("message", function(event) {
      if (event.data === "close-chat") toggleChat();
    }, false);
  })();
</script>
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    toast.success('Script copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Installation</h1>
        <p className="text-gray-600">Ensure a fresh experience for your users every time they open the chat.</p>
      </div>

      <div className="card p-8 bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
            <Code className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Smart Widget Script</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          This script automatically creates a <b>new chat session</b> every time the bubble is clicked.
        </p>

        <div className="relative">
          <pre className="bg-gray-900 text-gray-300 p-6 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[400px]">
            {scriptCode}
          </pre>
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all shadow-lg"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <a 
            href="/embed/chat" 
            target="_blank" 
            className="flex items-center space-x-2 text-primary-600 hover:underline font-bold text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Standalone Widget Preview</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Installation;
