
import React from 'react';
import { 
  LayoutDashboard, Users, UserPlus, Settings, 
  Briefcase, MessageSquare, Zap, WalletCards, Bike, Sparkles
} from 'lucide-react';
import { NavigationState } from '../types';

interface SidebarProps {
  currentView: NavigationState['view'];
  onNavigate: (view: NavigationState['view']) => void;
  unreadMessages?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, unreadMessages = 0 }) => {
  const menuItems = [
    { id: 'dashboard', label: '运营概览', icon: LayoutDashboard },
    { id: 'ai-consultant', label: 'AI 专家顾问', icon: Sparkles, highlight: true },
    { id: 'recruitment', label: '招聘漏斗', icon: UserPlus },
    { id: 'riders', label: '骑手档案', icon: Users },
    { id: 'devices', label: '资产设备', icon: Zap },
    { id: 'finance', label: '返费对账', icon: WalletCards },
    { id: 'messages', label: '指令通讯', icon: MessageSquare, badge: unreadMessages },
    { id: 'jobs', label: '组织架构', icon: Briefcase },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-full flex flex-col shrink-0 border-r border-slate-100 relative z-50">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 group cursor-pointer transition-transform active:scale-95 text-left">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Bike size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-bold text-xl tracking-tight leading-none">RiderHub</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fleet Management</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavigationState['view'])}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-indigo-600" : (item.highlight ? "text-indigo-400 group-hover:text-indigo-600" : "group-hover:text-slate-600")} />
              <span className={`flex-1 text-left text-[13px] font-bold tracking-tight ${isActive ? 'text-slate-900' : ''}`}>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200"
              alt="User"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-slate-900 text-xs font-bold truncate">王主管</p>
            <p className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mt-0.5">Fleet Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
