import React, { useEffect, useRef } from "react";

// FadeOverlay handles a fade-in/fade-out overlay for theme transitions
export const FadeOverlay: React.FC<{ trigger: boolean; duration?: number; onDone?: () => void }> = ({ trigger, duration = 600, onDone }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    setTimeout(() => {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      if (onDone) setTimeout(onDone, duration);
    }, duration);
  }, [trigger, duration, onDone]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "var(--background, #fff)",
        opacity: 0,
        pointerEvents: "none",
        transition: `opacity ${duration}ms cubic-bezier(0.4,0,0.2,1)`,
        zIndex: 99999,
        mixBlendMode: "difference",
      }}
    />
  );
};
