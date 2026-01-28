
export enum RiderStatus {
  ACTIVE = '在职',
  RESIGNED = '离职'
}

export enum StaffRole {
  STAFF = '员工',
  TEAM_LEADER = '组长',
  MANAGER = '部门经理'
}

export interface Station {
  id: string;
  name: string;
  city: string;
}

export interface RiderActivity {
  date: string;
  earnings: number;
}

export interface RiderFeedback {
  id: string;
  customer: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Device {
  id: string;
  type: '电动车' | '换电电池';
  code: string; 
  vin?: string; 
  brand?: string; 
  color?: string; 
  status: '正常' | '维修中' | '低电量' | '异常';
  batteryLevel?: number;
  rider: string; 
  lastSync: string;
  city: string;
  station: string;
  location: string; 
}

export interface Rider {
  id: string;
  name: string;
  avatar: string;
  status: RiderStatus;
  rating: number;
  joinDate: string;
  resignDate?: string;
  region: string; 
  station: string; 
  contact: string;
  email: string;
  vehicleType: string;
  licensePlate?: string; 
  vin?: string; 
  emergencyContact?: string;
  activityHistory: RiderActivity[];
  recentFeedback: RiderFeedback[];
  idCardImage?: string; 
  contractImage?: string; 
  clientCompany?: string; 
  settlementAmount?: number; 
  settlementStatus?: 'pending' | 'qualified' | 'processing' | 'settled'; 
}

export interface Staff {
  id: string;
  name: string;
  avatar: string;
  gender: '男' | '女';
  age: number;
  role: StaffRole;
  employeeId: string;
  city: string;
  station: string;
  group: string; 
  leader: string; 
  contact: string;
  email: string;
  joinDate: string;
  status: '在职' | '请假' | '离职';
  dailyPerformance: number; 
}

export interface Applicant {
  id: string;
  name: string;
  idNumber: string;
  contact: string;
  age: number;
  city: string;
  station: string;
  experience: string;
  status: '待处理' | '面试中' | '待定' | '面试通过' | '已入职' | '已拒绝';
  entryResult?: 'passed' | 'failed' | 'pending' | 'station_assigned'; 
  appliedDate: string;
  assignmentStatus: '待分配' | '已分配' | '跳过';
  idCardImage?: string; 
  contractImage?: string; 
}

export interface JobPost {
  id: string;
  title: string;
  salary: string;
  location: string;
  skills: string[];
  benefits: string[];
  description: string;
  createdAt: string;
}

export type AppPort = 'admin' | 'applicant-portal';

export interface NavigationState {
  view: 'dashboard' | 'recruitment' | 'riders' | 'jobs' | 'messages' | 'settings' | 'devices' | 'vehicle-assignment' | 'finance' | 'ai-consultant';
  port: AppPort;
}
