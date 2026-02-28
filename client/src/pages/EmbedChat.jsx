import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, RefreshCw, X, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "../hooks/useChat";

function EmbedChat() {
  const { messages, loading, sendMessage, clearHistory } = useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
    const content = inputValue;
    setInputValue("");
    try {
      await sendMessage(content);
    } catch (error) {
      console.error("Failed to send message");
    }
  };

  const handleMinimize = () => {
    window.parent.postMessage("close-chat", "*");
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
              <span className="text-[10px] text-primary-100 font-medium">
                Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (confirm("Clear this conversation?")) clearHistory();
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
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
            <h3 className="text-gray-900 font-bold mb-1 text-sm">Welcome</h3>
            <p className="text-[11px] leading-relaxed">
              Ask me anything from the database.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-[13px] shadow-sm ${
                  m.type === "user"
                    ? "bg-primary-600 text-white rounded-tr-none"
                    : m.type === "error"
                      ? "bg-red-50 text-red-800 border border-red-100"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
              >
                <div
                  className={`prose prose-sm leading-relaxed ${m.type === "user" ? "prose-invert" : ""}`}
                >
                  {m.type === "user" ? (
                    <p>{m.content}</p>
                  ) : (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  )}
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

      {/* Google Style Input for Widget */}
      <div className="p-4 bg-white border-t border-gray-50">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-0.5 focus-within:bg-white focus-within:shadow-md focus-within:border-primary-200 transition-all duration-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm py-2.5 text-gray-800"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className={`${inputValue.trim() ? "text-primary-600" : "text-gray-300"} transition-all`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-400 mt-2 font-bold uppercase tracking-tight">
          Gemini AI
        </p>
      </div>
    </div>
  );
}

export default EmbedChat;
