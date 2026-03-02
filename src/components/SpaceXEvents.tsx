import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

interface SpaceEvent {
  id: string;
  type: 'launch' | 'landing' | 'docking' | 'milestone' | 'test';
  title: string;
  description: string;
  timestamp: Date;
  location: string;
}

const SpaceXEvents = memo(function SpaceXEvents() {
  const [events, setEvents] = useState<SpaceEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const now = new Date();
    const mockEvents: SpaceEvent[] = [
      {
        id: 'ev1',
        type: 'launch',
        title: 'Falcon 9 Liftoff',
        description: 'Starlink G12-15 mission launch from SLC-40',
        timestamp: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        location: 'Cape Canaveral, FL',
      },
      {
        id: 'ev2',
        type: 'landing',
        title: 'Booster Recovery',
        description: 'B1082 landing attempt on ASOG droneship',
        timestamp: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000),
        location: 'Atlantic Ocean',
      },
      {
        id: 'ev3',
        type: 'test',
        title: 'Static Fire Test',
        description: 'Starship S31 full stack static fire',
        timestamp: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        location: 'Starbase, TX',
      },
      {
        id: 'ev4',
        type: 'docking',
        title: 'Dragon Docking',
        description: 'Crew Dragon autonomus ISS docking',
        timestamp: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        location: 'Low Earth Orbit',
      },
      {
        id: 'ev5',
        type: 'milestone',
        title: 'Starship IFT-7',
        description: 'Seventh integrated flight test of Starship',
        timestamp: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        location: 'Starbase, TX',
      },
      {
        id: 'ev6',
        type: 'launch',
        title: 'Heavy Lift Mission',
        description: 'Falcon Heavy deploying classified NRO payload',
        timestamp: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        location: 'Kennedy Space Center',
      },
    ];
    setEvents(mockEvents);
  }, []);

  const getTypeIcon = (type: SpaceEvent['type']) => {
    switch (type) {
      case 'launch': return '▲';
      case 'landing': return '▼';
      case 'docking': return '◆';
      case 'milestone': return '★';
      case 'test': return '◎';
    }
  };

  const getTypeColor = (type: SpaceEvent['type']) => {
    switch (type) {
      case 'launch': return 'text-[#00ffff] bg-[#00ffff]/10';
      case 'landing': return 'text-[#00ff00] bg-[#00ff00]/10';
      case 'docking': return 'text-[#ff9500] bg-[#ff9500]/10';
      case 'milestone': return 'text-[#ffff00] bg-[#ffff00]/10';
      case 'test': return 'text-[#ff6600] bg-[#ff6600]/10';
    }
  };

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  const formatDate = (date: Date) => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-[#0a0a0f]/80 border border-[#ff9500]/30 p-4 md:p-6 h-full"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.2em] text-[#ff9500]/80">EVENT TIMELINE</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {['all', 'launch', 'landing', 'test', 'milestone'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 md:px-3 py-1 text-[8px] md:text-[10px] tracking-widest uppercase transition-all min-h-[32px] ${
              filter === f
                ? 'bg-[#ff9500] text-[#0a0a0f]'
                : 'bg-[#ff9500]/10 text-[#ff9500]/60 hover:text-[#ff9500]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="space-y-2 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
        {filteredEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#ff9500]/5 border border-[#ff9500]/20 p-2 md:p-3 hover:bg-[#ff9500]/10 transition-colors"
          >
            <div className="flex items-start gap-2 md:gap-3">
              {/* Type icon */}
              <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm shrink-0 ${getTypeColor(event.type)}`}>
                {getTypeIcon(event.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[8px] md:text-[10px] tracking-widest text-[#ff9500]/60 uppercase">
                    {event.type}
                  </span>
                  <span className="text-[8px] md:text-[10px] text-[#00ffff]">{formatDate(event.timestamp)}</span>
                </div>
                <h4 className="text-xs md:text-sm text-[#ff9500] mt-1 truncate">{event.title}</h4>
                <p className="text-[9px] md:text-[11px] text-[#ff9500]/50 mt-0.5 line-clamp-2">{event.description}</p>
                <div className="text-[8px] md:text-[10px] text-[#ff9500]/30 mt-1 flex items-center gap-1">
                  <span>◉</span>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-[#ff9500]/20">
        <div className="text-[8px] md:text-[10px] text-[#ff9500]/40 mb-2">EVENT TYPES</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[8px] md:text-[10px]">
          <span className="text-[#00ffff]">▲ LAUNCH</span>
          <span className="text-[#00ff00]">▼ LANDING</span>
          <span className="text-[#ff9500]">◆ DOCKING</span>
          <span className="text-[#ffff00]">★ MILESTONE</span>
        </div>
      </div>
    </motion.div>
  );
});

export default SpaceXEvents;
