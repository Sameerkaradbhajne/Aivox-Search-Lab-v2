import React, { useState, useEffect, useMemo } from 'react';
import { initialContacts } from './data/mockContacts';
import { getBinarySearchSteps } from './utils/binarySearch';
import { AddContactForm } from './components/AddContactForm';
import { ContactCard } from './components/ContactCard';
import { VisualizerPanel } from './components/VisualizerPanel';
import { RegistryView } from './components/RegistryView';
import { 
  Search, UserCircle, Settings, Bell, Hexagon, X, 
  CheckCircle2, Trash2, Mail, LayoutGrid, Database, 
  FlaskConical, Cpu, Activity, Terminal,
  Globe, Github, Linkedin, MailPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Lab Logo
const LabLogo = () => (
  <div className="relative flex items-center justify-center p-1.5 bg-brand-600 rounded-xl shadow-lg shadow-brand-500/20 group overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
    <FlaskConical className="w-5 h-5 text-white z-10 group-hover:rotate-12 transition-transform" />
    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-brand-600 animate-bounce" />
  </div>
);

function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSteps, setSearchSteps] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isBinaryMode, setIsBinaryMode] = useState(true);
  const [viewMode, setViewMode] = useState('directory'); // 'directory' or 'registry'
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Sorting
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts]);

  // Handle Binary Search Animation
  useEffect(() => {
    if (!isBinaryMode) {
      setSearchSteps(null);
      return;
    }
    
    if (searchQuery.trim().length > 0) {
      const steps = getBinarySearchSteps(sortedContacts, searchQuery);
      setSearchSteps(steps);
      setCurrentStepIndex(0);
    } else {
      setSearchSteps(null);
    }
  }, [searchQuery, sortedContacts, isBinaryMode]);

  // Step Animator
  useEffect(() => {
    if (searchSteps && currentStepIndex < searchSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [searchSteps, currentStepIndex]);

  const handleAddContact = (newContact) => {
    setContacts(prev => [...prev, newContact]);
    showToast(`Added ${newContact.name} to contacts!`);
  };

  const handleDeleteContact = (id) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast(`Deleted ${contact?.name || 'contact'}`, 'delete');
  };

  const handleSendEmail = (name) => {
    showToast(`Drafting email to ${name}...`);
  };

  const currentDisplayedContacts = useMemo(() => {
    if (isBinaryMode && searchSteps) {
      return sortedContacts;
    } 
    if (!isBinaryMode && searchQuery) {
      return sortedContacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return sortedContacts;
  }, [sortedContacts, isBinaryMode, searchQuery, searchSteps]);

  const getCardHighlight = (index) => {
    if (isBinaryMode && searchSteps) {
      const stepData = searchSteps[currentStepIndex];
      if (stepData.found && stepData.mid === index) return 'match';
      if (index === stepData.mid) return 'mid';
      if (index >= stepData.left && index <= stepData.right) return 'in-range';
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-brand-100 selection:text-brand-900">
      {/* Toast System */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
                toast.type === 'delete' 
                  ? 'bg-red-50 border-red-100 text-red-700' 
                  : 'bg-white border-slate-100 text-slate-700'
              }`}
            >
              {toast.type === 'delete' ? <Trash2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 w-64">
          <LabLogo />
          <span className="font-extrabold text-xl tracking-tighter text-slate-800">SEARCH<span className="text-brand-600">LAB</span><span className="text-[10px] font-bold text-slate-400 align-top ml-1">v2.0</span></span>
        </div>

        <div className="flex-1 max-w-2xl px-8 flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Query Repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-2xl pl-11 pr-11 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/10 focus:bg-white transition-all text-sm font-bold tracking-tight text-slate-700"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-100">
             <button 
                onClick={() => setViewMode('directory')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'directory' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Directory View"
             >
                <LayoutGrid className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setViewMode('registry')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'registry' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Registry Explorer"
             >
                <Database className="w-4 h-4" />
             </button>
          </div>

          <button 
            onClick={() => setIsBinaryMode(!isBinaryMode)}
            className={`shrink-0 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
              isBinaryMode 
                ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isBinaryMode ? 'Binary' : 'Linear'}
          </button>
        </div>

        <div className="flex items-center gap-4 w-64 justify-end">
          <button className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-500">
              <Activity className="w-3 h-3 text-green-500" /> SYSTEM.ONLINE
          </button>
          <div className="w-9 h-9 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center font-black text-sm relative">
             SA
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto shrink-0 z-20 shadow-[4px_0_15px_rgba(0,0,0,0.02)]">
          <AddContactForm onAdd={handleAddContact} />
          
          {/* Developer Profile Card */}
          <div className="mt-8 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl shadow-slate-200 text-white">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-white/10 rounded-xl">
                  <Cpu className="w-5 h-5 text-brand-400" />
               </div>
               <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Developer Profile</h3>
                  <p className="font-bold text-sm">Sameer</p>
               </div>
            </div>
            
            <div className="space-y-3 mb-5 text-[11px] font-medium text-slate-400">
               <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Role</span>
                  <span className="text-white">Senior AI Architect</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Specialization</span>
                  <span className="text-white">Binary Logic Ops</span>
               </div>
               <div className="flex justify-between">
                  <span>Identity</span>
                  <span className="text-white">#ANTIGRAVITY_O1</span>
               </div>
            </div>

            <div className="flex gap-2">
               <button className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Github className="w-3 h-3" />
               </button>
               <button className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Linkedin className="w-3 h-3" />
               </button>
               <button className="flex-1 py-1.5 bg-brand-500 shadow-lg shadow-brand-500/20 rounded-lg flex items-center justify-center gap-2">
                  <Globe className="w-3 h-3" />
               </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Registry Status</span>
              <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-brand-500/30 rounded-full" />)}
                 <div className="w-1 h-3 bg-brand-500 rounded-full animate-pulse" />
              </div>
          </div>
        </aside>

        {/* Center Content */}
        <main className="flex-1 bg-slate-50/50 p-8 overflow-y-auto w-full relative z-10 no-scrollbar">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-1 flex items-center gap-3">
                  {viewMode === 'registry' ? <Database className="text-brand-600" /> : <Globe className="text-brand-600" />}
                  {viewMode === 'registry' ? 'HKEY_LOCAL_CONTACTS' : 'Directory Hub'}
                </h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> System Root {" > "} Lab {" > "} Registry
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
               <AnimatePresence mode="wait">
                  {viewMode === 'directory' ? (
                    <motion.div 
                      key="directory"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-32"
                    >
                      {currentDisplayedContacts.map((contact, index) => (
                        <ContactCard
                          key={contact.id}
                          contact={contact}
                          isSelected={selectedContactId === contact.id}
                          onClick={() => setSelectedContactId(contact.id)}
                          onDelete={() => handleDeleteContact(contact.id)}
                          onEmail={() => handleSendEmail(contact.name)}
                          highlightType={getCardHighlight(index)}
                        />
                      ))}
                      
                      {currentDisplayedContacts.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 border-2 border-dashed border-slate-200">
                            <UserCircle className="w-10 h-10" />
                          </div>
                          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Query Empty</h3>
                          <p className="text-slate-500 text-xs font-bold uppercase mt-1">Adjust search parameters or check registry keys.</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="registry"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="h-full pb-32"
                    >
                      <RegistryView 
                        contacts={currentDisplayedContacts}
                        onDelete={handleDeleteContact}
                        onEmail={handleSendEmail}
                      />
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Visualization Panel */}
      <AnimatePresence>
        {isBinaryMode && searchSteps && (
          <motion.div 
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
             <VisualizerPanel 
               contacts={sortedContacts}
               currentStepData={searchSteps[currentStepIndex]}
               stepIndex={currentStepIndex}
               totalSteps={searchSteps.length}
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
