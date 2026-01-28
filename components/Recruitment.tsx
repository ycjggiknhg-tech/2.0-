
import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, QrCode, 
  ChevronRight, XCircle, 
  Check, History, Clock, List, CalendarDays
} from 'lucide-react';
import { Applicant, Station, Device } from '../types';
import VehicleAssignmentView from './VehicleAssignmentView';

interface RecruitmentProps {
  onAction: (msg: string) => void;
  applicants: Applicant[];
  stations: Station[];
  devices: Device[];
  setStations: React.Dispatch<React.SetStateAction<Station[]>>;
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  onOpenPublicForm: () => void;
  onHire: (applicant: Applicant, deviceId?: string) => void;
}

const Recruitment: React.FC<RecruitmentProps> = ({ onAction, applicants, stations, devices, setStations, setApplicants, onOpenPublicForm, onHire }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'history'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningApplicant, setAssigningApplicant] = useState<Applicant | null>(null);

  const displayApplicants = useMemo(() => {
    let list = applicants;
    if (activeTab === 'pipeline') {
      list = list.filter(a => a.status !== '已入职' && a.status !== '已拒绝');
    } else {
      list = list.filter(a => a.status === '已入职' || a.status === '已拒绝');
    }

    if (searchQuery) {
      list = list.filter(a => a.name.includes(searchQuery) || a.contact.includes(searchQuery));
    }

    return [...list].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  }, [applicants, activeTab, searchQuery]);

  const handleConfirmHire = (deviceId: string) => {
    if (assigningApplicant) {
      onHire(assigningApplicant, deviceId);
      setAssigningApplicant(null);
    }
  };

  const handleRejectClick = (app: Applicant) => {
    setApplicants(applicants.map(a => a.id === app.id ? { ...a, status: '已拒绝' } : a));
    onAction(`🚫 已拒绝 ${app.name} 的入职申请`);
  };

  if (assigningApplicant) {
    return (
      <VehicleAssignmentView 
        applicant={assigningApplicant}
        allVehicles={devices}
        onClose={() => setAssigningApplicant(null)}
        onConfirm={handleConfirmHire}
        onUpdateVehicle={() => {}}
        onUpdateDevices={() => {}}
      />
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 animate-fade-up text-left relative min-h-full">
      <header className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Recruitment Operation</div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">骑手面试入职管理</h1>
          <p className="text-slate-500 font-medium mt-2">{activeTab === 'pipeline' ? '处理实时面试与入职申请' : '历史档案回溯'}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { setActiveTab(activeTab === 'pipeline' ? 'history' : 'pipeline'); }} className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-xs font-bold border-2 transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}>
            {activeTab === 'pipeline' ? <History size={18} /> : <List size={18} />} {activeTab === 'pipeline' ? '查看过往记录' : '返回面试漏斗'}
          </button>
          <button onClick={onOpenPublicForm} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <QrCode size={18} /> 入职填报码
          </button>
        </div>
      </header>

      {/* 搜索栏 */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={20} />
        <input type="text" placeholder="搜索面试档案、手机号..." className="w-full pl-16 pr-8 py-5 apple-card shadow-sm border border-slate-200/50 outline-none text-base focus:ring-4 focus:ring-indigo-600/5 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="space-y-4">
        {displayApplicants.length === 0 ? (
          <div className="py-20 text-center apple-card border-dashed border-slate-200 bg-slate-50/50">
             <p className="text-slate-400 font-bold uppercase tracking-widest">暂无匹配的面试申请</p>
          </div>
        ) : (
          displayApplicants.map((applicant) => (
            <div key={applicant.id} className="apple-card p-6 flex items-center justify-between group transition-all duration-500 hover:shadow-xl hover:border-indigo-100">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-lg shadow-inner shrink-0 overflow-hidden border border-slate-100">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`} alt="" />
                  </div>
                  <div className="text-left">
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-900">{applicant.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${applicant.status === '已入职' ? 'bg-emerald-100 text-emerald-700' : applicant.status === '已拒绝' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                          {applicant.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo-600" /> {applicant.station}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {applicant.appliedDate}</span>
                        <span className="flex items-center gap-1.5"><CalendarDays size={12} /> {applicant.age}岁</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2">
                 {applicant.status !== '已入职' && applicant.status !== '已拒绝' && (
                    <>
                      <button onClick={() => handleRejectClick(applicant)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="拒绝申请">
                        <XCircle size={18} />
                      </button>
                      <button onClick={() => setAssigningApplicant(applicant)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <Check size={16} /> 确认入职
                      </button>
                    </>
                 )}
               </div>
            </div>
          ))
        )}
      </div>

      {activeTab === 'pipeline' && applicants.length === 0 && (
         <div className="mt-12 p-10 bg-indigo-900 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150"><QrCode size={200} /></div>
            <div className="relative z-10 text-left">
               <h3 className="text-2xl font-black mb-2">开放招聘入口</h3>
               <p className="text-indigo-200 text-sm max-w-sm">当前暂无新申请。点击“入职填报码”展示二维码给骑手扫码填报，即可实时在此处看到申请记录。</p>
            </div>
            <button onClick={onOpenPublicForm} className="px-10 py-4 bg-white text-indigo-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10">立即启用二维码</button>
         </div>
      )}
    </div>
  );
};

export default Recruitment;
