import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink, Sparkles, Film, Cloud, Radio, Home } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    number: '01',
    title: 'Personal AI Assistant',
    description: 'A custom AI assistant running 24/7, handling automations, monitoring systems, and managing my digital life.',
    tags: ['AI', 'Automation', 'Claude', 'Python'],
    link: '#',
    icon: Sparkles,
    gradient: 'from-violet/20 to-purple/20',
  },
  {
    number: '02',
    title: "Oscar's Tracker",
    description: 'Track and predict Oscar nominations and wins. Web and iOS app for movie enthusiasts following awards season.',
    tags: ['React', 'iOS App', 'Movies', 'API'],
    link: 'https://oscarstracker.com',
    icon: Film,
    gradient: 'from-gold/20 to-yellow/20',
  },
  {
    number: '03',
    title: 'Weather Station',
    description: 'Live weather monitoring with a Tempest sensor on my roof. Real-time data visualization and historical trends.',
    tags: ['IoT', 'React', 'API', 'Data Viz'],
    link: 'https://ryancoakley.com/weather',
    icon: Cloud,
    gradient: 'from-cyan/20 to-blue/20',
  },
  {
    number: '04',
    title: 'ADS-B Radar',
    description: 'Live aircraft tracking from roof-mounted antennas. 1090 MHz and 978 MHz feeds covering the DC metro area.',
    tags: ['ADS-B', 'Aviation', 'Real-time', 'RTL-SDR'],
    link: 'https://ryancoakley.com/radar',
    icon: Radio,
    gradient: 'from-green/20 to-emerald/20',
  },
  {
    number: '05',
    title: 'Smart Home Automation',
    description: 'Integrated smart home system with presence detection, climate control, and automated routines.',
    tags: ['Home Assistant', 'IoT', 'Zigbee', 'Automation'],
    link: '#',
    icon: Home,
    gradient: 'from-orange/20 to-red/20',
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        section.querySelector('.work-heading'),
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
          },
        }
      );

      // Project items staggered animation
      gsap.fromTo(
        section.querySelectorAll('.work-item'),
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.work-list'),
            start: 'top 75%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 z-30 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="text-cyan text-sm font-mono uppercase tracking-widest mb-4">
            03 — Portfolio
          </p>
          <h2 className="work-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4">
            WORK
          </h2>
          <p className="text-white/50 text-lg max-w-xl">
            From AI assistants to homelab infrastructure — here's what I've been working on.
          </p>
        </div>

        {/* Projects List */}
        <div className="work-list space-y-2">
          {PROJECTS.map((project, index) => {
            const Icon = project.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="work-item block group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative py-6 md:py-8 px-4 md:px-6 rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-cyan/30 hover:bg-white/5">
                  {/* Background gradient on hover */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${project.gradient} transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  />
                  
                  <div className="relative flex items-start gap-4 md:gap-8">
                    {/* Icon */}
                    <div className={`hidden md:flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0 transition-all duration-300 ${isHovered ? 'bg-cyan/20' : 'bg-white/5'}`}>
                      <Icon className={`w-5 h-5 transition-colors duration-300 ${isHovered ? 'text-cyan' : 'text-white/40'}`} />
                    </div>

                    {/* Number */}
                    <span className="work-number text-sm font-mono text-white/20 w-8 flex-shrink-0 transition-colors duration-300 group-hover:text-cyan/50">
                      {project.number}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="work-title text-xl md:text-2xl lg:text-3xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <ArrowRight className="work-arrow w-5 h-5 md:w-6 md:h-6 text-white/20 flex-shrink-0 transition-all duration-300 group-hover:text-cyan group-hover:translate-x-2" />
                        </div>
                      </div>
                      
                      <p className="text-white/40 text-sm md:text-base mb-4 max-w-2xl transition-colors duration-300 group-hover:text-white/60">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10 transition-all duration-300 group-hover:bg-cyan/10 group-hover:text-cyan/70 group-hover:border-cyan/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* External link indicator */}
                  {isHovered && project.link !== '#' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 text-cyan text-xs font-mono animate-fade-in">
                      <span>View Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
