
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Recruitment from './components/Recruitment';
import Messenger from './components/Messenger';
import Settings from './components/Settings';
import DeviceManagement from './components/DeviceManagement';
import JobManagement from './components/JobManagement';
import FinanceSettlement from './components/FinanceSettlement';
import AIConsultant from './components/AIConsultant';
import PublicApplication from './components/PublicApplication';
import RiderManagement from './components/RiderManagement';
import RiderDetail from './components/RiderDetail';
import { NavigationState, RiderStatus, Rider, Applicant, Station, Device, Staff, StaffRole } from './types';
import { Search, Bell } from 'lucide-react';

const STORAGE_KEYS = {
  RIDERS: 'riderhub_v5_riders',
  APPLICANTS: 'riderhub_v5_applicants',
  STATIONS: 'riderhub_v5_stations',
  DEVICES: 'riderhub_v5_devices',
  STAFF: 'riderhub_v5_staff'
};

const INITIAL_STATIONS: Station[] = [
  { id: 'st1', name: '朝阳三里屯站', city: '北京' },
  { id: 'st2', name: '静安寺站', city: '上海' },
  { id: 'st3', name: '南山科技园站', city: '深圳' },
  { id: 'st4', name: '武林广场站', city: '杭州' }
];

const INITIAL_STAFF: Staff[] = [
  { id: 's1', name: '王主管', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', gender: '男', age: 32, role: StaffRole.MANAGER, employeeId: 'E1001', city: '北京', station: '总部', group: '运营部', leader: 'CEO', contact: '138-1111-2222', email: 'wang@riderhub.cn', joinDate: '2023-01-10', status: '在职', dailyPerformance: 98 },
  { id: 's2', name: '李组长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li', gender: '男', age: 28, role: StaffRole.TEAM_LEADER, employeeId: 'E1002', city: '上海', station: '静安寺站', group: '配送一组', leader: '王主管', contact: '139-2222-3333', email: 'li@riderhub.cn', joinDate: '2023-05-15', status: '在职', dailyPerformance: 92 }
];

const App: React.FC = () => {
  const [nav, setNav] = useState<NavigationState | { view: 'public-form', port: 'applicant-portal' }>({ view: 'dashboard', port: 'admin' });
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  
  const [riders, setRiders] = useState<Rider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIDERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICANTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATIONS);
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEVICES);
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(riders)); }, [riders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(applicants)); }, [applicants]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations)); }, [stations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices)); }, [devices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff)); }, [staff]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleHire = (applicant: Applicant, deviceId?: string) => {
    let vehicleName = '智能电动车';
    if (deviceId && deviceId !== 'skip') {
      const targetDevice = devices.find(d => d.id === deviceId);
      if (targetDevice) {
        vehicleName = targetDevice.code;
        setDevices(devices.map(d => d.id === deviceId ? { ...d, rider: applicant.name, status: '正常' } : d));
      }
    }
    const newRider: Rider = {
      id: 'R' + Date.now(),
      name: applicant.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`,
      status: RiderStatus.ACTIVE,
      rating: 5.0,
      joinDate: new Date().toISOString().split('T')[0],
      region: applicant.city,
      station: applicant.station,
      contact: applicant.contact,
      email: `${applicant.name}@riderhub.cn`,
      vehicleType: vehicleName,
      activityHistory: [],
      recentFeedback: []
    };
    setRiders([newRider, ...riders]);
    setApplicants(applicants.map(a => a.id === applicant.id ? { ...a, status: '已入职' } : a));
    showToast(`🎉 骑手 ${applicant.name} 入职成功！`);
  };

  const currentRider = useMemo(() => riders.find(r => r.id === selectedRiderId), [riders, selectedRiderId]);

  if (nav.view === 'public-form') {
    return <PublicApplication onApply={(a) => { setApplicants([a, ...applicants]); showToast('申请提交成功！'); }} onBack={() => setNav({ view: 'recruitment', port: 'admin' })} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFFFFF] font-sans">
      <Sidebar currentView={nav.view as any} onNavigate={(view) => { setNav({ ...nav, view: view as any }); setSelectedRiderId(null); }} />
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <header className="h-16 shrink-0 apple-blur border-b border-slate-200/50 px-10 flex justify-between items-center sticky top-0 z-40">
           <div className="flex items-center gap-10 flex-1">
              <div className="relative w-80 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                 <input type="text" placeholder="快速检索人员、资产、订单..." className="w-full pl-12 pr-4 py-2 rounded-2xl bg-slate-100/50 border-none text-[13px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
              </div>
           </div>
           <div className="flex items-center gap-6">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative"><Bell size={20} /><div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" /></button>
              <div className="h-8 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right"><p className="text-sm font-black text-slate-900 leading-none">王主管</p><p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Fleet Admin</p></div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-xl border border-slate-200 shadow-sm" alt="" />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-auto">
          {nav.view === 'dashboard' && <Dashboard riders={riders} applicants={applicants} onNavigate={(v) => setNav({ ...nav, view: v })} />}
          {nav.view === 'ai-consultant' && <AIConsultant />}
          {nav.view === 'recruitment' && (
            <Recruitment 
              applicants={applicants} 
              setApplicants={setApplicants} 
              stations={stations} 
              setStations={setStations} 
              devices={devices}
              onOpenPublicForm={() => setNav({ view: 'public-form', port: 'applicant-portal' })} 
              onHire={handleHire} 
              onAction={showToast} 
            />
          )}
          {nav.view === 'riders' && (
            selectedRiderId && currentRider ? (
              <RiderDetail rider={currentRider} onBack={() => setSelectedRiderId(null)} onAction={showToast} onUpdateRider={(updated) => setRiders(riders.map(r => r.id === updated.id ? updated : r))} />
            ) : (
              <RiderManagement riders={riders} onSelectRider={setSelectedRiderId} onAction={showToast} />
            )
          )}
          {nav.view === 'finance' && <FinanceSettlement riders={riders} onUpdateRider={(r) => setRiders(riders.map(rd => rd.id === r.id ? r : rd))} onAction={showToast} />}
          {nav.view === 'settings' && <Settings />}
          {nav.view === 'devices' && <DeviceManagement devices={devices} setDevices={setDevices} stations={stations} onAction={showToast} />}
          {nav.view === 'jobs' && (
            <JobManagement staff={staff} setStaff={setStaff} stations={stations} setStations={setStations} onAction={showToast} />
          )}
          {nav.view === 'messages' && <Messenger riders={riders} staff={staff} onAction={showToast} />}
        </div>
      </main>
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-[2rem] bg-slate-900 text-white shadow-2xl text-xs font-black tracking-widest uppercase animate-in slide-in-from-bottom-5 border border-white/10">{toast}</div>
      )}
    </div>
  );
};

export default App;
