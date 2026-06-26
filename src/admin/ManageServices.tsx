import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';
import { Plus, Trash2, Edit2, X, Scissors, DollarSign, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Service } from '../types';

export default function ManageServices() {
  const { services, addService, updateService, deleteService } = useBarber();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    category: 'Haircut'
  });

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        price: service.price.toString(),
        duration: service.duration,
        description: service.description,
        category: service.category
      });
    } else {
      setEditingService(null);
      setFormData({ name: '', price: '', duration: '', description: '', category: 'Haircut' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      price: parseInt(formData.price) || 0,
    };

    try {
      if (editingService) {
        await updateService({ ...serviceData, id: editingService.id });
      } else {
        await addService(serviceData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Gagal menyimpan data: " + (err.message || "Pastikan tabel sudah dibuat di Supabase"));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl text-slate-900 mb-2 tracking-tight font-serif">Manage Services</h1>
          <p className="text-slate-500 font-medium">Tambah atau edit daftar layanan barbershop.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Add Service
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <motion.div
            layout
            key={service.id}
            className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col group hover:border-primary/30 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-primary">
                <Scissors size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(service)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={async () => {
                    if (window.confirm('Yakin ingin menghapus layanan ini?')) {
                      try {
                        await deleteService(service.id);
                      } catch (err: any) {
                        alert("Gagal menghapus: " + err.message);
                      }
                    }
                  }}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg text-slate-900 font-bold mb-1">{service.name}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">{service.category}</p>
            <p className="text-slate-600 text-sm mb-6 line-clamp-2">{service.description}</p>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-primary font-bold">
                <span className="text-xs">Rp</span>
                <span className="text-lg">{service.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tight">
                <Clock size={12} />
                <span>{service.duration}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white border border-slate-100 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl text-slate-900 font-bold font-serif">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Service Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Price (IDR)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Duration (e.g. 45 min)</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none font-medium"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-primary text-white px-6 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
