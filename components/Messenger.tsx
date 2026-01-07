
import React, { useState } from 'react';
import { Search, User, Bike, Briefcase, Phone, Mail, MapPin, BadgeCheck, Clock, Star, Send } from 'lucide-react';
import { Rider, Staff, StaffRole, RiderStatus } from '../types';

interface MessengerProps {
  riders: Rider[];
  staff: Staff[];
  onAction: (msg: string) => void;
}

type Category = 'rider' | 'staff';

const Messenger: React.FC<MessengerProps> = ({ riders, staff, onAction }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('rider');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredRiders = riders.filter(r => 
    r.name.includes(searchQuery) || r.region.includes(searchQuery) || r.station.includes(searchQuery)
  );
  
  const filteredStaff = staff.filter(s => 
    s.name.includes(searchQuery) || s.city.includes(searchQuery) || s.station.includes(searchQuery) || s.role.includes(searchQuery)
  );

  const currentList = activeCategory === 'rider' ? filteredRiders : filteredStaff;
  const selectedPerson = activeCategory === 'rider' 
    ? riders.find(r => r.id === selectedId) 
    : staff.find(s => s.id === selectedId);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-black text-slate-900 mb-6 text-left">信息中心</h2>
            
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
              <button 
                onClick={() => { setActiveCategory('rider'); setSelectedId(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeCategory === 'rider' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Bike size={14} /> 骑手人员
              </button>
              <button 
                onClick={() => { setActiveCategory('staff'); setSelectedId(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeCategory === 'staff' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Briefcase size={14} /> 人资员工
              </button>
            </div>

            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                placeholder="快速搜索姓名、区域..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {currentList.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Search size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs font-medium">未找到匹配人员</p>
              </div>
            ) : (
              currentList.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full p-4 flex gap-3 hover:bg-white transition-all border-l-4 active:bg-slate-100 ${selectedId === item.id ? 'bg-white border-blue-600 shadow-sm' : 'border-transparent'}`}
                >
                  <img src={(item as any).avatar} className="w-12 h-12 rounded-2xl object-cover" alt={item.name} />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{(item as any).region || (item as any).city}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {activeCategory === 'rider' 
                        ? (item as Rider).vehicleType 
                        : (item as Staff).role}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50/20 flex flex-col min-w-0 overflow-hidden">
          {selectedPerson ? (
            <div className="flex-1 overflow-y-auto p-12">
              <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500">
                {/* Header Profile */}
                <div className="flex items-start gap-8 flex-wrap">
                  <div className="relative">
                    <img src={(selectedPerson as any).avatar} className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-white shadow-xl" alt={selectedPerson.name} />
                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-4 border-white text-[10px] font-black uppercase tracking-wider text-white ${(selectedPerson as any).status === RiderStatus.ACTIVE || (selectedPerson as any).status === '在职' ? 'bg-green-500' : 'bg-orange-500'}`}>
                      {(selectedPerson as any).status}
                    </div>
                  </div>
                  <div className="flex-1 text-left pt-2 min-w-[200px]">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">{selectedPerson.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                        {activeCategory === 'rider' ? '实名认证骑手' : (selectedPerson as Staff).role}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">
                        {(selectedPerson as any).region || (selectedPerson as any).city} · {(selectedPerson as any).station}
                      </span>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => onAction('通讯系统建立中...')} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                         <Send size={18} /> 发起会话
                       </button>
                       <button onClick={() => onAction('名片已复制')} className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                         复制联系方式
                       </button>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">联系资料</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Phone size={18} /></div>
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase">移动电话</p><p className="font-bold text-slate-800">{selectedPerson.contact}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Mail size={18} /></div>
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase">工作邮箱</p><p className="font-bold text-slate-800">{selectedPerson.email}</p></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">履约信息</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Clock size={18} /></div>
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase">入职时间</p><p className="font-bold text-slate-800">{selectedPerson.joinDate}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><BadgeCheck size={18} /></div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">身份标识</p>
                          <p className="font-bold text-slate-800">{activeCategory === 'rider' ? 'ID: ' + selectedPerson.id : '工号: ' + (selectedPerson as Staff).employeeId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance or Specific Info */}
                {activeCategory === 'rider' ? (
                  <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl shadow-blue-200 flex-wrap gap-4">
                    <div className="text-left">
                      <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">年度考核表现</p>
                      <h3 className="text-4xl font-black">卓越 (4.9/5.0)</h3>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-blue-100 text-[10px] font-bold uppercase">总送达</p>
                        <p className="text-xl font-bold">{(selectedPerson as Rider).deliveries}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-100 text-[10px] font-bold uppercase">准时率</p>
                        <p className="text-xl font-bold">99.2%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl flex-wrap gap-4">
                    <div className="text-left">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">内部管理权限</p>
                      <h3 className="text-2xl font-black">{(selectedPerson as Staff).role}</h3>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-slate-500 text-[10px] font-bold uppercase">管理站点</p>
                        <p className="text-lg font-bold">12个</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-500 text-[10px] font-bold uppercase">团队规模</p>
                        <p className="text-lg font-bold">148人</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-left space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">备注与日志</h3>
                  <div className="bg-slate-100/50 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed border border-dashed border-slate-200">
                    该人员表现稳定，暂无违规记录。近期在业务考核中获得{(selectedPerson as any).name}所在单位的高度评价。建议作为核心骨干进行培养。
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                <User size={48} className="opacity-20" />
              </div>
              <p className="font-black text-xl text-slate-400 tracking-tight">请在左侧选择人员查看详情</p>
              <p className="text-sm mt-2 opacity-60">您可以按姓名或城市进行快速检索</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
