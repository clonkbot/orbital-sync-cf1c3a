import { memo } from 'react';

const ScanLines = memo(function ScanLines() {
  return (
    <>
      {/* Horizontal scan lines */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,149,0,0.3) 2px, rgba(255,149,0,0.3) 4px)',
        }}
      />

      {/* Moving scan line */}
      <div
        className="fixed inset-x-0 h-[2px] pointer-events-none z-40 bg-gradient-to-r from-transparent via-[#ff9500]/30 to-transparent animate-scan"
        style={{
          top: 0,
        }}
      />

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#ff9500]/30 pointer-events-none z-30" />
      <div className="fixed top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#ff9500]/30 pointer-events-none z-30" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#ff9500]/30 pointer-events-none z-30" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#ff9500]/30 pointer-events-none z-30" />
    </>
  );
});

export default ScanLines;
