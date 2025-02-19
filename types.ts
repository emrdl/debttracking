export interface Debt {
  id: string;
  name: string;
  amount: number;
  type: 'credit-card' | 'loan' | 'bill' | 'other';
  dueDate: string;
  status: 'active' | 'paid';
  createdAt?: string;
}