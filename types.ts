
export enum RiderStatus {
  ACTIVE = '在职',
  RESIGNED = '离职'
}

export enum StaffRole {
  STAFF = '员工',
  TEAM_LEADER = '组长',
  MANAGER = '部门经理'
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

export interface Device {
  id: string;
  type: '电动车' | '换电电池';
  code: string; // 资产代码
  vin?: string; // 大架号
  brand?: string; // 品牌
  color?: string; // 颜色
  status: '正常' | '维修中' | '低电量' | '异常';
  batteryLevel?: number;
  rider: string; // 绑定骑手姓名
  lastSync: string;
  city: string;
  station: string;
  location: string; // 车辆内部编号
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
  licensePlate?: string; // 对应设备手动编号
  vin?: string; // 新增：车辆大架号
  emergencyContact?: string;
  activityHistory: RiderActivity[];
  recentFeedback: RiderFeedback[];
  idCardImage?: string; 
  contractImage?: string; 
  // 财务结算相关字段
  clientCompany?: string; // 甲方公司 (结算单位)
  settlementAmount?: number; // 约定的返费金额
  settlementStatus?: 'pending' | 'qualified' | 'processing' | 'settled'; // 结算状态
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
  group: string; // 分组情况
  leader: string; // 组长
  contact: string;
  email: string;
  joinDate: string;
  status: '在职' | '请假' | '离职';
  dailyPerformance: number; // 每日出单情况 (平均)
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
  entryResult?: 'passed' | 'failed' | 'pending'; // 入职结论
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
  view: 'dashboard' | 'recruitment' | 'riders' | 'jobs' | 'messages' | 'settings' | 'devices' | 'vehicle-assignment' | 'finance';
  port: AppPort;
}
