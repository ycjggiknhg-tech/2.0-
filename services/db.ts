
import { Applicant, Rider, RiderStatus } from '../types';

const STORAGE_KEY_APPLICANTS = 'riderhub_applicants';
const STORAGE_KEY_RIDERS = 'riderhub_riders';

// 模拟后端数据库操作
export const db = {
  // 获取所有应聘者
  getApplicants: (): Applicant[] => {
    const data = localStorage.getItem(STORAGE_KEY_APPLICANTS);
    return data ? JSON.parse(data) : [];
  },

  // 保存所有应聘者
  saveApplicants: (applicants: Applicant[]) => {
    localStorage.setItem(STORAGE_KEY_APPLICANTS, JSON.stringify(applicants));
  },

  // 更新应聘者结论
  updateEntryResult: (id: string, result: 'passed' | 'failed' | 'pending'): Applicant[] => {
    const applicants = db.getApplicants();
    const updated = applicants.map(app => {
      if (app.id === id) {
        // Fix: Explicitly cast the returned object to Applicant to prevent string widening of the 'status' property
        return {
          ...app,
          entryResult: result,
          status: result === 'passed' ? '已发录用' : result === 'failed' ? '已拒绝' : '待处理'
        } as Applicant;
      }
      return app;
    });
    db.saveApplicants(updated);
    return updated;
  },

  // 办理电动车 (入职) 业务逻辑
  processVehicleBinding: (applicant: Applicant): { riders: Rider[], applicants: Applicant[] } => {
    const riders = JSON.parse(localStorage.getItem(STORAGE_KEY_RIDERS) || '[]');
    
    const newRider: Rider = {
      id: 'R' + applicant.id + Date.now().toString().slice(-4),
      name: applicant.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`,
      status: RiderStatus.ACTIVE,
      rating: 5.0,
      deliveries: 0,
      joinDate: new Date().toISOString().split('T')[0],
      region: applicant.city,
      station: applicant.station,
      contact: applicant.contact,
      email: `${applicant.name}@riderhub.cn`,
      vehicleType: '已分配电动车',
      idCardImage: applicant.idCardImage,
      contractImage: applicant.contractImage,
      activityHistory: [],
      recentFeedback: []
    };

    const updatedRiders = [newRider, ...riders];
    const updatedApplicants = db.getApplicants().filter(a => a.id !== applicant.id);
    
    localStorage.setItem(STORAGE_KEY_RIDERS, JSON.stringify(updatedRiders));
    db.saveApplicants(updatedApplicants);
    
    return { riders: updatedRiders, applicants: updatedApplicants };
  }
};
