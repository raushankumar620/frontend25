export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  tags: string[];
  status: 'active' | 'opted_out' | 'blocked';
  customAttributes: Record<string, string | number | boolean>;
  source: string;
  totalOrders?: number;
  totalSpent?: number;
  lastActive: string;
  createdAt: string;
}
