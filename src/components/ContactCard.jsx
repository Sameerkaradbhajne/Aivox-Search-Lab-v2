import React from 'react';
import { Phone, Mail, User, Trash2, ShieldCheck, MailPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ContactCard({ contact, isSelected, highlightType, onClick, onDelete, onEmail }) {
  const getHighlightStyles = () => {
    switch (highlightType) {
      case 'match':
        return 'border-green-500 ring-4 ring-green-100 shadow-xl bg-green-50/50 scale-[1.02] z-10';
      case 'mid':
        return 'border-brand-500 ring-4 ring-brand-100 shadow-xl bg-brand-50/50 scale-[1.02] z-10';
      case 'in-range':
        return 'border-slate-300 bg-white opacity-100';
      default:
        return 'border-slate-200 bg-white/60 opacity-60 grayscale-[0.5] scale-[0.98] blur-[0.5px]';
    }
  };

  const isHighlighted = !!highlightType;

  return (
    <motion.div 
      layout
      onClick={onClick}
      className={twMerge(
        clsx(
          "relative group rounded-3xl border p-5 cursor-pointer transition-all duration-300 flex flex-col gap-5",
          !isHighlighted ? (isSelected ? "border-brand-500 ring-2 ring-brand-100 shadow-lg bg-white" : "border-slate-100 bg-white hover:border-brand-200 hover:shadow-xl hover:shadow-slate-200/50") : getHighlightStyles()
        )
      )}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow-md transition-shadow">
               {contact.avatar ? (
                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
               ) : (
                <User className="text-slate-400 w-7 h-7" />
               )}
            </div>
            {isSelected && (
              <div className="absolute -bottom-1 -right-1 bg-brand-600 rounded-lg p-1 border-2 border-white shadow-sm">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">{contact.name}</h3>
            <p className="text-xs font-semibold text-brand-600 mt-0.5">{contact.role || 'Partner'}</p>
          </div>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Bio / Contact Info */}
      <div className="space-y-3 bg-slate-50/50 rounded-2xl p-3 border border-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
          <div className="p-1.5 bg-white rounded-lg border border-slate-100">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
          <div className="p-1.5 bg-white rounded-lg border border-slate-100">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="truncate">{contact.email}</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="grid grid-cols-1 gap-2">
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); onEmail(); }}
          className="w-full py-2.5 bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-600 transition-all flex justify-center items-center gap-2 shadow-sm"
        >
          <MailPlus className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" /> Send Message
        </motion.button>
      </div>

      {/* Visual Indicator for Binary Search */}
      {highlightType === 'mid' && !contact.id.startsWith('temp') && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
          CURRENT MID
        </div>
      )}
      {highlightType === 'match' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white animate-pulse">
          MATCH FOUND
        </div>
      )}
    </motion.div>
  );
}
