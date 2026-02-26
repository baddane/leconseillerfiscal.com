import { motion } from "motion/react";
import { 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  BookOpen, 
  Mail, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-lg border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center">
            <span className="text-gold font-serif font-bold text-lg">C</span>
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">Le Conseiller <span className="text-gold italic">Fiscal</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#" className="hover:text-gold transition-colors">Expertise</a>
          <a href="#" className="hover:text-gold transition-colors">Destinations</a>
          <a href="#" className="hover:text-gold transition-colors">Guides</a>
          <a href="#" className="bg-ink text-paper px-6 py-2.5 rounded-full hover:bg-gold hover:text-ink transition-all duration-300">
            Consultation
          </a>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-paper border-b border-ink/5 p-6 flex flex-col gap-4 text-center"
        >
          <a href="#" className="text-lg font-serif">Expertise</a>
          <a href="#" className="text-lg font-serif">Destinations</a>
          <a href="#" className="text-lg font-serif">Guides</a>
          <a href="#" className="bg-ink text-paper py-3 rounded-xl">Consultation</a>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="relative pt-40 pb-24 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-bold tracking-[0.2em] uppercase mb-6">
          Blueprint Stratégique v3.0
        </span>
        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
          L'Excellence <br />
          <span className="italic text-gold">Fiscale</span> sans Frontières.
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-ink/60 font-light leading-relaxed mb-12">
          Accompagnement premium pour expatriés et investisseurs. Optimisez votre patrimoine avec une expertise reconnue et une approche sur-mesure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-ink text-paper px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gold hover:text-ink transition-all group">
            Découvrir nos guides
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto border border-ink/10 px-10 py-4 rounded-full font-bold text-lg hover:bg-ink/5 transition-all">
            Parler à un expert
          </button>
        </div>
      </motion.div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl -z-0" />
  </section>
);

const Stats = () => (
  <section className="py-12 border-y border-ink/5 bg-white/30">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { label: "Destinations", value: "20+" },
        { label: "Articles Experts", value: "120" },
        { label: "Clients Accompagnés", value: "500+" },
        { label: "Économie Moyenne", value: "15%" },
      ].map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-3xl md:text-4xl font-serif font-black text-ink mb-1">{stat.value}</div>
          <div className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);

const PillarCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="p-8 rounded-3xl bg-white border border-ink/5 hover:border-gold/30 transition-all group"
  >
    <div className="w-14 h-14 rounded-2xl bg-paper flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
      <Icon className="w-7 h-7 text-gold" />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-ink/60 leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

const Pillars = () => (
  <section className="py-24 px-6 bg-paper">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <span className="text-gold font-bold tracking-widest uppercase text-xs mb-4 block">Nos Fondations</span>
          <h2 className="text-4xl md:text-6xl font-black leading-tight">Une approche rigoureuse pour des résultats concrets.</h2>
        </div>
        <div className="text-ink/60 max-w-sm text-sm leading-relaxed">
          Nous combinons expertise humaine et outils technologiques pour vous offrir la meilleure expérience fiscale du marché.
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PillarCard 
          icon={Globe} 
          title="Vision Globale" 
          desc="Une couverture exhaustive de 20 destinations clés pour les expatriés français."
          delay={0.1}
        />
        <PillarCard 
          icon={ShieldCheck} 
          title="Sécurité Juridique" 
          desc="Des conseils validés par des experts et basés sur les dernières conventions fiscales."
          delay={0.2}
        />
        <PillarCard 
          icon={TrendingUp} 
          title="Optimisation" 
          desc="Maximisez vos revenus et minimisez votre pression fiscale en toute légalité."
          delay={0.3}
        />
        <PillarCard 
          icon={BookOpen} 
          title="Pédagogie" 
          desc="Des guides clairs et accessibles pour comprendre les enjeux de votre expatriation."
          delay={0.4}
        />
      </div>
    </div>
  </section>
);

const Destinations = () => (
  <section className="py-24 px-6 bg-ink text-paper relative overflow-hidden">
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black mb-6">Destinations <span className="text-gold italic">Cibles</span></h2>
        <p className="text-paper/60 max-w-xl mx-auto">Explorez nos guides détaillés par pays pour préparer votre départ ou optimiser votre séjour.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { name: "Portugal", flag: "🇵🇹", tag: "NHR" },
          { name: "Émirats", flag: "🇦🇪", tag: "0% Impôt" },
          { name: "Suisse", flag: "🇨🇭", tag: "Frontaliers" },
          { name: "Espagne", flag: "🇪🇸", tag: "Loi Beckham" },
          { name: "Canada", flag: "🇨🇦", tag: "Résidence" },
          { name: "Belgique", flag: "🇧🇪", tag: "Succession" },
          { name: "Maurice", flag: "🇲🇺", tag: "Premium" },
          { name: "Thaïlande", flag: "🇹🇭", tag: "Nomad" },
          { name: "Luxembourg", flag: "🇱🇺", tag: "Holding" },
          { name: "Singapour", flag: "🇸🇬", tag: "Business" },
        ].map((country, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <span className="text-3xl mb-4 block">{country.flag}</span>
            <h4 className="text-lg font-bold mb-1">{country.name}</h4>
            <span className="text-[10px] text-gold font-bold tracking-widest uppercase">{country.tag}</span>
          </motion.div>
        ))}
      </div>
    </div>
    
    {/* Background Texture */}
    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-gold) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
  </section>
);

const Newsletter = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto bg-gold rounded-[40px] p-12 md:p-20 text-ink relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Restez informé des évolutions fiscales.</h2>
          <p className="text-ink/70 text-lg mb-8">Rejoignez 15,000+ expatriés et recevez nos analyses exclusives directement dans votre boîte mail.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className="flex-1 px-6 py-4 rounded-full bg-white/20 border border-ink/10 placeholder:text-ink/40 focus:outline-none focus:bg-white/40 transition-all"
            />
            <button className="bg-ink text-paper px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
              S'abonner <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="hidden lg:block w-64 h-64 bg-ink/5 rounded-full flex items-center justify-center">
          <Mail className="w-32 h-32 text-ink/20" />
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-ink text-paper pt-24 pb-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-paper rounded-full flex items-center justify-center">
              <span className="text-ink font-serif font-bold text-xl">C</span>
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight">Le Conseiller <span className="text-gold italic">Fiscal</span></span>
          </div>
          <p className="text-paper/40 max-w-sm leading-relaxed mb-8">
            La référence francophone de la fiscalité internationale. Expertise, clarté et accompagnement pour vos projets d'expatriation.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-ink transition-all cursor-pointer">
              <Globe className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-bold mb-6 uppercase tracking-widest text-xs text-gold">Expertise</h5>
          <ul className="flex flex-col gap-4 text-paper/60 text-sm">
            <li><a href="#" className="hover:text-paper transition-colors">Résidence Fiscale</a></li>
            <li><a href="#" className="hover:text-paper transition-colors">Exit Tax</a></li>
            <li><a href="#" className="hover:text-paper transition-colors">LMNP Expatrié</a></li>
            <li><a href="#" className="hover:text-paper transition-colors">Crypto & Fiscalité</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-6 uppercase tracking-widest text-xs text-gold">Ressources</h5>
          <ul className="flex flex-col gap-4 text-paper/60 text-sm">
            <li><a href="#" className="hover:text-paper transition-colors">Guides Pays</a></li>
            <li><a href="#" className="hover:text-paper transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-paper transition-colors">Calculateurs</a></li>
            <li><a href="#" className="hover:text-paper transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-paper/30 font-bold">
        <div>© 2026 Le Conseiller Fiscal. Tous droits réservés.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-paper transition-colors">Mentions Légales</a>
          <a href="#" className="hover:text-paper transition-colors">Confidentialité</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen selection:bg-gold selection:text-ink">
      <Navbar />
      <Hero />
      <Stats />
      <Pillars />
      <Destinations />
      
      {/* Editorial Quote Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-5xl font-serif mb-8 block">“</span>
            <blockquote className="text-3xl md:text-5xl font-serif italic leading-tight mb-12">
              La fiscalité ne doit plus être un frein à vos ambitions internationales, mais un levier de croissance pour votre patrimoine.
            </blockquote>
            <cite className="not-italic font-mono text-xs uppercase tracking-[0.3em] text-ink/40">
              — L'Équipe du Conseiller Fiscal
            </cite>
          </motion.div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}

