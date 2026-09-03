import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Asterisk,
  Bot,
  BrainCircuit,
  Code2,
  Globe2,
  MessageCircle,
  Orbit,
  Rocket,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { DiscordCopy } from '@/components/discord-copy';
import { JournalFeed } from '@/components/journal-feed';
import { ScrollDirector } from '@/components/scroll-director';
import { VisitorChat } from '@/components/visitor-chat';
import { experience, projects, socials } from '@/lib/site-data';

const disciplines = [
  { number: '01', icon: Rocket, title: 'Entrepreneur', copy: 'Turning high-conviction ideas into ventures with a real path from concept to market.' },
  { number: '02', icon: BrainCircuit, title: 'AI specialist', copy: 'Designing useful intelligent workflows, assistants and automation around human outcomes.' },
  { number: '03', icon: Code2, title: 'Full-stack developer', copy: 'Building the interface, systems, data and deployment that make a product whole.' },
];

const process = [
  ['Discover', 'Find the real friction, not only the first feature request.'],
  ['Architect', 'Shape the product, information and technical system together.'],
  ['Build', 'Move from expressive interface to dependable implementation.'],
  ['Evolve', 'Learn from use, sharpen the signal and compound the value.'],
];

export default function Home() {
  return (
    <main className="v3-shell portfolio-shell">
      <ScrollDirector />
      <nav className="v3-nav reference-nav" aria-label="Primary navigation">
        <a className="v3-monogram" href="#top" aria-label="Yamin Mastoi">YM<span>10</span></a>
        <div className="reference-nav-links"><a href="#work">Work</a><a href="#about">About</a><a href="#journal">Journal</a><a href="#contact">Contact</a></div>
        <a className="v3-nav-cta reference-nav-cta" href="#contact"><span>Available for work</span><ArrowDownRight /></a>
      </nav>

      {/* <div className="journey-portrait">
        <div className="journey-portrait-frame"><img src="/portraits/yamin-portrait-journey.png" alt="Yamin Mastoi in a tailored navy suit" /></div>
        <span>Yamin · in motion</span>
      </div> */}

      <section className="v3-section v3-hero reference-hero" id="top" data-3d-section>
        <div className="reference-hero-glow" aria-hidden="true" />
        <div className="reference-hero-copy" data-scene>
          <p className="reference-kicker"><Sparkles /> Independent builder · Pakistan · 2026</p>
          <div className="reference-name" aria-label="Yamin Mastoi"><span>YAMIN</span><span>MASTOI</span></div>
          <div className="reference-portrait">
            <img src="/yamin-mastoi-hero.png" alt="Yamin Mastoi" />
          </div>
          <div className="reference-role"><span>Entrepreneur</span><i /><span>AI specialist</span><i /><span>Full-stack developer</span></div>
          <div className="reference-intro"><p>I build intelligent ventures and expressive digital systems that turn ambitious ideas into useful products.</p><a href="#work">Explore selected work <ArrowUpRight /></a></div>
          <a className="reference-scroll" href="#signal" aria-label="Scroll to next section"><span>Scroll to explore</span><ArrowDown /></a>
        </div>
        <span className="v3-section-count reference-count">01 / 15</span>
      </section>

      <section className="v3-section v3-signal" id="signal" data-3d-section>
        <div className="v3-statement" data-scene>
          <span className="v3-label">02 / North star</span>
          <h2 data-kinetic>Technology should feel<br /><em>capable, human and alive.</em></h2>
          <div className="v3-statement-foot"><p>My work lives at the intersection of intelligence, identity and business momentum.</p><Orbit /></div>
        </div>
      </section>

      <section className="v3-section v3-disciplines" data-3d-section>
        <div className="v3-scene" data-scene>
          <header className="v3-heading"><span className="v3-label">03 / Three lenses</span><h2 data-kinetic>One builder.<br />Three dimensions.</h2><p>Strategy, intelligence and engineering—considered as one connected craft.</p></header>
          <div className="v3-discipline-grid">
            {disciplines.map(({ number, icon: Icon, title, copy }) => <article data-tilt key={title}><span>{number}</span><Icon /><h3>{title}</h3><p>{copy}</p><ArrowUpRight /></article>)}
          </div>
        </div>
      </section>

      <section className="v3-section v3-work" id="work" data-3d-section>
        <div className="v3-scene" data-scene>
          <header className="v3-heading"><span className="v3-label">04 / Selected work</span><h2 data-kinetic>Proof in<br /><em>production.</em></h2><p>Three public ventures, each built for a different kind of human journey.</p></header>
          <div className="v3-project-grid">
            {projects.map((project) => (
              <a className={`v3-project-card ${project.accent}`} href={project.url} target="_blank" rel="noreferrer" data-tilt key={project.name}>
                <div><span>{project.number}</span><ArrowUpRight /></div>
                <div className="v3-project-orb" aria-hidden="true"><i /><i /><i /></div>
                <p>{project.kind}</p><h3>{project.name}</h3><small>{project.copy}</small><strong>{project.domain}</strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="v3-section v3-process" data-3d-section>
        <div className="v3-scene" data-scene>
          <header className="v3-heading inverse"><span className="v3-label">05 / Operating system</span><h2 data-kinetic>From signal<br />to shipped.</h2><p>A product rhythm designed to protect clarity while moving with pace.</p></header>
          <div className="v3-process-track">
            {process.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{copy}</p></div><Workflow /></article>)}
          </div>
        </div>
      </section>

      <section className="v3-section v3-intelligence" id="intelligence" data-3d-section>
        <div className="v3-ai-console" data-scene data-tilt>
          <div className="v3-console-top"><span><i /> MASTOI INTELLIGENCE LAYER</span><em>LIVE</em></div>
          <div className="v3-console-grid">
            <div><span className="v3-label">06 / Applied AI</span><h2 data-kinetic>Intelligence<br />with intent.</h2><p>Useful AI is not a decoration. It should understand context, reduce friction and know when a human should take over.</p><a href="#contact">Design an intelligent workflow <ArrowUpRight /></a></div>
            <div className="v3-neural-object" aria-hidden="true"><i /><i /><i /><i /><span><Bot /></span></div>
          </div>
          <footer><span>Context-aware</span><span>Human handoff</span><span>Private by design</span></footer>
        </div>
      </section>

      <section className="v3-section v3-stack" data-3d-section>
        <div className="v3-stack-layout" data-scene>
          <div className="v3-stack-title"><span className="v3-label">07 / Full-stack craft</span><h2 data-kinetic>Every layer<br /><em>in conversation.</em></h2></div>
          <div className="v3-code-cube" data-tilt>
            <div><span>Interface</span><strong>Motion · Systems · Story</strong></div>
            <div><span>Application</span><strong>React · TypeScript · APIs</strong></div>
            <div><span>Intelligence</span><strong>AI · Automation · Context</strong></div>
            <div><span>Infrastructure</span><strong>Data · Security · Deploy</strong></div>
          </div>
        </div>
      </section>

      <section className="v3-section v3-venture" data-3d-section>
        <div className="v3-venture-card" data-scene>
          <span className="v3-label">08 / Venture thinking</span>
          <div className="v3-venture-word" aria-hidden="true">BUILD</div>
          <h2 data-kinetic>Not just a website.<br /><em>A direction with momentum.</em></h2>
          <div><p>I connect product strategy, experience design and technical execution so an idea can become something people understand, trust and use.</p><Rocket /></div>
        </div>
      </section>

      <section className="v3-section v3-culture" data-3d-section>
        <div className="v3-culture-layout" data-scene>
          <div className="v3-cultural-mark" aria-hidden="true"><i /><i /><i /><Asterisk /></div>
          <div><span className="v3-label">09 / Identity</span><h2 data-kinetic>Global ambition.<br /><em>Rooted perspective.</em></h2><p>Culture is not a visual layer added at the end. Through Heritage of Sindh and the way I approach products, it becomes a source of meaning, memory and differentiation.</p><a href="https://heritageofsindh.com" target="_blank" rel="noreferrer">Visit Heritage of Sindh <ArrowUpRight /></a></div>
        </div>
      </section>

      <section className="v3-section v3-experience" data-3d-section>
        <div className="v3-scene" data-scene>
          <header className="v3-heading inverse"><span className="v3-label">10 / Experience</span><h2 data-kinetic>Built with<br />others.</h2><p>Teams, technology initiatives and ventures that shaped how I collaborate.</p></header>
          <div className="v3-experience-list">
            {experience.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3><p>Collaboration · Technology</p><ArrowUpRight /></div>)}
          </div>
        </div>
      </section>

      <section className="v3-section v3-hackathon" data-3d-section>
        <div className="v3-globe-card" data-scene data-tilt>
          <div className="v3-globe" aria-hidden="true"><i /><i /><i /><Globe2 /></div>
          <div><span className="v3-label">11 / Worldwide collaboration</span><h2 data-kinetic>GNEC UN<br />Hackathon 2026.</h2><p>Participated with a full international team—aligning different perspectives, time zones and skills around one shared outcome.</p></div>
        </div>
      </section>

      <section className="v3-section v3-evidence" data-3d-section>
        <div className="v3-evidence-layout" data-scene>
          <header><span className="v3-label">12 / Compounding evidence</span><h2 data-kinetic>Early chapters.<br /><em>Serious direction.</em></h2></header>
          <div className="v3-metric"><strong>03</strong><span>Years of focused study and practice</span></div>
          <div className="v3-metric maroon"><strong>03</strong><span>Live ventures across distinct industries</span></div>
          <div className="v3-metric gold"><strong>01</strong><span>Global hackathon team experience</span></div>
        </div>
      </section>

      <section className="v3-section v3-journal" id="journal" data-3d-section>
        <div className="v3-scene" data-scene>
          <header className="v3-heading"><span className="v3-label">13 / Field notes</span><h2 data-kinetic>Thinking<br /><em>in public.</em></h2><p>Build logs, lessons and ideas from the intersection of AI, business and culture.</p></header>
          <JournalFeed limit={3} />
          <a className="v3-text-link" href="/journal">Explore every note <ArrowUpRight /></a>
        </div>
      </section>

      <section className="v3-section v3-network" data-3d-section>
        <div className="v3-network-layout" data-scene>
          <div className="v3-network-heading"><span className="v3-label">14 / Network</span><h2 data-kinetic>One identity.<br /><em>Every signal.</em></h2><p>Follow the experiments, the work in progress and what comes next.</p></div>
          <div className="v3-social-list">
            {socials.map((social, index) => <a href={social.url} target="_blank" rel="noreferrer" key={social.label}><span>{String(index + 1).padStart(2, '0')}</span><h3>{social.label}</h3><p>{social.handle}</p><ArrowUpRight /></a>)}
            <DiscordCopy />
          </div>
        </div>
      </section>

      <section className="v3-section v3-contact" id="contact" data-3d-section>
        <div className="v3-contact-scene" data-scene>
          <div className="v3-contact-copy"><span className="v3-label">15 / Start something</span><h2 data-kinetic>What should exist<br /><em>that doesn’t yet?</em></h2><p>Bring the ambition. I’ll bring product thinking, intelligent systems and the craft to make it real.</p><div><MessageCircle /> Or use the live concierge in the bottom-left corner.</div></div>
          <ContactForm />
        </div>
      </section>

      <footer className="reference-footer" id="footer">
        <div className="reference-footer-top">
          <div>
            <span className="v3-label">Let’s build something worth remembering.</span>
            <h2>Have an idea?<br /><em>Let’s make it real.</em></h2>
          </div>
          <a className="reference-footer-cta" href="#contact">Get in touch <ArrowUpRight /></a>
        </div>
        <div className="reference-footer-links">
          <div><span>Social</span>{socials.slice(0, 4).map((social) => <a href={social.url} target="_blank" rel="noreferrer" key={social.label}>{social.label}<ArrowUpRight /></a>)}</div>
          <div><span>Navigate</span><a href="#work">Work</a><a href="#about">About</a><a href="#journal">Journal</a><a href="#contact">Contact</a></div>
          <div><span>Based in</span><p>Pakistan · Working globally</p></div>
        </div>
        <div className="reference-footer-bottom"><a className="v3-monogram" href="#top">YM<span>10</span></a><p>© 2026 Yamin Mastoi · Built with intent.</p><a href="#top">Back to top ↑</a></div>
      </footer>
      <VisitorChat />
    </main>
  );
}
