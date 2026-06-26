import React from 'react';
import { useBarber } from '../context/BarberContext';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { bookings, services, barbers } = useBarber();

  const stats = [
    { name: 'Total Bookings', value: bookings.length, icon: CalendarCheck, trend: '+12%', color: 'text-blue-500' },
    { name: 'Total Customers', value: bookings.reduce((acc, b) => acc.add(b.customerName), new Set()).size, icon: Users, trend: '+5%', color: 'text-purple-500' },
    { name: 'Active Barbers', value: barbers.length, icon: TrendingUp, trend: 'stable', color: 'text-green-500' },
    { name: 'Total Revenue', value: `Rp ${bookings.reduce((acc, b) => acc + (services.find(s => s.id === b.serviceId)?.price || 0), 0).toLocaleString('id-ID')}`, icon: DollarSign, trend: '+18%', color: 'text-gold' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl text-slate-900 mb-2 tracking-tight font-serif">Dashboard Overview</h1>
        <p className="text-slate-500 font-medium">Selamat datang kembali. Berikut adalah performa bisnis hari ini.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 group hover:border-primary/30 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.includes('+') ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.name}</h3>
            <p className="text-2xl text-slate-900 font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl text-slate-900 font-bold tracking-tight">Recent Bookings</h2>
            <button className="text-sm text-primary hover:underline font-bold flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-widest bg-slate-50">
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Service</th>
                  <th className="px-6 py-4 font-bold">Waktu</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic font-medium">No recent bookings</td>
                  </tr>
                ) : (
                  bookings.slice(-5).reverse().map((booking) => {
                    const service = services.find(s => s.id === booking.serviceId);
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-bold">{booking.customerName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600 text-sm font-medium">{service?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                            <Clock size={12} />
                            <span>{booking.time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl text-slate-900 font-bold mb-6 italic font-serif">Popular Services</h2>
            <div className="space-y-4">
              {services.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg uppercase transition-transform group-hover:scale-110">
                    {s.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-bold">{s.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{s.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary font-bold">Rp {s.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
