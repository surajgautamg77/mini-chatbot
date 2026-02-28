import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Documents from './pages/Documents';
import Installation from './pages/Installation';
import EmbedChat from './pages/EmbedChat';
import Chatbots from './pages/Chatbots';
import ChatbotDetail from './pages/ChatbotDetail';
import { ChatbotProvider } from './context/ChatbotContext';

// Standard Layout component using Outlet
const AppLayout = () => (
  <div className="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <ChatbotProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbots" element={<Chatbots />} />
          
          {/* Nested Chatbot Routes */}
          <Route path="/chatbots/:botId" element={<ChatbotDetail />}>
            <Route index element={<Navigate to="knowledge" replace />} />
            <Route path="knowledge" element={<Documents />} />
            <Route path="test" element={<Chatbot />} />
            <Route path="installation" element={<Installation />} />
          </Route>
        </Route>

        {/* Standalone Route */}
        <Route path="/embed/chat" element={<EmbedChat />} />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/chatbots" replace />} />
      </Routes>
    </ChatbotProvider>
  );
}

export default App;
