
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, MapPin, Building2, UserCheck, Edit2, Trash2, 
  ChevronDown, X, User, Fingerprint, Activity, QrCode, Copy, Download, 
  ExternalLink, FileSpreadsheet, CalendarRange, AlertCircle, Image as ImageIcon, 
  FileSignature, RotateCw, ZoomIn, ZoomOut, Printer, UserPlus, CheckCircle, XCircle, Phone
} from 'lucide-react';
import { Applicant } from '../types';

interface RecruitmentProps {
  onAction: (msg: string) => void;
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  onOpenPublicForm: () => void;
  onHire: (applicant: Applicant) => void;
}

const Recruitment: React.FC<RecruitmentProps> = ({ onAction, applicants, setApplicants, onOpenPublicForm, onHire }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [viewingDoc, setViewingDoc] = useState<{ url: string, title: string } | null>(null);
  const [docRotation, setDocRotation] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().split('T')[0];

  const [exportRange, setExportRange] = useState({
    start: lastMonthStr,
    end: today
  });

  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleUpdateEntryResult = (id: string, result: 'passed' | 'failed' | 'pending') => {
    setApplicants(prev => prev.map(app => 
      app.id === id ? { 
        ...app, 
        entryResult: result, 
        status: result === 'passed' ? '已发录用' : result === 'failed' ? '已拒绝' : '待处理' 
      } : app
    ));
    const resultText = result === 'passed' ? '已通过' : result === 'failed' ? '未通过' : '待定';
    onAction(`已标注 ${applicants.find(a => a.id === id)?.name} 为${resultText}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条应聘记录吗？此操作无法撤销。')) {
      setApplicants(prev => prev.filter(a => a.id !== id));
      onAction('应聘者记录已成功删除');
      setActiveMenuId(null);
    }
  };

  const openModifyModal = (applicant: Applicant) => {
    setEditingApplicant({ ...applicant });
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplicant) return;
    setApplicants(prev => prev.map(a => a.id === editingApplicant.id ? editingApplicant : a));
    setIsEditModalOpen(false);
    setEditingApplicant(null);
    onAction(`已更新应聘者 ${editingApplicant.name} 的信息`);
  };

  const handleExportCSV = () => {
    const startDate = new Date(exportRange.start);
    const endDate = new Date(exportRange.end);
    if (startDate > endDate) {
      alert('开始日期不能晚于结束日期');
      return;
    }
    const filteredApplicants = applicants.filter(app => {
      const appDate = new Date(app.appliedDate);
      return appDate >= startDate && appDate <= endDate;
    });
    if (filteredApplicants.length === 0) {
      onAction('所选时间段内暂无应聘者数据');
      setShowExportModal(false);
      return;
    }
    const headers = ['序号', '面试日期', '姓名', '结论', '分配情况', '站点', '手机号', '经验'];
    const rows = filteredApplicants.map((app, idx) => [
      idx + 1, app.appliedDate, app.name,
      app.entryResult === 'passed' ? '通过' : app.entryResult === 'failed' ? '未通过' : '待定',
      app.assignmentStatus, app.city + '-' + app.station, app.contact,
      `"${app.experience.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RiderHub_名单_${exportRange.start}_至_${exportRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  const publicLink = "https://riderhub.cn/apply/bj-cy-01";

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 text-left">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">站点招聘</h1>
          <p className="text-slate-500">追踪各物理站点每日进项应聘骑手，管理跨城市与站点的资源分配。</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowQRModal(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"><QrCode size={20} /> 添加应聘者 (扫码)</button>
          <button onClick={() => setShowExportModal(true)} className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2"><FileSpreadsheet size={20} className="text-green-600" /> 导出名单报表</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1 text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="通过姓名、站点、或手机号搜索..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" />
          </div>
          <button onClick={() => onAction('筛选器已打开')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-white transition-colors text-slate-600 bg-white text-sm font-medium"><Filter size={18} /> 按城市/站点筛选</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] border-collapse">
            <thead>
              <tr className="text-left bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">序号</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">面试日期</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">姓名</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">是否通过状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">待分配状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">分配站点</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">手机号码</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-left">
              {applicants.map((applicant, index) => (
                <tr key={applicant.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600 flex items-center gap-1"><Calendar size={14} className="text-slate-400" />{applicant.appliedDate}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs flex-shrink-0">{applicant.name.charAt(0)}</div>
                      <p className="font-bold text-slate-900 truncate">{applicant.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-36">
                      <select 
                        value={applicant.entryResult || 'pending'}
                        onChange={(e) => handleUpdateEntryResult(applicant.id, e.target.value as any)}
                        className={`w-full appearance-none px-4 py-2 pr-10 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none border transition-all cursor-pointer ${
                          applicant.entryResult === 'passed' 
                            ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
                            : applicant.entryResult === 'failed'
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <option value="pending" className="bg-white text-slate-500">待定中</option>
                        <option value="passed" className="bg-white text-green-600 font-bold">已通过</option>
                        <option value="failed" className="bg-white text-red-600 font-bold">未通过</option>
                      </select>
                      <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                        applicant.entryResult === 'passed' ? 'text-green-400' : applicant.entryResult === 'failed' ? 'text-red-400' : 'text-slate-400'
                      }`} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                      <UserCheck size={14} className={applicant.assignmentStatus.includes('已分配') ? 'text-green-500' : 'text-slate-400'} />
                      {applicant.assignmentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1"><MapPin size={12} className="text-blue-500" /> {applicant.city}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Building2 size={12} /> {applicant.station}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-300" />
                      {applicant.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right overflow-visible">
                    <div className="relative flex justify-end">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === applicant.id ? null : applicant.id); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${activeMenuId === applicant.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                      >
                        操作 <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenuId === applicant.id ? 'rotate-180' : ''}`} />
                      </button>
                      {activeMenuId === applicant.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <div className="p-1.5 space-y-0.5">
                            <button onClick={() => { if (applicant.entryResult !== 'passed') return alert('请先标注入职结论为“已通过”'); if (window.confirm(`确定为 ${applicant.name} 办理电动车入职吗？`)) onHire(applicant); setActiveMenuId(null); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-black rounded-lg transition-all text-left ${applicant.entryResult === 'passed' ? 'text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white' : 'text-slate-300 cursor-not-allowed'}`}><UserPlus size={16} /> 办理电动车</button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button onClick={() => { if (applicant.idCardImage) setViewingDoc({ url: applicant.idCardImage, title: `${applicant.name} - 身份证` }); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"><ImageIcon size={16} /> 查看身份证</button>
                            <button onClick={() => { if (applicant.contractImage) setViewingDoc({ url: applicant.contractImage, title: `${applicant.name} - 合同` }); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"><FileSignature size={16} /> 查看合同照片</button>
                            <button onClick={() => openModifyModal(applicant)} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"><Edit2 size={16} /> 修改资料</button>
                            <button onClick={() => handleDelete(applicant.id)} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"><Trash2 size={16} /> 删除应聘记录</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Viewer */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
          <div className="flex justify-between items-center p-6 text-white border-b border-white/10">
            <div className="flex items-center gap-4">
              <button onClick={() => { setViewingDoc(null); setDocRotation(0); }} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
              <h3 className="text-xl font-bold tracking-tight">{viewingDoc.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDocRotation(prev => prev + 90)} className="p-3 bg-white/10 rounded-xl"><RotateCw size={20} /></button>
              <button className="p-3 bg-white/10 rounded-xl"><ZoomIn size={20} /></button>
              <button className="p-3 bg-white/10 rounded-xl"><ZoomOut size={20} /></button>
              <button onClick={() => onAction('打印准备中...')} className="ml-4 flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-sm shadow-xl"><Printer size={18} /> 打印/导出</button>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-12">
            <div className="relative transition-transform duration-300 shadow-2xl bg-white max-w-4xl" style={{ transform: `rotate(${docRotation}deg)` }}>
              <img src={viewingDoc.url} alt="Doc Preview" className="max-h-[80vh] w-auto block select-none" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex flex-wrap gap-10 p-10 rotate-[-15deg]">
                {[...Array(10)].map((_, i) => <span key={i} className="text-lg font-black text-black">RiderHub 内部机密 · 严禁外传</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-600 text-white rounded-xl shadow-lg shadow-green-200"><FileSpreadsheet size={20} /></div>
                 <h2 className="text-xl font-bold text-slate-900">导出名单报表</h2>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-8 text-left space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-xs text-blue-700 leading-relaxed font-medium">根据安全审计要求，单次导出范围最大为 3 个月。</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">开始日期</label>
                  <input type="date" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800" value={exportRange.start} onChange={e => setExportRange({...exportRange, start: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">结束日期</label>
                  <input type="date" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800" value={exportRange.end} onChange={e => setExportRange({...exportRange, end: e.target.value})} />
                </div>
              </div>
              <button onClick={handleExportCSV} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"><Download size={20} /> 立即生成并导出</button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">自助入职二维码</h2>
              <button onClick={() => setShowQRModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500 mb-6 px-4">请面试者使用手机扫描下方二维码，开始填写入职资料。</p>
              <div className="relative group mx-auto w-48 h-48 bg-white border-8 border-slate-50 rounded-[2rem] shadow-inner flex items-center justify-center mb-6 overflow-hidden">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicLink)}&bgcolor=ffffff&color=0f172a&margin=10`} alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="flex-1 text-[10px] font-mono text-slate-400 truncate">{publicLink}</span>
                  <button onClick={() => { navigator.clipboard.writeText(publicLink); onAction('链接已复制'); }} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm"><Copy size={14} /></button>
                </div>
                <button onClick={() => { setShowQRModal(false); onOpenPublicForm(); }} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-2"><ExternalLink size={14} /> 模拟扫码进入申请端</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingApplicant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200"><Edit2 size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">修改应聘者信息</h2>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-8 space-y-6 text-left max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase px-1">姓名</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={editingApplicant.name} onChange={e => setEditingApplicant({...editingApplicant, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase px-1">年龄</label>
                  <input required type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={editingApplicant.age} onChange={e => setEditingApplicant({...editingApplicant, age: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase px-1">身份证号</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono" value={editingApplicant.idNumber} onChange={e => setEditingApplicant({...editingApplicant, idNumber: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase px-1">城市</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={editingApplicant.city} onChange={e => setEditingApplicant({...editingApplicant, city: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase px-1">站点</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={editingApplicant.station} onChange={e => setEditingApplicant({...editingApplicant, station: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl active:scale-95">确认保存</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
