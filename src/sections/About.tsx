import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Server, Database, Cloud, Shield, Terminal } from 'lucide-react';
import TiltCard from '../components/custom/TiltCard';

gsap.registerPlugin(ScrollTrigger);

const TECH_STACK = [
  {
    category: 'Frontend',
    icon: Terminal,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite'],
    color: 'from-cyan/20 to-blue/20',
  },
  {
    category: 'Backend',
    icon: Server,
    skills: ['Node.js', 'Python', 'Express', 'FastAPI', 'GraphQL'],
    color: 'from-green/20 to-emerald/20',
  },
  {
    category: 'Database',
    icon: Database,
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma'],
    color: 'from-yellow/20 to-orange/20',
  },
  {
    category: 'DevOps',
    icon: Cloud,
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'],
    color: 'from-purple/20 to-pink/20',
  },
  {
    category: 'IoT & Hardware',
    icon: Cpu,
    skills: ['Raspberry Pi', 'Arduino', 'Home Assistant', 'Zigbee', 'MQTT'],
    color: 'from-red/20 to-rose/20',
  },
  {
    category: 'Security',
    icon: Shield,
    skills: ['Networking', 'VPN', 'Firewall', 'SSL/TLS', 'Auth'],
    color: 'from-indigo/20 to-violet/20',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        section.querySelector('.about-heading'),
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

      // Bio text animation
      gsap.fromTo(
        section.querySelector('.about-bio'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
          },
        }
      );

      // Tech cards staggered animation
      gsap.fromTo(
        section.querySelectorAll('.tech-card'),
        { opacity: 0, y: 80, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.tech-grid'),
            start: 'top 75%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 z-20 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 mb-20">
          <div>
            <p className="text-cyan text-sm font-mono uppercase tracking-widest mb-4">
              01 — About Me
            </p>
            <h2 className="about-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              ABOUT
            </h2>
          </div>
          <div className="about-bio space-y-6">
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              I'm a software developer with a passion for building things that live on the internet. 
              I specialize in creating experiences that are both beautiful and functional.
            </p>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              From AI assistants to homelab infrastructure, I love tackling complex problems and 
              turning ideas into reality. My roof has a weather station because why not know the 
              exact conditions at home?
            </p>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              When I'm not coding, you'll find me experimenting with IoT devices, optimizing my 
              smart home setup, or tracking aircraft with my ADS-B receiver.
            </p>
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div>
          <p className="text-cyan text-sm font-mono uppercase tracking-widest mb-2">
            02 — Skills
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Tech Stack
          </h3>
          <div className="tech-grid grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <TiltCard key={index} tiltAmount={8}>
                  <div className="tech-card glass rounded-xl p-6 border border-white/5 hover:border-cyan/30 transition-all duration-300 group h-full">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-white/5 group-hover:bg-cyan/20 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-cyan" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-3 group-hover:text-cyan transition-colors duration-300">
                          {tech.category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tech.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="tech-tag text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/60 border border-white/10 hover:bg-cyan hover:text-black hover:border-cyan transition-all duration-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
