import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, CheckCircle, Mail, MapPin, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        section.querySelector('.contact-heading'),
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

      // Info cards animation
      gsap.fromTo(
        section.querySelectorAll('.info-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
          },
        }
      );

      // Form animation
      gsap.fromTo(
        section.querySelector('.contact-form'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 z-40 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="text-cyan text-sm font-mono uppercase tracking-widest mb-4">
            04 — Get in Touch
          </p>
          <h2 className="contact-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4">
            CONTACT
          </h2>
          <p className="text-white/50 text-lg max-w-md">
            Want to work together? Have a project in mind? Let's talk about it.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left column - Info cards */}
          <div className="space-y-4">
            <div className="info-card glass rounded-xl p-5 border border-white/5 hover:border-cyan/30 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-cyan/10">
                  <Mail className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-mono uppercase mb-1">Email</p>
                  <a href="mailto:ryan@ryancoakley.com" className="text-white hover:text-cyan transition-colors">
                    ryan@ryancoakley.com
                  </a>
                </div>
              </div>
            </div>

            <div className="info-card glass rounded-xl p-5 border border-white/5 hover:border-cyan/30 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-cyan/10">
                  <MapPin className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-mono uppercase mb-1">Location</p>
                  <p className="text-white">Washington, D.C. Metro Area</p>
                </div>
              </div>
            </div>

            <div className="info-card glass rounded-xl p-5 border border-white/5 hover:border-cyan/30 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-cyan/10">
                  <Calendar className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-mono uppercase mb-1">Availability</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
                    <p className="text-white">Open to opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="lg:col-span-2">
            <div className="contact-form glass rounded-2xl p-6 md:p-8 border border-white/5">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-cyan" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-white/50">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name field */}
                    <div className="relative">
                      <label
                        htmlFor="name"
                        className={`absolute left-4 transition-all duration-300 font-mono text-sm pointer-events-none ${
                          focusedField === 'name' || formData.name
                            ? '-top-2.5 text-xs text-cyan bg-background px-2'
                            : 'top-4 text-white/40'
                        }`}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-4 text-white focus:border-cyan transition-colors"
                      />
                    </div>

                    {/* Email field */}
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className={`absolute left-4 transition-all duration-300 font-mono text-sm pointer-events-none ${
                          focusedField === 'email' || formData.email
                            ? '-top-2.5 text-xs text-cyan bg-background px-2'
                            : 'top-4 text-white/40'
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-4 text-white focus:border-cyan transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className={`absolute left-4 transition-all duration-300 font-mono text-sm pointer-events-none ${
                        focusedField === 'message' || formData.message
                          ? '-top-2.5 text-xs text-cyan bg-background px-2'
                          : 'top-4 text-white/40'
                      }`}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-4 text-white focus:border-cyan transition-colors resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="btn-primary w-full bg-white text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan transition-all duration-300"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
