
import React, { useState } from 'react';
import { User, Shield, Bell, Building, CheckCircle2, Globe, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: '个人账户', icon: User },
    { id: 'team', label: '团队设置', icon: Building },
    { id: 'notif', label: '通知偏好', icon: Bell },
    { id: 'security', label: '安全中心', icon: Shield },
  ];

  return (
    <div className="p-8">
      <div className="text-left mb-8">
        <h1 className="text-2xl font-bold text-slate-900">系统设置</h1>
        <p className="text-slate-500">管理您的个人资料、团队权限及安全策略。</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-slate-100 bg-slate-50/50 p-6 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-10 text-left">
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-6">
                <img src="https://picsum.photos/seed/admin/100/100" className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 shadow-md" alt="Avatar" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">运营主管</h3>
                  <p className="text-sm text-slate-400">admin@riderhub.cn</p>
                  <button className="mt-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">更换头像</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">中文姓名</label>
                  <input type="text" defaultValue="王大锤" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">联系电话</label>
                  <input type="text" defaultValue="138-8888-8888" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">默认语言</label>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100 flex items-center gap-2">
                    <Globe size={14} /> 简体中文
                  </button>
                  <button className="px-4 py-2 bg-white text-slate-400 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-50">
                    English (US)
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all active:scale-95">
                  <Save size={18} /> 保存更改
                </button>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-900">企业/组织信息</h3>
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-800">上海极速物流有限公司</p>
                    <p className="text-xs text-slate-400">企业代码：91310000MA1GXXXXXX</p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">已认证</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 pt-4">席位管理</h3>
              <div className="space-y-3">
                {[
                  { name: '李经理', role: '区域主管', email: 'li@riderhub.cn' },
                  { name: '张会计', role: '财务核算', email: 'zhang@riderhub.cn' }
                ].map((member, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">{member.name[0]}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{member.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{member.role}</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-slate-400 hover:text-red-500">移除</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notif' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-900">推送规则</h3>
              <div className="space-y-4">
                {[
                  { label: '新骑手入职申请', desc: '当有新的骑手通过二维码提交资料时通知我', checked: true },
                  { label: '设备电量预警', desc: '当车辆电量低于 20% 时向站长发送推送', checked: true },
                  { label: '周度运营报表', desc: '每周一早晨 8:00 发送上周运力分析至邮箱', checked: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${item.checked ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.checked ? 'right-1' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-900">账号安全</h3>
              <div className="p-6 border border-slate-100 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">双因素身份验证 (2FA)</p>
                      <p className="text-xs text-slate-500">已开启，保护您的账号不受非法登录。</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600">管理</button>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">修改登录密码</p>
                    <p className="text-xs text-slate-500">建议每 90 天更新一次强密码。</p>
                  </div>
                  <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50">重置密码</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
