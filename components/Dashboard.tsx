
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, CheckCircle, MapPin, Award
} from 'lucide-react';
import { NavigationState, Rider } from '../types';

const StatCard = ({ title, value, change, icon: Icon, color, onClick, subValue }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-500/30 hover:shadow-lg transition-all active:scale-[0.98] group text-left"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {change && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {change}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline gap-2">
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {subValue && <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">{subValue}</span>}
    </div>
  </div>
);

const data = [
  { name: '周一', active: 400, completed: 240 },
  { name: '周二', active: 300, completed: 139 },
  { name: '周三', active: 200, completed: 980 },
  { name: '周四', active: 278, completed: 390 },
  { name: '周五', active: 189, completed: 480 },
  { name: '周六', active: 239, completed: 380 },
  { name: '周日', active: 349, completed: 430 },
];

interface DashboardProps {
  onNavigate: (view: NavigationState['view']) => void;
  riders: Rider[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, riders }) => {
  // 计算达标人数（入职超过30天）
  const calculateQualifiedRiders = () => {
    const today = new Date();
    const qualified = riders.filter(rider => {
      const joinDate = new Date(rider.joinDate);
      const diffTime = Math.abs(today.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 30;
    });
    return qualified.length;
  };

  const qualifiedCount = calculateQualifiedRiders();
  const estimatedBonus = qualifiedCount * 3000;

  return (
    <div className="p-8">
      <header className="mb-8 text-left">
        <h1 className="text-2xl font-bold text-slate-900">骑手概览</h1>
        <p className="text-slate-500">实时运营指标与运力状态监控。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="在职骑手人数" value={riders.length.toLocaleString()} change="+12%" icon={Users} color="blue" onClick={() => onNavigate('riders')} />
        <StatCard 
          title="骑手达标人数" 
          value={qualifiedCount} 
          subValue={`预计返点: ¥${(estimatedBonus/10000).toFixed(1)}W`} 
          icon={Award} 
          color="purple" 
          onClick={() => onNavigate('riders')} 
        />
        <StatCard title="当前在线" value="842" change="+4.5%" icon={TrendingUp} color="green" onClick={() => onNavigate('riders')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-600" />
            配送单量表现
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="active" stroke="#2563eb" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            区域运力分布
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
