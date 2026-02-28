import { useState, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';

export const useChat = (initialChatbotId = null, initialSessionId = null) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [chatbotId, setChatbotId] = useState(initialChatbotId);

  const fetchHistory = useCallback(async (sid, bid) => {
    if (!sid || !bid) {
      setMessages([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await chatAPI.getHistory(sid, bid);
      const history = (response || []).reverse().map((chat) => [
        {
          id: chat.id + '-q',
          type: 'user',
          content: chat.query,
          timestamp: chat.timestamp,
        },
        {
          id: chat.id + '-a',
          type: 'bot',
          content: chat.answer,
          timestamp: chat.timestamp,
        },
      ]).flat();
      setMessages(history);
    } catch (error) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync IDs
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSid = urlParams.get('sessionId');
    const urlBid = urlParams.get('chatbotId');
    
    let bid = urlBid || initialChatbotId;
    let sid = urlSid || initialSessionId || localStorage.getItem(`chat_session_${bid}`);
    
    if (!sid && bid) {
      sid = crypto.randomUUID();
      localStorage.setItem(`chat_session_${bid}`, sid);
    }
    
    setChatbotId(bid);
    setSessionId(sid);
  }, [initialChatbotId, initialSessionId]);

  // Refresh history when IDs change
  useEffect(() => {
    if (sessionId && chatbotId) {
      fetchHistory(sessionId, chatbotId);
    }
  }, [sessionId, chatbotId, fetchHistory]);

  const sendMessage = async (content) => {
    if (!content.trim() || loading || !chatbotId) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatAPI.query(content, sessionId, chatbotId);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
      return response;
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    const newSid = crypto.randomUUID();
    if (chatbotId) {
      localStorage.setItem(`chat_session_${chatbotId}`, newSid);
    }
    setSessionId(newSid);
    setMessages([]);
    return newSid;
  };

  return { messages, loading, sendMessage, clearHistory, sessionId, chatbotId };
};
