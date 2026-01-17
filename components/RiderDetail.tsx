
import React from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Bike, 
  Zap, Calendar, Award, Clock, ShieldCheck, DollarSign, ChevronRight
} from 'lucide-react';
import { Rider, RiderStatus } from '../types';

interface RiderDetailProps {
  rider: Rider;
  onBack: () => void;
  onAction: (msg: string) => void;
}

const InfoBlock = ({ label, value, subValue }: any) => (
  <div className="text-left">
    <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-2">{label}</p>
    <p className="text-base font-semibold text-[#1d1d1f]">{value}</p>
    {subValue && <p className="text-xs text-[#86868b] mt-1">{subValue}</p>}
  </div>
);

const RiderDetail: React.FC<RiderDetailProps> = ({ rider, onBack, onAction }) => {
  const getTenure = () => {
    const joined = new Date(rider.joinDate);
    const diffDays = Math.floor((Date.now() - joined.getTime()) / (1000 * 60 * 60 * 24));
    return { days: Math.max(0, diffDays), isQualified: diffDays >= 30, progress: Math.min(100, (diffDays / 30) * 100) };
  };

  const { days, isQualified, progress } = getTenure();

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12 animate-fade-up">
      <header className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#86868b] hover:text-[#0071e3] transition-colors font-semibold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回档案
        </button>
        <div className="flex gap-4">
          <button onClick={() => onAction('正在生成报告')} className="apple-btn-secondary px-6 py-2.5 text-xs">生成月度报表</button>
          <button onClick={() => onAction('资产变更中')} className="apple-btn-secondary px-6 py-2.5 text-xs">变更绑定资产</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1 apple-card p-10 flex flex-col items-center text-center">
          <img src={rider.avatar} className="w-40 h-40 rounded-full bg-[#f5f5f7] mb-8 ring-8 ring-[#f5f5f7]" alt={rider.name} />
          <h2 className="text-3xl font-bold text-[#1d1d1f] mb-2">{rider.name}</h2>
          <div className="flex items-center gap-2 text-[#86868b] font-medium mb-10">
            <MapPin size={16} className="text-[#0071e3]" /> {rider.region} · {rider.station}
          </div>

          <div className="w-full space-y-8 pt-10 border-t border-[#f5f5f7]">
            <InfoBlock label="入职时间" value={rider.joinDate} />
            <InfoBlock label="绑定资产" value={rider.licensePlate || '未绑定'} subValue={rider.vin} />
            <InfoBlock label="实名状态" value="已通过背调" />
          </div>
        </div>

        {/* Operational Monitoring */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <div className="apple-card p-12 relative overflow-hidden bg-white">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2">30天留存达标监控</h3>
                  <p className="text-[#86868b] font-medium">当前已在职运营 {days} 天。达标后将触发返费结算。</p>
                </div>
                {isQualified ? <Award className="text-[#ff9500]" size={48} /> : <Clock className="text-[#0071e3]" size={48} />}
              </div>

              <div className="space-y-4">
                <div className="h-4 w-full bg-[#f5f5f7] rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${isQualified ? 'bg-[#34c759]' : 'bg-[#0071e3]'}`} 
                    style={{ width: `${progress}%` }} 
                   />
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#86868b]">
                  <span>入职日</span>
                  <span>目标: 第30天</span>
                </div>
              </div>

              {isQualified && (
                <div className="mt-12 p-8 bg-[#34c759]/5 border border-[#34c759]/20 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="text-[#34c759]" size={28} />
                    <div>
                      <p className="font-bold text-[#1d1d1f]">结算资格已开启</p>
                      <p className="text-sm text-[#86868b]">系统已自动核算本单返费。预计金额 ¥{rider.settlementAmount}</p>
                    </div>
                  </div>
                  <button onClick={() => onAction('跳转结算')} className="apple-btn-primary px-8 py-3 text-xs">去财务对账</button>
                </div>
              )}
            </div>
          </div>

          <div className="apple-card p-12 bg-[#f5f5f7] border-none shadow-none">
             <h3 className="text-sm font-bold uppercase tracking-widest text-[#86868b] mb-6">历史履约备注</h3>
             <div className="bg-white p-6 rounded-2xl text-[#1d1d1f] text-sm leading-relaxed border border-[#d2d2d7]/30 italic">
               “ 骑手 {rider.name} 在职期间表现良好，资产维护情况正常。背景调查结论为合格，暂无任何违规记录反馈。”
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDetail;
