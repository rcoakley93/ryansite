import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { 
  Cloud, Github, Linkedin, Mail, ChevronDown, Sparkles, Code, Server,
  Cpu, Database, Globe, Terminal, Wifi, Zap, ArrowRight, ExternalLink,
  Bot, Home as HomeIcon, BarChart3, Shield, Trophy, Plane
} from 'lucide-react'

// Typing animation hook
function useTypingAnimation(texts, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime])

  return displayText
}

// Animated section wrapper with scroll reveal
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// Glass stat card component
function GlassStatCard({ value, label, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-stat"
    >
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/60">{label}</div>
    </motion.div>
  )
}

// Project card component
function ProjectCard({ title, description, icon: Icon, tags, link, links, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <div className="glass-card-sm p-6 h-full relative overflow-hidden">
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-500 rounded-3xl" />
        
        {/* Icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
          <Icon size={26} className="text-black" />
        </div>
        
        {/* Content */}
        <h3 className="relative text-xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">{title}</h3>
        <p className="relative text-zinc-400 mb-4 leading-relaxed text-sm">{description}</p>
        
        {/* Tags */}
        <div className="relative flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        {/* Links */}
        {links ? (
          <div className="relative flex flex-wrap gap-4">
            {links.map((l) => (
              <motion.a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-emerald-400 hover:text-white transition-colors text-sm font-medium"
                whileHover={{ x: 4 }}
              >
                <span>{l.label}</span>
                <ArrowRight size={14} />
              </motion.a>
            ))}
          </div>
        ) : link && (
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center space-x-2 text-emerald-400 hover:text-white transition-colors text-sm font-medium"
            whileHover={{ x: 4 }}
          >
            <span>View Project</span>
            <ArrowRight size={14} />
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}

// Skill item component
function SkillItem({ icon: Icon, name }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center space-y-2 p-4 rounded-2xl glass cursor-default group"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-emerald-500/20 transition-colors">
        <Icon size={24} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
      </div>
      <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">{name}</span>
    </motion.div>
  )
}

// Stats counter animation
function AnimatedCounter({ target, label, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = target / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count}{suffix}
      </div>
      <div className="text-zinc-500 text-sm">{label}</div>
    </div>
  )
}

export default function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const typingText = useTypingAnimation([
    'Building cool stuff.',
    'Automating everything.',
    'Making systems smarter.',
    'Running servers at home.',
    'Collecting weather data.',
  ])

  const projects = [
    {
      title: "Oscar's Tracker",
      description: 'Track and predict Oscar nominations and wins. Web and iOS app for movie enthusiasts following awards season.',
      icon: Trophy,
      tags: ['React', 'iOS App', 'Movies'],
      links: [
        { label: 'Website', url: 'https://oscarstracker.com' },
        { label: 'iOS App', url: 'https://testflight.apple.com/join/DesqX8Eb' },
      ],
    },
    {
      title: 'Weather Station',
      description: 'Live weather monitoring with a Tempest sensor on my roof. Real-time data visualization and historical trends.',
      icon: Cloud,
      tags: ['IoT', 'React', 'API'],
      link: '/weather',
    },
    {
      title: 'ADS-B Radar',
      description: 'Live aircraft tracking from roof-mounted antennas. 1090 MHz and 978 MHz feeds covering the DC metro area.',
      icon: Plane,
      tags: ['ADS-B', 'Aviation', 'Real-time'],
      link: '/radar',
    },
  ]

  const skills = [
    { icon: Terminal, name: 'Linux' },
    { icon: Code, name: 'Python' },
    { icon: Globe, name: 'React' },
    { icon: Database, name: 'Databases' },
    { icon: Server, name: 'Docker' },
    { icon: Wifi, name: 'Networking' },
    { icon: Cpu, name: 'Hardware' },
    { icon: Shield, name: 'Security' },
  ]

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section ref={targetRef} className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <motion.div style={{ opacity }} className="text-center relative z-10 max-w-4xl mx-auto">
          {/* Avatar with animated ring */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block mb-8"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[3px] relative">
              {/* Animated gradient border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"
              />
              <div className="relative w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <span className="text-6xl sm:text-7xl font-bold gradient-text-emerald">R</span>
              </div>
            </div>
            {/* Status indicator */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-400 border-4 border-black"
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 heading-tight"
          >
            <span className="text-white">Ryan Coakley</span>
          </motion.h1>

          {/* Typing animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-12 mb-10"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-zinc-400 font-light">
              <span className="text-emerald-400">&gt;</span> {typingText}
              <span className="cursor-blink text-emerald-400">|</span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link to="/weather">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-action"
              >
                <span>Live Weather</span>
                <div className="icon-circle">
                  <Cloud size={18} className="text-white" />
                </div>
              </motion.button>
            </Link>
            <Link to="/radar">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 font-medium text-white/80"
              >
                <Plane size={18} />
                <span>Live Radar</span>
              </motion.button>
            </Link>
            <motion.a
              href="mailto:Ryan.coakley93@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 font-medium text-white/80"
            >
              <Mail size={18} />
              <span>Get in Touch</span>
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center space-x-4 mb-20 sm:mb-0"
          >
            {[
              { icon: Github, href: 'https://github.com/rcoakley93', label: 'GitHub' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/ryan-coakley-9931479a', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-full glass hover:bg-white/10 transition-all duration-300 text-white/60 hover:text-white"
                aria-label={label}
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 sm:bottom-8 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="label-caps text-zinc-500">Scroll</span>
            <ChevronDown size={24} className="text-zinc-500" />
          </motion.div>
        </motion.div>

      </section>

      {/* Projects Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-flex items-center px-4 py-2 rounded-full glass text-sm text-emerald-400 mb-6"
            >
              <Sparkles size={14} className="mr-2" />
              <span className="label-caps">Featured Work</span>
            </motion.span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 heading-tight">
              <span className="text-white">What I Build</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-light">
              From AI assistants to homelab infrastructure — here's what I've been working on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Skills Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-flex items-center px-4 py-2 rounded-full glass text-sm text-emerald-400 mb-6"
            >
              <Zap size={14} className="mr-2" />
              <span className="label-caps">Tech Stack</span>
            </motion.span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 heading-tight">
              <span className="text-white">Skills & Tools</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-light">
              Technologies and tools I work with daily.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid grid-cols-4 md:grid-cols-8 gap-4"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <SkillItem {...skill} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* About Section - Dark Block Style */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="dark-block rounded-4xl p-8 md:p-12 relative overflow-hidden">
            <div className="grain-overlay-dark" />
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 heading-tight">
                  <span className="text-white">About Me</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Code,
                    title: 'Tech Enthusiast',
                    description: 'Passionate about automation, home infrastructure, and building systems that just work. If there\'s a way to make it smarter, I\'ll find it.',
                  },
                  {
                    icon: Server,
                    title: 'AI Solution Architect',
                    description: 'AI Solution Architect at ServiceNow, helping enterprises transform their workflows with intelligent automation and generative AI.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Data Driven',
                    description: 'Weather data, system metrics, analytics – I love collecting and visualizing data. Check out the live weather dashboard for proof.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Always Building',
                    description: 'From AI assistants to personal infrastructure, there\'s always a new project. The best code is the code that makes life easier.',
                  },
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="glass-card-sm p-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5">
                      <card.icon size={26} className="text-black" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{card.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            {/* Gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 heading-tight text-white">
              Want to collaborate?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto font-light">
              Always interested in new projects, tech discussions, or just geeking out about homelabs and automation.
            </p>
            <motion.a
              href="mailto:Ryan.coakley93@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-action inline-flex"
            >
              <span>Let's Talk</span>
              <div className="icon-circle">
                <Mail size={18} className="text-white" />
              </div>
            </motion.a>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-sm text-black">
                R
              </div>
              <span className="text-zinc-500">Ryan Coakley</span>
            </div>
            <p className="text-zinc-600 text-sm">
              © {new Date().getFullYear()} • Built with React & good vibes
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Github, href: 'https://github.com/rcoakley93' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/ryan-coakley-9931479a' },
                { icon: Mail, href: 'mailto:Ryan.coakley93@gmail.com' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-emerald-400 transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
