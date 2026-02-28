import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot,
  LayoutGrid
} from 'lucide-react';

function Sidebar() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Global Dashboard' },
    { to: '/chatbots', icon: LayoutGrid, label: 'My Chatbots' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-20">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
        <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-100">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">Gemini RAG</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">System Live</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
