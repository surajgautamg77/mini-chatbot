import { NavLink } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  GitBranch,
  RotateCcw,
  Bot,
  BarChart3,
} from "lucide-react";

const navItems = [
  {
    path: "/dashboard",
    icon: BarChart3,
    label: "Dashboard",
  },
  {
    path: "/documents",
    icon: FileText,
    label: "Documents",
  },
  {
    path: "/chatbot",
    icon: MessageSquare,
    label: "Chatbot",
  },
  {
    path: "/flowbuilder",
    icon: GitBranch,
    label: "Flow Builder",
  },

  {
    path: "/resetbot",
    icon: RotateCcw,
    label: "Reset Bot",
  },
];

function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">RAG Chatbot</h1>
            <p className="text-sm text-gray-500">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Powered by Rehsley
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
