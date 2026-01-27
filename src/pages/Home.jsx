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
      transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// Project card component
function ProjectCard({ title, description, icon: Icon, gradient, link, links, tags, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <div className="glass-card p-6 h-full relative overflow-hidden">
        {/* Gradient glow on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={26} className="text-white" />
        </div>
        
        {/* Content */}
        <h3 className="relative text-xl font-semibold mb-3 group-hover:text-white transition-colors">{title}</h3>
        <p className="relative text-gray-400 mb-4 leading-relaxed">{description}</p>
        
        {/* Tags */}
        <div className="relative flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10"
            >
              {tag}
            </span>
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
                className="inline-flex items-center space-x-2 text-accent-glow hover:text-white transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="text-sm font-medium">{l.label}</span>
                <ArrowRight size={16} />
              </motion.a>
            ))}
          </div>
        ) : link && (
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center space-x-2 text-accent-glow hover:text-white transition-colors"
            whileHover={{ x: 4 }}
          >
            <span className="text-sm font-medium">View Project</span>
            <ArrowRight size={16} />
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}

// Skill item component
function SkillItem({ icon: Icon, name, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="skill-icon flex flex-col items-center space-y-2 p-4 rounded-2xl glass cursor-default"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-sm text-gray-400">{name}</span>
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
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-500">{label}</div>
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
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
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
      title: 'Personal AI Assistant',
      description: 'A custom AI assistant running 24/7, handling automations, monitoring systems, and managing my digital life.',
      icon: Bot,
      gradient: 'from-violet-500 to-purple-600',
      tags: ['AI', 'Automation', 'Claude'],
      link: null,
    },
    {
      title: "Oscar's Tracker",
      description: 'Track and predict Oscar nominations and wins. Web and iOS app for movie enthusiasts following awards season.',
      icon: Trophy,
      gradient: 'from-yellow-500 to-amber-600',
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
      gradient: 'from-cyan-500 to-blue-600',
      tags: ['IoT', 'React', 'API'],
      link: '/weather',
    },
    {
      title: 'ADS-B Radar',
      description: 'Live aircraft tracking from roof-mounted antennas. 1090 MHz and 978 MHz feeds covering the DC metro area.',
      icon: Plane,
      gradient: 'from-emerald-500 to-teal-600',
      tags: ['ADS-B', 'Aviation', 'Real-time'],
      link: '/radar',
    },
    {
      title: 'Smart Home Automation',
      description: 'Integrated smart home system with presence detection, climate control, and automated routines.',
      icon: HomeIcon,
      gradient: 'from-green-500 to-emerald-600',
      tags: ['Home Assistant', 'IoT', 'Zigbee'],
      link: null,
    },
  ]

  const skills = [
    { icon: Terminal, name: 'Linux', color: 'bg-yellow-500/20 text-yellow-400' },
    { icon: Code, name: 'Python', color: 'bg-blue-500/20 text-blue-400' },
    { icon: Globe, name: 'React', color: 'bg-cyan-500/20 text-cyan-400' },
    { icon: Database, name: 'Databases', color: 'bg-green-500/20 text-green-400' },
    { icon: Server, name: 'Docker', color: 'bg-blue-600/20 text-blue-500' },
    { icon: Wifi, name: 'Networking', color: 'bg-purple-500/20 text-purple-400' },
    { icon: Cpu, name: 'Hardware', color: 'bg-red-500/20 text-red-400' },
    { icon: Shield, name: 'Security', color: 'bg-emerald-500/20 text-emerald-400' },
  ]

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section ref={targetRef} className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <motion.div style={{ y: textY, opacity }} className="text-center relative z-10">
          {/* Avatar with animated ring */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative inline-block mb-8"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[3px] relative">
              {/* Animated gradient border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-primary via-accent-secondary to-pink-500"
              />
              <div className="relative w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                <span className="text-6xl sm:text-7xl font-bold gradient-text-fast">R</span>
              </div>
            </div>
            {/* Status indicator */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-dark-900"
            />
          </motion.div>

          {/* Name with stagger animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6"
          >
            <span className="gradient-text">Ryan Coakley</span>
          </motion.h1>

          {/* Typing animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-12 mb-10"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-mono">
              <span className="text-accent-glow">&gt;</span> {typingText}
              <span className="cursor-blink text-accent-primary">|</span>
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
                className="btn-primary px-8 py-4 rounded-2xl flex items-center space-x-3 glow font-medium"
              >
                <Cloud size={22} />
                <span>Live Weather</span>
              </motion.button>
            </Link>
            <Link to="/radar">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl glass hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 font-medium"
              >
                <Plane size={22} />
                <span>Live Radar</span>
              </motion.button>
            </Link>
            <motion.a
              href="mailto:Ryan.coakley93@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl glass hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 font-medium"
            >
              <Mail size={22} />
              <span>Get in Touch</span>
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center space-x-4"
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
                className="p-4 rounded-2xl glass hover:bg-white/10 transition-all duration-300"
                aria-label={label}
              >
                <Icon size={26} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
            <ChevronDown size={24} className="text-gray-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter target={5} label="Years Coding" suffix="+" />
              <AnimatedCounter target={15} label="Projects Built" suffix="+" />
              <AnimatedCounter target={99} label="Uptime" suffix="%" />
              <AnimatedCounter target={24} label="Hour Monitoring" suffix="/7" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block px-4 py-2 rounded-full glass text-sm text-accent-glow mb-4"
            >
              <Sparkles size={14} className="inline mr-2" />
              Featured Work
            </motion.span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">What I Build</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
              className="inline-block px-4 py-2 rounded-full glass text-sm text-accent-glow mb-4"
            >
              <Zap size={14} className="inline mr-2" />
              Tech Stack
            </motion.span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Skills & Tools</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Technologies and tools I work with daily.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
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

      {/* About Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">About Me</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Code,
                title: 'Tech Enthusiast',
                description: 'Passionate about automation, home infrastructure, and building systems that just work. If there\'s a way to make it smarter, I\'ll find it.',
                gradient: 'from-accent-primary to-accent-secondary',
              },
              {
                icon: Server,
                title: 'Homelab Addict',
                description: 'Running servers, weather stations, and automation systems. My roof has a Tempest weather station because why not know the exact conditions at home?',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: BarChart3,
                title: 'Data Driven',
                description: 'Weather data, system metrics, analytics – I love collecting and visualizing data. Check out the live weather dashboard for proof.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Sparkles,
                title: 'Always Building',
                description: 'From AI assistants to personal infrastructure, there\'s always a new project. The best code is the code that makes life easier.',
                gradient: 'from-orange-500 to-red-500',
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5`}>
                  <card.icon size={26} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border">
            <div className="glass-card p-8 md:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Want to collaborate?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Always interested in new projects, tech discussions, or just geeking out about homelabs and automation.
              </p>
              <motion.a
                href="mailto:Ryan.coakley93@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center space-x-3 px-8 py-4 rounded-2xl glow font-medium"
              >
                <Mail size={22} />
                <span>Let's Talk</span>
              </motion.a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center font-bold text-sm">
                R
              </div>
              <span className="text-gray-500">Ryan Coakley</span>
            </div>
            <p className="text-gray-600 text-sm">
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
                  className="text-gray-600 hover:text-white transition-colors"
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
