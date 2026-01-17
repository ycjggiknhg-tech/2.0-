
import React from 'react';
import { 
  LayoutDashboard, Users, UserPlus, Settings, Bike, 
  Briefcase, MessageSquare, Zap, WalletCards
} from 'lucide-react';
import { NavigationState } from '../types';

interface SidebarProps {
  currentView: NavigationState['view'];
  onNavigate: (view: NavigationState['view']) => void;
  unreadMessages?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, unreadMessages = 0 }) => {
  const menuItems = [
    { id: 'dashboard', label: '概览', icon: LayoutDashboard },
    { id: 'recruitment', label: '招聘', icon: UserPlus },
    { id: 'riders', label: '骑手', icon: Users },
    { id: 'devices', label: '资产', icon: Zap },
    { id: 'finance', label: '财务', icon: WalletCards },
    { id: 'messages', label: '信息', icon: MessageSquare, badge: unreadMessages },
    { id: 'jobs', label: '团队', icon: Briefcase },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-full flex flex-col shrink-0 border-r border-[#f5f5f7] relative z-50">
      <div className="p-10 flex items-center gap-3">
        <div className="bg-[#0071e3] p-2.5 rounded-xl shadow-lg shadow-[#0071e3]/20">
          <Bike className="text-white" size={20} />
        </div>
        <h1 className="text-[#1d1d1f] font-bold text-xl tracking-tighter">RiderHub</h1>
      </div>
      
      <nav className="flex-1 px-4 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavigationState['view'])}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 mb-1 group ${
                isActive 
                  ? 'bg-[#f5f5f7] text-[#0071e3] font-bold' 
                  : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]/50'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1 text-left text-sm tracking-tight">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-[#ff3b30] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-8 border-t border-[#f5f5f7]">
        <div className="flex items-center gap-4 p-2 hover:bg-[#f5f5f7] rounded-2xl transition-colors cursor-pointer group">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin" 
            className="w-10 h-10 rounded-full bg-[#f5f5f7]"
            alt="User"
          />
          <div className="text-left overflow-hidden">
            <p className="text-[#1d1d1f] text-xs font-bold truncate group-hover:text-[#0071e3] transition-colors">王主管</p>
            <p className="text-[#86868b] text-[10px] truncate uppercase font-bold tracking-widest">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
