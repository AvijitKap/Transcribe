import React, { useEffect, useRef } from 'react';

export const AudioVisualizer = ({ isActive, audioLevel = 0, accentColor = '#3b82f6' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const numBars = 32;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;
        if (isActive) {
          // Dynamic wave based on level and sine harmonics
          const sinMod = Math.sin((i / numBars) * Math.PI * 2 + phase);
          const cosMod = Math.cos((i / numBars) * Math.PI * 4 + phase * 1.5);
          const normalizedLevel = (audioLevel / 100);
          
          barHeight = Math.max(
            4,
            (normalizedLevel * height * 0.8 * (0.4 + 0.3 * Math.abs(sinMod) + 0.3 * Math.abs(cosMod)))
          );
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isActive) {
          gradient.addColorStop(0, '#60a5fa');
          gradient.addColorStop(0.5, '#3b82f6');
          gradient.addColorStop(1, '#1d4ed8');
        } else {
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += 0.08;
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, audioLevel, accentColor]);

  return (
    <div className="w-full flex items-center justify-center bg-slate-900/60 rounded-xl p-2 border border-slate-800">
      <canvas
        ref={canvasRef}
        width={320}
        height={48}
        className="w-full max-w-xs h-10 block"
      />
    </div>
  );
};
