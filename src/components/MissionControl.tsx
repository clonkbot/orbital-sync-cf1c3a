import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

interface Mission {
  id: string;
  name: string;
  vehicle: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'scrubbed';
  launchTime: Date;
  payload: string;
  orbit: string;
}

const MissionControl = memo(function MissionControl() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulated mission data (since we can't make API calls)
    const now = new Date();
    const mockMissions: Mission[] = [
      {
        id: 'starlink-12-15',
        name: 'Starlink Group 12-15',
        vehicle: 'Falcon 9 Block 5',
        status: 'upcoming',
        launchTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        payload: '23 Starlink v2 Mini',
        orbit: 'LEO (540 km)',
      },
      {
        id: 'crew-dragon-10',
        name: 'Crew Dragon Mission 10',
        vehicle: 'Falcon 9 Block 5',
        status: 'upcoming',
        launchTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        payload: 'Crew-10 (4 astronauts)',
        orbit: 'ISS (420 km)',
      },
      {
        id: 'transporter-12',
        name: 'Transporter-12',
        vehicle: 'Falcon 9 Block 5',
        status: 'upcoming',
        launchTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        payload: 'Rideshare (150+ sats)',
        orbit: 'SSO (525 km)',
      },
      {
        id: 'starship-flight-7',
        name: 'Starship IFT-7',
        vehicle: 'Starship + Super Heavy',
        status: 'upcoming',
        launchTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        payload: 'Integrated Flight Test',
        orbit: 'Suborbital',
      },
      {
        id: 'starlink-12-14',
        name: 'Starlink Group 12-14',
        vehicle: 'Falcon 9 Block 5',
        status: 'completed',
        launchTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        payload: '23 Starlink v2 Mini',
        orbit: 'LEO (540 km)',
      },
    ];
    setMissions(mockMissions);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (launchTime: Date) => {
    const diff = launchTime.getTime() - currentTime.getTime();
    if (diff < 0) return 'T+' + formatDuration(Math.abs(diff));
    return 'T-' + formatDuration(diff);
  };

  const formatDuration = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'upcoming': return 'text-[#00ffff]';
      case 'in-progress': return 'text-[#00ff00]';
      case 'completed': return 'text-[#ff9500]/60';
      case 'scrubbed': return 'text-[#ff3333]';
    }
  };

  const getStatusBg = (status: Mission['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-[#00ffff]/10 border-[#00ffff]/30';
      case 'in-progress': return 'bg-[#00ff00]/10 border-[#00ff00]/30';
      case 'completed': return 'bg-[#ff9500]/5 border-[#ff9500]/20';
      case 'scrubbed': return 'bg-[#ff3333]/10 border-[#ff3333]/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0a0a0f]/80 border border-[#ff9500]/30 p-4 md:p-6"
    >
      {/* Panel header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.2em] text-[#ff9500]/80">MISSION CONTROL FEED</span>
        </div>
        <div className="text-[10px] tracking-wider text-[#ff9500]/60">
          {missions.filter(m => m.status === 'upcoming').length} UPCOMING
        </div>
      </div>

      {/* Mission list */}
      <div className="space-y-3">
        {missions.map((mission, i) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedMission(selectedMission === mission.id ? null : mission.id)}
            className={`border cursor-pointer transition-all duration-300 min-h-[44px] ${
              selectedMission === mission.id
                ? 'bg-[#ff9500]/10 border-[#ff9500]'
                : getStatusBg(mission.status) + ' hover:bg-[#ff9500]/5'
            }`}
          >
            {/* Mission header */}
            <div className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[8px] md:text-[10px] tracking-widest uppercase ${getStatusColor(mission.status)}`}>
                      {mission.status}
                    </span>
                    <span className="text-[8px] md:text-[10px] text-[#ff9500]/40">|</span>
                    <span className="text-[8px] md:text-[10px] text-[#ff9500]/60">{mission.vehicle}</span>
                  </div>
                  <h3 className="text-sm md:text-lg font-display text-[#ff9500] mt-1 truncate">{mission.name}</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[8px] md:text-[10px] text-[#ff9500]/40 tracking-widest">COUNTDOWN</div>
                  <div className={`text-base md:text-xl font-display ${
                    mission.status === 'completed' ? 'text-[#ff9500]/40' : 'text-[#00ffff]'
                  }`}>
                    {getCountdown(mission.launchTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {selectedMission === mission.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-[#ff9500]/20 p-3 md:p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <div className="text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest mb-1">PAYLOAD</div>
                    <div className="text-xs md:text-sm text-[#ff9500]">{mission.payload}</div>
                  </div>
                  <div>
                    <div className="text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest mb-1">TARGET ORBIT</div>
                    <div className="text-xs md:text-sm text-[#ff9500]">{mission.orbit}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest mb-1">LAUNCH TIME (UTC)</div>
                    <div className="text-xs md:text-sm text-[#00ffff]">
                      {mission.launchTime.toISOString().replace('T', ' ').slice(0, 19)}
                    </div>
                  </div>
                </div>

                {/* Progress bar for upcoming */}
                {mission.status === 'upcoming' && (
                  <div className="mt-3 md:mt-4">
                    <div className="flex justify-between text-[8px] md:text-[10px] text-[#ff9500]/40 mb-1">
                      <span>MISSION PREP</span>
                      <span>LAUNCH</span>
                    </div>
                    <div className="h-1 bg-[#ff9500]/20 relative overflow-hidden">
                      <motion.div
                        className="h-full bg-[#00ffff]"
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Status footer */}
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-[#ff9500]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[8px] md:text-[10px]">
        <span className="text-[#ff9500]/40">DATA SOURCE: SIMULATED SPACEX MANIFEST</span>
        <span className="text-[#00ff00]">● FEED ACTIVE</span>
      </div>
    </motion.div>
  );
});

export default MissionControl;
