import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'power2.out',
      });
    };

    const onMouseEnter = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 1,
        duration: 0.3,
      });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 0,
        duration: 0.3,
      });
    };

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .work-item');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        setIsHovering(true);
        if (el.classList.contains('work-item')) {
          setCursorText('VIEW');
        }
      });
      el.addEventListener('mouseleave', () => {
        setIsHovering(false);
        setCursorText('');
      });
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor circle */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          isHovering ? 'scale-150' : 'scale-100'
        }`}
        style={{ opacity: 0 }}
      >
        <div
          className={`rounded-full flex items-center justify-center transition-all duration-200 ${
            cursorText
              ? 'w-20 h-20 bg-white'
              : isHovering
              ? 'w-12 h-12 bg-white/10 border border-white/30'
              : 'w-8 h-8 border border-white/50'
          }`}
        >
          {cursorText && (
            <span className="text-black text-xs font-mono font-semibold">
              {cursorText}
            </span>
          )}
        </div>
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0 }}
      >
        <div
          className={`w-1 h-1 rounded-full bg-cyan transition-transform duration-150 ${
            isHovering ? 'scale-0' : 'scale-100'
          }`}
        />
      </div>
    </>
  );
}
