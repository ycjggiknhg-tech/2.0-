
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MapPin, DollarSign, Briefcase, X } from 'lucide-react';
import { JobPost } from '../types';

interface JobManagementProps {
  jobs: JobPost[];
  onAdd: (job: JobPost) => void;
  onDelete: (id: string) => void;
  onAction: (msg: string) => void;
}

const JobManagement: React.FC<JobManagementProps> = ({ jobs, onAdd, onDelete, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState<Partial<JobPost>>({
    title: '',
    salary: '',
    location: '',
    description: '',
    skills: [],
    benefits: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job: JobPost = {
      ...newJob as JobPost,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      skills: (newJob.skills as any).toString().split(',').map((s: string) => s.trim()),
      benefits: (newJob.benefits as any).toString().split(',').map((b: string) => b.trim()),
    };
    onAdd(job);
    setIsModalOpen(false);
    setNewJob({ title: '', salary: '', location: '', description: '', skills: [], benefits: [] });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900">人资团队</h1>
          <p className="text-slate-500">创建并管理您的骑手车队招聘需求与团队架构。</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          新建团队计划
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jobs.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-slate-900 font-bold text-lg">暂无团队需求</h3>
            <p className="text-slate-500">点击上方按钮发布您的第一个人资团队计划。</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">活跃中</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
                  <div className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salary}</div>
                  <div className="flex items-center gap-1.5"><Briefcase size={16} /> 发布于 {job.createdAt}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onAction('团队需求编辑界面开发中')} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(job.id)}
                  className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">发布新需求</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 active:scale-90"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">团队需求名称</label>
                <input required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：资深配送骑手 (电动车)" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">薪资水平</label>
                  <input required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：6000 - 8000/月" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">工作地点</label>
                  <input required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：上海市 浦东新区" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">技能要求 (逗号分隔)</label>
                <input className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：熟练使用地图, 沟通能力强" value={newJob.skills as any} onChange={e => setNewJob({...newJob, skills: e.target.value as any})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">详细描述</label>
                <textarea className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="请描述团队职责和具体要求..." value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">立即发布</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
