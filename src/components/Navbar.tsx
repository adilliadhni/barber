import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Download, RefreshCw, Check } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useBarber();
  const location = useLocation();

  // PWA Installation & Device states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Monitor installation prompt (beforeinstallprompt)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Monitor when app is successfully installed
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Check display-mode standalone and device model
  useEffect(() => {
    const checkInstallState = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstallState();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isIOS) {
      alert("💡 Khusus iOS (Safari):\nKetuk tombol 'Bagikan' (Share) 📤 di browser Anda, lalu pilih 'Tambah ke Layar Utama' (Add to Home Screen) untuk memasang aplikasi ini.");
      return;
    }
    if (!deferredPrompt) {
      alert("Browser Anda belum mendeteksi kesiapan instalasi, atau aplikasi sudah terpasang.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
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

            {/* PWA Install Button (Desktop) */}
            {!isInstalled && (deferredPrompt || isIOS) && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all active:scale-95 cursor-pointer bg-primary text-white border-primary/20 hover:bg-primary-dark shadow-sm"
                title="Pasang Aplikasi di Desktop / HP"
              >
                <Download size={10} />
                <span>Instal Aplikasi</span>
              </button>
            )}
            {isInstalled && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <Check size={10} />
                <span>Aplikasi Terpasang</span>
              </div>
            )}

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
            {/* PWA Install Button (Mobile) */}
            {!isInstalled && (deferredPrompt || isIOS) && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-bold border transition-all active:scale-95 bg-primary text-white border-primary/20 hover:bg-primary-dark"
              >
                <Download size={8} />
                <span>Instal</span>
              </button>
            )}
            {isInstalled && (
              <div className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <Check size={8} />
                <span>Terpasang</span>
              </div>
            )}

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
