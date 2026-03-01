import { useState, useEffect } from "react";
import {
  MessageSquare,
  RefreshCw,
  Calendar,
  ChevronRight,
  Clock,
  User,
  Bot as BotIcon,
  ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';
import { chatAPI } from "../services/api";
import { useChatbot } from "../context/ChatbotContext";

function BotHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionChat, setSessionChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const { selectedChatbot } = useChatbot();

  useEffect(() => {
    fetchSessions();
  }, [selectedChatbot]);

  async function fetchSessions() {
    if (!selectedChatbot) return;
    setLoading(true);
    try {
      const data = await chatAPI.getSessions(selectedChatbot.id);
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  }

  async function handleSessionClick(session) {
    setSelectedSession(session);
    setChatLoading(true);
    try {
      const data = await chatAPI.getHistory(session.session_id, selectedChatbot.id);
      // History comes in newest first, we want oldest first for a natural chat flow
      setSessionChat(data.reverse());
    } catch (error) {
      toast.error("Failed to fetch chat log");
    } finally {
      setChatLoading(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (selectedSession) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-4 bg-gray-50/50">
          <button 
            onClick={() => setSelectedSession(null)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Session: {selectedSession.session_id.substring(0, 8)}...</h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{selectedSession.message_count} Messages</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatLoading ? (
            <div className="text-center py-20 text-gray-400">Loading conversation...</div>
          ) : (
            sessionChat.map((msg, idx) => (
              <div key={idx} className="space-y-4">
                {/* User Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                    <User size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase">User</p>
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800">
                      {msg.query}
                    </div>
                  </div>
                </div>

                {/* Bot Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white flex-shrink-0">
                    <BotIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase">Gemini</p>
                    <div className="prose prose-sm max-w-none text-gray-700 bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <ReactMarkdown>{msg.answer}</ReactMarkdown>
                    </div>
                    {msg.timestamp && (
                      <p className="text-[9px] text-gray-400 mt-2 italic">{formatDate(msg.timestamp)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Chat Sessions</h2>
          <p className="text-sm text-gray-500">History of user interactions with {selectedChatbot?.name}</p>
        </div>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center space-x-2 text-sm font-bold"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Sync</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No sessions recorded yet</p>
          <p className="text-sm text-gray-400 mt-1">Chat history will appear here once users interact with the bot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sessions.map((session) => (
            <div
              key={session.session_id}
              onClick={() => handleSessionClick(session)}
              className="group p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:shadow-md hover:border-primary-100 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center">
                    Session {session.session_id.substring(0, 8)}
                    <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-[9px] text-gray-500 uppercase tracking-tighter">
                      {session.message_count} queries
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5 italic">
                    Last: "{session.last_message}"
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    <Clock size={10} className="mr-1" />
                    Last Active
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium">{formatDate(session.timestamp)}</p>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BotHistory;
