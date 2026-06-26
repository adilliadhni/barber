import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Instagram, Facebook, Twitter, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-slate-900 mb-4 font-serif italic"
          >
            Hubungi Kami
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
            Kami selalu siap melayani Anda. Kunjungi barbershop kami atau hubungi kami melalui kontak di bawah ini untuk informasi lebih lanjut.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl text-slate-900 font-bold mb-6">Informasi Kontak</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase mb-1">Telepon / WhatsApp</p>
                    <p className="text-slate-900 font-medium text-lg">0822-2702-1166</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase mb-1">Lokasi</p>
                    <p className="text-slate-900 font-medium text-lg">Jl. Mangunjaya Kios No.3, Mangunjaya<br />Purwokrto Timur, Banyumas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase mb-1">Jam Operasional</p>
                    <ul className="text-slate-900 font-medium text-base space-y-1">
                      <li className="flex justify-between w-full gap-4"><span>Senin - Minggu:</span> <span>10:00 - 21:00</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white p-8 rounded-3xl shadow-xl shadow-primary/30">
              <h3 className="text-2xl font-bold mb-6">Sosial Media & Chat</h3>
              <p className="text-primary-light text-sm mb-6">Ikuti kami untuk mendapatkan update terbaru atau hubungi via WhatsApp untuk reservasi langsung.</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/top_barbershop2?igsh=MXU0a3o0ZjQ5bzg0dA==" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><Instagram size={24} /></a>
                <a href="https://wa.me/6282227021166" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><Phone size={24} /></a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl text-slate-900 font-bold mb-6">Ulasan Pelanggan</h3>
              <p className="text-slate-500 text-sm mb-6">Kami sangat menghargai feedback Anda. Silakan tinggalkan ulasan atau lihat testimoni pelanggan lainnya di Google Maps.</p>
              <a
                href="https://share.google/8JT6iglAqY0X1lyTG"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all w-full justify-center"
              >
                Lihat di Google Maps
              </a>
            </div>
          </motion.div>

          {/* Maps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 h-full min-h-[500px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1012844.1706674495!2d108.686804665625!3d-7.418400100000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655f007fe0760f%3A0x7be9b11224dcff70!2sTOP%20BARBERSHOP!5e0!3m2!1sid!2sid!4v1776437948529!5m2!1sid!2sid"
                className="w-full h-full rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
