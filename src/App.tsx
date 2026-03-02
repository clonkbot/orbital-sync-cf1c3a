import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EarthVisualization from './components/EarthVisualization';
import MissionControl from './components/MissionControl';
import RotationData from './components/RotationData';
import SpaceXEvents from './components/SpaceXEvents';
import ScanLines from './components/ScanLines';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'missions' | 'rotation'>('missions');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUTC = useCallback((date: Date) => {
    return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#ff9500] relative overflow-hidden font-mono">
      <ScanLines />

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-[#ff9500]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-2xl md:text-4xl tracking-[0.2em] uppercase flex items-center gap-2 md:gap-4">
                <span className="inline-block w-2 h-2 md:w-3 md:h-3 bg-[#ff9500] rounded-full animate-pulse" />
                ORBITAL
                <span className="text-[#00ffff]">SYNC</span>
              </h1>
              <p className="text-[10px] md:text-xs tracking-[0.3em] text-[#ff9500]/60 mt-1">
                SPACE EVENT TRACKING SYSTEM v2.4.7
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-right"
            >
              <div className="text-[10px] md:text-xs tracking-widest text-[#ff9500]/60">MISSION TIME</div>
              <div className="font-display text-base md:text-2xl tracking-wider text-[#00ffff]">
                {formatUTC(currentTime)}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 border-b border-[#ff9500]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-1">
            {(['missions', 'rotation'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-300 relative min-h-[44px] ${
                  activeTab === tab
                    ? 'text-[#0a0a0f] bg-[#ff9500]'
                    : 'text-[#ff9500]/60 hover:text-[#ff9500] hover:bg-[#ff9500]/10'
                }`}
              >
                {tab === 'missions' ? 'MISSION CONTROL' : 'EARTH ROTATION'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#ff9500] -z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'missions' ? (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <div className="lg:col-span-2">
                <MissionControl />
              </div>
              <div className="lg:col-span-1">
                <SpaceXEvents />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rotation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
            >
              <div>
                <EarthVisualization currentTime={currentTime} />
              </div>
              <div>
                <RotationData currentTime={currentTime} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#ff9500]/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-xs text-[#ff9500]/30">
            <span className="tracking-widest">ORBITAL SYNC // SECURE TRANSMISSION</span>
            <span className="tracking-wide">Requested by @web-user · Built by @clonkbot</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
