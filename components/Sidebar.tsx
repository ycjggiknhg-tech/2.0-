
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  Bike,
  Briefcase,
  MessageSquare,
  Zap
} from 'lucide-react';
import { NavigationState } from '../types';

interface SidebarProps {
  currentView: NavigationState['view'];
  onNavigate: (view: NavigationState['view']) => void;
  unreadMessages?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, unreadMessages = 0 }) => {
  const menuItems = [
    { id: 'dashboard', label: '控制概览', icon: LayoutDashboard },
    { id: 'recruitment', label: '站点招聘', icon: UserPlus },
    { id: 'riders', label: '骑手管理', icon: Users },
    { id: 'devices', label: '资产设备', icon: Zap },
    { id: 'jobs', label: '人资团队', icon: Briefcase },
    { id: 'messages', label: '信息中心', icon: MessageSquare, badge: unreadMessages },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Bike className="text-white" size={24} />
        </div>
        <h1 className="text-white font-bold text-xl tracking-tight">RiderHub</h1>
      </div>
      
      <nav className="flex-1 px-4 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavigationState['view'])}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <img 
            src="https://picsum.photos/seed/admin/40/40" 
            className="w-10 h-10 rounded-full border border-slate-700"
            alt="Admin"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-sm font-medium truncate">运营主管</p>
            <p className="text-slate-500 text-xs truncate">Logistics Pro v1.2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
