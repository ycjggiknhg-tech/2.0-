
import React, { useState, useEffect, useRef } from 'react';
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
import VehicleAssignmentView from './components/VehicleAssignmentView';
import FinanceSettlement from './components/FinanceSettlement';
import { NavigationState, RiderStatus, Rider, Applicant, Staff, StaffRole, JobPost } from './types';
import { Search, Bell, Sparkles, ChevronRight, MapPin, BadgeCheck, Zap } from 'lucide-react';

const STORAGE_KEYS = {
  RIDERS: 'riderhub_v2_riders',
  APPS: 'riderhub_v2_apps',
  JOBS: 'riderhub_v2_jobs',
  STAFF: 'riderhub_v2_staff',
  DEVICES: 'riderhub_v2_devices'
};

const INITIAL_STAFF: Staff[] = [
  { 
    id: 's1', 
    name: '王大伟', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang', 
    gender: '男',
    age: 34,
    role: StaffRole.STATION_MANAGER, 
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
  },
  { 
    id: 's2', 
    name: '李小美', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiHR', 
    gender: '女',
    age: 28,
    role: StaffRole.HR, 
    employeeId: 'H002', 
    city: '上海', 
    station: '静安寺站', 
    group: '华东人资组',
    leader: '王大伟',
    contact: '139-2222-3333', 
    email: 'li_hr@riderhub.cn', 
    joinDate: '2022-02-15', 
    status: '在职',
    dailyPerformance: 92
  }
];

const INITIAL_RIDERS: Rider[] = [
  { id: 'r1', name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang', status: RiderStatus.ACTIVE, rating: 4.9, deliveries: 1240, joinDate: '2024-10-15', region: '北京', station: '朝阳三里屯站', contact: '138-0000-1111', email: 'zhangwei@riderhub.cn', vehicleType: '智能电动两轮车', licensePlate: 'EV-A9021', vin: 'VIN-ZHANG-001', activityHistory: [], recentFeedback: [], clientCompany: 'ABC甲方实业', settlementAmount: 3500 },
  { id: 'r2', name: '李娜', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li', status: RiderStatus.ACTIVE, rating: 4.8, deliveries: 890, joinDate: '2024-11-20', region: '上海', station: '静安寺站', contact: '139-1111-2222', email: 'lina@riderhub.cn', vehicleType: '智能电动两轮车', licensePlate: 'EV-B1102', vin: 'VIN-LI-002', activityHistory: [], recentFeedback: [], clientCompany: 'XYZ末端物流', settlementAmount: 4200 }
];

const INITIAL_APPLICANTS: Applicant[] = [
  { id: '1', name: '陈兵', idNumber: '110101199501018888', contact: '13812345678', age: 28, city: '北京', station: '朝阳三里屯站', experience: '3年配送经验', status: '待处理', entryResult: 'pending', appliedDate: '2023-10-24', assignmentStatus: '待分配' }
];

const INITIAL_DEVICES = [
  { id: 'd1', type: '电动车' as const, code: 'EV-A9021', vin: 'VIN-ZHANG-001', status: '正常' as const, rider: '张伟', lastSync: '2分钟前', location: '北京 朝阳三里屯站 仓库' },
  { id: 'd2', type: '电动车' as const, code: 'EV-B1102', vin: 'VIN-LI-002', status: '正常' as const, rider: '李娜', lastSync: '10分钟前', location: '上海 静安寺站 仓库' }
];

const App: React.FC = () => {
  const [nav, setNav] = useState<NavigationState>({ view: 'dashboard', port: 'admin' });
  
  // 拖拽状态管理
  const ridersScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ridersScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ridersScrollRef.current.offsetLeft);
    setStartY(e.pageY - ridersScrollRef.current.offsetTop);
    setScrollLeft(ridersScrollRef.current.scrollLeft);
    setScrollTop(ridersScrollRef.current.scrollTop);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ridersScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - ridersScrollRef.current.offsetLeft;
    const y = e.pageY - ridersScrollRef.current.offsetTop;
    const walkX = (x - startX) * 2;
    const walkY = (y - startY) * 2;
    ridersScrollRef.current.scrollLeft = scrollLeft - walkX;
    ridersScrollRef.current.scrollTop = scrollTop - walkY;
  };

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
  const [assigningApplicant, setAssigningApplicant] = useState<Applicant | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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

  const handleUpdateRider = (updatedRider: Rider) => {
    setRiders(prev => prev.map(r => r.id === updatedRider.id ? updatedRider : r));
  };

  const handleStartHireFlow = (applicant: Applicant) => {
    setAssigningApplicant(applicant);
    setNav({ ...nav, view: 'vehicle-assignment' });
  };

  const handleUpdateDevice = (updatedDevice: any) => {
    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
  };

  const handleUpdateDevices = (updatedDevices: any[]) => {
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
      deliveries: 0,
      joinDate: new Date().toISOString().split('T')[0],
      region: applicant.city,
      station: applicant.station,
      contact: applicant.contact,
      email: `${applicant.name}@riderhub.cn`,
      vehicleType: selectedDevice ? `智能电动车 (${selectedDevice.code})` : '待分配',
      licensePlate: selectedDevice?.code,
      vin: selectedDevice?.vin,
      activityHistory: [],
      recentFeedback: [],
      clientCompany: 'ABC甲方实业', // 默认分配一个甲方
      settlementAmount: 3000,
      settlementStatus: 'pending'
    };

    if (deviceId !== 'skip') {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, rider: applicant.name } : d
      ));
    }

    setRiders([newRider, ...riders]);
    setApplicants(applicants.filter(a => a.id !== applicant.id));
    setAssigningApplicant(null);
    setNav({ ...nav, view: 'riders' });
    showToast(`骑手 ${applicant.name} 已入职并成功绑定车辆 ${selectedDevice?.code || ''}`);
  };

  if (nav.port === 'applicant-portal') {
    return (
      <div className="h-screen w-screen bg-slate-100">
        <PublicApplication 
          onApply={(app) => {
            setApplicants([app, ...applicants]);
            setNav({ ...nav, port: 'admin', view: 'recruitment' });
            showToast('申请提交成功，已在后台显示');
          }} 
          onBack={() => setNav({ ...nav, port: 'admin', view: 'recruitment' })} 
        />
      </div>
    );
  }

  if (nav.view === 'vehicle-assignment' && assigningApplicant) {
    return (
      <div className="h-screen w-screen bg-slate-50">
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
    <div className="flex h-screen w-screen overflow-hidden text-left bg-gradient-to-br from-[#f5f7ff] to-[#fcfdfe]">
      {/* 侧边栏 */}
      <div className="hidden sm:block">
        <Sidebar currentView={nav.view} onNavigate={(view) => { setNav({ ...nav, view }); setSelectedRider(null); }} />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        <header className="h-16 shrink-0 bg-white/40 backdrop-blur-md border-b border-blue-50 px-4 sm:px-8 flex justify-between items-center text-left sticky top-0 z-40">
          <div className="relative flex-1 max-w-xs sm:max-w-md text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="搜索骑手、站点..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/50 border border-white text-xs outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            <div className="hidden sm:flex bg-white/60 p-1 rounded-xl border border-white shadow-sm">
              <button onClick={() => setNav({...nav, view: 'messages'})} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                <Sparkles size={16} className="text-blue-600" />
              </button>
            </div>
            <div className="relative p-2 text-slate-400 hover:bg-white/60 rounded-xl cursor-pointer transition-colors">
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="h-8 w-px bg-blue-50 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-600 hidden md:block uppercase tracking-widest">王主管</span>
               <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden border border-white shadow-sm shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto relative">
          <div className="min-w-full">
            {nav.view === 'dashboard' && <Dashboard riders={riders} onNavigate={(v) => setNav({ ...nav, view: v })} />}
            {nav.view === 'recruitment' && (
              <Recruitment 
                applicants={applicants} 
                setApplicants={setApplicants}
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
                <div className="p-4 sm:p-6 text-left animate-in fade-in duration-300">
                  <header className="mb-4">
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">骑手档案管理</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic opacity-60">
                      按住鼠标左键可全向拖拽视图 · 视图已优化为紧凑模式
                    </p>
                  </header>

                  {/* 紧凑型列表容器 */}
                  <div 
                    ref={ridersScrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-auto select-none max-h-[calc(100vh-180px)] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  >
                    
                    {/* 移动端紧凑卡片 */}
                    <div className="block md:hidden divide-y divide-slate-100/50">
                      {riders.map(r => (
                        <div 
                          key={r.id} 
                          onClick={() => !isDragging && setSelectedRider(r)}
                          className="p-3 active:bg-blue-50 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <img src={r.avatar} className="w-10 h-10 rounded-xl bg-blue-50 border border-slate-100 shadow-sm" alt={r.name} />
                            <div className="text-left">
                              <p className="font-black text-slate-800 text-xs">{r.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`px-1 py-0.5 rounded text-[7px] font-black uppercase border ${r.status === RiderStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                  {r.status}
                                </span>
                                {r.licensePlate && (
                                  <span className="flex items-center gap-0.5 px-1 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[7px] font-black uppercase">
                                    <Zap size={8} /> {r.licensePlate}
                                  </span>
                                )}
                                <span className="text-[9px] text-slate-400 font-bold">{r.station}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300" />
                        </div>
                      ))}
                    </div>

                    {/* 桌面端紧凑表格 */}
                    <div className="hidden md:block">
                      <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                          <tr className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                            <th className="px-6 py-3">骑手信息</th>
                            <th className="px-6 py-3">状态</th>
                            <th className="px-6 py-3">绑定设备</th>
                            <th className="px-6 py-3">所属站点</th>
                            <th className="px-6 py-3">服务时长</th>
                            <th className="px-6 py-3 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {riders.map(r => (
                            <tr 
                              key={r.id} 
                              className="hover:bg-slate-50 cursor-pointer transition-colors group" 
                              onClick={() => !isDragging && setSelectedRider(r)}
                            >
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                  <img src={r.avatar} className="w-8 h-8 rounded-lg bg-blue-50 border border-slate-100" />
                                  <div>
                                    <p className="font-bold text-slate-800 text-xs">{r.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{r.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase border ${r.status === RiderStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="px-6 py-3">
                                {r.licensePlate ? (
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg w-fit">
                                      <Zap size={10} />
                                      <span className="text-[10px] font-black uppercase tracking-tight">{r.licensePlate}</span>
                                    </div>
                                    {r.vin && <p className="text-[8px] text-slate-400 font-medium px-1 truncate max-w-[120px]">VIN: {r.vin}</p>}
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-300 italic">未绑定设备</span>
                                )}
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                                  <MapPin size={11} className="text-slate-300" />
                                  {r.station}
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                                  <BadgeCheck size={12} className="text-blue-400" />
                                  {Math.floor((Date.now() - new Date(r.joinDate).getTime()) / (1000 * 60 * 60 * 24))} 天
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <span className="text-blue-600 font-black text-[9px] uppercase tracking-widest group-hover:underline">详情报告</span>
                              </td>
                            </tr>
                          ))}
                          {riders.length < 8 && [...Array(4)].map((_, i) => (
                            <tr key={`spacer-${i}`} className="opacity-0">
                               <td colSpan={6} className="py-4">Spacer</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            )}
            {nav.view === 'finance' && <FinanceSettlement riders={riders} onUpdateRider={handleUpdateRider} onAction={showToast} />}
            {nav.view === 'devices' && <DeviceManagement devices={devices} setDevices={setDevices} onAction={showToast} />}
            {nav.view === 'jobs' && <JobManagement staff={staff} setStaff={setStaff} onAction={showToast} />}
            {nav.view === 'messages' && <Messenger riders={riders} staff={staff} onAction={showToast} />}
            {nav.view === 'settings' && <Settings />}
          </div>
        </div>
      </main>

      {/* 底部移动端快速导航栏 */}
      <div className="sm:hidden h-14 bg-white border-t border-slate-100 flex items-center justify-around px-4 sticky bottom-0 z-50">
        <button onClick={() => setNav({...nav, view: 'dashboard'})} className={`p-2 rounded-xl ${nav.view === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
           <Search size={18} />
        </button>
        <button onClick={() => setNav({...nav, view: 'riders'})} className={`p-2 rounded-xl ${nav.view === 'riders' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
           <BadgeCheck size={18} />
        </button>
        <button onClick={() => setNav({...nav, view: 'messages'})} className={`p-2 rounded-xl ${nav.view === 'messages' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
           <Sparkles size={18} />
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl text-white shadow-2xl text-[10px] font-bold animate-in slide-in-from-bottom-5 border border-white/10 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
