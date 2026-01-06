
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Recruitment from './components/Recruitment';
import RiderDetail from './components/RiderDetail';
import Messenger from './components/Messenger';
import Settings from './components/Settings';
import DeviceManagement from './components/DeviceManagement';
import JobManagement from './components/JobManagement';
import AIConsultant from './components/AIConsultant';
import PublicApplication from './components/PublicApplication';
import { NavigationState, RiderStatus, Rider, Applicant, Staff, StaffRole, JobPost } from './types';
import { Search, Bell, Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  RIDERS: 'riderhub_v2_riders',
  APPS: 'riderhub_v2_apps',
  JOBS: 'riderhub_v2_jobs',
  STAFF: 'riderhub_v2_staff',
  DEVICES: 'riderhub_v2_devices'
};

const INITIAL_STAFF: Staff[] = [
  { id: 's1', name: '王站长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang', role: StaffRole.STATION_MANAGER, employeeId: 'M001', city: '北京', station: '朝阳三里屯站', contact: '138-1111-2222', email: 'wang@riderhub.cn', joinDate: '2021-05-10', status: '在职' },
  { id: 's2', name: '李主管', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiHR', role: StaffRole.HR, employeeId: 'H002', city: '上海', station: '静安寺站', contact: '139-2222-3333', email: 'li_hr@riderhub.cn', joinDate: '2022-02-15', status: '在职' }
];

const INITIAL_RIDERS: Rider[] = [
  { id: 'r1', name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang', status: RiderStatus.ACTIVE, rating: 4.9, deliveries: 1240, joinDate: '2022-01-15', region: '北京', station: '朝阳三里屯站', contact: '138-0000-1111', email: 'zhangwei@riderhub.cn', vehicleType: '智能电动两轮车', activityHistory: [], recentFeedback: [] }
];

const INITIAL_APPLICANTS: Applicant[] = [
  { id: '1', name: '陈兵', idNumber: '110101199501018888', contact: '13812345678', age: 28, city: '北京', station: '朝阳三里屯站', experience: '3年配送经验', status: '待处理', entryResult: 'pending', appliedDate: '2023-10-24', assignmentStatus: '待分配' },
  { id: '2', name: '赵大为', idNumber: '310101199205057777', contact: '13566667777', age: 31, city: '上海', station: '静安寺站', experience: '曾在顺丰工作', status: '面试中', entryResult: 'passed', appliedDate: '2023-10-25', assignmentStatus: '已预分配' }
];

const INITIAL_DEVICES = [
  { id: 'd1', type: '电动车' as const, code: 'EV-A9021', status: '正常' as const, rider: '张伟', lastSync: '2分钟前', location: '朝阳区三里屯' },
  { id: 'd2', type: '换电电池' as const, code: 'BAT-X002', status: '低电量' as const, batteryLevel: 15, rider: '李娜', lastSync: '10秒前', location: '静安区南京西路' }
];

const App: React.FC = () => {
  const [nav, setNav] = useState<NavigationState>({ view: 'dashboard', port: 'admin' });
  
  // 初始化逻辑：从存储中读取，没有则使用初始数据
  const [riders, setRiders] = useState<Rider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIDERS);
    return saved ? JSON.parse(saved) : INITIAL_RIDERS;
  });

  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICANTS;
  });

  const [jobs, setJobs] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [devices, setDevices] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEVICES);
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // 状态监听：任何数据变化时立即保存到 LocalStorage，确保下次打开依然存在
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(riders));
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(applicants));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
  }, [riders, applicants, jobs, staff, devices]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleHireApplicant = (applicant: Applicant) => {
    const newRider: Rider = {
      id: 'R' + Date.now(),
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
      vehicleType: '已分配车辆',
      activityHistory: [],
      recentFeedback: []
    };
    setRiders([newRider, ...riders]);
    setApplicants(applicants.filter(a => a.id !== applicant.id));
    showToast(`骑手 ${applicant.name} 已入职，数据已永久保存。`);
  };

  if (nav.port === 'applicant-portal') {
    return (
      <PublicApplication 
        onApply={(app) => {
          setApplicants([app, ...applicants]);
          setNav({ ...nav, port: 'admin', view: 'recruitment' });
          showToast('申请提交成功，已在后台显示');
        }} 
        onBack={() => setNav({ ...nav, port: 'admin', view: 'recruitment' })} 
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Noto_Sans_SC']">
      <Sidebar currentView={nav.view} onNavigate={(view) => { setNav({ ...nav, view }); setSelectedRider(null); }} />
      <main className="flex-1 ml-64 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center text-left">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="全域数据深度检索..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100/50 border-none text-sm outline-none" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setNav({...nav, view: 'messages'})} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Sparkles size={18} className="text-blue-600 animate-pulse" />
            </button>
            <Bell size={20} className="text-slate-400 cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin" alt="Admin" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {nav.view === 'dashboard' && <Dashboard riders={riders} onNavigate={(v) => setNav({ ...nav, view: v })} />}
          {nav.view === 'recruitment' && (
            <Recruitment 
              applicants={applicants} 
              setApplicants={setApplicants}
              onOpenPublicForm={() => setNav({ ...nav, port: 'applicant-portal' })}
              onHire={handleHireApplicant}
              onAction={showToast} 
            />
          )}
          {nav.view === 'riders' && (
            selectedRider ? (
              <RiderDetail rider={selectedRider} onBack={() => setSelectedRider(null)} onMessage={() => setNav({ ...nav, view: 'messages' })} onAction={showToast} />
            ) : (
              <div className="p-8 text-left">
                <h1 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">骑手档案库</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <th className="px-6 py-4">姓名</th>
                        <th className="px-6 py-4">状态</th>
                        <th className="px-6 py-4">所属站点</th>
                        <th className="px-6 py-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {riders.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelectedRider(r)}>
                          <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                            <img src={r.avatar} className="w-8 h-8 rounded-lg bg-slate-100" />
                            {r.name}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-600">{r.status}</td>
                          <td className="px-6 py-4 text-xs text-blue-600 font-bold">{r.station}</td>
                          <td className="px-6 py-4 text-right text-blue-600 font-bold text-xs">详情</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
          {nav.view === 'devices' && <DeviceManagement devices={devices} setDevices={setDevices} onAction={showToast} />}
          {nav.view === 'jobs' && (
            <JobManagement 
              jobs={jobs} 
              onAdd={(j) => setJobs([j, ...jobs])} 
              onDelete={(id) => setJobs(jobs.filter(x => x.id !== id))} 
              onAction={showToast} 
            />
          )}
          {nav.view === 'messages' && <Messenger riders={riders} staff={staff} onAction={showToast} />}
          {nav.view === 'settings' && <Settings />}
        </div>
      </main>
      
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl text-sm font-bold animate-in slide-in-from-bottom-5 border border-slate-800">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
