import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';
import { Plus, Trash2, X, User, Star, Camera, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Barber } from '../types';

export default function ManageBarbers() {
  const { barbers, addBarber, updateBarber, deleteBarber } = useBarber();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    specialization: '',
    rating: '5.0'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (barber?: Barber) => {
    if (barber) {
      setEditingBarber(barber);
      setFormData({
        name: barber.name,
        photo: barber.photo,
        specialization: barber.specialization,
        rating: barber.rating.toString()
      });
    } else {
      setEditingBarber(null);
      setFormData({ name: '', photo: '', specialization: '', rating: '5.0' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBarber) {
        await updateBarber({
          ...formData,
          id: editingBarber.id,
          rating: parseFloat(formData.rating) || 5.0,
          photo: formData.photo
        });
      } else {
        await addBarber({
          ...formData,
          rating: parseFloat(formData.rating) || 5.0,
          photo: formData.photo
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Gagal menyimpan data: " + (err.message || "Pastikan tabel sudah dibuat di Supabase"));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="text-3xl md:text-4xl text-slate-900 mb-2 tracking-tight font-serif">Manage Barbers</h1>
          <p className="text-slate-500 font-medium">Tim Barber profesional Anda.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
        >
          <Plus size={20} /> Add Barber
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {barbers.map((barber) => (
          <motion.div
            layout
            key={barber.id}
            className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-primary/30 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={barber.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.name)}&background=random&color=fff&size=400`} 
                alt={barber.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>

            <div className="absolute top-4 right-4 translate-y-0 lg:translate-y-2 opacity-100 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all flex flex-col gap-2 z-10">
              <button
                onClick={() => openModal(barber)}
                className="p-3 bg-white text-primary rounded-full shadow-2xl hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                title="Edit Barber"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Yakin ingin menghapus barber ini?')) {
                    try {
                      await deleteBarber(barber.id);
                    } catch (err: any) {
                      alert("Gagal menghapus: " + err.message);
                    }
                  }
                }}
                className="p-3 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                title="Delete Barber"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl text-white font-bold">{barber.name}</h3>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{barber.specialization}</p>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20">
                  <Star size={12} className="text-yellow-400" fill="currentColor" />
                  <span className="text-white text-xs font-bold">{barber.rating}</span>
                </div>
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
              className="relative bg-white border border-slate-100 w-full max-w-lg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl text-slate-900 font-bold font-serif tracking-tight">
                  {editingBarber ? 'Edit Barber' : 'Add New Barber'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary transition-all font-bold"
                      placeholder="e.g. Michael Jordan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Specialization</label>
                  <div className="relative">
                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary transition-all font-bold"
                      placeholder="e.g. Master Clipper"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:ring-2 focus:ring-primary transition-all font-bold"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Photo (Gallery)</label>
                    <div 
                      className="w-full h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {formData.photo ? (
                        <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Camera size={20} />
                          <span className="text-sm font-medium">Pilih Foto</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    {editingBarber ? 'Update Barber' : 'Register Barber'}
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
