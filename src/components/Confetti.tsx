import React from "react";

// Simple confetti animation using canvas
export const Confetti: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({ trigger, onComplete }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>();

  React.useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Confetti particles
    const confettiCount = 120;
    const confettiColors = ["#6366f1", "#f59e42", "#10b981", "#f43f5e", "#fbbf24", "#3b82f6"];
    const confetti: any[] = Array.from({ length: confettiCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
    }));

    let angle = 0;
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      angle += 0.01;
      for (let i = 0; i < confettiCount; i++) {
        const c = confetti[i];
        c.tiltAngle += c.tiltAngleIncremental;
        c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
        c.x += Math.sin(angle);
        c.tilt = Math.sin(c.tiltAngle) * 15;
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 3);
        ctx.stroke();
      }
      frame++;
      if (frame < 120) {
        animationRef.current = requestAnimationFrame(draw);
      } else {
        if (onComplete) onComplete();
      }
    }
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ctx.clearRect(0, 0, width, height);
    };
  }, [trigger, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        display: trigger ? "block" : "none",
      }}
    />
  );
};
