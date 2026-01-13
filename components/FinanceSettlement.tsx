
import React, { useMemo, useState } from 'react';
import { 
  DollarSign, Users, CheckCircle2, AlertCircle, 
  Search, Filter, ArrowUpRight, Download, 
  Building2, History, CreditCard, ChevronRight,
  TrendingUp, Wallet, Receipt, Edit3, Save, X
} from 'lucide-react';
import { Rider, RiderStatus } from '../types';

interface FinanceSettlementProps {
  riders: Rider[];
  onUpdateRider: (rider: Rider) => void;
  onAction: (msg: string) => void;
}

interface EditState {
  id: string;
  company: string;
  amount: number;
}

const FinanceSettlement: React.FC<FinanceSettlementProps> = ({ riders, onUpdateRider, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'qualified' | 'pending'>('all');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditState | null>(null);

  // 计算结算相关数据
  const settlementStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = riders.map(r => {
      const joined = new Date(r.joinDate);
      const diffDays = Math.floor((today.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24));
      const amount = r.settlementAmount || 3000; 
      const company = r.clientCompany || '待指派单位';
      
      return {
        ...r,
        days: diffDays,
        amount,
        company,
        isQualified: diffDays >= 30,
        currentStatus: r.settlementStatus || (diffDays >= 30 ? 'qualified' : 'pending')
      };
    });

    const totalQualified = data.filter(d => d.isQualified).length;
    const pendingAmount = data.filter(d => d.currentStatus === 'qualified').reduce((acc, curr) => acc + curr.amount, 0);
    const totalPotential = data.reduce((acc, curr) => acc + curr.amount, 0);

    return { data, totalQualified, pendingAmount, totalPotential };
  }, [riders]);

  const filteredData = settlementStats.data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'qualified' && item.isQualified) || 
                         (statusFilter === 'pending' && !item.isQualified);
    return matchesSearch && matchesStatus;
  });

  const handleStartEdit = (item: any) => {
    setEditingRowId(item.id);
    setEditValues({
      id: item.id,
      company: item.company,
      amount: item.amount
    });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditValues(null);
  };

  const handleSaveEdit = () => {
    if (!editValues) return;
    const riderToUpdate = riders.find(r => r.id === editValues.id);
    if (riderToUpdate) {
      onUpdateRider({
        ...riderToUpdate,
        clientCompany: editValues.company,
        settlementAmount: editValues.amount
      });
      onAction(`✅ 已更新骑手 ${riderToUpdate.name} 的对账信息`);
    }
    setEditingRowId(null);
    setEditValues(null);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-500 text-left">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <TrendingUp size={12} /> 劳务返费对账系统
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">返费结算中心</h1>
          <p className="text-slate-400 font-medium">手动配置甲方结算单位及返费金额，追踪入职达标进度。</p>
        </div>
        <button 
          onClick={() => onAction('正在生成本月对账清单...')}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95"
        >
          <Download size={18} /> 导出对账明细
        </button>
      </header>

      {/* 财务数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-left">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
            <Wallet size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">待对账总额 (已达标)</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">¥{(settlementStats.pendingAmount / 10000).toFixed(2)}W</p>
            <span className="text-[10px] font-bold text-amber-500 uppercase">Pending</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-left">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <Receipt size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">已达标骑手人数</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">{settlementStats.totalQualified}</p>
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Qualified</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-left">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <History size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">本月预期返费总计</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">¥{(settlementStats.totalPotential / 10000).toFixed(2)}W</p>
            <span className="text-[10px] font-bold text-blue-500 uppercase">Forecast</span>
          </div>
        </div>
      </div>

      {/* 列表区域 */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
              全部记录
            </button>
            <button 
              onClick={() => setStatusFilter('qualified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === 'qualified' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
              已达标 (待结算)
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
              在职中 (未达标)
            </button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索骑手或甲方单位..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                <th className="px-8 py-5">骑手信息</th>
                <th className="px-8 py-5">结算单位 (甲方公司)</th>
                <th className="px-8 py-5">在职天数</th>
                <th className="px-8 py-5">返费金额</th>
                <th className="px-4 py-5">结算状态</th>
                <th className="pl-4 pr-10 py-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => {
                const isEditing = editingRowId === item.id;
                
                return (
                  <tr key={item.id} className={`${isEditing ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'} transition-colors group`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img src={item.avatar} className="w-9 h-9 rounded-xl bg-slate-100 shadow-sm" alt={item.name} />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.joinDate} 入职</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                           <Building2 size={14} className="text-blue-500" />
                           <input 
                            autoFocus
                            className="bg-white border border-blue-200 px-2 py-1 rounded text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={editValues?.company}
                            onChange={(e) => setEditValues(prev => prev ? {...prev, company: e.target.value} : null)}
                           />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                            <Building2 size={14} />
                          </div>
                          <span className="text-xs font-black text-slate-700">{item.company}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${item.isQualified ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {item.days}天
                        </span>
                        {!item.isQualified && (
                          <span className="text-[9px] font-bold text-slate-300">还差{30 - item.days}天</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400">¥</span>
                          <input 
                            type="number"
                            className="w-24 bg-white border border-blue-200 px-2 py-1 rounded text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={editValues?.amount}
                            onChange={(e) => setEditValues(prev => prev ? {...prev, amount: parseInt(e.target.value) || 0} : null)}
                           />
                        </div>
                      ) : (
                        <span className="text-sm font-black text-slate-900">¥{item.amount.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        {item.isQualified ? (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            <CheckCircle2 size={10} /> 已达标
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                            <AlertCircle size={10} /> 达标中
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="pl-4 pr-10 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={handleSaveEdit} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md">
                              <Save size={14} />
                            </button>
                            <button onClick={handleCancelEdit} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 active:scale-95 transition-all">
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleStartEdit(item)} 
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="手动修改单位或金额"
                          >
                            <Edit3 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceSettlement;
