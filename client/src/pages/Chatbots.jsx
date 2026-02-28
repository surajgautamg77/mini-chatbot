import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Bot, LayoutGrid, ArrowRight } from 'lucide-react';
import { chatbotAPI } from '../services/api';
import { useChatbot } from '../context/ChatbotContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Chatbots() {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { selectChatbot } = useChatbot();
  const navigate = useNavigate();

  const fetchChatbots = async () => {
    setLoading(true);
    try {
      const data = await chatbotAPI.getAll();
      setChatbots(data);
    } catch (error) {
      toast.error('Failed to fetch chatbots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newBot = await chatbotAPI.create(name, description);
      toast.success('Chatbot created!');
      setName('');
      setDescription('');
      setShowCreate(false);
      fetchChatbots();
      // After creation, go straight to its knowledge base
      navigate(`/chatbots/${newBot.id}/knowledge`);
    } catch (error) {
      toast.error('Failed to create chatbot');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure? This will delete all documents and history for this bot.')) return;

    try {
      await chatbotAPI.delete(id);
      toast.success('Chatbot deleted');
      fetchChatbots();
    } catch (error) {
      toast.error('Failed to delete chatbot');
    }
  };

  const handleBotClick = (bot) => {
    selectChatbot(bot);
    navigate(`/chatbots/${bot.id}/knowledge`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Chatbots</h1>
          <p className="text-gray-600">Create and manage multiple AI assistants</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="btn btn-primary flex items-center space-x-2 shadow-lg shadow-primary-100"
        >
          <Plus size={20} />
          <span>New Chatbot</span>
        </button>
      </div>

      {showCreate && (
        <div className="card p-6 mb-8 border-2 border-primary-100 bg-primary-50/30">
          <h2 className="text-lg font-bold mb-4 flex items-center text-primary-700">
            <Plus size={18} className="mr-2" /> Create New AI Assistant
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input" 
                placeholder="e.g. Customer Support"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input" 
                placeholder="e.g. Handles product queries"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary text-sm">Cancel</button>
              <button type="submit" className="btn btn-primary text-sm px-8">Create Assistant</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">Loading chatbots...</div>
      ) : chatbots.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <Bot size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No chatbots yet</h3>
          <p className="text-gray-500 mt-1">Create your first AI assistant to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((bot) => (
            <div 
              key={bot.id}
              onClick={() => handleBotClick(bot)}
              className="group p-6 rounded-2xl border border-gray-100 bg-white cursor-pointer transition-all hover:shadow-xl hover:border-primary-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-primary-50 text-gray-400 group-hover:text-primary-600 transition-colors">
                  <Bot size={24} />
                </div>
                <button 
                  onClick={(e) => handleDelete(bot.id, e)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-700 transition-colors truncate">{bot.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 h-10 mt-1">{bot.description || 'No description provided'}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {new Date(bot.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center text-primary-600 font-bold text-xs">
                  <span>Manage</span>
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Chatbots;
