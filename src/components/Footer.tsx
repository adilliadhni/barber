import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Instagram } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  const handleCopyrightClick = () => {
    const now = Date.now();
    // Jika rentang klik kurang dari 3 detik, tambahkan hitungan
    if (now - lastClick < 3000) {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      if (newClicks >= 5) {
        setClicks(0);
        navigate('/admin-secure-portal');
      }
    } else {
      setClicks(1);
    }
    setLastClick(now);
  };

  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <footer id="contact" className="bg-slate-900 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-bold tracking-tighter text-white">
                TOP<span className="text-primary-light italic">BARBER</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Menyediakan layanan potong rambut dan perawatan pria terbaik di kota Anda.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/top_barbershop2?igsh=MXU0a3o0ZjQ5bzg0dA==" className="p-2 border border-white/10 rounded-lg text-slate-400 hover:text-primary-light hover:border-primary-light transition-all"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg text-white font-bold mb-6">Buka Setiap</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex justify-between"><span>Senin - Minggu:</span> <span>10:00 - 21:00</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg text-white font-bold mb-6">Location</h4>
            <ul className="space-y-6 text-slate-400 text-sm">
              <li className="flex gap-3">
                <MapPin className="text-primary-light shrink-0" size={18} />
                <span>Jl. Mangunjaya Kios No.3, Mangunjaya,Purwokerto Timur,Banyumas</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-primary-light shrink-0" size={18} />
                <span>0822-2702-1166</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center">
          <p 
            onClick={handleCopyrightClick}
            className="text-slate-500 text-xs cursor-default select-none active:text-slate-400 transition-colors"
          >
            &copy; {new Date().getFullYear()} Top Barber Modern Barbershop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

