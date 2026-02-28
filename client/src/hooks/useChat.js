import { useState, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';

export const useChat = (initialSessionId = null) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId);

  const fetchHistory = useCallback(async (sid) => {
    if (!sid) return;
    try {
      const response = await chatAPI.getHistory(sid);
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
      console.error('Error fetching chat history:', error);
    }
  }, []);

  useEffect(() => {
    let sid = sessionId || localStorage.getItem('chat_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('chat_session_id', sid);
    }
    setSessionId(sid);
    fetchHistory(sid);
  }, [sessionId, fetchHistory]);

  const sendMessage = async (content) => {
    if (!content.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatAPI.query(content, sessionId);
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
    localStorage.setItem('chat_session_id', newSid);
    setSessionId(newSid);
    setMessages([]);
    return newSid;
  };

  return { messages, loading, sendMessage, clearHistory, sessionId };
};
