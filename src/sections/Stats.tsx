import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Layers, Activity, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 5, suffix: '+', label: 'Years Coding', icon: Code },
  { value: 15, suffix: '+', label: 'Projects Built', icon: Layers },
  { value: 99, suffix: '%', label: 'Uptime', icon: Activity },
  { value: 24, suffix: '/7', label: 'Hour Monitoring', icon: Clock },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter || hasAnimated.current) return;

    const trigger = ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        
        gsap.to({ val: 0 }, {
          val: value,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: function() {
            setCount(Math.floor(this.targets()[0].val));
          },
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [value]);

  return (
    <span ref={counterRef} className="stat-number">
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.stat-item'),
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 z-20 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stat-item relative group"
              >
                <div className="glass rounded-2xl p-6 md:p-8 text-center card-lift border border-white/5 hover:border-cyan/30 transition-colors duration-300">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-cyan/10 group-hover:bg-cyan/20 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-cyan" />
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 group-hover:text-cyan transition-colors duration-300">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs md:text-sm font-mono text-white/40 uppercase tracking-wider">
                    {stat.label}
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider line */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-20">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </section>
  );
}
