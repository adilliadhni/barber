import React from 'react';
import { useBarber } from '../context/BarberContext';
import { Check, Trash2, Clock, User, Scissors } from 'lucide-react';
import { motion } from 'motion/react';

export default function ManageBookings() {
  const { bookings, services, barbers, updateBookingStatus, deleteBooking } = useBarber();

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl text-slate-900 mb-2 tracking-tight font-serif">Manage Bookings</h1>
          <p className="text-slate-500 font-medium">Kelola dan update status janji temu customer.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-widest bg-slate-50">
                <th className="px-6 py-5 font-bold">Customer</th>
                <th className="px-6 py-5 font-bold">Layanan</th>
                <th className="px-6 py-5 font-bold">Barber</th>
                <th className="px-6 py-5 font-bold">Waktu</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic font-medium">Belum ada booking yang masuk.</td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const service = services.find(s => s.id === booking.serviceId);
                  const barber = barbers.find(b => b.id === booking.barberId);
                  return (
                    <motion.tr 
                      layout
                      key={booking.id} 
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {booking.customerName[0].toUpperCase()}
                          </div>
                          <p className="text-slate-900 font-bold">{booking.customerName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Scissors size={14} className="text-primary/50" />
                          <span className="text-sm font-semibold">{service?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <User size={14} className="text-primary/50" />
                          <span className="text-sm font-semibold">{barber?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-slate-900 text-sm font-bold">{booking.date}</p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <Clock size={10} />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'done' 
                            ? 'bg-green-100 text-green-600 border border-green-200' 
                            : 'bg-amber-100 text-amber-600 border border-amber-200'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {booking.status === 'pending' && (
                            <button
                              onClick={async () => {
                                try {
                                  await updateBookingStatus(booking.id, 'done');
                                } catch (err: any) {
                                  alert("Gagal mengupdate: " + err.message);
                                }
                              }}
                              className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100"
                              title="Mark as Done"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (window.confirm('Yakin ingin menghapus booking ini?')) {
                                try {
                                  await deleteBooking(booking.id);
                                } catch (err: any) {
                                  alert("Gagal menghapus: " + err.message);
                                }
                              }
                            }}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                            title="Delete Booking"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
