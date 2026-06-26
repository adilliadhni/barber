import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FinanceRecord } from '../types';

export default function ManageFinances() {
  const { finances, addFinance, deleteFinance } = useBarber();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const totalIncome = finances.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netIncome = totalIncome - totalExpense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    
    try {
      await addFinance({
        type: formData.type,
        amount: parseInt(formData.amount),
        date: formData.date,
        description: formData.description
      });
      
      setIsModalOpen(false);
      setFormData({ ...formData, amount: '', description: '' });
    } catch (err: any) {
      alert("Gagal mencatat transaksi: " + (err.message || "Pastikan tabel sudah dibuat di Supabase"));
    }
  };

  const exportToExcel = () => {
    const header = ["Tanggal", "Deskripsi", "Tipe", "Jumlah"];
    const rows = finances.map(f => [
      f.date,
      `"${f.description}"`, // Handle commas in description
      f.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      f.amount.toString()
    ]);
    
    const csvContent = [header.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Laporan_Keuangan_BarberTop.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Keuangan</h1>
          <p className="text-slate-500 font-medium">Pencatatan pemasukan dan pengeluaran</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={exportToExcel}
            className="flex-1 sm:flex-none justify-center bg-green-600 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 text-xs sm:text-sm cursor-pointer"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex-1 sm:flex-none justify-center bg-red-600 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 text-xs sm:text-sm cursor-pointer"
          >
            Export PDF
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto justify-center bg-primary text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 text-xs sm:text-sm cursor-pointer"
          >
            <Plus size={20} />
            Catat Transaksi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Total Pemasukan</p>
            <p className="text-2xl font-bold text-slate-900">Rp {totalIncome.toLocaleString('id-ID')}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-slate-900">Rp {totalExpense.toLocaleString('id-ID')}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Saldo Bersih</p>
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Rp {netIncome.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Table View (Layar Komputer) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Riwayat Transaksi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-bold uppercase">Tanggal</th>
                <th className="p-4 font-bold uppercase">Deskripsi</th>
                <th className="p-4 font-bold uppercase">Tipe</th>
                <th className="p-4 font-bold uppercase">Jumlah</th>
                <th className="p-4 font-bold uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {finances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada catatan transaksi.</td>
                </tr>
              ) : (
                finances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{record.date}</td>
                    <td className="p-4 text-slate-600">{record.description}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {record.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.type === 'income' ? '+' : '-'} Rp {record.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={async () => {
                          if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
                            try {
                              await deleteFinance(record.id);
                            } catch (err: any) {
                              alert("Gagal menghapus: " + err.message);
                            }
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List (Tampilan HP) */}
      <div className="md:hidden space-y-4">
        <h2 className="text-lg font-bold text-slate-900 px-1">Riwayat Transaksi</h2>
        {finances.length === 0 ? (
          <div className="bg-white p-8 text-center text-slate-400 italic rounded-2xl border border-slate-200">
            Belum ada catatan transaksi.
          </div>
        ) : (
          finances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
            <div 
              key={record.id} 
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">{record.date}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  record.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {record.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deskripsi</p>
                <p className="text-slate-700 text-sm font-semibold">{record.description}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Jumlah</p>
                  <p className={`text-base font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.type === 'income' ? '+' : '-'} Rp {record.amount.toLocaleString('id-ID')}
                  </p>
                </div>
                
                <button
                  onClick={async () => {
                    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
                      try {
                        await deleteFinance(record.id);
                      } catch (err: any) {
                        alert("Gagal menghapus: " + err.message);
                      }
                    }
                  }}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                  title="Hapus Transaksi"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
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
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-6">Catat Transaksi</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Tipe Transaksi</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Pemasukan
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Pengeluaran
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Tanggal</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Jumlah (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Contoh: 50000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Deskripsi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Beli peralat cukur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 text-white py-3 rounded-xl font-bold transition-colors shadow-lg ${formData.type === 'income' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}
                  >
                    Simpan
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
