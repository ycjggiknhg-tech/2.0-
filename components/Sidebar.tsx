
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  Bike,
  Briefcase,
  MessageSquare,
  Zap,
  WalletCards
} from 'lucide-react';
import { NavigationState } from '../types';

interface SidebarProps {
  currentView: NavigationState['view'];
  onNavigate: (view: NavigationState['view']) => void;
  unreadMessages?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, unreadMessages = 0 }) => {
  const menuItems = [
    { id: 'dashboard', label: '控制概览', icon: LayoutDashboard, color: 'blue' },
    { id: 'recruitment', label: '站点招聘', icon: UserPlus, color: 'indigo' },
    { id: 'riders', label: '骑手管理', icon: Users, color: 'purple' },
    { id: 'devices', label: '财产管理', icon: Zap, color: 'amber' },
    { id: 'jobs', label: '人资团队', icon: Briefcase, color: 'emerald' },
    { id: 'finance', label: '财务结算', icon: WalletCards, color: 'emerald' }, // 移动到信息中心上方
    { id: 'messages', label: '信息中心', icon: MessageSquare, badge: unreadMessages, color: 'pink' },
    { id: 'settings', label: '系统设置', icon: Settings, color: 'slate' },
  ];

  return (
    <div className="w-64 bg-[#fcfdfe]/80 backdrop-blur-xl h-full flex flex-col flex-shrink-0 border-r border-blue-50 relative z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-200/50">
          <Bike className="text-white" size={24} />
        </div>
        <h1 className="text-slate-800 font-black text-xl tracking-tight text-left">RiderHub</h1>
      </div>
      
      <nav className="flex-1 px-4 mt-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavigationState['view'])}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1.5 relative group ${
                isActive 
                  ? 'bg-white text-blue-600 font-bold shadow-sm ring-1 ring-blue-50' 
                  : 'text-slate-500 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100/50 text-slate-400 group-hover:bg-slate-100'}`}>
                <Icon size={18} />
              </div>
              <span className="flex-1 text-left text-[13px] tracking-tight">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="flex items-center gap-3 p-3 bg-white/50 border border-white rounded-2xl shadow-sm">
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin" 
              className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100"
              alt="User"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-slate-800 text-xs font-bold truncate">运营主管</p>
            <p className="text-slate-400 text-[9px] font-black truncate uppercase tracking-widest opacity-70">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
