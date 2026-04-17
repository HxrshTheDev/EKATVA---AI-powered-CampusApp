import DashboardLayout from "@/components/DashboardLayout";
import { Building, Calendar, Users, ArrowRight, Search, Globe, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { joinClub } from "@/services/clubService";

const categories = ["All Clubs", "Technical", "Cultural", "Social"];

const clubs = [
  {
    name: "IEEE Student Branch",
    desc: "Advancing technology for humanity through cutting-edge research in AI, robotics, and power systems. Join the world's largest technical community.",
    members: 680,
    tags: ["Robotics", "Research"],
    color: "from-primary to-secondary",
    icon: "⚡",
    cta: "Join Club"
  },
  {
    name: "GDG on Campus",
    desc: "Google Developer Groups for students. Master Firebase, Flutter, Android, and Cloud through hands-on hackathons and workshops.",
    members: 126,
    tags: ["DevOps", "Cloud"],
    color: "from-accent to-primary",
    icon: "🔥",
    cta: "Apply Now"
  },
  {
    name: "BeatBox & Rhythms",
    desc: "Where creativity meets performance. From classical harmonies to modern street dance, find your stage and showcase your soul.",
    members: 490,
    tags: ["Arts", "Drama"],
    color: "from-secondary to-accent",
    icon: "🎵",
    cta: "Join Club"
  },
];

const events = [
  { date: "OCT 24", title: "Quantum Hackathon 2024", time: "09:00 AM", location: "Tech Hub, Block C", action: "RSVP" },
  { date: "OCT 28", title: "AI Ethics Seminar", time: "02:30 PM", location: "Auditorium II", action: "RSVP" },
  { date: "NOV 02", title: "GDG: Flutter Forward", time: "10:00 AM", location: "Online Portal", action: "Link Sent" },
];

const trendingTags = ["#GenerativeAI", "#Web3", "#Finarts", "#Sustainability", "#ChessMasters"];

const Clubs = () => {
  const { user } = useAuth();
  const [joiningClubs, setJoiningClubs] = useState<Record<string, boolean>>({});

  const handleJoin = async (clubName: string) => {
    setJoiningClubs(prev => ({ ...prev, [clubName]: true }));
    
    if (user?.id) {
       await joinClub(user.id, clubName);
    }
    
    setTimeout(() => {
      setJoiningClubs(prev => ({ ...prev, [clubName]: false }));
      toast.success(`Welcome to ${clubName}! 🎉 (Synced to Supabase)`);
    }, 1500);
  };

  return (
  <DashboardLayout>
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Epic Intelligent Discovery
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Communities<br />& Synergy.
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-lg">
          Find your tribe in our high-performance ecosystem. From technical excellence to creative mastery, EKATVA connects you with the campus's elite groups.
        </p>
      </div>

      {/* Global Reach Badge */}
      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <div />
        <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Global Reach</p>
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 border-2 border-background flex items-center justify-center">
                <span className="text-[8px] font-bold text-primary-foreground">{i}</span>
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-accent/20 border-2 border-background flex items-center justify-center">
              <span className="text-[8px] text-accent">+1.8k</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Active members across 40+ specialized chapters.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 flex-wrap animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, technology, or interest..." className="pl-9 bg-muted/20 border-border/30 rounded-xl" />
        </div>
        <div className="flex gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Club Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {clubs.map((club, i) => (
          <div key={club.name} className="glass rounded-2xl overflow-hidden card-hover">
            <div className={`h-36 bg-gradient-to-br ${club.color} relative`}>
              <div className="absolute inset-0 bg-background/40" />
              <div className="absolute top-3 right-3 text-2xl">{club.icon}</div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-foreground mb-2">{club.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{club.desc}</p>
              <div className="flex gap-1.5 mb-4">
                {club.tags.map(t => (
                  <span key={t} className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted/30 text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" /> {club.members} Members
                </span>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg text-xs min-w-[80px]" onClick={() => handleJoin(club.name)} disabled={joiningClubs[club.name]}>
                  {joiningClubs[club.name] ? "Joining..." : club.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Next Pulse Events */}
        <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Next Pulse</h2>
              <p className="text-xs text-muted-foreground">Stay ahead of the competition with upcoming events.</p>
            </div>
            <button className="text-xs text-primary flex items-center gap-1">Full Calendar <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {events.map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/10 border border-border/20">
                <div className="text-center shrink-0 w-12">
                  <p className="text-[9px] uppercase tracking-wider text-accent">{e.date.split(' ')[0]}</p>
                  <p className="text-xl font-bold text-foreground">{e.date.split(' ')[1]}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{e.title}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                    <span>⏰ {e.time}</span> <span>📍 {e.location}</span>
                  </p>
                </div>
                <Button size="sm" variant={e.action === 'Link Sent' ? 'ghost' : 'outline'} className={`text-xs rounded-lg ${
                  e.action === 'Link Sent' ? 'text-muted-foreground' : 'border-accent/30 text-accent'
                }`} onClick={() => e.action !== 'Link Sent' && toast.success(`RSVP confirmed for ${e.title}`)}>
                  {e.action}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Start Your Tribe */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
            <h3 className="text-lg font-bold text-foreground mb-2">Start Your Own Tribe</h3>
            <p className="text-xs text-muted-foreground mb-4">Can't find what you're looking for? Propose a new club and lead the next generation.</p>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg" onClick={() => toast("Propose Club", { description: "Opening proposal form..." })}>
              Propose Club
            </Button>
          </div>

          {/* Trending Tags */}
          <div className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border border-border/20 cursor-pointer hover:border-primary/40 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 pt-6 pb-4 flex items-center justify-between text-[10px] text-muted-foreground/60 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
        <p>© 2026 EKATVA OS. All systems operational.</p>
        <div className="flex gap-6">
          <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Protocol</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Support</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Network Status</span>
        </div>
      </footer>
    </div>
  </DashboardLayout>
  );
};

export default Clubs;
