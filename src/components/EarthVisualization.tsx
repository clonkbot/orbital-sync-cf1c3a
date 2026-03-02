import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface EarthVisualizationProps {
  currentTime: Date;
}

const EarthVisualization = memo(function EarthVisualization({ currentTime }: EarthVisualizationProps) {
  const rotationAngle = useMemo(() => {
    const hours = currentTime.getUTCHours();
    const minutes = currentTime.getUTCMinutes();
    const seconds = currentTime.getUTCSeconds();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return (totalSeconds / 86400) * 360;
  }, [currentTime]);

  const siderealTime = useMemo(() => {
    const jd = Math.floor(currentTime.getTime() / 86400000 + 2440587.5);
    const t = (jd - 2451545.0) / 36525;
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t;
    return ((gmst % 360) + 360) % 360;
  }, [currentTime]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0a0a0f]/80 border border-[#ff9500]/30 p-4 md:p-6 relative overflow-hidden"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.2em] text-[#ff9500]/80">EARTH ROTATION VISUAL</span>
        </div>
        <span className="text-[10px] tracking-wider text-[#00ffff]">LIVE</span>
      </div>

      {/* Earth visualization */}
      <div className="relative aspect-square max-w-[300px] md:max-w-[400px] mx-auto">
        {/* Orbit rings */}
        {[1, 0.8, 0.6].map((scale, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-[#ff9500]/10"
            style={{
              transform: `scale(${scale})`,
              top: `${(1 - scale) * 50}%`,
              left: `${(1 - scale) * 50}%`,
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
            }}
          />
        ))}

        {/* Earth globe */}
        <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#1a3a5c] via-[#0d2137] to-[#061018] border-2 border-[#00ffff]/30 shadow-[0_0_60px_rgba(0,255,255,0.2),inset_0_0_30px_rgba(0,255,255,0.1)] overflow-hidden">
          {/* Grid lines - rotating */}
          <div
            className="absolute inset-0 transition-transform duration-1000"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {/* Longitude lines */}
            {[0, 30, 60, 90, 120, 150].map((deg) => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-full h-[1px] bg-[#00ffff]/20 origin-center"
                style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
              />
            ))}
          </div>

          {/* Latitude lines - static */}
          <div className="absolute inset-0">
            {[-60, -30, 0, 30, 60].map((lat, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-[1px] bg-[#00ffff]/15"
                style={{ top: `${50 + lat * 0.7}%` }}
              />
            ))}
          </div>

          {/* Equator highlight */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff9500]/40 -translate-y-1/2" />

          {/* Sun position indicator */}
          <motion.div
            className="absolute w-3 h-3 md:w-4 md:h-4 bg-[#ff9500] rounded-full shadow-[0_0_20px_rgba(255,149,0,0.8)]"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${-rotationAngle}deg) translateX(80px)`,
            }}
          />

          {/* Center glow */}
          <div className="absolute inset-0 bg-gradient-radial from-[#00ffff]/5 via-transparent to-transparent" />
        </div>

        {/* Axis line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-[#ff9500] via-transparent to-[#ff9500] -translate-x-1/2" />

        {/* Axis labels */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest">N</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest">S</div>
      </div>

      {/* Data readouts */}
      <div className="mt-4 md:mt-6 grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-[#ff9500]/5 border border-[#ff9500]/20 p-2 md:p-3">
          <div className="text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest mb-1">ROTATION ANGLE</div>
          <div className="text-lg md:text-2xl font-display text-[#00ffff]">{rotationAngle.toFixed(4)}°</div>
        </div>
        <div className="bg-[#ff9500]/5 border border-[#ff9500]/20 p-2 md:p-3">
          <div className="text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest mb-1">GMST</div>
          <div className="text-lg md:text-2xl font-display text-[#00ffff]">{siderealTime.toFixed(4)}°</div>
        </div>
      </div>
    </motion.div>
  );
});

export default EarthVisualization;
