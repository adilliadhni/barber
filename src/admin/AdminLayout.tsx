import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Users,
  LogOut,
  Home,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { motion } from 'motion/react';

export default function AdminLayout() {
  const { logout, user } = useBarber();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manage Bookings', icon: CalendarCheck, path: '/admin/bookings' },
    { name: 'Manage Services', icon: Scissors, path: '/admin/services' },
    { name: 'Manage Barbers', icon: Users, path: '/admin/barbers' },
    { name: 'Manage Models', icon: Scissors, path: '/admin/models' },
    { name: 'Keuangan', icon: CalendarCheck, path: '/admin/finances' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary flex items-center justify-between px-4 z-50 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-white">
            TOP<span className="text-slate-900 italic">BARBER</span>
          </span>
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-primary flex flex-col fixed h-full max-h-screen overflow-y-auto z-50 shadow-2xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 lg:p-8">
          <Link to="/" className="hidden lg:flex items-center gap-2 mb-12">
            <span className="text-xl font-bold tracking-tighter text-white">
              TOP<span className="text-slate-900 italic">BARBER</span> ADMIN
            </span>
          </Link>

          <nav className="space-y-4 mt-4 lg:mt-0">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${isActive
                    ? 'bg-white text-primary shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 lg:p-8 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white transition-colors"
          >
            <Home size={20} />
            <span className="text-sm font-medium">Back to Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:text-red-100 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>

          <div className="pt-6 border-t border-white/10 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white font-bold truncate">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 pt-24 lg:p-12 lg:pt-12 min-w-0 max-w-full overflow-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
