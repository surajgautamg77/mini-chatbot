import React, { useState } from 'react';
import { Copy, Check, Code, ExternalLink, ListOrdered, FileText, ClipboardCopy, Layout } from 'lucide-react';
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

    function toggleChat() {
      if (container.style.display === "none") {
        var newSessionId = generateUUID();
        iframe.src = "${siteUrl}/embed/chat?sessionId=" + newSessionId;
        container.style.display = "block";
        btn.style.display = "none";
      } else {
        container.style.display = "none";
        btn.style.display = "flex";
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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Installation Guide</h1>
        <p className="text-gray-600 text-lg">Follow these simple steps to integrate the chatbot into your website.</p>
      </div>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="text-primary-100 absolute -top-2 -right-2 transform rotate-12">
            <FileText size={80} />
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">1</span>
            <h3 className="font-bold text-gray-900">Prepare Data</h3>
          </div>
          <p className="text-sm text-gray-500 relative z-10">
            Go to the <b>Knowledge Base</b> and upload the documents you want the AI to learn from.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="text-primary-100 absolute -top-2 -right-2 transform rotate-12">
            <ClipboardCopy size={80} />
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">2</span>
            <h3 className="font-bold text-gray-900">Copy Script</h3>
          </div>
          <p className="text-sm text-gray-500 relative z-10">
            Copy the auto-generated code snippet provided in the section below.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="text-primary-100 absolute -top-2 -right-2 transform rotate-12">
            <Layout size={80} />
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">3</span>
            <h3 className="font-bold text-gray-900">Go Live</h3>
          </div>
          <p className="text-sm text-gray-500 relative z-10">
            Paste the script into your website HTML before the <code>&lt;/body&gt;</code> tag.
          </p>
        </div>
      </div>

      {/* Code Section */}
      <div className="card p-8 bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
            <Code className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Step 2: Copy the Script</h2>
        </div>

        <div className="relative group">
          <pre className="bg-gray-900 text-gray-300 p-6 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[400px] border-4 border-gray-800 shadow-inner">
            {scriptCode}
          </pre>
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-lg flex items-center space-x-2"
          >
            {copied ? (
              <><Check className="w-4 h-4" /> <span>Copied!</span></>
            ) : (
              <><Copy className="w-4 h-4" /> <span>Copy Code</span></>
            )}
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 font-medium italic">
            Note: This script will automatically create a fresh session for every user click.
          </p>
          <a 
            href="/embed/chat" 
            target="_blank" 
            className="flex items-center space-x-2 text-primary-600 hover:underline font-bold text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview Widget</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Installation;
