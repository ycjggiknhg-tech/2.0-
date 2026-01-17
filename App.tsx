
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Recruitment from './components/Recruitment';
import RiderDetail from './components/RiderDetail';
import Messenger from './components/Messenger';
import Settings from './components/Settings';
import DeviceManagement from './components/DeviceManagement';
import JobManagement from './components/JobManagement';
import PublicApplication from './components/PublicApplication';
import VehicleAssignmentView from './components/VehicleAssignmentView';
import FinanceSettlement from './components/FinanceSettlement';
import { NavigationState, RiderStatus, Rider, Applicant, Staff, StaffRole, JobPost, Device, Station } from './types';
import { Search, Bell, MapPin, BadgeCheck, Zap } from 'lucide-react';

const STORAGE_KEYS = {
  RIDERS: 'riderhub_v4_riders',
  APPS: 'riderhub_v4_apps',
  STAFF: 'riderhub_v4_staff',
  DEVICES: 'riderhub_v4_devices',
  STATIONS: 'riderhub_v4_stations'
};

const INITIAL_STATIONS: Station[] = [
  { id: 'st1', name: '朝阳三里屯站', city: '北京' },
  { id: 'st2', name: '静安寺站', city: '上海' },
  { id: 'st3', name: '天河中心站', city: '广州' },
  { id: 'st4', name: '武林广场站', city: '杭州' }
];

const INITIAL_STAFF: Staff[] = [
  { 
    id: 's1', 
    name: '王大伟', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang', 
    gender: '男',
    age: 34,
    role: StaffRole.MANAGER, 
    employeeId: 'M001', 
    city: '北京', 
    station: '朝阳三里屯站', 
    group: '核心管理组',
    leader: '系统管理员',
    contact: '138-1111-2222', 
    email: 'wang@riderhub.cn', 
    joinDate: '2021-05-10', 
    status: '在职',
    dailyPerformance: 85
  }
];

const INITIAL_RIDERS: Rider[] = [
  { id: 'r1', name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang', status: RiderStatus.ACTIVE, rating: 4.9, joinDate: '2024-10-15', region: '北京', station: '朝阳三里屯站', contact: '138-0000-1111', email: 'zhangwei@riderhub.cn', vehicleType: '智能电动车 (EV-A9021)', licensePlate: 'EV-A9021', vin: 'VIN-ZHANG-001', activityHistory: [], recentFeedback: [], clientCompany: 'ABC甲方实业', settlementAmount: 3500 }
];

const INITIAL_APPLICANTS: Applicant[] = [
  { id: '1', name: '陈兵', idNumber: '110101199501018888', contact: '13812345678', age: 28, city: '北京', station: '朝阳三里屯站', experience: '3年配送经验', status: '待处理', entryResult: 'pending', appliedDate: '2023-10-24', assignmentStatus: '待分配' }
];

const INITIAL_DEVICES: Device[] = [
  { id: 'd1', type: '电动车', code: 'EV-A9021', vin: 'VIN-ZHANG-001', brand: '九号', color: '极地白', status: '正常', rider: '张伟', lastSync: '2分钟前', city: '北京', station: '朝阳三里屯站', location: '001-A' },
  { id: 'd3', type: '电动车', code: 'EV-X7722', vin: 'VIN-FREE-992', brand: '雅迪', color: '星空灰', status: '正常', rider: '未分配', lastSync: '1小时前', city: '北京', station: '朝阳三里屯站', location: '003-B' },
  { id: 'd4', type: '电动车', code: 'EV-K1120', vin: 'VIN-FREE-881', brand: '小牛', color: '活力红', status: '正常', rider: '未分配', lastSync: '刚刚', city: '北京', station: '朝阳三里屯站', location: '004-C' },
  { id: 'd2', type: '电动车', code: 'EV-B1102', vin: 'VIN-LI-002', brand: '九号', color: '磨砂黑', status: '正常', rider: '未分配', lastSync: '10分钟前', city: '上海', station: '静安寺站', location: 'S-102' }
];

const App: React.FC = () => {
  const [nav, setNav] = useState<NavigationState>({ view: 'dashboard', port: 'admin' });
  
  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATIONS);
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [riders, setRiders] = useState<Rider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIDERS);
    return saved ? JSON.parse(saved) : INITIAL_RIDERS;
  });

  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICANTS;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEVICES);
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [assigningApplicant, setAssigningApplicant] = useState<Applicant | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(riders));
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(applicants));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
  }, [riders, applicants, staff, devices, stations]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateRider = (updatedRider: Rider) => {
    setRiders(prev => prev.map(r => r.id === updatedRider.id ? updatedRider : r));
  };

  const handleStartHireFlow = (applicant: Applicant) => {
    setAssigningApplicant(applicant);
    setNav({ ...nav, view: 'vehicle-assignment' });
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
  };

  const handleUpdateDevices = (updatedDevices: Device[]) => {
    setDevices(prev => {
      const newDevices = [...prev];
      updatedDevices.forEach(upd => {
        const idx = newDevices.findIndex(d => d.id === upd.id);
        if (idx !== -1) newDevices[idx] = upd;
      });
      return newDevices;
    });
  };

  const handleCompleteHiring = (applicant: Applicant, deviceId: string) => {
    const selectedDevice = devices.find(d => d.id === deviceId);
    
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
      vehicleType: selectedDevice ? `${selectedDevice.brand || '智能电动车'} (${selectedDevice.code})` : '未绑定',
      licensePlate: selectedDevice?.code,
      vin: selectedDevice?.vin,
      activityHistory: [],
      recentFeedback: [],
      clientCompany: '待分配单位',
      settlementAmount: 3000,
      settlementStatus: 'pending'
    };

    if (deviceId !== 'skip') {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, rider: applicant.name } : d
      ));
    }

    setRiders([newRider, ...riders]);
    setApplicants(prev => prev.filter(a => a.id !== applicant.id));
    setAssigningApplicant(null);
    setNav({ ...nav, view: 'riders' });
    showToast(`🎉 入职成功！骑手 ${applicant.name} 已激活并完成资产分配。`);
  };

  if (nav.port === 'applicant-portal') {
    return (
      <div className="h-screen w-screen bg-[#f5f5f7]">
        <PublicApplication 
          onApply={(app) => {
            setApplicants([app, ...applicants]);
            setNav({ ...nav, port: 'admin', view: 'recruitment' });
            showToast('申请提交成功');
          }} 
          onBack={() => setNav({ ...nav, port: 'admin', view: 'recruitment' })} 
        />
      </div>
    );
  }

  if (nav.view === 'vehicle-assignment' && assigningApplicant) {
    return (
      <div className="h-screen w-screen bg-[#f5f5f7]">
        <VehicleAssignmentView 
          applicant={assigningApplicant} 
          allVehicles={devices}
          onClose={() => { setAssigningApplicant(null); setNav({ ...nav, view: 'recruitment' }); }}
          onConfirm={(deviceId) => handleCompleteHiring(assigningApplicant, deviceId)}
          onUpdateVehicle={handleUpdateDevice}
          onUpdateDevices={handleUpdateDevices}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f5f5f7]">
      <div className="hidden sm:block">
        <Sidebar currentView={nav.view} onNavigate={(view) => { setNav({ ...nav, view }); setSelectedRider(null); }} />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        <header className="h-16 shrink-0 apple-blur border-b border-slate-200/60 px-10 flex justify-between items-center sticky top-0 z-40">
          <div className="relative flex-1 max-md text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" size={16} />
            <input 
              type="text" 
              placeholder="搜索系统内容..." 
              className="w-full pl-10 pr-4 py-1.5 rounded-full bg-[#f5f5f7] border-none text-sm outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder-[#86868b]" 
            />
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
               <span className="text-[12px] font-semibold text-[#1d1d1f] hidden md:block">王主管</span>
               <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            {nav.view === 'dashboard' && <Dashboard riders={riders} onNavigate={(v) => setNav({ ...nav, view: v })} />}
            {nav.view === 'recruitment' && (
              <Recruitment 
                applicants={applicants} 
                setApplicants={setApplicants}
                stations={stations}
                setStations={setStations}
                onOpenPublicForm={() => setNav({ ...nav, port: 'applicant-portal' })}
                onHire={handleStartHireFlow}
                onAction={showToast} 
              />
            )}
            {nav.view === 'riders' && (
              selectedRider ? (
                <RiderDetail 
                  rider={selectedRider} 
                  onBack={() => setSelectedRider(null)} 
                  onAction={showToast} 
                />
              ) : (
                <div className="p-10 text-left animate-in fade-in duration-500">
                  <header className="mb-10">
                    <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">骑手数字档案</h1>
                    <p className="text-[#86868b] font-medium mt-1">管理站点所有在职与离职骑手的全生命周期记录。</p>
                  </header>
                  <div className="apple-card overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#f5f5f7]/50 border-b border-slate-200/60">
                        <tr className="text-[11px] font-bold uppercase text-[#86868b] tracking-wider">
                          <th className="px-8 py-4">姓名</th>
                          <th className="px-8 py-4">状态</th>
                          <th className="px-8 py-4">绑定资产</th>
                          <th className="px-8 py-4">所属站点</th>
                          <th className="px-8 py-4 text-right">档案操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {riders.map(r => (
                          <tr key={r.id} className="hover:bg-[#f5f5f7]/50 cursor-pointer transition-colors group" onClick={() => setSelectedRider(r)}>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <img src={r.avatar} className="w-9 h-9 rounded-full bg-slate-100" />
                                <span className="font-semibold text-[#1d1d1f]">{r.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.status === RiderStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                 {r.status}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-sm text-[#1d1d1f] font-mono">{r.licensePlate || '—'}</td>
                            <td className="px-8 py-5 text-sm text-[#86868b] font-medium">{r.station}</td>
                            <td className="px-8 py-5 text-right">
                               <button className="text-[#0071e3] font-semibold text-sm hover:underline">查看详情</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
            {nav.view === 'finance' && <FinanceSettlement riders={riders} onUpdateRider={handleUpdateRider} onAction={showToast} />}
            {nav.view === 'devices' && <DeviceManagement devices={devices} setDevices={setDevices} stations={stations} onAction={showToast} />}
            {nav.view === 'jobs' && (
              <JobManagement 
                staff={staff} 
                setStaff={setStaff} 
                stations={stations}
                setStations={setStations}
                onAction={showToast} 
              />
            )}
            {nav.view === 'messages' && <Messenger riders={riders} staff={staff} onAction={showToast} />}
            {nav.view === 'settings' && <Settings />}
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-[2rem] bg-slate-900 text-white shadow-2xl text-sm font-bold animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
