import { useState, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';

export const useChat = (initialSessionId = null) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId);

  const fetchHistory = useCallback(async (sid) => {
    if (!sid) {
      setMessages([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await chatAPI.getHistory(sid);
      // History is returned from newest to oldest; we reverse to show chronologically
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
      // 404 means a new session with no history yet
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync Session ID from URL or Storage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSid = urlParams.get('sessionId');
    
    let sid = urlSid || initialSessionId || localStorage.getItem('chat_session_id');
    
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('chat_session_id', sid);
    }
    
    setSessionId(sid);
  }, [initialSessionId]);

  // REFRESH history whenever sessionId changes
  useEffect(() => {
    if (sessionId) {
      fetchHistory(sessionId);
    }
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
    setSessionId(newSid); // This will trigger the useEffect to refresh/clear messages
    return newSid;
  };

  return { messages, loading, sendMessage, clearHistory, sessionId };
};
