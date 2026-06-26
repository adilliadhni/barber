import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function Services() {
  const { services, models } = useBarber();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-slate-900 mb-4 font-serif italic"
          >
            Layanan Kami
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-primary mx-auto rounded-full"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 font-medium mt-6 max-w-2xl mx-auto"
          >
            Pilih layanan yang sesuai dengan kebutuhan Anda. Kami menjamin kepuasan dengan hasil terbaik dari tangan para ahli kami.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-primary/30 transition-all group shadow-xl shadow-slate-200/50"
            >
              <div className="mb-6 p-4 bg-primary/5 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
                <Star className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl text-slate-900 mb-3">{service.name}</h3>
              <p className="text-slate-500 mb-6 text-sm">{service.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <span className="text-primary font-bold text-xl">
                  Rp {service.price.toLocaleString('id-ID')}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                  <Clock size={12} /> {service.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-24 text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl text-slate-900 mb-4 font-serif italic"
          >
            Inspirasi Model Rambut
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-primary mx-auto rounded-full"
          />
          <p className="text-slate-500 font-medium mt-6 max-w-2xl mx-auto">
            Berbagai macam gaya potongan rambut pria yang sedang tren. Tunjukkan pada barber kami untuk hasil yang presisi.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 5) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-md border border-slate-200"
            >
              <img 
                src={model.photo} 
                alt={model.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white font-bold tracking-wide">{model.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
