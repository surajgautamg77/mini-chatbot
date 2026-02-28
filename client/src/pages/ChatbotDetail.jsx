import React, { useEffect, useState } from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Code, ChevronLeft, Bot } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import { chatbotAPI } from '../services/api';
import toast from 'react-hot-toast';

function ChatbotDetail() {
  const { botId } = useParams();
  const { selectedChatbot, selectChatbot } = useChatbot();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSyncBot = async () => {
      // If already selected and matches URL, just stop loading
      if (selectedChatbot?.id === botId) {
        setLoading(false);
        return;
      }

      try {
        const bot = await chatbotAPI.getOne(botId);
        selectChatbot(bot);
      } catch (error) {
        toast.error("Bot not found");
        navigate('/chatbots');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSyncBot();
  }, [botId]);

  if (loading) return <div className="p-8 text-center">Loading assistant details...</div>;

  const tabs = [
    { to: 'knowledge', icon: FileText, label: 'Knowledge Base' },
    { to: 'test', icon: MessageSquare, label: 'Test Chatbot' },
    { to: 'installation', icon: Code, label: 'Installation' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Bot Header */}
      <div className="px-8 pt-6 pb-0 border-b border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => navigate('/chatbots')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="p-2.5 bg-primary-600 rounded-xl shadow-lg shadow-primary-100">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedChatbot?.name}</h1>
            <p className="text-sm text-gray-500">{selectedChatbot?.description || 'AI Assistant'}</p>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center space-x-2 py-4 px-1 border-b-2 transition-all font-medium text-sm ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`
              }
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <Outlet />
      </div>
    </div>
  );
}

export default ChatbotDetail;
