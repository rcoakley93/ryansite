import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MouseSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const glow = glowRef.current;
    if (!spotlight || !glow) return;

    // Check if touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Inner bright spotlight */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none z-[5] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%)',
        }}
      />
      {/* Outer glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[4] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.03) 0%, transparent 60%)',
        }}
      />
    </>
  );
}
