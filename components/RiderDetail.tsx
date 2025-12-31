
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Bike, Calendar, 
  Star, TrendingUp, Package, DollarSign, Clock, 
  CreditCard, ShieldAlert, Award, Navigation, 
  X, Zap, Activity, Navigation2, Maximize2
} from 'lucide-react';
import { Rider, RiderStatus } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface RiderDetailProps {
  rider: Rider;
  onBack: () => void;
  onMessage: () => void;
  onAction: (msg: string) => void;
}

const InfoRow = ({ icon: Icon, label, value, color = "slate", extra }: any) => (
  <div className="flex items-center gap-3 text-sm text-left">
    <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-400 flex-shrink-0`}>
      <Icon size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        {extra}
      </div>
      <p className="text-slate-900 font-semibold truncate">{value}</p>
    </div>
  </div>
);

const GPSTrackerOverlay = ({ rider, onClose }: { rider: Rider, onClose: () => void }) => {
  const [speed, setSpeed] = useState(24);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => Math.max(0, Math.min(45, prev + (Math.random() - 0.5) * 4)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-500 font-mono">
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-all">
            <X size={24} />
          </button>
          <div className="text-left">
            <h3 className="text-white font-black tracking-tight text-lg">资产实时位置监控 - {rider.name}</h3>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest leading-none">Asset Digital Twin Management</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-left">
            <p className="text-[10px] text-slate-400 font-black uppercase">卫星信号</p>
            <p className="text-green-400 font-bold">EXCELLENT (14 Sats)</p>
          </div>
          <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all">
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden grid grid-cols-12">
        {/* 左侧地图模拟区 */}
        <div className="col-span-9 relative group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=2000')] opacity-10 grayscale brightness-50 contrast-125 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-105" />
          
          {/* 模拟坐标网格 */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 骑手图标 */}
            <div className="relative">
              <div className="absolute -inset-12 bg-blue-500/20 rounded-full animate-ping" />
              <div className="absolute -inset-6 bg-blue-500/30 rounded-full animate-pulse" />
              <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] relative z-10">
                <Navigation2 size={16} className="text-white rotate-[145deg]" />
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white text-[10px] font-bold shadow-2xl">
                {rider.name} ({speed.toFixed(1)} km/h)
              </div>
            </div>

            {/* 模拟路径轨迹 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <path 
                d="M 300,400 Q 450,200 600,450 T 900,300" 
                fill="none" 
                stroke="rgba(37,99,235,0.3)" 
                strokeWidth="4" 
                strokeDasharray="8 4"
              />
              <path 
                d="M 300,400 Q 450,200 600,450 T 900,300" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="4" 
                strokeDasharray="0 1000"
                className="animate-[drawPath_5s_linear_infinite]"
              />
            </svg>
          </div>

          {/* 悬浮地点看板 */}
          <div className="absolute top-8 left-8 p-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl text-left">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-2 tracking-widest">当前位置</p>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-sm font-bold text-white">{rider.region} {rider.station} 附近</span>
            </div>
            <p className="text-xs text-slate-400">最后更新: 刚刚</p>
          </div>
        </div>

        {/* 右侧数据看板 */}
        <div className="col-span-3 border-l border-white/10 bg-slate-900/40 p-8 space-y-8 text-left">
          <div className="space-y-2">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">车辆性能状态</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">当前车速</span>
                  <Activity size={14} className="text-blue-500" />
                </div>
                <p className="text-3xl font-black text-white">{speed.toFixed(1)} <span className="text-xs font-normal text-slate-500">km/h</span></p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">剩余电量</span>
                  <Zap size={14} className="text-yellow-500" />
                </div>
                <p className="text-3xl font-black text-white">72 <span className="text-xs font-normal text-slate-500">%</span></p>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[72%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">今日轨迹统计</h4>
            <div className="space-y-3">
              {[
                { label: '累计里程', value: '42.8 km' },
                { label: '配送单量', value: '24 单' },
                { label: '平均时速', value: '18.4 km/h' },
                { label: '超速记录', value: '0 次' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{stat.label}</span>
                  <span className="text-white font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button className="w-full py-4 bg-slate-800 text-white rounded-2xl text-xs font-black hover:bg-slate-700 transition-all active:scale-95 border border-white/5">
              下载历史路径数据
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawPath {
          0% { stroke-dasharray: 0 1000; }
          100% { stroke-dasharray: 1000 0; }
        }
      `}</style>
    </div>
  );
};

const RiderDetail: React.FC<RiderDetailProps> = ({ rider, onBack, onMessage, onAction }) => {
  const [showGPS, setShowGPS] = useState(false);

  const getTenure = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const joined = new Date(rider.joinDate);
    joined.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - joined.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return {
      days: diffDays > 0 ? diffDays : 1,
      isQualified: diffDays >= 30
    };
  };

  const { days, isQualified } = getTenure();
  const isResigned = rider.status === RiderStatus.RESIGNED;

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {showGPS && <GPSTrackerOverlay rider={rider} onClose={() => setShowGPS(false)} />}
      
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors group active:scale-95"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">返回列表</span>
      </button>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isResigned ? 'opacity-90' : ''}`}>
        {/* 左侧：基本信息 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img src={rider.avatar} className="w-32 h-32 rounded-3xl object-cover ring-4 ring-slate-50" alt={rider.name} />
                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-4 border-white text-[10px] font-black uppercase tracking-wider text-white ${
                  rider.status === RiderStatus.ACTIVE ? 'bg-blue-600' : 'bg-slate-400'
                }`}>
                  {rider.status}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{rider.name}</h2>
                {isQualified && <Award className="text-green-600" size={20} />}
              </div>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-1 justify-center"><MapPin size={14} /> {rider.region}</p>
              
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  累计工作 {days} 天
                </span>
                {isQualified ? (
                  <div className="px-4 py-1.5 border rounded-full flex items-center gap-2 shadow-lg bg-green-500 border-green-600 text-white shadow-green-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      已通过考核达标
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">尚在考核期</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6 w-full">
                <button 
                  onClick={onMessage} 
                  disabled={isResigned}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg active:scale-95 ${
                    isResigned 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  即时私信
                </button>
                <button onClick={() => onAction('编辑界面开发中')} className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors active:scale-95">编辑资料</button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">联系信息</h4>
              <div className="space-y-4">
                <InfoRow icon={Mail} label="电子邮箱" value={rider.email} />
                <InfoRow icon={Phone} label="联系电话" value={rider.contact} />
                <InfoRow icon={ShieldAlert} label="紧急联系人" value={rider.emergencyContact || '未设置'} color="red" />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">车辆资产</h4>
              <div className="space-y-4">
                <InfoRow 
                  icon={Bike} 
                  label="交通工具" 
                  value={rider.vehicleType} 
                  color="blue" 
                  extra={
                    !isResigned && (
                      <button 
                        onClick={() => setShowGPS(true)}
                        className="flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Navigation size={10} /> 查看实时轨迹
                      </button>
                    )
                  }
                />
                <InfoRow icon={CreditCard} label="车牌号 / ID" value={rider.licensePlate || '暂无'} color="blue" />
                <InfoRow icon={Calendar} label="入职日期" value={rider.joinDate} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star size={20} className="text-yellow-500" />最近评价
            </h3>
            <div className="space-y-4 text-left">
              {rider.recentFeedback.length > 0 ? (
                rider.recentFeedback.map(fb => (
                  <div key={fb.id} className="p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors active:scale-[0.98]" onClick={() => onAction('查看完整评价')}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-bold text-slate-900">{fb.customer}</p>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{fb.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{fb.comment}"</p>
                    <p className="text-[10px] text-slate-400 mt-2">{fb.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-4">暂无评价记录</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-help group" onClick={() => onAction('配送统计明细')}>
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:rotate-12 transition-transform"><Package size={20} /></div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">总配送单量</p>
              <p className="text-2xl font-black text-slate-900">{rider.deliveries.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-help group" onClick={() => onAction('收入明细流水')}>
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-xl bg-green-50 text-green-600 group-hover:rotate-12 transition-transform"><DollarSign size={20} /></div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">累计收入</p>
              <p className="text-2xl font-black text-slate-900">¥12,450.00</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-help group" onClick={() => onAction('考核报告')}>
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:rotate-12 transition-transform"><Clock size={20} /></div>
                <span className="text-xs text-slate-400 font-bold">98%</span>
              </div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">准时率</p>
              <p className="text-2xl font-black text-slate-900">极优</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">活跃度分析</h3>
              <select className="bg-slate-50 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                <option>最近 7 天</option>
                <option>最近 30 天</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rider.activityHistory}>
                  <defs>
                    <linearGradient id="colorDeliv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="deliveries" stroke="#2563eb" fillOpacity={1} fill="url(#colorDeliv)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">最近配送记录</h3>
              <button onClick={() => onAction('报表正在生成并准备下载...')} className="text-sm text-blue-600 font-bold hover:underline active:opacity-50">导出 CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                    <th className="px-6 py-3">订单编号</th>
                    <th className="px-6 py-3">完成时间</th>
                    <th className="px-6 py-3 text-right">收入</th>
                    <th className="px-6 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="text-sm hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => onAction('查看订单明细')}>
                      <td className="px-6 py-4 font-bold text-slate-900">#ORD-902{i}</td>
                      <td className="px-6 py-4 text-slate-500">10月26日 14:3{i}</td>
                      <td className="px-6 py-4 font-bold text-green-600 text-right">¥12.50</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-blue-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">查看</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDetail;
