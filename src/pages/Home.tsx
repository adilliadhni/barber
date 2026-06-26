import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock, MapPin, Phone, Instagram, Facebook, Twitter, Check } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { barbers } = useBarber();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero.jpg"
            alt="Barbershop Atmosphere"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl mb-6 flex flex-col">
              <span className="text-slate-900">LEVEL UP YOUR</span>
              <span className="text-gradient-blue text-primary">CONFIDENCE</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Pengalaman potong rambut kelas dunia dengan sentuhan modern
              dan detail yang presisi. Barberia adalah rumah bagi gaya pria sejati.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="bg-primary text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                Book Now
              </Link>
              <Link
                to="/services"
                className="bg-slate-100 border border-slate-200 text-slate-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-slate-200 transition-all"
              >
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-full barber-pole opacity-20 hidden lg:block" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>



      {/* Operational Hours Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl text-slate-900 mb-8 font-bold">Jam Operasional</h2>
          <div className="flex justify-center">
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 max-w-sm w-full">
              <Clock className="mx-auto text-primary mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">Senin - Minggu</h3>
              <p className="text-slate-600 font-medium text-lg">10:00 - 21:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Barbers Section */}
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-slate-900 mb-4">The Masters</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
            <p className="text-slate-600 mt-6 max-w-xl mx-auto">
              Bertemu dengan profesional kami yang berdedikasi untuk memberikan tampilan terbaik Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {barbers.map((barber, index) => (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border-2 border-transparent group-hover:border-primary transition-all shadow-xl">
                  <img
                    src={barber.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.name)}&background=random&color=fff&size=400`}
                    alt={barber.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl text-white mb-1 font-serif italic">{barber.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-light text-sm font-bold uppercase tracking-widest">{barber.specialization}</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold text-white">{barber.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
