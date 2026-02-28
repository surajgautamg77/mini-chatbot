import { useState, useEffect } from "react";
import {
  BarChart3,
  MessageSquare,
  CheckCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { chatAPI } from "../services/api";

function Dashboard() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    answered: 0,
  });

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [chatHistory]);

  async function fetchChatHistory() {
    setLoading(true);
    try {
      const response = await chatAPI.getAllHistory(100, 0);
      setChatHistory(response || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast.error("Failed to fetch chat history");
    } finally {
      setLoading(false);
    }
  }

  function calculateStats() {
    const stats = {
      total: chatHistory.length,
      answered: chatHistory.length,
    };
    setStats(stats);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Monitor all chatbot interactions across all sessions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Queries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Successful Responses
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.answered}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      <div className="flex mb-6">
        <button
          onClick={fetchChatHistory}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="font-semibold text-gray-800">Recent Activity</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center bg-white">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-300" />
            <p className="mt-2 text-gray-500">Loading history...</p>
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="p-8 text-center bg-white">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-200" />
            <p className="mt-2 text-gray-500">No chat history recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                    Session
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                    Query
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                    Response
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {chatHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {item.session_id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate font-medium">
                        {item.query}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md prose prose-sm line-clamp-3 overflow-hidden">
                        <ReactMarkdown>{item.answer}</ReactMarkdown>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(item.timestamp)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
