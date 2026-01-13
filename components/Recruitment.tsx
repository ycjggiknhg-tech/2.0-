
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, MapPin, UserCheck, Trash2, 
  ChevronDown, X, QrCode, FileSpreadsheet, 
  UserPlus, Phone, AlertCircle, Users, CheckCircle2, XCircle, TrendingUp
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

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // 计算今日各城市招募概览数据
  const todaySummary = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const stats: Record<string, { total: number; passed: number; failed: number }> = {};

    applicants.forEach(app => {
      if (app.appliedDate === today) {
        if (!stats[app.city]) {
          stats[app.city] = { total: 0, passed: 0, failed: 0 };
        }
        stats[app.city].total += 1;
        if (app.entryResult === 'passed') stats[app.city].passed += 1;
        if (app.entryResult === 'failed') stats[app.city].failed += 1;
      }
    });

    return stats;
  }, [applicants]);

  const handleUpdateEntryResult = (id: string, result: 'passed' | 'failed' | 'pending') => {
    setApplicants(prev => prev.map(app => 
      app.id === id ? { 
        ...app, 
        entryResult: result, 
        status: result === 'passed' ? '已发录用' : result === 'failed' ? '已拒绝' : '待处理' 
      } : app
    ));
    onAction(`已更新面试结论为：${result === 'passed' ? '通过' : result === 'failed' ? '拒绝' : '待定'}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要永久删除这条申请记录吗？')) {
      setApplicants(prev => prev.filter(a => a.id !== id));
      onAction('记录已删除');
    }
  };

  return (
    <div className="p-8 text-left">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">站点招聘管理</h1>
          <p className="text-slate-500 text-sm">实时监控各城市面试进度与入职转化效率。</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowQRModal(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 text-sm">
            <QrCode size={18} /> 添加应聘者（扫码）
          </button>
          <button onClick={() => onAction('报表生成中...')} className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 text-sm">
            <FileSpreadsheet size={18} className="text-green-600" /> 导出报表
          </button>
        </div>
      </div>

      {/* 今日招募看板 - 城市维度 */}
      <div className="mb-10">
        <header className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-blue-500" />
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">今日招募实况看板 (City-Level Overview)</h2>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(todaySummary).length > 0 ? (
            Object.entries(todaySummary).map(([city, data]) => {
              // Fix: Explicitly cast "data" from unknown to the expected stats type to resolve compilation errors
              const summaryData = data as { total: number; passed: number; failed: number };
              return (
                <div key={city} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <MapPin size={16} />
                      </div>
                      <span className="font-black text-slate-800 tracking-tight">{city}</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">
                      转化率 {summaryData.total > 0 ? Math.round((summaryData.passed / summaryData.total) * 100) : 0}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">面试</p>
                      <p className="text-lg font-black text-slate-800">{summaryData.total}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black text-emerald-400 uppercase mb-0.5">通过</p>
                      <p className="text-lg font-black text-emerald-600">{summaryData.passed}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black text-rose-400 uppercase mb-0.5">淘汰</p>
                      <p className="text-lg font-black text-rose-600">{summaryData.failed}</p>
                    </div>
                  </div>

                  <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(summaryData.passed / summaryData.total) * 100}%` }} />
                    <div className="bg-rose-400 h-full transition-all" style={{ width: `${(summaryData.failed / summaryData.total) * 100}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
               <Users size={32} className="opacity-10 mb-2" />
               <p className="text-xs font-bold uppercase tracking-widest italic">今日暂无城市面试记录</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50 text-left">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="搜索姓名、电话或站点..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-4 focus:ring-blue-50" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-white text-slate-600 bg-white text-sm font-bold"><Filter size={18} /> 筛选</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse table-auto">
            <thead>
              <tr className="text-left bg-slate-50 border-b border-slate-100">
                <th className="pl-6 pr-1 py-5 text-[10px] font-black uppercase text-slate-400 w-12">序号</th>
                <th className="px-0.5 py-5 text-[10px] font-black uppercase text-slate-400 w-px whitespace-nowrap text-left">面试日期</th>
                <th className="px-4 py-5 text-[10px] font-black uppercase text-slate-400 w-px whitespace-nowrap text-left">姓名</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 w-44">面试结论状态</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 w-32">待分配状态</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">所属站点</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">联系电话</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-right">管理</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-left">
              {applicants.map((applicant, index) => (
                <tr key={applicant.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="pl-6 pr-1 py-5 text-sm font-medium text-slate-400 font-mono">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="px-0.5 py-5 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-bold font-mono tracking-tighter">{applicant.appliedDate}</span>
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-[10px] shadow-sm">{applicant.name.charAt(0)}</div>
                      <p className="font-bold text-slate-900 text-sm">{applicant.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="relative inline-block w-36">
                      <select 
                        value={applicant.entryResult || 'pending'}
                        onChange={(e) => handleUpdateEntryResult(applicant.id, e.target.value as any)}
                        className={`w-full appearance-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer outline-none ${
                          applicant.entryResult === 'passed' ? 'bg-green-50 text-green-600 border-green-200' :
                          applicant.entryResult === 'failed' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        <option value="pending">待定</option>
                        <option value="passed">通过</option>
                        <option value="failed">拒绝</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <UserCheck size={14} className={applicant.assignmentStatus.includes('已') ? 'text-green-500' : 'text-slate-300'} />
                      {applicant.assignmentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col text-sm">
                      <span className="font-bold text-slate-800 flex items-center gap-1">{applicant.city}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{applicant.station}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700 font-mono tracking-tighter">{applicant.contact}</td>
                  <td className="px-6 py-5 text-right relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === applicant.id ? null : applicant.id); }}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all ml-auto ${
                        activeMenuId === applicant.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      操作菜单 <ChevronDown size={12} />
                    </button>
                    {activeMenuId === applicant.id && (
                      <div className="absolute right-6 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (applicant.entryResult !== 'passed') {
                              onAction('⚠️ 请先将面试结论修改为“通过”再办理入职');
                              return;
                            }
                            onHire(applicant); 
                            setActiveMenuId(null); 
                          }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <UserPlus size={14} /> 确认入职分车
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(applicant.id); }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} /> 删除此条记录
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl p-8 text-center animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase">扫码快速录入</h2>
              <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-slate-50 rounded-full"><X className="text-slate-400" size={24} /></button>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl mb-8 border border-slate-100">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://riderhub.cn/apply" alt="qr" className="mx-auto" />
            </div>
            <button onClick={() => { setShowQRModal(false); onOpenPublicForm(); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">模拟手机填报端</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
