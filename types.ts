
export enum RiderStatus {
  ACTIVE = '在职',
  RESIGNED = '离职'
}

export enum StaffRole {
  HR = '人力资源',
  STATION_MANAGER = '站长',
  DISPATCHER = '调度员',
  OPERATIONS = '运营专员',
  AREA_MANAGER = '区域经理'
}

export interface RiderActivity {
  date: string;
  deliveries: number;
  earnings: number;
}

export interface RiderFeedback {
  id: string;
  customer: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Rider {
  id: string;
  name: string;
  avatar: string;
  status: RiderStatus;
  rating: number;
  deliveries: number;
  joinDate: string;
  region: string; // City
  station: string; 
  contact: string;
  email: string;
  vehicleType: string;
  licensePlate?: string;
  emergencyContact?: string;
  activityHistory: RiderActivity[];
  recentFeedback: RiderFeedback[];
  idCardImage?: string; 
  contractImage?: string; 
}

export interface Staff {
  id: string;
  name: string;
  avatar: string;
  role: StaffRole;
  employeeId: string;
  city: string;
  station: string;
  contact: string;
  email: string;
  joinDate: string;
  status: '在职' | '请假' | '离职';
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
  status: '待处理' | '面试中' | '背景调查' | '已发录用' | '已拒绝';
  entryResult?: 'passed' | 'failed' | 'pending'; // 新增：入职结论
  appliedDate: string;
  assignmentStatus: string;
  aiScore?: number;
  aiSummary?: string;
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
  view: 'dashboard' | 'recruitment' | 'riders' | 'jobs' | 'messages' | 'settings' | 'devices';
  port: AppPort;
}
