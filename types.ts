
export type UserRole = 'ADMIN' | 'USER';
export type CustomerType = 'CUSTOMER' | 'REQUEST_CUSTOMER';

export interface User {
  id: string;
  fullName: string;
  nickname: string;
  email: string;
  phone: string;
  password?: string; // New field for generated password
  profilePic?: string; // base64 string
  idFrontPic?: string; // base64 string
  idBackPic?: string;  // base64 string
  role: UserRole;
  userType?: CustomerType;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  debt: number;
  gpsLocation?: { lat: number; lng: number };
}

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  cost: number;
  quantity: number;
  image: string;
  video?: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: 'PENDING' | 'SHIPPING' | 'DELIVERED';
  timestamp: number;
  location: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  userId: string;
  type: string; // e.g., 'Vodafone Cash', 'Recharge'
  amount: number;
  profit: number;
  details: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  timestamp: number;
}

export interface FinancialMetric {
  totalProfit: number;
  totalSales: number;
  activeUsers: number;
}
