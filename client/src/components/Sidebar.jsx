import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  Code,
  Bot,
} from "lucide-react";

function Sidebar() {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/chatbot", icon: MessageSquare, label: "Chatbot" },
    { to: "/documents", icon: FileText, label: "Knowledge Base" },
    { to: "/installation", icon: Code, label: "Installation" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-20">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
        <div className="bg-primary-600 p-2 rounded-xl">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">
          AI assistant
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className={`w-5 h-5 transition-colors duration-200`} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <Settings className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Settings</p>
            <p className="text-[10px] text-gray-500">v1.0.0 Stable</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
