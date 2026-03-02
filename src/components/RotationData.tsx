import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface RotationDataProps {
  currentTime: Date;
}

const RotationData = memo(function RotationData({ currentTime }: RotationDataProps) {
  const rotationData = useMemo(() => {
    const dayOfYear = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / 86400000);
    const hours = currentTime.getUTCHours();
    const minutes = currentTime.getUTCMinutes();
    const seconds = currentTime.getUTCSeconds();
    const ms = currentTime.getUTCMilliseconds();

    const totalDayFraction = (hours * 3600 + minutes * 60 + seconds + ms / 1000) / 86400;

    // Earth's rotation speed at equator
    const rotationSpeed = 1674.4; // km/h at equator

    // Sidereal day length
    const siderealDayLength = 23 * 3600 + 56 * 60 + 4.0916;

    // Angular velocity
    const angularVelocity = 360 / siderealDayLength; // degrees per second

    // Current angular position
    const angularPosition = (totalDayFraction * 360) % 360;

    // Time until next rotation milestone (every 90°)
    const nextMilestone = Math.ceil(angularPosition / 90) * 90;
    const degreesToMilestone = nextMilestone - angularPosition;
    const secondsToMilestone = degreesToMilestone / angularVelocity;

    // Predict rotation at specific future times
    const predictions = [1, 6, 12, 24].map(hoursAhead => {
      const futureAngle = (angularPosition + (hoursAhead * 3600 * angularVelocity)) % 360;
      return { hours: hoursAhead, angle: futureAngle };
    });

    return {
      dayOfYear,
      totalDayFraction,
      rotationSpeed,
      angularVelocity,
      angularPosition,
      nextMilestone,
      secondsToMilestone,
      predictions,
    };
  }, [currentTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const dataPoints = [
    { label: 'DAY OF YEAR', value: rotationData.dayOfYear.toString(), unit: '' },
    { label: 'ANGULAR VELOCITY', value: rotationData.angularVelocity.toFixed(6), unit: '°/s' },
    { label: 'EQUATORIAL SPEED', value: rotationData.rotationSpeed.toFixed(1), unit: 'km/h' },
    { label: 'DAILY PROGRESS', value: (rotationData.totalDayFraction * 100).toFixed(4), unit: '%' },
  ];

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
          <div className="w-2 h-2 bg-[#ff9500] rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.2em] text-[#ff9500]/80">ROTATION TELEMETRY</span>
        </div>
        <span className="text-[10px] tracking-wider text-[#ff9500]/60">REALTIME</span>
      </div>

      {/* Main data grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
        {dataPoints.map((point, i) => (
          <motion.div
            key={point.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-[#ff9500]/5 border border-[#ff9500]/20 p-2 md:p-3"
          >
            <div className="text-[7px] md:text-[9px] text-[#ff9500]/60 tracking-widest mb-1">{point.label}</div>
            <div className="text-sm md:text-lg font-display text-[#00ffff]">
              {point.value}
              <span className="text-[8px] md:text-[10px] text-[#ff9500]/40 ml-1">{point.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next milestone */}
      <div className="bg-[#00ffff]/5 border border-[#00ffff]/30 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[8px] md:text-[10px] text-[#00ffff]/60 tracking-widest mb-1">NEXT QUADRANT ({rotationData.nextMilestone}°)</div>
            <div className="text-xl md:text-3xl font-display text-[#00ffff]">
              T-{formatTime(rotationData.secondsToMilestone)}
            </div>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((q) => (
              <div
                key={q}
                className={`w-3 h-3 md:w-4 md:h-4 border ${
                  q * 90 < rotationData.angularPosition
                    ? 'bg-[#00ffff] border-[#00ffff]'
                    : 'border-[#00ffff]/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div>
        <div className="text-[8px] md:text-[10px] text-[#ff9500]/60 tracking-widest mb-2 md:mb-3">ROTATION PREDICTIONS</div>
        <div className="space-y-2">
          {rotationData.predictions.map((pred, i) => (
            <motion.div
              key={pred.hours}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-[#ff9500]/10 last:border-0"
            >
              <span className="text-[10px] md:text-xs text-[#ff9500]/60">+{pred.hours}h</span>
              <div className="flex-1 mx-2 md:mx-4 h-[1px] bg-gradient-to-r from-[#ff9500]/20 to-transparent" />
              <span className="text-xs md:text-sm font-display text-[#ff9500]">{pred.angle.toFixed(2)}°</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-[#ff9500]/20">
        <div className="flex items-center justify-between text-[8px] md:text-[10px]">
          <span className="text-[#ff9500]/40">SYSTEM STATUS</span>
          <div className="flex items-center gap-2">
            <span className="text-[#00ff00]">● NOMINAL</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default RotationData;
