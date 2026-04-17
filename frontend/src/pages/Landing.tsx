import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Brain, TrendingUp, Briefcase, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DigitalOrb from "@/components/DigitalOrb";
import FloatingStat from "@/components/FloatingStat";
import ekatvaLogo from "@/assets/ekatva-logo.png";

const stats = [
  { label: "Global Students", value: "240,000+" },
  { label: "AI Interactions", value: "12.5M" },
  { label: "Hiring Partners", value: "1,200+" },
  { label: "Average NPS", value: "140%" },
];

const features = [
  {
    icon: Brain,
    title: "Neural Tracking",
    desc: "Continuous monitoring of your academic progress and cognitive load to optimize study sessions through your Digital Twin.",
    cta: "Learn More",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    desc: "AI-driven foresight into skill gaps and performance trends, ensuring you're always ahead of industry demands.",
    cta: "Analyze Growth",
    accent: true,
  },
  {
    icon: Briefcase,
    title: "Hyper-Placement",
    desc: "Direct pipeline to top-tier hiring partners based on verified placement scores and project-based validation.",
    cta: "Open Dashboard",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border/20">
        <div className="flex items-center gap-2.5">
          <img src={ekatvaLogo} alt="EKATVA" className="w-7 h-7 invert" />
          <span className="text-lg font-bold tracking-tight text-foreground">EKATVA</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate("/dashboard")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
          <button onClick={() => navigate("/saarthi")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Saarthi AI</button>
          <button onClick={() => navigate("/career")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Placements</button>
          <button onClick={() => navigate("/community")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</button>
        </div>
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground px-5 rounded-full text-sm font-medium"
          onClick={() => navigate("/dashboard")}
        >
          Initialize Core
        </Button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-24 px-8">
        <div className="glass rounded-full px-4 py-1.5 mb-8 animate-fade-in-up flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Powered by <span className="text-accent">SAARTHI AI</span></span>
        </div>

        <h1 className="text-7xl md:text-[7rem] font-black tracking-tighter text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          EKATVA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light mb-4 animate-fade-in-up text-center max-w-lg" style={{ animationDelay: '200ms' }}>
          The Operating System for Student Life. <span className="text-accent italic">Predictive.</span>
        </p>
        <p className="text-lg text-muted-foreground font-light mb-16 animate-fade-in-up italic" style={{ animationDelay: '250ms' }}>
          Personal. Powerful.
        </p>

        {/* Orb section */}
        <div className="relative mb-16 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <DigitalOrb />
          <FloatingStat label="Academic GPA" value="3.92" icon="chart" position="top-2 -left-36" delay="600ms" />
          <FloatingStat label="Focus Score" value="88%" icon="target" position="top-2 -right-36" delay="800ms" />
          <FloatingStat label="Total XP" value="12.4k" icon="zap" position="bottom-8 -left-40" delay="1000ms" />
          <FloatingStat label="Placement" value="942" icon="award" position="bottom-8 -right-40" delay="1200ms" />
        </div>

        {/* CTA */}
        <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl glow-primary"
            onClick={() => navigate("/dashboard")}
          >
            Get Started with Saarthi
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border/50 text-foreground hover:bg-muted/30 px-8 py-6 text-base rounded-xl"
            onClick={() => navigate("/analytics")}
          >
            View Digital Twin
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 border-t border-border/20 py-12 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${600 + i * 100}ms` }}>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">{s.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Ecosystem Section */}
      <div className="relative z-10 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-3 animate-fade-in-up">Core Ecosystem</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12 animate-fade-in-up max-w-2xl leading-tight" style={{ animationDelay: '100ms' }}>
            Precision Intelligence for Every Career Step.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${
                  f.accent 
                    ? 'border-accent/30 bg-accent/5' 
                    : 'border-border/30 bg-card/40'
                }`}
                style={{ animationDelay: `${200 + i * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  f.accent ? 'bg-accent/10' : 'bg-muted/50'
                }`}>
                  <f.icon className={`w-5 h-5 ${f.accent ? 'text-accent' : 'text-primary'}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
                <button className={`text-sm font-medium flex items-center gap-1 ${f.accent ? 'text-accent' : 'text-primary'} hover:gap-2 transition-all`}>
                  {f.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/20 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground/60">
          <p>© 2026 EKATVA OS. All systems operational.</p>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Protocol</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Support</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Network Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
