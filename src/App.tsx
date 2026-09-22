import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Clock3,
  Factory,
  Layers3,
  Menu,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import logo from '@/assests/logo.jpeg';
import type { EnquiryForm, GalleryImage } from '@/types';

const fallbackHero = 'https://images.pexels.com/photos/36230779/pexels-photo-36230779.jpeg?auto=compress&cs=tinysrgb&w=1800';
const categories = ['All', 'Industrial', 'Commercial', 'Residential', 'Garage'];

const services = [
  { icon: Factory, title: 'Industrial Flooring', text: 'Heavy-duty surfaces engineered for factories, warehouses, and demanding production floors.' },
  { icon: Building2, title: 'Commercial Spaces', text: 'Clean, durable finishes that make showrooms, offices, and parking areas stand out.' },
  { icon: Layers3, title: 'PU Flooring', text: 'Seamless polyurethane systems built for impact, hygiene, and long-term performance.' },
  { icon: Sparkles, title: 'Decorative Finishes', text: 'Modern colour, flake, and metallic finishes that turn everyday floors into features.' },
];

const benefits = ['High chemical resistance', 'Easy to clean and maintain', 'Waterproof seamless finish', 'Fast, professional installation'];

function App() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [form, setForm] = useState<EnquiryForm>({ name: '', phone: '', email: '', service_type: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadGallery() {
      const { data } = await supabase
        .from('gallery_images')
        .select('id, title, category, image_url, description, sort_order, created_at')
        .order('sort_order', { ascending: true });
      if (data) setGallery(data as GalleryImage[]);
      setIsLoadingGallery(false);
    }
    void loadGallery();
  }, []);

  const filteredGallery = useMemo(
    () => activeCategory === 'All' ? gallery : gallery.filter((image) => image.category === activeCategory),
    [activeCategory, gallery],
  );
  const heroImage = gallery[0]?.image_url ?? fallbackHero;

  function updateForm(field: keyof EnquiryForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus('sending');

    const { error } = await supabase.from('enquiries').insert(form);
    if (error) {
      console.error('Enquiry submission failed', error);
      setFormStatus('error');
      return;
    }

    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-enquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ record: form }),
    });

    setForm({ name: '', phone: '', email: '', service_type: '', message: '' });
    setFormStatus('success');
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  return (
    <div className="site-shell">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>Trusted epoxy flooring specialists</span>
          <span className="top-strip-right"><Clock3 size={14} /> Mon–Sat: 9:00 AM – 7:00 PM <a href="tel:+916374498982">Call +91 63744 98982</a></span>
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => scrollTo('home')} aria-label="Sri Sai Enterprises home">
            <img src={logo} alt="Sri Sai Enterprises" className="brand-logo" />
          </button>
          <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
            <button onClick={() => scrollTo('home')}>Home</button>
            <button onClick={() => scrollTo('services')}>Services</button>
            <button onClick={() => scrollTo('work')}>Our Work</button>
            <button onClick={() => scrollTo('about')}>Why Us</button>
            <button className="nav-cta" onClick={() => scrollTo('enquire')}>Get a Quote <ArrowRight size={16} /></button>
          </nav>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-copy">
              <div className="eyebrow light"><span /> BUILT TO LAST. MADE TO IMPRESS.</div>
              <h1>Floors that work<br /><em>as hard as you do.</em></h1>
              <p>Premium epoxy and PU flooring systems for industrial, commercial, and residential spaces. Designed for life. Finished with precision.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => scrollTo('enquire')}>Start your project <ArrowRight size={18} /></button>
                <button className="button button-ghost" onClick={() => scrollTo('work')}>View our work</button>
              </div>
            </div>
            <div className="hero-note"><span className="hero-note-line" />Serving quality surfaces with pride</div>
          </div>
          <div className="hero-stats container">
            <div><strong>10+</strong><span>Years of craft</span></div>
            <div><strong>500+</strong><span>Floors completed</span></div>
            <div><strong>100%</strong><span>Client focused</span></div>
          </div>
        </section>

        <section className="intro-section">
          <div className="container intro-grid">
            <div><div className="eyebrow">THE SRI SAI STANDARD</div><h2>A better floor<br /><span>starts here.</span></h2></div>
            <div className="intro-text"><p>We believe a floor is more than a surface. It is the foundation of every great space. Our specialist team delivers seamless epoxy and PU flooring that combines serious performance with a finish you will be proud of.</p><button className="text-link" onClick={() => scrollTo('about')}>Discover our approach <ArrowRight size={17} /></button></div>
          </div>
        </section>

        <section id="services" className="services-section section-dark">
          <div className="container"><div className="section-heading light-heading"><div><div className="eyebrow light"><span /> WHAT WE DO</div><h2>Surfaces for<br /><em>every ambition.</em></h2></div><p>From a busy factory floor to a beautiful home garage, we bring the same care and technical excellence to every project.</p></div>
            <div className="service-grid">{services.map(({ icon: Icon, title, text }) => <article className="service-card" key={title}><div className="service-icon"><Icon size={23} /></div><h3>{title}</h3><p>{text}</p><button onClick={() => scrollTo('enquire')}>Learn more <ArrowRight size={16} /></button></article>)}</div>
          </div>
        </section>

        <section id="work" className="work-section">
          <div className="container"><div className="section-heading"><div><div className="eyebrow">SELECTED PROJECTS</div><h2>Proof is in<br /><span>the finish.</span></h2></div><p>Explore a few of the spaces we have transformed with durable, beautiful surfaces.</p></div>
            <div className="filter-row">{categories.map((category) => <button className={activeCategory === category ? 'filter active' : 'filter'} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>
            {isLoadingGallery ? <div className="gallery-loading">Loading our latest work...</div> : <div className="gallery-grid">{filteredGallery.map((image, index) => <article className={index === 0 ? 'gallery-card gallery-featured' : 'gallery-card'} key={image.id}><img src={image.image_url} alt={image.title} /><div className="gallery-caption"><span>{image.category}</span><h3>{image.title}</h3></div></article>)}</div>}
            {!isLoadingGallery && filteredGallery.length === 0 && <div className="gallery-loading">No projects in this category yet.</div>}
          </div>
        </section>

        <section id="about" className="about-section"><div className="container about-grid"><div className="about-image"><img src={gallery[1]?.image_url ?? 'https://images.pexels.com/photos/29482812/pexels-photo-29482812.jpeg?auto=compress&cs=tinysrgb&w=1200'} alt="Finished industrial flooring" /><div className="about-badge"><BadgeCheck size={20} /><strong>Quality<br />assured</strong></div></div><div className="about-copy"><div className="eyebrow">WHY SRI SAI</div><h2>Built on trust.<br /><span>Finished with pride.</span></h2><p>We combine proven materials, disciplined preparation, and skilled application to create floors that stay beautiful under pressure. Every project gets our full attention, from the first conversation to the final walkthrough.</p><div className="benefit-list">{benefits.map((benefit) => <div key={benefit}><span><Check size={14} /></span>{benefit}</div>)}</div><button className="button button-dark" onClick={() => scrollTo('enquire')}>Talk to a flooring expert <ArrowRight size={18} /></button></div></div></section>

        <section id="enquire" className="enquire-section"><div className="container enquire-grid"><div className="enquire-copy"><div className="eyebrow light"><span /> LET'S TALK FLOORS</div><h2>Have a space<br /><em>in mind?</em></h2><p>Tell us a little about your project. Our team will get back to you with practical advice and a clear, no-obligation quote.</p><div className="contact-line"><Phone size={18} /><div><small>Call us directly</small><a href="tel:+916374498982">+91 63744 98982</a></div></div></div><form className="enquiry-form" onSubmit={submitEnquiry}><div className="form-row"><label>Name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Your full name" /></label><label>Phone<input required type="tel" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="+91 00000 00000" /></label></div><div className="form-row"><label>Email <span>(optional)</span><input type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="you@company.com" /></label><label>Project type<select required value={form.service_type} onChange={(event) => updateForm('service_type', event.target.value)}><option value="">Select a service</option><option>Industrial Flooring</option><option>Commercial Flooring</option><option>Residential Flooring</option><option>Garage Flooring</option><option>PU / Protective Coating</option></select></label></div><label>Tell us about your space <span>(optional)</span><textarea rows={4} value={form.message} onChange={(event) => updateForm('message', event.target.value)} placeholder="Approximate area, current floor condition, or anything else..." /></label><button className="button button-primary form-submit" type="submit" disabled={formStatus === 'sending'}>{formStatus === 'sending' ? 'Sending...' : 'Send enquiry'} <ArrowRight size={18} /></button>{formStatus === 'success' && <div className="form-message success"><Check size={17} /> Thank you. We will be in touch soon.</div>}{formStatus === 'error' && <div className="form-message error">We could not send your enquiry. Please try again or call us directly.</div>}</form></div></section>
      </main>

      <footer className="footer"><div className="container footer-inner"><div className="brand footer-brand"><img src={logo} alt="Sri Sai Enterprises" className="brand-logo" /></div><p>Premium epoxy flooring, crafted for real life.</p><div className="footer-right"><span>© 2026 Sri Sai Enterprises</span><a href="tel:+916374498982"><Phone size={14} /> +91 63744 98982</a></div></div></footer>
    </div>
  );
}

export default App;
