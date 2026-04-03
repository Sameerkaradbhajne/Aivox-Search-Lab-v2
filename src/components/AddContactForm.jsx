import React, { useState } from 'react';
import { UserPlus, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AddContactForm({ onAdd }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', role: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    onAdd({
      id: Date.now().toString(),
      ...formData,
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop`
    });
    
    setFormData({ name: '', phone: '', email: '', role: '' });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-50 rounded-lg">
          <UserPlus className="w-5 h-5 text-brand-600" />
        </div>
        <h2 className="font-bold text-lg text-slate-800 tracking-tight">Create Contact</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 outline-none transition-all text-sm font-medium"
            placeholder="e.g. Ramesh Kumar"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Role / Company</label>
          <input 
            type="text" 
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 outline-none transition-all text-sm font-medium"
            placeholder="e.g. Senior Consultant"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
          <input 
            type="tel" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 outline-none transition-all text-sm font-medium"
            placeholder="+91 90000 00000"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 outline-none transition-all text-sm font-medium"
            placeholder="name@example.in"
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
        >
          <PlusCircle className="w-4 h-4" /> Save Contact
        </motion.button>
      </form>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Contact saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
