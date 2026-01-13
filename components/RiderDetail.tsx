
import React from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Bike, 
  X, Zap, Navigation2, MoreHorizontal, 
  Calendar, CheckCircle2, Timer, Award,
  Clock, ShieldCheck, DollarSign
} from 'lucide-react';
import { Rider, RiderStatus } from '../types';

interface RiderDetailProps {
  rider: Rider;
  onBack: () => void;
  onAction: (msg: string) => void;
}

const InfoRow = ({ icon: Icon, label, value, color = "slate", extra, subValue }: any) => (
  <div className="flex items-center gap-3 text-sm text-left">
    <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-400 flex-shrink-0`}>
      <Icon size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{label}</p>
        {extra}
      </div>
      <p className="text-slate-900 font-bold truncate text-xs sm:text-sm">{value}</p>
      {subValue && <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{subValue}</p>}
    </div>
  </div>
);

const RiderDetail: React.FC<RiderDetailProps> = ({ rider, onBack, onAction }) => {
  const getTenure = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const joined = new Date(rider.joinDate);
    const diffTime = today.getTime() - joined.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const days = Math.max(0, diffDays);
    const isQualified = days >= 30;
    const progress = Math.min(100, (days / 30) * 100);
    const remainingDays = Math.max(0, 30 - days);
    
    // 计算预计达标日期
    const targetDate = new Date(joined);
    targetDate.setDate(targetDate.getDate() + 30);
    
    return { days, isQualified, progress, remainingDays, targetDate: targetDate.toLocaleDateString() };
  };

  const { days, isQualified, progress, remainingDays, targetDate } = getTenure();
  const isResigned = rider.status === RiderStatus.RESIGNED;

  return (
    <div className="p-4 sm:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group active:scale-95"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">返回骑手列表</span>
        </button>
        <div className="flex gap-2">
          <button onClick={() => onAction('正在生成结算凭证...')} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <DollarSign size={14} /> 导出达标证明
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 ${isResigned ? 'opacity-80' : ''}`}>
        
        {/* 左侧基本信息 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-white text-center">
            <div className="relative inline-block mb-6">
              <img src={rider.avatar} className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] object-cover ring-8 ring-slate-50 shadow-xl" alt={rider.name} />
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-4 border-white text-[9px] font-black uppercase tracking-wider text-white ${
                rider.status === RiderStatus.ACTIVE ? 'bg-blue-600' : 'bg-slate-400'
              }`}>
                {rider.status}
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-1">{rider.name}</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
               <MapPin size={14} className="text-blue-500" /> {rider.region} · {rider.station}
            </p>

            <div className="mt-10 pt-8 border-t border-slate-50 space-y-5">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-left mb-2">核心档案</h4>
              <InfoRow icon={Calendar} label="入职日期" value={rider.joinDate} color="blue" />
              <InfoRow icon={Phone} label="联系电话" value={rider.contact} color="blue" />
              <InfoRow 
                icon={Bike} 
                label="当前资产" 
                value={rider.licensePlate ? `设备: ${rider.licensePlate}` : '未分配设备'} 
                subValue={rider.vin ? `大架号: ${rider.vin}` : ''}
                color="indigo"
              />
            </div>
          </div>
        </div>

        {/* 右侧：入职达标监控中心 */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 30天达标追踪大组件 */}
          <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-sm border border-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="text-left">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    {isQualified ? <Award className="text-amber-500" size={32} /> : <Timer className="text-blue-500" size={32} />}
                    入职达标追踪
                  </h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">
                    {isQualified ? '该骑手已满足30天在职要求，人资返费结算已就绪。' : `距离30天达标还需在职运营 ${remainingDays} 天。`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">当前在职</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{days} <span className="text-sm font-bold text-slate-400">/ 30天</span></p>
                </div>
              </div>

              {/* 视觉进度条 */}
              <div className="space-y-4">
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                  <div 
                    className={`h-full transition-all duration-1000 relative ${isQualified ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                    style={{ width: `${progress}%` }}
                  >
                    {!isQualified && <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-bar-stripes_2s_linear_infinite]" />}
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                   <div className="flex items-center gap-2 text-slate-400">
                     <Clock size={12} /> {rider.joinDate} 入职
                   </div>
                   <div className={`flex items-center gap-2 ${isQualified ? 'text-amber-600' : 'text-slate-400'}`}>
                     {isQualified ? '已于昨日达标' : `预计达标日期: ${targetDate}`} <CheckCircle2 size={12} />
                   </div>
                </div>
              </div>

              {/* 达标奖励/返费说明 */}
              <div className={`mt-10 p-6 rounded-3xl flex items-center justify-between transition-all ${isQualified ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50 border border-slate-100'}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-2xl ${isQualified ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className={`text-sm font-black ${isQualified ? 'text-amber-900' : 'text-slate-600'}`}>
                      {isQualified ? '返费结算资格：已生效' : '返费结算资格：审核中'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {isQualified ? '所有结算单据已自动汇总至财务中心。' : '需在职满30天且无严重违规记录方可触发结算。'}
                    </p>
                  </div>
                </div>
                {isQualified && (
                  <button onClick={() => onAction('跳转至财务模块...')} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-200 active:scale-95 transition-all">
                    去结算
                  </button>
                )}
              </div>
            </div>

            {/* 背景装饰背景 */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-slate-50 rounded-full opacity-50 pointer-events-none" />
          </div>

          {/* 备注与合规性 */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white text-left">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">合规与风控备注</h3>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  “ 该骑手目前处于在职状态。根据系统自动校验，其入职资料完整，背景调查结果为‘合格’。目前已服务 {days} 天，建议持续关注其出勤情况，确保顺利完成返费达标周期。”
                </p>
              </div>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg border border-green-100">背调合格</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">资料已签章</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg border border-purple-100">无违规记录</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes progress-bar-stripes {
          from { background-position: 40px 0; }
          to { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
};

export default RiderDetail;
