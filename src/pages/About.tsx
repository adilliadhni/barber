import React from 'react';
import { motion } from 'motion/react';
import { Award, Scissors, Users, Star } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-slate-900 mb-4 font-serif italic"
          >
            Tentang Kami
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-primary mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img
                src="/assets/about.jpeg"
                alt="Top Barber Master"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="text-primary" size={32} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">2+</p>
                  <p className="text-slate-500 font-medium">Tahun Pengalaman</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Mengenal Lebih Dekat <br />
              <span className="text-primary italic font-serif">Sang Master Barber</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Selamat datang di Top Barbershop. Kami percaya bahwa potongan rambut bukan sekadar rutinitas, melainkan sebuah seni yang merefleksikan karakter dan kepercayaan diri seorang pria sejati.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Didirikan oleh Top Barber yang telah mendedikasikan lebih dari satu dekade hidupnya dalam dunia grooming pria. Perjalanan panjang dari barbershop klasik hingga menguasai teknik modern menjadikan setiap sentuhan guntingan sebagai mahakarya.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              "Bagi saya, setiap kepala adalah kanvas baru. Kebahagiaan terbesar adalah melihat senyum puas klien saat melihat cermin."
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div className="flex flex-col gap-2">
                <Scissors className="text-primary" size={28} />
                <h4 className="font-bold text-slate-900">Teknik Presisi</h4>
                <p className="text-sm text-slate-500">Detail dalam setiap potongan</p>
              </div>
              <div className="flex flex-col gap-2">
                <Users className="text-primary" size={28} />
                <h4 className="font-bold text-slate-900">Pelayanan Ramah</h4>
                <p className="text-sm text-slate-500">Kenyamanan Anda adalah prioritas</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
