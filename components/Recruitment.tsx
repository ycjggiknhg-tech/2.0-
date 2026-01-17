
import React, { useState } from 'react';
import { 
  Search, MapPin, QrCode, FileSpreadsheet, 
  ChevronRight, MoreVertical, CheckCircle2, XCircle, AlertCircle, 
  UserPlus, Calendar, Check, ArrowRight, User, Building2, Bike, Edit3, Plus, Trash2, X, Save, AlertTriangle
} from 'lucide-react';
import { Applicant, Station } from '../types';

interface RecruitmentProps {
  onAction: (msg: string) => void;
  applicants: Applicant[];
  stations: Station[];
  setStations: React.Dispatch<React.SetStateAction<Station[]>>;
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  onOpenPublicForm: () => void;
  onHire: (applicant: Applicant) => void;
}

const Recruitment: React.FC<RecruitmentProps> = ({ onAction, applicants, stations, setStations, setApplicants, onOpenPublicForm, onHire }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showStationPicker, setShowStationPicker] = useState<string | null>(null);
  
  // 站点管理状态
  const [isAddingStation, setIsAddingStation] = useState(false);
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [deletingStationId, setDeletingStationId] = useState<string | null>(null); // 用于二次确认删除
  const [stationNameInput, setStationNameInput] = useState('');
  const [stationCityInput, setStationCityInput] = useState('北京');

  const filteredApplicants = applicants.filter(a => 
    a.name.includes(searchQuery) || a.city.includes(searchQuery) || a.contact.includes(searchQuery)
  );

  const handleStartAssign = (id: string) => {
    setShowStationPicker(id);
    setIsAddingStation(false);
    setEditingStationId(null);
    setDeletingStationId(null);
  };

  const handleAssignStation = (applicantId: string, stationName: string) => {
    // 如果正在编辑或删除站点，禁止触发分配逻辑
    if (editingStationId || deletingStationId) return;
    
    setApplicants(prev => prev.map(app => 
      app.id === applicantId ? { ...app, station: stationName, status: '面试通过', entryResult: 'station_assigned' } : app
    ));
    setShowStationPicker(null);
    onAction(`✅ 已将骑手分配至：${stationName}`);
  };

  const handleQuickAddStation = () => {
    if (!stationNameInput.trim()) {
      onAction('⚠️ 请输入站点名称');
      return;
    }
    const newStation: Station = {
      id: 'st' + Date.now(),
      name: stationNameInput.trim(),
      city: stationCityInput || '北京'
    };
    setStations(prev => [...prev, newStation]);
    setStationNameInput('');
    setIsAddingStation(false);
    onAction(`🎉 站点“${newStation.name}”创建成功`);
  };

  const handleQuickUpdateStation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!stationNameInput.trim()) {
      onAction('⚠️ 站点名称不能为空');
      return;
    }
    setStations(prev => prev.map(s => s.id === id ? { ...s, name: stationNameInput.trim() } : s));
    setEditingStationId(null);
    setStationNameInput('');
    onAction(`✅ 站点信息修改成功`);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingStationId === id) {
      // 执行真正的删除
      const target = stations.find(s => s.id === id);
      setStations(prev => prev.filter(s => s.id !== id));
      setDeletingStationId(null);
      onAction(`🗑️ 站点“${target?.name}”已永久移除`);
    } else {
      // 进入待删除状态（二次确认）
      setDeletingStationId(id);
      setEditingStationId(null);
      onAction('❓ 请再次点击删除图标以确认移除');
    }
  };

  const handleReject = (id: string) => {
    setApplicants(prev => prev.map(app => 
      app.id === id ? { ...app, entryResult: 'failed', status: '已拒绝' } : app
    ));
    onAction('❌ 已拒绝该申请');
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-fade-up text-left relative">
      <header className="flex justify-between items-end mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Recruitment Pipeline
          </div>
          <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight">招聘决策管理</h1>
          <p className="text-[#86868b] font-medium mt-2">在这里面试、指派站点并为骑手发放生产工具。</p>
        </div>
        <button 
          onClick={onOpenPublicForm} 
          className="apple-btn-primary px-8 py-4 text-xs flex items-center gap-2 shadow-xl shadow-[#0071e3]/20"
        >
          <QrCode size={18} /> 入职填报码
        </button>
      </header>

      <div className="relative mb-10">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b]" size={20} />
        <input 
          type="text" 
          placeholder="搜索姓名、城市或联系方式..." 
          className="w-full pl-16 pr-8 py-5 apple-card shadow-sm border border-slate-200/50 outline-none text-base focus:ring-4 focus:ring-[#0071e3]/5 transition-all placeholder-[#d2d2d7] font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredApplicants.map((applicant, index) => {
          const isStationAssigned = applicant.entryResult === 'station_assigned';
          const isFailed = applicant.entryResult === 'failed';

          return (
            <div 
              key={applicant.id}
              className={`apple-card p-8 flex items-center justify-between group transition-all duration-500 ${isStationAssigned ? 'ring-2 ring-[#0071e3] bg-blue-50/10' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-8 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] flex items-center justify-center font-bold text-xl text-[#1d1d1f] shadow-inner">
                  {applicant.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#1d1d1f] truncate">{applicant.name}</h3>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      isStationAssigned ? 'bg-emerald-100 text-emerald-700' : 
                      isFailed ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {applicant.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-[#86868b] text-xs font-bold">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#0071e3]" /> {isStationAssigned ? applicant.station : '待分配站点'}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {applicant.appliedDate} 申请</span>
                    {isStationAssigned && (
                      <button 
                        onClick={() => handleStartAssign(applicant.id)}
                        className="text-[#0071e3] flex items-center gap-1 hover:underline"
                      >
                        <Edit3 size={12} /> 修改站点
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {isStationAssigned ? (
                  <button 
                    onClick={() => onHire(applicant)}
                    className="bg-[#0071e3] text-white px-8 py-3.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#0071e3]/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    去绑定车辆 <ArrowRight size={16} />
                  </button>
                ) : isFailed ? (
                  <div className="text-red-400 font-bold text-xs px-4">申请已拒绝</div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStartAssign(applicant.id)}
                      className="px-6 py-3 bg-[#1d1d1f] text-white rounded-full text-xs font-bold hover:bg-black transition-all flex items-center gap-2"
                    >
                      通过并分站 <ChevronRight size={16} />
                    </button>
                    <button 
                      onClick={() => handleReject(applicant.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* 站点管理与选择浮层 */}
              {showStationPicker === applicant.id && (
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-xl p-10 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] z-[60] border-t border-slate-200 animate-in slide-in-from-bottom-full duration-500">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="text-2xl font-black text-[#1d1d1f] flex items-center gap-3">
                          <Building2 className="text-[#0071e3]" size={28} /> 指派入职站点
                        </h4>
                        <p className="text-slate-400 text-sm font-medium mt-1">请为 {applicant.name} 选择或创建一个配送站</p>
                      </div>
                      <button 
                        onClick={() => { setIsAddingStation(true); setEditingStationId(null); setDeletingStationId(null); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0071e3] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#0071e3]/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        <Plus size={16} /> 新增站点
                      </button>
                    </div>

                    {/* 快捷新增表单 */}
                    {isAddingStation && (
                      <div className="mb-8 p-6 bg-[#f5f5f7] rounded-3xl border border-slate-200 animate-in zoom-in-95 duration-200 flex items-center gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">站点名称</label>
                          <input 
                            autoFocus
                            placeholder="如：静安寺站" 
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-[#0071e3]"
                            value={stationNameInput}
                            onChange={e => setStationNameInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleQuickAddStation()}
                          />
                        </div>
                        <div className="w-32 space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属城市</label>
                          <input 
                            placeholder="如：上海" 
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm"
                            value={stationCityInput}
                            onChange={e => setStationCityInput(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2 pt-5">
                          <button onClick={handleQuickAddStation} className="p-3 bg-[#0071e3] text-white rounded-xl hover:bg-blue-600 transition-colors shadow-md"><Save size={20}/></button>
                          <button onClick={() => setIsAddingStation(false)} className="p-3 bg-white text-slate-400 rounded-xl border border-slate-200 hover:bg-slate-50"><X size={20}/></button>
                        </div>
                      </div>
                    )}

                    {/* 站点卡片列表 */}
                    <div className="grid grid-cols-2 gap-4 mb-10 overflow-y-auto max-h-[45vh] pr-2 scrollbar-thin">
                      {stations.map(st => {
                        const isEditing = editingStationId === st.id;
                        const isDeleting = deletingStationId === st.id;

                        return (
                          <div 
                            key={st.id}
                            className={`group relative p-6 border-2 rounded-3xl transition-all flex flex-col justify-between h-32 cursor-pointer ${
                              isEditing ? 'border-[#0071e3] bg-blue-50/30' : 
                              isDeleting ? 'border-red-500 bg-red-50/30' : 
                              'border-slate-100 bg-white hover:border-[#0071e3] hover:shadow-xl'
                            }`}
                            onClick={() => handleAssignStation(applicant.id, st.name)}
                          >
                            <div className="flex justify-between items-start">
                              <div className={`p-2.5 rounded-xl transition-colors ${isDeleting ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 group-hover:bg-[#0071e3]/10 group-hover:text-[#0071e3]'}`}>
                                <MapPin size={20} />
                              </div>
                              
                              {/* 管理按钮组 */}
                              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                {!isEditing && !isDeleting && (
                                  <>
                                    <button 
                                      onClick={() => { setEditingStationId(st.id); setStationNameInput(st.name); setDeletingStationId(null); }}
                                      className="p-2 text-slate-300 hover:text-[#0071e3] transition-colors"
                                    >
                                      <Edit3 size={16} />
                                    </button>
                                    <button 
                                      onClick={(e) => handleConfirmDelete(st.id, e)}
                                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                                {(isEditing || isDeleting) && (
                                  <button 
                                    onClick={() => { setEditingStationId(null); setDeletingStationId(null); }}
                                    className="p-2 text-slate-400 hover:bg-white rounded-lg"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {isEditing ? (
                              <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                                <input 
                                  autoFocus
                                  className="flex-1 px-3 py-1.5 bg-white border border-[#0071e3] rounded-lg outline-none text-sm font-bold"
                                  value={stationNameInput}
                                  onChange={e => setStationNameInput(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && handleQuickUpdateStation(st.id, e as any)}
                                />
                                <button onClick={(e) => handleQuickUpdateStation(st.id, e)} className="p-1.5 bg-[#0071e3] text-white rounded-lg"><Check size={16}/></button>
                              </div>
                            ) : isDeleting ? (
                              <div className="mt-2" onClick={e => e.stopPropagation()}>
                                <p className="text-[10px] font-black text-red-600 uppercase mb-1">确定要删除吗？</p>
                                <button 
                                  onClick={(e) => handleConfirmDelete(st.id, e)}
                                  className="w-full py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1 animate-pulse"
                                >
                                  <Trash2 size={12} /> 确认删除
                                </button>
                              </div>
                            ) : (
                              <div>
                                <p className="text-base font-bold text-slate-900 leading-tight truncate">{st.name}</p>
                                <p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">{st.city}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {stations.length === 0 && !isAddingStation && (
                        <div className="col-span-2 py-16 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                           <AlertTriangle className="mx-auto text-slate-300 mb-4" size={32} />
                           <p className="text-slate-400 font-bold mb-4">暂无预设站点</p>
                           <button onClick={() => setIsAddingStation(true)} className="text-[#0071e3] font-black text-[10px] uppercase tracking-widest hover:underline">点击立即手动添加</button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center border-t border-slate-100 pt-8">
                      <button 
                        onClick={() => setShowStationPicker(null)} 
                        className="px-12 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        取消并返回列表
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recruitment;
