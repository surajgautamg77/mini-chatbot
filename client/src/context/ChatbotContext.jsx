import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [selectedChatbot, setSelectedChatbot] = useState(null);

  useEffect(() => {
    const savedBot = localStorage.getItem('selected_chatbot');
    if (savedBot) {
      setSelectedChatbot(JSON.parse(savedBot));
    }
  }, []);

  const selectChatbot = (chatbot) => {
    setSelectedChatbot(chatbot);
    if (chatbot) {
      localStorage.setItem('selected_chatbot', JSON.stringify(chatbot));
    } else {
      localStorage.removeItem('selected_chatbot');
    }
  };

  return (
    <ChatbotContext.Provider value={{ selectedChatbot, selectChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);
