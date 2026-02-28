import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Documents from "./pages/Documents";
import Chatbot from "./pages/Chatbot";
import FlowBuilder from "./pages/FlowBuilder";
import ResetBot from "./pages/ResetBot";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Documents />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/flowbuilder" element={<FlowBuilder />} />
          <Route path="/resetbot" element={<ResetBot />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
