import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import TextScramble from '../components/custom/TextScramble';

gsap.registerPlugin(ScrollTrigger);

const TYPING_PHRASES = [
  'Building cool stuff',
  'Software Developer',
  'Problem Solver',
  'Homelab Enthusiast',
  'Automation Expert',
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameScrambled, setNameScrambled] = useState(false);

  // Typing effect
  useEffect(() => {
    const phrase = TYPING_PHRASES[currentPhrase];
    const typeSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(phrase.slice(0, displayText.length + 1));
        if (displayText === phrase) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(phrase.slice(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentPhrase((prev) => (prev + 1) % TYPING_PHRASES.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhrase]);

  // GSAP scroll animations
  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const name = nameRef.current;
    if (!section || !viewport || !content) return;

    const ctx = gsap.context(() => {
      // Initial name animation
      gsap.fromTo(name,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 1.7 }
      );

      // Pin the section and zoom effect
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.5,
        },
      });

      tl.to(viewport, {
        scale: 5,
        y: '-30%',
        opacity: 0,
        ease: 'none',
      });

      tl.to(content, {
        opacity: 0,
        ease: 'none',
      }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden z-10"
    >
      {/* Viewport container */}
      <div
        ref={viewportRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          ref={contentRef}
          className="relative w-[90%] max-w-6xl h-[75%] max-h-[650px] glass rounded-3xl flex flex-col items-center justify-center p-8 md:p-16 border border-white/10"
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan/50 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan/50 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan/50 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan/50 rounded-br-3xl" />

          {/* Available status */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan pulse-dot" />
            <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
              Available for work
            </span>
          </div>

          {/* Social links */}
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <a
              href="https://github.com/rcoakley93"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-cyan transition-all duration-300 hover:scale-110"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/ryan-coakley-9931479a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-cyan transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:ryan@ryancoakley.com"
              className="text-white/40 hover:text-cyan transition-all duration-300 hover:scale-110"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Main content */}
          <div className="text-center">
            {/* Pre-title */}
            <p className="text-white/40 text-sm font-mono uppercase tracking-[0.3em] mb-6">
              Hello, I'm
            </p>

            {/* Name with scramble effect */}
            <h1
              ref={nameRef}
              className="text-[12vw] md:text-[9vw] lg:text-[7vw] font-bold text-white tracking-tighter leading-none mb-6 opacity-0"
              onMouseEnter={() => setNameScrambled(true)}
              onMouseLeave={() => setNameScrambled(false)}
            >
              <TextScramble 
                text="RYAN COAKLEY" 
                trigger={nameScrambled}
                className="cursor-pointer hover:text-cyan transition-colors duration-300"
              />
            </h1>

            {/* Typing text */}
            <div className="h-10 flex items-center justify-center">
              <span className="text-lg md:text-xl font-mono text-cyan/80 typing-cursor">
                {displayText}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-cyan transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                View Work
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 border border-white/30 text-white rounded-full hover:border-cyan hover:text-cyan transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
              Scroll to explore
            </span>
            <ChevronDown className="w-5 h-5 text-white/30 scroll-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
