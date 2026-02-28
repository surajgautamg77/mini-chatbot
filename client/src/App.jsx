import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Documents from './pages/Documents';
import Installation from './pages/Installation';
import EmbedChat from './pages/EmbedChat';

// Layout component to wrap pages that need Sidebar
const Layout = ({ children }) => (
  <div className="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Main Application Routes (with Sidebar) */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/chatbot" element={<Layout><Chatbot /></Layout>} />
      <Route path="/documents" element={<Layout><Documents /></Layout>} />
      <Route path="/installation" element={<Layout><Installation /></Layout>} />

      {/* Embedded Chat Route (Standalone, No Sidebar) */}
      <Route path="/embed/chat" element={<EmbedChat />} />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
