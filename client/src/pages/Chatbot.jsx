import { useState, useEffect, useRef } from "react";
import { Send, RotateCcw, User, Bot, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { chatAPI } from "../services/api";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let sid = localStorage.getItem("chat_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("chat_session_id", sid);
    }
    setSessionId(sid);
    fetchChatHistory(sid);
  }, []);

  async function fetchChatHistory(sid) {
    if (!sid) return;
    try {
      const response = await chatAPI.getHistory(sid);
      const history = (response || [])
        .reverse()
        .map((chat) => [
          {
            id: chat.id + "-q",
            type: "user",
            content: chat.query,
            timestamp: chat.timestamp,
          },
          {
            id: chat.id + "-a",
            type: "bot",
            content: chat.answer,
            timestamp: chat.timestamp,
          },
        ])
        .flat();

      setMessages(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue("");
    setLoading(true);

    try {
      const response = await chatAPI.query(currentQuery, sessionId);

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");

      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    if (!confirm("This will start a new session. Continue?")) return;
    const newSid = crypto.randomUUID();
    localStorage.setItem("chat_session_id", newSid);
    setSessionId(newSid);
    setMessages([]);
    toast.success("New session started");
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === "user";
    const isError = message.type === "error";

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
        <div
          className={`flex max-w-4xl ${isUser ? "flex-row-reverse" : "flex-row"} items-start space-x-3`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUser ? "bg-primary-600" : isError ? "bg-red-500" : "bg-gray-800"
            } ${isUser ? "ml-3" : "mr-3"}`}
          >
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>
          <div
            className={`rounded-2xl px-5 py-3 ${
              isUser
                ? "bg-primary-600 text-white shadow-md"
                : isError
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-white text-gray-800 border border-gray-100 shadow-sm"
            }`}
          >
            <div
              className={`text-sm leading-relaxed prose prose-sm ${isUser ? "prose-invert" : ""}`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              )}
            </div>

            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Verified Sources
                </p>
                <div className="space-y-1">
                  {message.sources.map((source, index) => (
                    <div
                      key={index}
                      className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 italic"
                    >
                      "{source.content.substring(0, 150)}..."
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p
              className={`text-[10px] mt-2 ${isUser ? "text-primary-100" : "text-gray-400"}`}
            >
              {formatDate(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Chatbot</h1>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-xs text-gray-500 font-medium">Online</p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-gray-100 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-base font-semibold text-gray-900">
              How can I help you today?
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mt-1">
              Ask questions about your uploaded documents for instant answers.
            </p>
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

      <div className="p-6 bg-white border-t border-gray-100 shadow-2xl">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Send a message..."
            className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
