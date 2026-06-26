import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Download, RefreshCw } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useBarber();
  const location = useLocation();

  // PWA Offline states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(
    localStorage.getItem('offline_assets_cached') === 'true'
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownloadOffline = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDownloading || isDownloaded || !isOnline) return;

    setIsDownloading(true);
    const routesToCache = [
      '/',
      '/services',
      '/booking',
      '/contact',
      '/about',
      '/index.html',
      '/pwa-icon.png',
      '/assets/logo.PNG'
    ];

    try {
      if ('caches' in window) {
        const cache = await caches.open('topbarber-cache-v1');
        await Promise.all(
          routesToCache.map(async (route) => {
            try {
              const response = await fetch(route);
              if (response.ok) {
                await cache.put(route, response);
              }
            } catch (err) {
              console.warn(`Gagal mem-cache rute: ${route}`, err);
            }
          })
        );
        localStorage.setItem('offline_assets_cached', 'true');
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error('Gagal mengunduh aset offline:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-white/40 backdrop-blur-xl border border-white/25 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.06)] max-w-7xl mx-auto transition-all duration-300">
      <div className="px-6 sm:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center p-0.5 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors w-10 h-10 overflow-hidden">
              <img src="/assets/logo.PNG" alt="Logo" className="w-full h-full object-cover rounded-full" onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/logo/100/100'; }} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-900">
              TOP<span className="text-primary italic">BARBER</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-semibold py-1.5 px-3 rounded-full transition-all duration-300 ${
                    isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-primary/10 rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}

            {/* Offline/Online Status Capsule (Desktop) */}
            <button
              onClick={handleDownloadOffline}
              disabled={isDownloading || !isOnline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all active:scale-95 cursor-pointer ${
                !isOnline
                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                  : isDownloaded
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-white/80 text-slate-600 border-slate-200/50 hover:bg-slate-50'
              }`}
              title={
                !isOnline
                  ? 'Koneksi terputus (Offline)'
                  : isDownloaded
                  ? 'Aplikasi siap diakses offline'
                  : 'Klik untuk simpan data offline'
              }
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                !isOnline ? 'bg-red-500 animate-pulse' : isDownloaded ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
              {isDownloading ? (
                <RefreshCw size={10} className="animate-spin text-slate-500" />
              ) : !isOnline ? (
                <span>Offline</span>
              ) : isDownloaded ? (
                <span>Siap Offline</span>
              ) : (
                <span className="flex items-center gap-1">
                  <Download size={10} />
                  Simpan Offline
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/'}
                  className="flex items-center gap-2 text-sm text-slate-800 hover:text-primary"
                >
                  <User size={18} />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-red-600 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button and Status */}
          <div className="md:hidden flex items-center gap-3">
            {/* Offline/Online Status Capsule (Mobile) */}
            <button
              onClick={handleDownloadOffline}
              disabled={isDownloading || !isOnline}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold border transition-all active:scale-95 ${
                !isOnline
                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                  : isDownloaded
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-white/80 text-slate-600 border-slate-200/50'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                !isOnline ? 'bg-red-500 animate-pulse' : isDownloaded ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
              {isDownloading ? (
                <RefreshCw size={8} className="animate-spin" />
              ) : !isOnline ? (
                <span>Offline</span>
              ) : isDownloaded ? (
                <span>Ready</span>
              ) : (
                <span>Unduh</span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary p-1"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav (Floating Dropdown) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-18 left-0 right-0 md:hidden bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden p-6"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-base font-semibold rounded-2xl transition-all ${
                      isActive
                        ? 'text-primary bg-primary/10 pl-6 border-l-4 border-primary'
                        : 'text-slate-800 hover:text-primary hover:bg-white/40'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {user && (
                <div className="pt-4 mt-4 border-t border-slate-200/50 space-y-4">
                  <p className="px-4 text-primary text-sm font-bold">Hello, {user.username}</p>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-red-50/30 rounded-2xl transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
