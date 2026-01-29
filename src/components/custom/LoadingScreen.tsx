import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    const text = textRef.current;
    if (!container || !line || !text) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Progress animation
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: function () {
          setProgress(Math.floor(this.targets()[0].val));
        },
      },
      0
    );

    // Line expansion
    tl.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, ease: 'power2.inOut' },
      0
    );

    // Exit animation
    tl.to(line, {
      scaleY: 50,
      duration: 0.6,
      ease: 'power3.inOut',
    });

    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-background flex items-center justify-center"
    >
      <div className="relative w-full max-w-md px-8">
        {/* Loading text */}
        <div
          ref={textRef}
          className="flex items-center justify-between mb-4"
        >
          <span className="text-white/60 text-sm font-mono uppercase tracking-widest">
            Loading
          </span>
          <span className="text-cyan text-sm font-mono">
            {progress}%
          </span>
        </div>

        {/* Progress line */}
        <div className="relative h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={lineRef}
            className="absolute inset-y-0 left-0 bg-white rounded-full origin-left"
            style={{ width: '100%', transform: 'scaleX(0)' }}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-8 left-8 w-1 h-1 bg-cyan/50 rounded-full" />
        <div className="absolute -bottom-4 right-12 w-1.5 h-1.5 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}
