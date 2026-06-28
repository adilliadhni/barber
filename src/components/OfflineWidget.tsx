import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, Download, Check, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function OfflineWidget() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(
    localStorage.getItem('offline_assets_cached') === 'true'
  );
  const [showStatus, setShowStatus] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const location = useLocation();

  // Monitor network status
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

  // Monitor installation prompt (beforeinstallprompt)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
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
      console.log('App was successfully installed');
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

  // Jangan tampilkan widget di halaman admin agar tidak mengganggu layout dashboard
  const isAdminPath = location.pathname.startsWith('/admin');
  if (isAdminPath) return null;

  // Jika aplikasi dibuka sebagai standalone (aplikasi terinstal) dan jaringan online, sembunyikan widget agar tampilan bersih seperti aplikasi native
  if (isInstalled && isOnline) return null;

  const handleDownloadOffline = async () => {
    setIsDownloading(true);
    
    // Daftar rute dan aset statis utama yang ingin di-cache
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
      // Buka cache storage PWA dan simpan semua rute
      if ('caches' in window) {
        const cache = await caches.open('topbarber-cache-v1');
        
        // Melakukan fetch dan caching
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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm w-full sm:w-[350px] px-4 sm:px-0"
        >
          {/* Glassmorphic Container (Apple-Style) */}
          <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-2.5xl p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl backdrop-blur-md ${
                    isOnline ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">
                      {isOnline ? 'Status Jaringan' : 'Mode Offline Aktif'}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {isOnline ? 'Terhubung dengan Internet' : 'Menampilkan data lokal/cache'}
                    </p>
                  </div>
                </div>
                
                {/* Indikator Status Dot */}
                <span className={`flex h-2.5 w-2.5 relative`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOnline ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                </span>
              </div>

              {/* Aksi/Keterangan Offline & Instal */}
              <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-300 font-medium flex-1">
                    {isInstalled 
                      ? 'Aplikasi terpasang di perangkat Anda.' 
                      : isDownloaded 
                        ? 'Siap diakses offline. Pasang aplikasinya?' 
                        : 'Simpan offline & instal aplikasi.'}
                  </p>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isOnline && (
                      <button
                        onClick={handleDownloadOffline}
                        disabled={isDownloading || isDownloaded}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                          isDownloaded 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20'
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Proses...</span>
                          </>
                        ) : isDownloaded ? (
                          <>
                            <Check size={12} />
                            <span>Tersimpan</span>
                          </>
                        ) : (
                          <>
                            <Download size={12} />
                            <span>Offline</span>
                          </>
                        )}
                      </button>
                    )}

                    {!isInstalled && deferredPrompt && (
                      <button
                        onClick={handleInstallClick}
                        className="px-3 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md cursor-pointer"
                      >
                        <Download size={12} />
                        <span>Instal</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Info iOS Safari */}
                {!isInstalled && isIOS && (
                  <p className="text-[10px] text-slate-300 bg-white/5 p-2 rounded-xl border border-white/5 italic">
                    💡 <strong>Khusus iOS (Safari):</strong> Ketuk tombol <strong>"Bagikan"</strong> (Share) <span className="inline-block text-xs">📤</span> lalu pilih <strong>"Tambah ke Layar Utama"</strong>.
                  </p>
                )}

                {/* Status PWA Terinstal */}
                {isInstalled && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    <Check size={10} />
                    <span>Aplikasi Terpasang (Standalone)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

