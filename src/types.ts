export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  category: string;
}

export interface Barber {
  id: string;
  name: string;
  photo: string;
  specialization: string;
  rating: number;
}

export interface Booking {
  id: string;
  customerName: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  status: 'pending' | 'done';
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  role: 'customer' | 'admin';
}

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  description: string;
}

export interface HaircutModel {
  id: string;
  name: string;
  photo: string;
}
