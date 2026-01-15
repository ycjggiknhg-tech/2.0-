
import React, { useState } from 'react';
import { X, Bike, Zap, CheckCircle2, Search, ArrowRight, ShieldCheck, MapPin, Hash } from 'lucide-react';
import { Applicant } from '../types';

interface VehicleAssignmentModalProps {
  applicant: Applicant;
  availableVehicles: any[];
  onClose: () => void;
  onConfirm: (deviceId: string) => void;
}

const VehicleAssignmentModal: React.FC<VehicleAssignmentModalProps> = ({ applicant, availableVehicles, onClose, onConfirm }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = availableVehicles.filter(v => 
    v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.location.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Bike size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">入职资产分配工作台</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Asset Allocation Workbench</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 text-left">
          {/* Applicant Summary */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-lg">
                {applicant.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{applicant.name}</p>
                <p className="text-xs text-slate-500">{applicant.city} · {applicant.station}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <ShieldCheck size={14} /> 面试已通过
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">选择待分配车辆 ({filteredVehicles.length})</h3>
              <div className="relative w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索编号..." 
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVehicles.length === 0 ? (
                <div className="col-span-2 py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-400">当前站点暂无可用车辆</p>
                </div>
              ) : (
                filteredVehicles.map(vehicle => (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedId(vehicle.id)}
                    className={`p-5 rounded-3xl border-2 transition-all text-left flex flex-col gap-3 group relative overflow-hidden ${
                      selectedId === vehicle.id 
                        ? 'border-blue-600 bg-blue-50/50' 
                        : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div className={`p-2 rounded-xl ${selectedId === vehicle.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                        <Zap size={18} />
                      </div>
                      {selectedId === vehicle.id && (
                        <CheckCircle2 size={20} className="text-blue-600 animate-in zoom-in" />
                      )}
                    </div>
                    <div className="relative z-10">
                      <p className="font-black text-slate-900 text-lg tracking-tight">{vehicle.code}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
                        <Hash size={12} /> 车辆编号: {vehicle.location}
                      </div>
                    </div>
                    {/* Visual decoration */}
                    <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transition-transform duration-700 ${selectedId === vehicle.id ? 'scale-150 rotate-12 opacity-[0.08]' : ''}`}>
                      <Bike size={120} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={() => onConfirm('skip')}
            className="px-6 py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 active:scale-95 transition-all"
          >
            跳过分配直接入职
          </button>
          <button 
            disabled={!selectedId}
            onClick={() => selectedId && onConfirm(selectedId)}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            确认资产绑定并完成入职 <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleAssignmentModal;
