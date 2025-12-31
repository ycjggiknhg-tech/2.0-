
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Recruitment from './components/Recruitment';
import RiderDetail from './components/RiderDetail';
import DeviceManagement from './components/DeviceManagement';
import JobManagement from './components/JobManagement';
import Messenger from './components/Messenger';
import Settings from './components/Settings';
import PublicApplication from './components/PublicApplication';
import AIConsultant from './components/AIConsultant';
import { NavigationState, RiderStatus, Rider, Staff, StaffRole, Applicant, JobPost, AppPort } from './types';
import { Search, Bell, Sparkles, Filter, MoreVertical, MapPin, Bike, Brain, Award, ChevronDown, Clock } from 'lucide-react';

const INITIAL_RIDERS: Rider[] = [
  { 
    id: 'r1', name: '张伟', avatar: 'https://picsum.photos/seed/1/200', status: RiderStatus.ACTIVE, rating: 4.9, deliveries: 1240, joinDate: '2022-01-15', region: '北京', station: '朝阳站点', contact: '138-0000-1111', email: 'zhangwei@riderhub.cn', vehicleType: '智能电动两轮车', licensePlate: '京A·88888', emergencyContact: '李芳 (138-0000-2222)', activityHistory: [{ date: '周一', deliveries: 22, earnings: 110 }], recentFeedback: [{ id: 'f1', customer: '王女士', comment: '送餐准时', rating: 5, date: '2小时前' }],
    idCardImage: 'https://images.unsplash.com/photo-1590483734724-383b85ad65e7?q=80&w=1000',
    contractImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000'
  },
  { 
    id: 'r2', name: '李娜', avatar: 'https://picsum.photos/seed/2/200', status: RiderStatus.ACTIVE, rating: 4.7, deliveries: 850, joinDate: '2022-05-20', region: '上海', station: '静安站点', contact: '139-0000-3333', email: 'lina@riderhub.cn', vehicleType: '电动三轮车', licensePlate: '沪B·20333', emergencyContact: '王刚 (139-0000-4444)', activityHistory: [{ date: '周一', deliveries: 15, earnings: 75 }], recentFeedback: [{ id: 'f3', customer: '张先生', comment: '很好', rating: 4, date: '昨天' }]
  },
  { 
    id: 'r3', name: '王强', avatar: 'https://picsum.photos/seed/3/200', status: RiderStatus.RESIGNED, rating: 4.2, deliveries: 310, joinDate: '2023-09-01', region: '北京', station: '海淀站点', contact: '137-0000-5555', email: 'wangqiang@riderhub.cn', vehicleType: '电动两轮车', licensePlate: '京B·12345', activityHistory: [], recentFeedback: []
  },
  { 
    id: 'r4', name: '赵敏', avatar: 'https://picsum.photos/seed/4/200', status: RiderStatus.ACTIVE, rating: 4.8, deliveries: 45, joinDate: new Date().toISOString().split('T')[0], region: '深圳', station: '南山站点', contact: '136-0000-6666', email: 'zhaomin@riderhub.cn', vehicleType: '智能电动两轮车', licensePlate: '粤B·66666', activityHistory: [], recentFeedback: []
  }
];

const INITIAL_STAFF: Staff[] = [
  { id: 's1', name: '赵主管', avatar: 'https://picsum.photos/seed/s1/200', role: StaffRole.AREA_MANAGER, employeeId: 'ST-001', city: '北京', station: '总部', contact: '130-1111-2222', email: 'zhao@riderhub.cn', joinDate: '2021-03-01', status: '在职' }
];

const INITIAL_APPLICANTS: Applicant[] = [
  { 
    id: '1', 
    name: '陈兵', 
    idNumber: '110101199501018888', 
    contact: '13812345678', 
    age: 28, 
    city: '北京', 
    station: '朝阳站点', 
    experience: '3年配送经验', 
    status: '已发录用', 
    entryResult: 'passed',
    appliedDate: '2023-10-24', 
    assignmentStatus: '待分配',
    idCardImage: 'https://images.unsplash.com/photo-1590483734724-383b85ad65e7?q=80&w=1000',
    contractImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000'
  }
];

const INITIAL_JOBS: JobPost[] = [
  { id: 'j1', title: '朝阳区全职骑手', salary: '8000-12000', location: '北京-朝阳', skills: ['熟悉地形', '有电动车'], benefits: ['五险一金', '餐补'], description: '负责朝阳区日常配送。', createdAt: '2023-10-01' }
];

const App: React.FC = () => {
  const [nav, setNav] = useState<NavigationState>({ view: 'dashboard', port: 'admin' });
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  const [staff] = useState<Staff[]>(INITIAL_STAFF);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [jobs, setJobs] = useState<JobPost[]>(INITIAL_JOBS);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [msgSubView, setMsgSubView] = useState<'chat' | 'ai'>('chat');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNewApplication = (newApplicant: Applicant) => {
    setApplicants(prev => [newApplicant, ...prev]);
    showToast(`新应聘者 ${newApplicant.name} 资料已同步！`, 'success');
  };

  const handleHireApplicant = (applicant: Applicant) => {
    const newRider: Rider = {
      id: 'R' + applicant.id + Date.now().toString().slice(-4),
      name: applicant.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`,
      status: RiderStatus.ACTIVE,
      rating: 5.0,
      deliveries: 0,
      joinDate: new Date().toISOString().split('T')[0],
      region: applicant.city,
      station: applicant.station,
      contact: applicant.contact,
      email: `${applicant.name}@riderhub.cn`,
      vehicleType: '待分配',
      idCardImage: applicant.idCardImage,
      contractImage: applicant.contractImage,
      activityHistory: [],
      recentFeedback: []
    };
    setRiders(prev => [newRider, ...prev]);
    setApplicants(prev => prev.filter(a => a.id !== applicant.id));
    showToast(`骑手 ${applicant.name} 已正式入职！`, 'success');
  };

  const handleStatusChange = (riderId: string, newStatus: RiderStatus) => {
    setRiders(prev => prev.map(r => r.id === riderId ? { ...r, status: newStatus } : r));
    showToast(`骑手状态已标注为：${newStatus}`, 'success');
  };

  const getRiderTenureInfo = (joinDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const joined = new Date(joinDate);
    joined.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - joined.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return { days: diffDays > 0 ? diffDays : 1, isQualified: diffDays >= 30 };
  };

  if (nav.port === 'applicant-portal') {
    return (
      <div className="animate-in fade-in duration-500">
        <PublicApplication 
          onApply={handleNewApplication} 
          onBack={() => setNav({ ...nav, port: 'admin', view: 'recruitment' })} 
        />
      </div>
    );
  }

  const renderAdminContent = () => {
    switch (nav.view) {
      case 'dashboard': 
        return <Dashboard riders={riders} onNavigate={(v) => setNav({ ...nav, view: v })} />;
      case 'recruitment': 
        return (
          <Recruitment 
            applicants={applicants} 
            setApplicants={setApplicants} 
            onOpenPublicForm={() => setNav({ ...nav, port: 'applicant-portal' })}
            onHire={handleHireApplicant}
            onAction={(m) => showToast(m, 'success')} 
          />
        );
      case 'riders':
        if (selectedRider) return <RiderDetail rider={selectedRider} onBack={() => setSelectedRider(null)} onMessage={() => { setNav({ ...nav, view: 'messages' }); setMsgSubView('chat'); }} onAction={(m) => showToast(m)} />;
        return (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 text-left">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">骑手档案库</h1>
                <p className="text-slate-500">管理在职骑手档案，查看身份证、电子合同等核心证照照片。</p>
              </div>
              <button onClick={() => showToast('准备导出数据...')} className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-all active:scale-95">导出数据</button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-left">
              <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
                <div className="relative flex-1 text-left">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="搜索姓名、手机或站点..." className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all text-left" />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl bg-white text-slate-600 text-sm font-bold shadow-sm active:scale-95 transition-all"><Filter size={18} /> 筛选</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="px-8 py-5">骑手信息</th>
                      <th className="px-8 py-5">在职状态</th>
                      <th className="px-8 py-5">入职时长</th>
                      <th className="px-8 py-5">联系方式</th>
                      <th className="px-8 py-5">区域/站点</th>
                      <th className="px-8 py-5 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {riders.map((rider) => {
                      const { days, isQualified } = getRiderTenureInfo(rider.joinDate);
                      const isResigned = rider.status === RiderStatus.RESIGNED;
                      return (
                        <tr key={rider.id} className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${isResigned ? 'bg-slate-50/30' : ''}`}>
                          <td className="px-8 py-5" onClick={() => setSelectedRider(rider)}>
                            <div className={`flex items-center gap-4 ${isResigned ? 'opacity-50' : ''}`}>
                              <img src={rider.avatar} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50" />
                              <div className="text-left">
                                <p className="font-bold text-slate-900">{rider.name}</p>
                                <p className="text-[10px] text-slate-400">ID: {rider.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="relative inline-block w-32">
                              <select 
                                value={rider.status}
                                onChange={(e) => handleStatusChange(rider.id, e.target.value as RiderStatus)}
                                onClick={(e) => e.stopPropagation()}
                                className={`w-full appearance-none px-3 py-2 pr-8 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none border transition-all cursor-pointer ${rider.status === RiderStatus.ACTIVE ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                              >
                                <option value={RiderStatus.ACTIVE}>在职</option>
                                <option value={RiderStatus.RESIGNED}>离职</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                          </td>
                          <td className="px-8 py-5" onClick={() => setSelectedRider(rider)}>
                            <div className="flex flex-col gap-1 items-start text-left">
                              <p className={`text-[11px] font-bold ${isResigned ? 'text-slate-400' : 'text-slate-600'}`}>{rider.joinDate}</p>
                              <p className="text-[10px] font-black text-slate-500 flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded"><Clock size={10} /> 累计 {days} 天</p>
                              {isQualified && <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded uppercase mt-1 bg-green-500 text-white"><Award size={10} /> 已达标</span>}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-left" onClick={() => setSelectedRider(rider)}>
                            <p className={`text-sm font-bold ${isResigned ? 'text-slate-400' : 'text-slate-800'}`}>{rider.contact}</p>
                            <p className="text-[11px] font-medium text-slate-400">{rider.vehicleType}</p>
                          </td>
                          <td className="px-8 py-5 text-left" onClick={() => setSelectedRider(rider)}>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700"><MapPin size={14} className="text-blue-500" />{rider.region}</div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase">{rider.station}</p>
                          </td>
                          <td className="px-8 py-5 text-right"><button className="p-2 text-slate-300 hover:text-blue-600"><MoreVertical size={20} /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'devices': 
        return <DeviceManagement onAction={(m) => showToast(m)} />;
      case 'jobs': 
        return <JobManagement jobs={jobs} onAdd={(j) => setJobs([j, ...jobs])} onDelete={(id) => setJobs(jobs.filter(j => j.id !== id))} onAction={(m) => showToast(m)} />;
      case 'messages': 
        return (
          <div className="h-full flex flex-col">
            <div className="px-8 pt-8 flex gap-4 bg-slate-50">
              <button onClick={() => setMsgSubView('chat')} className={`px-6 py-2.5 rounded-t-2xl text-sm font-black transition-all ${msgSubView === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>即时通讯</button>
              <button onClick={() => setMsgSubView('ai')} className={`px-6 py-2.5 rounded-t-2xl text-sm font-black transition-all ${msgSubView === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>AI 运营专家</button>
            </div>
            <div className="flex-1 min-h-0">
              {msgSubView === 'chat' ? <Messenger riders={riders} staff={staff} onAction={(m) => showToast(m)} /> : <AIConsultant />}
            </div>
          </div>
        );
      case 'settings': 
        return <Settings />;
      default: 
        return <Dashboard riders={riders} onNavigate={(v) => setNav({ ...nav, view: v })} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Noto_Sans_SC']">
      <Sidebar currentView={nav.view} onNavigate={(view) => { setNav({ ...nav, view }); setSelectedRider(null); }} />
      <main className="flex-1 ml-64 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
          <div className="relative w-96 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="text" placeholder="搜索人员、资产、候选人..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100/50 border-none text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-left" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => { setNav({ ...nav, view: 'messages' }); setMsgSubView('ai'); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all group" title="AI 专家"><Sparkles size={18} className="group-hover:rotate-12" /></button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            <Bell size={20} className="text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
            <img src="https://picsum.photos/seed/user/32/32" className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 cursor-pointer" alt="Profile" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto pb-20">{renderAdminContent()}</div>
        </div>
      </main>
      
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-green-600 text-white border-green-500' : 'bg-slate-900 text-white border-slate-800'}`}>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
