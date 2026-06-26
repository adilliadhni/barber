import React, { useState, useRef } from 'react';
import { useBarber } from '../context/BarberContext';
import { Plus, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HaircutModel } from '../types';

export default function ManageModels() {
  const { models, addModel, updateModel, deleteModel } = useBarber();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<HaircutModel | null>(null);
  const [formData, setFormData] = useState({ name: '', photo: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (model?: HaircutModel) => {
    if (model) {
      setEditingModel(model);
      setFormData({ name: model.name, photo: model.photo });
    } else {
      setEditingModel(null);
      setFormData({ name: '', photo: '' });
    }
    setIsModalOpen(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo) {
      alert("Mohon unggah foto model rambut!");
      return;
    }

    try {
      if (editingModel) {
        await updateModel({ ...formData, id: editingModel.id });
      } else {
        await addModel(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Gagal menyimpan data: " + (err.message || "Pastikan tabel sudah dibuat di Supabase"));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Manage Models</h1>
          <p className="text-slate-500 font-medium">Atur galeri model potongan rambut Anda</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Model
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {models.map((model) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group"
          >
            <div className="aspect-square bg-slate-100 relative">
              <img src={model.photo} alt={model.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/40 lg:bg-slate-900/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                <button
                  onClick={() => openModal(model)}
                  className="w-11 h-11 lg:w-10 lg:h-10 bg-white/20 hover:bg-white text-white hover:text-primary rounded-full flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
                  title="Edit Model"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Yakin ingin menghapus model ini?')) {
                      try {
                        await deleteModel(model.id);
                      } catch (err: any) {
                        alert("Gagal menghapus: " + err.message);
                      }
                    }
                  }}
                  className="w-11 h-11 lg:w-10 lg:h-10 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
                  title="Delete Model"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{model.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 font-serif">
                {editingModel ? 'Edit Model' : 'Add New Model'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Model Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Photo</label>
                  <div 
                    className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.photo ? (
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon className="mx-auto mb-2 text-slate-300" size={32} />
                        <span className="text-sm font-medium">Klik untuk pilih gambar</span>
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

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer text-sm sm:text-base"
                  >
                    {editingModel ? 'Update Model' : 'Save Model'}
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
