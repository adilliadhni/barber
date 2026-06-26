import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBarber } from '../context/BarberContext';
import { CheckCircle, Calendar, User, Scissors, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Booking() {
  const { services, barbers, addBooking } = useBarber();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedBarber = barbers.find(b => b.id === formData.barberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.serviceId || !formData.barberId || !formData.date || !formData.time) {
      alert('Mohon lengkapi semua data');
      return;
    }

    addBooking(formData);
    setIsSuccess(true);

    const phoneNumber = "6282227021166";
    const message = `Halo, saya ingin konfirmasi pemesanan:\n\nNama: ${formData.customerName}\nLayanan: ${selectedService?.name || '-'}\nBarber: ${selectedBarber?.name || '-'}\nTanggal: ${formData.date}\nWaktu: ${formData.time}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-slate-900 mb-4">Book Your Appointment</h1>
          <p className="text-slate-500 font-medium">Pilih layanan dan waktu yang sesuai untuk Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                      placeholder="Masukkan nama Anda"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Pilih Layanan</label>
                    <div className="relative">
                      <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                      <select
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 appearance-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                        value={formData.serviceId}
                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      >
                        <option value="">Pilih Layanan</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - Rp {s.price.toLocaleString('id-ID')}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Pilih Barber</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                      <select
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 appearance-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                        value={formData.barberId}
                        onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                      >
                        <option value="">Pilih Barber</option>
                        {barbers.map(b => (
                          <option key={b.id} value={b.id}>{b.name} ({b.specialization})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Pilih Tanggal</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Pilih Jam</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                      <input
                        type="time"
                        required
                        min="09:00"
                        max="21:00"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 mt-4"
                >
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 sticky top-32 shadow-xl shadow-slate-200/30">
              <h3 className="text-xl text-slate-900 font-bold mb-6 italic font-serif">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <span className="text-slate-500 text-xs font-bold uppercase">Layanan</span>
                  <div className="text-right">
                    <p className="text-slate-900 font-bold">{selectedService?.name || '-'}</p>
                    <p className="text-primary text-sm font-medium">Rp {selectedService?.price.toLocaleString('id-ID') || '0'}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-500 text-xs font-bold uppercase">Barber</span>
                  <span className="text-slate-900 font-bold">{selectedBarber?.name || '-'}</span >
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-500 text-xs font-bold uppercase">Waktu</span>
                  <div className="text-right">
                    <p className="text-slate-900 font-bold">{formData.date || '-'}</p>
                    <p className="text-slate-400 text-xs font-medium">{formData.time || '-'}</p>
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-900 font-bold">Total</span>
                  <span className="text-2xl text-primary font-bold">Rp {selectedService?.price.toLocaleString('id-ID') || '0'}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  *Silakan datang 10 menit sebelum waktu temu Anda. Pembayaran dilakukan di tempat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-primary/20 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-primary w-10 h-10" />
              </div>
              <h2 className="text-3xl text-slate-900 mb-4 font-serif">Booking Berhasil!</h2>
              <p className="text-slate-600 mb-8">
                Terima kasih {formData.customerName}, janji temu Anda telah dicatat. Kami menantikan kedatangan Anda.
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl text-sm text-primary font-bold">
                Kembali ke halaman utama...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
