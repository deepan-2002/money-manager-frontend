export interface Abstract {
  id: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  is_active: boolean;
  is_deleted: boolean;
}

export type Role = 'admin' | 'requestor';

export interface User extends Abstract {
  email: string;
  name?: string;
  username: string;
  role: Role;
}

export interface LoginDto {
  identifier: string;
  password: string;
  fcmToken?: string | null;
  platform?: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  name: string;
  role: Role | string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category?: Category;
  category_id?: number;
}

export type TicketStatus = 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected';

export interface TicketTimelineItem {
  id: number;
  to_status: TicketStatus;
  message?: string;
  created_at: string;
}

export interface RequestItem extends Abstract {
  ticket_no: string;
  ticket_status: TicketStatus;
  subcategory_id: number;
  subcategory?: Subcategory;
  location: string;
  description: string;
  photo_url?: string;
  photo_path?: string;
  creator?: User;
  created_by_name?: string;
  statusTimeline?: TicketTimelineItem[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export interface DashboardReport {
  identifier: string;
  title: string;
  value: number;
  icon?: string;
  metadata?: { route?: string; params?: Record<string, string | number | undefined> };
}

export interface InvoiceItem {
  name: string;
  cost: number;
}

export interface Invoice {
  invoice_no: string;
  total_amount: number;
  items?: InvoiceItem[];
}
