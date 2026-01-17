
import React, { useState } from 'react';
import { Search, User, Bike, Briefcase, Phone, Mail, MapPin, BadgeCheck, Clock, Send, MessageCircle, Calendar } from 'lucide-react';
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
    r.name.includes(searchQuery) || r.region.includes(searchQuery) || (r.station && r.station.includes(searchQuery))
  );
  
  const filteredStaff = staff.filter(s => 
    s.name.includes(searchQuery) || s.city.includes(searchQuery) || (s.role && s.role.includes(searchQuery))
  );

  const currentList = activeCategory === 'rider' ? filteredRiders : filteredStaff;
  const selectedPerson = activeCategory === 'rider' 
    ? riders.find(r => r.id === selectedId) 
    : staff.find(s => s.id === selectedId);

  return (
    <div className="p-10 h-full flex flex-col animate-fade-up">
      <header className="mb-10 text-left">
        <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight">信息中心</h1>
        <p className="text-[#86868b] font-medium mt-1">实时沟通与成员档案概览。</p>
      </header>

      <div className="apple-card flex-1 flex overflow-hidden border border-slate-200/40">
        {/* Left List */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-[#f5f5f7]/30">
          <div className="p-6 space-y-4">
            <div className="flex p-1 bg-[#f5f5f7] rounded-2xl">
              <button 
                onClick={() => { setActiveCategory('rider'); setSelectedId(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'rider' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-[#86868b]'}`}
              >
                骑手
              </button>
              <button 
                onClick={() => { setActiveCategory('staff'); setSelectedId(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'staff' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-[#86868b]'}`}
              >
                职能
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={14} />
              <input 
                placeholder="搜索成员..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
            {currentList.map(item => (
              <button 
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full p-4 flex gap-4 rounded-2xl transition-all text-left ${selectedId === item.id ? 'bg-white shadow-md' : 'hover:bg-white/40'}`}
              >
                <img src={(item as any).avatar} className="w-11 h-11 rounded-full bg-white border border-slate-100" />
                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-sm ${selectedId === item.id ? 'text-[#0071e3]' : 'text-[#1d1d1f]'}`}>{item.name}</p>
                  <p className="text-[10px] text-[#86868b] font-medium truncate">{(item as any).region || (item as any).city}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Detail */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
          {selectedPerson ? (
            <div className="flex-1 overflow-y-auto p-16 animate-fade-up">
              <div className="max-w-2xl mx-auto text-center">
                <img src={(selectedPerson as any).avatar} className="w-32 h-32 rounded-full mx-auto mb-8 ring-4 ring-[#f5f5f7]" />
                <h2 className="text-4xl font-bold text-[#1d1d1f] tracking-tight mb-2">{selectedPerson.name}</h2>
                <p className="text-xl text-[#86868b] font-medium">{(selectedPerson as any).region || (selectedPerson as any).city} · {(selectedPerson as any).station}</p>
                
                <div className="flex justify-center gap-4 mt-10">
                  <button onClick={() => onAction('消息发起中')} className="apple-btn-primary px-8 py-3.5 flex items-center gap-2 text-sm">
                    <MessageCircle size={18} /> 发起会话
                  </button>
                  <button onClick={() => onAction('语音拨打中')} className="apple-btn-secondary px-8 py-3.5 flex items-center gap-2 text-sm">
                    <Phone size={18} /> 语音通话
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-10 border-t border-slate-100 mt-16 pt-16 text-left">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">联络方式</h4>
                      <p className="font-bold text-[#1d1d1f] flex items-center gap-2"><Phone size={14} className="text-[#0071e3]" /> {selectedPerson.contact}</p>
                      <p className="font-bold text-[#1d1d1f] flex items-center gap-2 mt-2"><Mail size={14} className="text-[#0071e3]" /> {selectedPerson.email}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">档案信息</h4>
                      <p className="font-bold text-[#1d1d1f] flex items-center gap-2"><Calendar size={14} className="text-[#0071e3]" /> 入职: {selectedPerson.joinDate}</p>
                      <p className="font-bold text-[#1d1d1f] flex items-center gap-2 mt-2"><BadgeCheck size={14} className="text-[#0071e3]" /> 状态: 已认证</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#d2d2d7]">
              <MessageCircle size={64} strokeWidth={1} className="mb-6 opacity-20" />
              <p className="text-xl font-medium">选择一个联系人开始沟通</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
