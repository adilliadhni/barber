import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useBarber } from '../context/BarberContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  // Security States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { login } = useBarber();
  const navigate = useNavigate();

  // Load lockout state on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem('login_attempts');
    const savedLockout = localStorage.getItem('login_lockout_until');
    
    if (savedAttempts) {
      setFailedAttempts(parseInt(savedAttempts, 10));
    }
    
    if (savedLockout) {
      const lockoutUntil = parseInt(savedLockout, 10);
      if (lockoutUntil > Date.now()) {
        setLockoutTime(lockoutUntil);
      } else {
        localStorage.removeItem('login_lockout_until');
        localStorage.removeItem('login_attempts');
        setFailedAttempts(0);
      }
    }
  }, []);

  // Countdown timer untuk durasi lockout
  useEffect(() => {
    if (lockoutTime === null) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.round((lockoutTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setLockoutTime(null);
        setFailedAttempts(0);
        localStorage.removeItem('login_lockout_until');
        localStorage.removeItem('login_attempts');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  // Hashing aman client-side dengan Web Crypto API (SHA-256)
  const hashSHA256 = async (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cek jika sedang dikunci
    if (lockoutTime && Date.now() < lockoutTime) {
      alert(`Login terkunci. Silakan coba lagi dalam ${timeLeft} detik.`);
      return;
    }

    // Sanitasi input dan batasi panjang karakter
    const cleanUsername = username.trim().substring(0, 50);
    const cleanPassword = password.trim().substring(0, 50);

    if (!cleanUsername || !cleanPassword) {
      alert('Harap isi username dan password dengan benar!');
      return;
    }

    // Hash input
    const usernameHash = await hashSHA256(cleanUsername);
    const passwordHash = await hashSHA256(cleanPassword);

    // Hash referensi (SHA-256 dari 'admin' dan 'admin123')
    const targetUsernameHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
    const targetPasswordHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

    if (usernameHash === targetUsernameHash && passwordHash === targetPasswordHash) {
      // Reset pelacak jika sukses
      setFailedAttempts(0);
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_lockout_until');
      
      login('admin', 'admin');
      navigate('/admin');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());

      if (newAttempts >= 5) {
        const lockoutUntil = Date.now() + 300000; // Kunci selama 5 menit (300.000 ms)
        setLockoutTime(lockoutUntil);
        localStorage.setItem('login_lockout_until', lockoutUntil.toString());
        alert('Terlalu banyak percobaan gagal! Form login dikunci selama 5 menit.');
      } else {
        alert(`Username atau password salah! Sisa percobaan: ${5 - newAttempts}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Background gradients for premium dark UI */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-950/80 backdrop-blur-2xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-white font-serif tracking-wide mb-2">Admin Sign In</h1>
            <p className="text-slate-400 text-sm">Gunakan kredensial yang aman untuk mengakses portal administrasi.</p>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-primary focus:bg-slate-900/60 focus:border-primary/50 transition-all font-semibold"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={lockoutTime !== null}
                  maxLength={50}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-primary focus:bg-slate-900/60 focus:border-primary/50 transition-all font-semibold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={lockoutTime !== null}
                  maxLength={50}
                />
              </div>
            </div>

            {lockoutTime !== null && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-center"
              >
                <p className="text-red-400 text-xs font-semibold">
                  Keamanan diaktifkan: Terlalu banyak kegagalan.<br />
                  Tutup untuk login kembali dalam <span className="font-bold text-white text-sm">{timeLeft}s</span>
                </p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={lockoutTime !== null}
              className={`group w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 active:scale-95 cursor-pointer ${
                lockoutTime !== null ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Masuk Portal
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}


