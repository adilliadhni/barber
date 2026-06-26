import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Barber, Booking, User, FinanceRecord, HaircutModel } from '../types';
import { supabase } from '../utils/supabase';

interface BarberContextType {
  services: Service[];
  barbers: Barber[];
  bookings: Booking[];
  user: User | null;
  finances: FinanceRecord[];
  models: HaircutModel[];
  loading: boolean;
  error: string | null;

  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  addBarber: (barber: Omit<Barber, 'id'>) => Promise<void>;
  updateBarber: (barber: Barber) => Promise<void>;
  deleteBarber: (id: string) => Promise<void>;

  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateBookingStatus: (id: string, status: 'pending' | 'done') => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  login: (username: string, role: 'customer' | 'admin') => void;
  logout: () => void;

  addFinance: (finance: Omit<FinanceRecord, 'id'>) => Promise<void>;
  deleteFinance: (id: string) => Promise<void>;

  addModel: (model: Omit<HaircutModel, 'id'>) => Promise<void>;
  updateModel: (model: HaircutModel) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;

  fetchData: () => Promise<void>;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [models, setModels] = useState<HaircutModel[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        { data: servicesData, error: servicesError },
        { data: barbersData, error: barbersError },
        { data: bookingsData, error: bookingsError },
        { data: financesData, error: financesError },
        { data: modelsData, error: modelsError }
      ] = await Promise.all([
        supabase.from('services').select('*'),
        supabase.from('barbers').select('*'),
        supabase.from('bookings').select('*'),
        supabase.from('finances').select('*'),
        supabase.from('haircut_models').select('*')
      ]);

      if (servicesError) throw servicesError;
      if (barbersError) throw barbersError;
      if (bookingsError) throw bookingsError;
      if (financesError) throw financesError;
      if (modelsError) throw modelsError;

      setServices(servicesData || []);
      setBarbers(barbersData || []);

      const mappedBookings: Booking[] = (bookingsData || []).map((b: any) => {
        const d = new Date(b.booking_date);
        return {
          id: b.id,
          customerName: b.customer_name || 'Customer',
          serviceId: b.service_id,
          barberId: b.barber_id,
          date: d.toISOString().split('T')[0],
          time: d.toTimeString().substring(0, 5),
          status: b.status as any,
          createdAt: b.booking_date
        };
      });
      setBookings(mappedBookings);

      const mappedFinances: FinanceRecord[] = (financesData || []).map((f: any) => ({
        id: f.id,
        amount: f.amount,
        type: f.type,
        description: f.description,
        date: f.created_at ? f.created_at.split('T')[0] : ''
      }));
      setFinances(mappedFinances);

      setModels(modelsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addService = async (newService: Omit<Service, 'id'>) => {
    try {
      // Dihapus manual ID generator karena sudah ditangani database (UUID)
      const { data, error } = await supabase.from('services').insert([newService]).select();
      if (error) throw error;
      if (data) setServices([...services, data[0]]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateService = async (updatedService: Service) => {
    try {
      const { error } = await supabase.from('services').update({
        name: updatedService.name,
        price: updatedService.price,
        duration: updatedService.duration,
        description: updatedService.description,
        category: updatedService.category
      }).eq('id', updatedService.id);
      if (error) throw error;
      setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addBarber = async (newBarber: Omit<Barber, 'id'>) => {
    try {
      const { data, error } = await supabase.from('barbers').insert([newBarber]).select();
      if (error) throw error;
      if (data) setBarbers([...barbers, data[0]]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateBarber = async (updatedBarber: Barber) => {
    try {
      const { error } = await supabase.from('barbers').update({
        name: updatedBarber.name,
        photo: updatedBarber.photo,
        specialization: updatedBarber.specialization,
        rating: updatedBarber.rating
      }).eq('id', updatedBarber.id);
      if (error) throw error;
      setBarbers(barbers.map(b => b.id === updatedBarber.id ? updatedBarber : b));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteBarber = async (id: string) => {
    try {
      const { error } = await supabase.from('barbers').delete().eq('id', id);
      if (error) throw error;
      setBarbers(barbers.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addBooking = async (newBooking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    try {
      const bookingDate = new Date(`${newBooking.date}T${newBooking.time || '00:00'}:00`).toISOString();

      const { data, error } = await supabase.from('bookings').insert([{
        customer_name: newBooking.customerName,
        service_id: newBooking.serviceId,
        barber_id: newBooking.barberId,
        booking_date: bookingDate,
        status: 'pending'
      }]).select('*');

      if (error) throw error;
      if (data && data[0]) {
        const b = data[0];
        const d = new Date(b.booking_date);
        setBookings([...bookings, {
          id: b.id,
          customerName: b.customer_name || newBooking.customerName,
          serviceId: b.service_id,
          barberId: b.barber_id,
          date: d.toISOString().split('T')[0],
          time: d.toTimeString().substring(0, 5),
          status: b.status as any,
          createdAt: b.booking_date
        }]);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: 'pending' | 'done') => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));

      if (status === 'done') {
        const booking = bookings.find(b => b.id === id);
        if (booking) {
          const service = services.find(s => s.id === booking.serviceId);
          if (service) {
            const { data: financeData, error: financeError } = await supabase.from('finances').insert([{
              amount: service.price,
              type: 'income',
              description: `Pendapatan Booking: ${service.name} (${booking.customerName})`,
              created_at: new Date().toISOString()
            }]).select();

            if (!financeError && financeData && financeData[0]) {
              const f = financeData[0];
              setFinances(prev => [...prev, {
                id: f.id,
                amount: f.amount,
                type: f.type as any,
                description: f.description,
                date: f.created_at ? f.created_at.split('T')[0] : ''
              }]);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = (username: string, role: 'customer' | 'admin') => {
    setUser({ id: Math.random().toString(36).substr(2, 9), username, role });
  };

  const logout = () => {
    setUser(null);
  };

  const addFinance = async (newFinance: Omit<FinanceRecord, 'id'>) => {
    try {
      const { data, error } = await supabase.from('finances').insert([{
        amount: newFinance.amount,
        type: newFinance.type,
        description: newFinance.description,
        created_at: new Date(newFinance.date).toISOString()
      }]).select();
      if (error) throw error;
      if (data && data[0]) {
        const f = data[0];
        setFinances([...finances, {
          id: f.id,
          amount: f.amount,
          type: f.type as any,
          description: f.description,
          date: f.created_at ? f.created_at.split('T')[0] : ''
        }]);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteFinance = async (id: string) => {
    try {
      const { error } = await supabase.from('finances').delete().eq('id', id);
      if (error) throw error;
      setFinances(finances.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addModel = async (newModel: Omit<HaircutModel, 'id'>) => {
    try {
      const { data, error } = await supabase.from('haircut_models').insert([newModel]).select();
      if (error) throw error;
      if (data) setModels([...models, data[0]]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateModel = async (updatedModel: HaircutModel) => {
    try {
      const { error } = await supabase.from('haircut_models').update({
        name: updatedModel.name,
        photo: updatedModel.photo
      }).eq('id', updatedModel.id);
      if (error) throw error;
      setModels(models.map(m => m.id === updatedModel.id ? updatedModel : m));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteModel = async (id: string) => {
    try {
      const { error } = await supabase.from('haircut_models').delete().eq('id', id);
      if (error) throw error;
      setModels(models.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <BarberContext.Provider value={{
      services, barbers, bookings, user, finances, models, loading, error, fetchData,
      addService, updateService, deleteService,
      addBarber, updateBarber, deleteBarber,
      addBooking, updateBookingStatus, deleteBooking,
      login, logout,
      addFinance, deleteFinance,
      addModel, updateModel, deleteModel
    }}>
      {children}
    </BarberContext.Provider>
  );
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (context === undefined) {
    throw new Error('useBarber must be used within a BarberProvider');
  }
  return context;
};