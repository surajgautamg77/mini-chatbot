import { useState, useEffect } from "react";
import {
  BarChart3,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  Send,
  Filter,
  RefreshCw,
  Calendar,
  User,
  Bot,
} from "lucide-react";
import toast from "react-hot-toast";
import { chatAPI } from "../services/api";

function Dashboard() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    answered: 0,
    request_human: 0,
    unanswered: 0,
    human_responded: 0,
  });
  const [respondingTo, setRespondingTo] = useState(null);
  const [humanResponse, setHumanResponse] = useState("");

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [chatHistory]);

  async function fetchChatHistory() {
    setLoading(true);
    try {
      const response = await chatAPI.getHistory(1000, 0);
      setChatHistory(response.chatHistory || []);
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
      answered: chatHistory.filter((item) => item.type === "answered").length,
      request_human: chatHistory.filter((item) => item.type === "request_human")
        .length,
      unanswered: chatHistory.filter((item) => item.type === "unanswered")
        .length,
      human_responded: chatHistory.filter(
        (item) => item.type === "human_responded"
      ).length,
    };
    setStats(stats);
  }

  function getFilteredHistory() {
    if (filter === "all") return chatHistory;
    return chatHistory.filter((item) => item.type === filter);
  }

  async function handleHumanResponse(chatId) {
    if (!humanResponse.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      await chatAPI.addHumanResponse(chatId, humanResponse);
      toast.success("Response added successfully");
      setRespondingTo(null);
      setHumanResponse("");
      fetchChatHistory(); // Refresh the data
    } catch (error) {
      console.error("Error adding human response:", error);
      toast.error("Failed to add response");
    }
  }

  function getTypeIcon(type) {
    switch (type) {
      case "answered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "request_human":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "unanswered":
        return <HelpCircle className="w-4 h-4 text-red-500" />;
      case "human_responded":
        return <User className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  }

  function getTypeLabel(type) {
    switch (type) {
      case "answered":
        return "Answered";
      case "request_human":
        return "Human Intervention";
      case "unanswered":
        return "Unanswered";
      case "human_responded":
        return "Human Responded";
      default:
        return "Unknown";
    }
  }

  function getTypeBadgeColor(type) {
    switch (type) {
      case "answered":
        return "bg-green-100 text-green-800";
      case "request_human":
        return "bg-yellow-100 text-yellow-800";
      case "unanswered":
        return "bg-red-100 text-red-800";
      case "human_responded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Monitor and manage all chatbot interactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Answered</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.answered}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Intervention</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.request_human}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unanswered</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.unanswered}
              </p>
            </div>
            <HelpCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.human_responded}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="answered">Answered</option>
            <option value="request_human">Human Intervention</option>
            <option value="unanswered">Unanswered</option>
            <option value="human_responded">Human Responded</option>
          </select>
        </div>

        <button
          onClick={fetchChatHistory}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Chat History Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading chat history...</p>
          </div>
        ) : getFilteredHistory().length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">No chat history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredHistory().map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(item.type)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(
                            item.type
                          )}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {item.question}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {item.answer}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.type === "request_human" && (
                        <button
                          onClick={() => setRespondingTo(item.id)}
                          className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                        >
                          Respond
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Human Response Modal */}
      {respondingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Human Response
            </h3>
            <textarea
              value={humanResponse}
              onChange={(e) => setHumanResponse(e.target.value)}
              placeholder="Enter your response..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  setRespondingTo(null);
                  setHumanResponse("");
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleHumanResponse(respondingTo)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Response</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
