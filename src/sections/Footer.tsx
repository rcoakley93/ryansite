import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail, Coffee, Heart, ExternalLink, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/rcoakley93', handle: '@rcoakley93' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/ryan-coakley-9931479a', handle: 'Ryan Coakley' },
  { name: 'Email', icon: Mail, url: 'mailto:ryan@ryancoakley.com', handle: 'ryan@ryancoakley.com' },
];

const PROJECT_LINKS = [
  { name: "Oscar's Tracker", url: 'https://oscarstracker.com', desc: 'Award predictions' },
  { name: 'Weather Station', url: 'https://ryancoakley.com/weather', desc: 'Live weather data' },
  { name: 'ADS-B Radar', url: 'https://ryancoakley.com/radar', desc: 'Aircraft tracking' },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Large name animation
      gsap.fromTo(
        section.querySelector('.footer-name'),
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );

      // Footer items animation
      gsap.fromTo(
        section.querySelectorAll('.footer-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 z-50 bg-background overflow-hidden"
    >
      {/* Large name display */}
      <div className="footer-name overflow-hidden mb-16 px-6">
        <h2 className="text-[14vw] md:text-[12vw] font-bold text-white/[0.03] leading-none tracking-tighter whitespace-nowrap text-center select-none">
          RYAN COAKLEY
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Social links */}
          <div className="footer-item">
            <h3 className="text-sm font-mono text-cyan uppercase tracking-widest mb-6">
              Connect
            </h3>
            <div className="space-y-4">
              {SOCIAL_LINKS.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan/20 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-white/50 group-hover:text-cyan transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-white group-hover:text-cyan transition-colors duration-300 font-medium">
                        {link.name}
                      </p>
                      <p className="text-white/30 text-xs">{link.handle}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ml-auto" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-item">
            <h3 className="text-sm font-mono text-cyan uppercase tracking-widest mb-6">
              Projects
            </h3>
            <div className="space-y-4">
              {PROJECT_LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group"
                >
                  <div>
                    <p className="text-white group-hover:text-cyan transition-colors duration-300 font-medium">
                      {link.name}
                    </p>
                    <p className="text-white/30 text-xs">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="footer-item">
            <h3 className="text-sm font-mono text-cyan uppercase tracking-widest mb-6">
              Support
            </h3>
            <p className="text-white/50 text-sm mb-6">
              If you enjoy my work, consider buying me a coffee. It helps fuel late-night coding sessions!
            </p>
            <a
              href="https://www.buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-cyan/20 border border-white/10 hover:border-cyan/30 transition-all duration-300 group"
            >
              <Coffee className="w-4 h-4 text-white/50 group-hover:text-cyan transition-colors duration-300" />
              <span className="text-white/70 group-hover:text-cyan transition-colors duration-300 text-sm font-medium">Buy me a coffee</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-item pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm flex items-center gap-1">
              <span>© 2025 Ryan Coakley. Built with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
              <span>and good vibes.</span>
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/20 text-xs font-mono">React</span>
              <span className="text-white/10">•</span>
              <span className="text-white/20 text-xs font-mono">TypeScript</span>
              <span className="text-white/10">•</span>
              <span className="text-white/20 text-xs font-mono">Tailwind</span>
              <span className="text-white/10">•</span>
              <span className="text-white/20 text-xs font-mono">Vite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 rounded-full glass border border-white/10 hover:border-cyan/30 hover:bg-cyan/10 transition-all duration-300 group"
        >
          <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-cyan transition-colors duration-300 -rotate-45" />
        </button>
      </div>
    </footer>
  );
}
