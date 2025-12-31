
import React, { useState } from 'react';
import { Search, Filter, Battery, MapPin, Shield, Zap, AlertTriangle, MoreHorizontal, Plus } from 'lucide-react';

interface Device {
  id: string;
  type: '电动车' | '换电电池';
  code: string;
  status: '正常' | '维修中' | '低电量' | '异常';
  batteryLevel?: number;
  rider: string;
  lastSync: string;
  location: string;
}

const INITIAL_DEVICES: Device[] = [
  { id: 'd1', type: '电动车', code: 'EV-A9021', status: '正常', rider: '张伟', lastSync: '2分钟前', location: '朝阳区三里屯' },
  { id: 'd2', type: '换电电池', code: 'BAT-X002', status: '低电量', batteryLevel: 15, rider: '李娜', lastSync: '10秒前', location: '静安区南京西路' },
  { id: 'd3', type: '电动车', code: 'EV-B4412', status: '维修中', rider: '未分配', lastSync: '1天前', location: '海淀区维修站' },
  { id: 'd4', type: '换电电池', code: 'BAT-Y881', status: '异常', batteryLevel: 0, rider: '赵敏', lastSync: '5小时前', location: '深圳南山区' },
];

interface DeviceManagementProps {
  onAction: (msg: string) => void;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ onAction }) => {
  const [devices] = useState<Device[]>(INITIAL_DEVICES);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900">资产与设备管理</h1>
          <p className="text-slate-500">实时监控车辆轨迹、电池电量及硬件健康状况。</p>
        </div>
        <button 
          onClick={() => onAction('新增设备功能开发中')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          入库新设备
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">在线设备</p>
          <p className="text-2xl font-black text-slate-900">1,102 <span className="text-xs text-green-500 font-bold ml-1">活跃</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">待充电/换电</p>
          <p className="text-2xl font-black text-slate-900">45 <span className="text-xs text-orange-500 font-bold ml-1">需关注</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">硬件报修</p>
          <p className="text-2xl font-black text-slate-900">12 <span className="text-xs text-red-500 font-bold ml-1">处理中</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">资产总值</p>
          <p className="text-2xl font-black text-slate-900">¥420.5W</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="搜索设备编号、骑手姓名或地点..." className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl hover:bg-white text-slate-600 bg-white text-sm font-bold shadow-sm">
            <Filter size={18} /> 筛选
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-8 py-5">设备类型 / 编号</th>
                <th className="px-8 py-5">状态</th>
                <th className="px-8 py-5">电量 / 健康</th>
                <th className="px-8 py-5">使用者</th>
                <th className="px-8 py-5">最后位置</th>
                <th className="px-8 py-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${device.type === '电动车' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {device.type === '电动车' ? <Zap size={20} /> : <Battery size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{device.code}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{device.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase border ${
                      device.status === '正常' ? 'bg-green-50 text-green-600 border-green-100' :
                      device.status === '低电量' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      device.status === '异常' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {device.batteryLevel !== undefined ? (
                      <div className="flex flex-col gap-1 w-24">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span>{device.batteryLevel}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${device.batteryLevel < 20 ? 'bg-orange-500' : 'bg-green-500'}`} 
                            style={{ width: `${device.batteryLevel}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                        <Shield size={14} /> 健康
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-800">{device.rider}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{device.lastSync}同步</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {device.location}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => onAction('远程锁车/指令发送中')} className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceManagement;
