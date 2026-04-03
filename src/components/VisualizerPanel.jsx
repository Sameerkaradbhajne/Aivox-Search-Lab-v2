import React, { useMemo } from 'react';
import { BrainCircuit, Info, Zap, Cpu, Activity, Clock, BarChart3, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function VisualizerPanel({ contacts, currentStepData, stepIndex, totalSteps }) {
  if (!currentStepData) return null;

  // Simulated Lab Metrics
  const metrics = useMemo(() => ({
    latency: (Math.random() * 0.5 + 0.1).toFixed(3),
    rps: Math.floor(Math.random() * 1000 + 500),
    load: Math.floor(Math.random() * 20 + 5)
  }), [stepIndex]);

  return (
    <div className="bg-slate-900 border-t-2 border-brand-500 text-slate-300 p-6 shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.3)] h-80 flex flex-col backdrop-blur-xl bg-opacity-95 z-50">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative">
        {/* Animated Background Pulse */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-20 bg-brand-500/10 blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-500 p-2.5 rounded-2xl shadow-lg shadow-brand-500/30 group">
              <BrainCircuit className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div>
              <h2 className="font-black text-lg text-white leading-tight tracking-tighter uppercase">SEARCH LAB <span className="text-brand-500">ENGINE</span></h2>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Status: EXECUTING_BINARY_OPS</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6 ml-10 border-l border-slate-800 pl-10">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latency</span>
                  <div className="flex items-center gap-1.5 text-slate-200 font-mono text-xs">
                     <Clock className="w-3 h-3 text-brand-400" /> {metrics.latency}ms
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Throughput</span>
                  <div className="flex items-center gap-1.5 text-slate-200 font-mono text-xs">
                     <Activity className="w-3 h-3 text-brand-400" /> {metrics.rps} r/s
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Registry Key</span>
                  <div className="flex items-center gap-1.5 text-slate-200 font-mono text-xs uppercase">
                     <Database className="w-3 h-3 text-brand-400" /> HKSL_CONTACT_DB
                  </div>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/50 px-4 py-2 rounded-xl text-[11px] font-black font-mono border border-slate-700/50 text-slate-400">
               STEP <span className="text-white">{stepIndex + 1}</span> / {totalSteps}
            </div>
            <AnimatePresence mode="wait">
              {currentStepData.found && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="bg-green-500 text-white px-5 py-2 rounded-xl border border-green-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-green-500/20"
                >
                  <Zap className="w-4 h-4 fill-white animate-pulse" /> RESULT_FOUND
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Logic Trace Message */}
        <div className="mb-6 bg-slate-100/5 p-4 rounded-2xl border border-white/5 flex items-start gap-4 transition-all duration-300 hover:bg-white/10">
          <div className="p-2 bg-brand-500/10 rounded-xl shrink-0">
            <Cpu className="w-4 h-4 text-brand-400" />
          </div>
          <div className="space-y-1">
             <p className="text-xs font-black text-brand-500 uppercase tracking-widest">Logic Trace Output:</p>
             <p className="text-sm font-bold text-slate-200 leading-relaxed italic tracking-tight">
               {currentStepData.message || "Initializing search sequence..."}
             </p>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center pb-6 no-scrollbar scroll-smooth">
          <div className="flex gap-4 min-w-max px-2">
            {contacts.map((c, idx) => {
              const isMid = idx === currentStepData.mid;
              const inRange = idx >= currentStepData.left && idx <= currentStepData.right;
              const isFound = isMid && currentStepData.found;

              return (
                <motion.div 
                  key={c.id}
                  layout
                  className={twMerge(
                    clsx(
                      "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-700 min-w-[140px] h-24",
                      isFound 
                        ? "bg-green-500 text-white border-green-400 scale-110 z-10 font-black shadow-2xl shadow-green-500/50" 
                        : isMid 
                          ? "bg-brand-600 text-white border-brand-400 scale-105 z-10 shadow-2xl shadow-brand-600/50"
                          : inRange 
                            ? "bg-slate-800 border-slate-700 text-slate-200" 
                            : "bg-slate-800/10 border-slate-800/20 text-slate-600 scale-90 opacity-20 grayscale blur-[1px]"
                    )
                  )}
                >
                  <div className="text-[9px] mb-1 font-black uppercase tracking-tighter opacity-50 font-mono">ADDR_0x{idx.toString(16).padStart(2, '0')}</div>
                  <div className="text-sm font-black truncate w-full text-center tracking-tighter uppercase">{c.name}</div>
                  
                  {isMid && (
                    <motion.div 
                      layoutId="indicator"
                      className={twMerge(
                        clsx(
                          "absolute -top-3 px-3 py-1 rounded-lg text-[9px] font-black tracking-widest shadow-xl border-2 border-white",
                          isFound ? "bg-green-400 text-green-950" : "bg-brand-500 text-white"
                        )
                      )}
                    >
                      {isFound ? "FOUND" : "QUERY_MID"}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Lab Status Bar */}
        <div className="flex justify-between items-center text-[9px] text-slate-500 font-black mt-4 pt-4 border-t border-slate-800/50 uppercase tracking-widest">
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <span className="text-slate-600">Memory Load:</span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.load}%` }}
                    className="h-full bg-brand-500" 
                 />
              </div>
              <span className="text-slate-400 font-mono">{metrics.load}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-600">Search Efficiency:</span>
              <span className="text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-md">Logarithmic O(log N)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <BarChart3 className="w-3 h-3" /> Result Consistency: 99.98%
          </div>
        </div>
      </div>
    </div>
  );
}
