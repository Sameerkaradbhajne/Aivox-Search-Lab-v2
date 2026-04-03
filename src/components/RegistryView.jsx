import React, { useState } from 'react';
import { Database, Folder, ChevronRight, ChevronDown, User, ShieldCheck, Mail, Phone, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function RegistryView({ contacts, onDelete, onEmail }) {
  const [expandedKeys, setExpandedKeys] = useState(['ROOT']);
  
  // Grouping for Tree View
  const initials = [...new Set(contacts.map(c => c.name[0].toUpperCase()))].sort();
  
  const toggleKey = (key) => {
    setExpandedKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isExpanded = (key) => expandedKeys.includes(key);

  return (
    <div className="flex h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Registry Tree (Left Pane) */}
      <aside className="w-64 border-r border-slate-100 bg-slate-50/50 p-4 overflow-y-auto no-scrollbar select-none">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Database className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Registry Hives</span>
        </div>

        <div className="space-y-1">
          <div 
            onClick={() => toggleKey('ROOT')}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer transition-colors text-xs font-semibold text-slate-700"
          >
            {isExpanded('ROOT') ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <Folder className="w-3.5 h-3.5 text-brand-500 fill-brand-500/20" />
            HK_SEARCH_LAB\LOCAL_CONTACTS
          </div>

          {isExpanded('ROOT') && (
            <div className="ml-4 space-y-1 border-l border-slate-200 pl-2">
              {initials.map(initial => (
                <div key={initial}>
                  <div 
                    onClick={() => toggleKey(initial)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer transition-colors text-[11px] font-medium text-slate-500"
                  >
                    {isExpanded(initial) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <Folder className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />
                    KEY_{initial}
                  </div>
                  
                  {isExpanded(initial) && (
                    <div className="ml-4 space-y-0.5 border-l border-yellow-200/50 pl-2">
                      {contacts.filter(c => c.name[0].toUpperCase() === initial).map(c => (
                        <div key={c.id} className="flex items-center gap-2 p-1.5 text-[10px] text-slate-400 font-mono italic">
                          <User className="w-3 h-3" />
                          {c.name.replace(' ', '_').toUpperCase()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Registry Table (Right Pane) */}
      <main className="flex-1 overflow-auto bg-white flex flex-col no-scrollbar">
        <div className="flex-1">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Name (Reg_SZ)</th>
                <th className="px-6 py-4">Role (Reg_EXP)</th>
                <th className="px-6 py-4">Phone (Reg_DWORD)</th>
                <th className="px-6 py-4">Email (Reg_BINARY)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {contacts.map(c => (
                <tr key={c.id} className="hover:bg-brand-50/30 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center overflow-hidden">
                        <img src={c.avatar} alt="" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-tighter">
                    {c.role || 'Partner'}
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                    {c.phone}
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400 max-w-[150px] truncate">
                    {c.email}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEmail()} className="p-2 text-slate-300 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(c.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Registry Footer */}
        <footer className="h-8 bg-slate-50 border-t border-slate-100 px-4 flex items-center text-[10px] font-mono text-slate-400">
          <ChevronRight className="w-3 h-3 mr-1" />
          Computer\HK_SEARCH_LAB\LOCAL_CONTACTS\{expandedKeys[expandedKeys.length-1] !== 'ROOT' ? `KEY_${expandedKeys[expandedKeys.length-1]}` : ''}
        </footer>
      </main>
    </div>
  );
}
