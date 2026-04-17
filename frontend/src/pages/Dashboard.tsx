import DashboardLayout from "@/components/DashboardLayout";
import { Bot, TrendingUp, AlertTriangle, Zap, BookOpen, Target, Brain, Clock, Calendar, ArrowRight, Flame, FileText, ChevronRight, Award, ShieldCheck, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CapabilityRadar from "@/components/CapabilityRadar";

const milestones = [
  { title: "AI Research Paper", due: "Due in 3 days", priority: "urgent" },
  { title: "Tech Symposium", due: "Friday, 14:00", priority: "normal" },
  { title: "Math Quiz IV", due: "Next Monday", priority: "low" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { dashboardData: data, isLoading } = useDashboard();
  const dashboardData = data?.profile || {};
  const holistic = data?.holistic || { holisticScore: 0, achievements: [], participation: [] };
  
  const [activeAlert, setActiveAlert] = useState<number | null>(null);
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);

  // Map holistic data to radar data
  const radarData = [
    { subject: 'Academic', A: dashboardData.gpa * 10 || 70, fullMark: 100 },
    { subject: 'Technical', A: (holistic.achievements?.length || 0) * 25, fullMark: 100 },
    { subject: 'Social', A: 65, fullMark: 100 },
    { subject: 'Impact', A: (holistic.participation?.length || 0) * 30, fullMark: 100 },
    { subject: 'Consistency', A: (dashboardData.streak || 0) * 5, fullMark: 100 },
  ].map(d => ({ ...d, A: Math.min(d.A, 100) }));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-1 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Holistic Digital Twin Active
            </p>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Excellence Center</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? "Syncing quantum state..." : `Lv. ${dashboardData.level || 1} Scholar · ${holistic.achievements?.length || 0} Verified Credentials`}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="glass rounded-xl px-4 py-2 border border-primary/20 bg-primary/5">
                <p className="text-[9px] uppercase tracking-wider text-primary font-bold">Campus Master Score</p>
                <p className="text-2xl font-black text-foreground">{holistic.holisticScore || 0}<span className="text-xs text-muted-foreground font-normal">/100</span></p>
             </div>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="glass rounded-2xl p-5 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Academic GPA</p>
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{dashboardData.gpa || "0.0"}</p>
          </div>
          <div className="glass rounded-2xl p-5 border-l-4 border-accent">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendance</p>
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">{dashboardData.attendance || "0"}%</p>
          </div>
          <div className="glass rounded-2xl p-5 border-l-4 border-secondary">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Focus Streak</p>
              <Flame className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{dashboardData.streak || "0"} Days</p>
          </div>
          <div className="glass rounded-2xl p-5 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Participation</p>
              <Target className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{holistic.participation?.length || 0} Events</p>
          </div>
        </div>

        {/* Main Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Capability Radar */}
          <div className="lg:col-span-5 glass rounded-3xl p-6 flex flex-col animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h2 className="text-lg font-bold text-foreground">Capability Radar</h2>
                  <p className="text-xs text-muted-foreground">Multi-dimensional mastery analysis</p>
               </div>
               <Brain className="w-5 h-5 text-primary/40" />
            </div>
            <div className="flex-1 min-h-[300px]">
              <CapabilityRadar data={radarData} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
               <div className="p-3 rounded-2xl bg-muted/20 border border-border/40">
                  <p className="text-[9px] uppercase text-muted-foreground">Core Strength</p>
                  <p className="text-sm font-bold text-foreground">Technical Architecture</p>
               </div>
               <div className="p-3 rounded-2xl bg-muted/20 border border-border/40">
                  <p className="text-[9px] uppercase text-muted-foreground">Growth Area</p>
                  <p className="text-sm font-bold text-foreground">Community Impact</p>
               </div>
            </div>
          </div>

          {/* Right: Insights & Timeline */}
          <div className="lg:col-span-7 space-y-6">
            {/* Saarthi Insight */}
            <div className="glass rounded-3xl p-7 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border-primary/10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-accent animate-pulse" />
                <h2 className="text-lg font-bold text-foreground">Saarthi Pulse</h2>
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3 leading-tight">
                {data?.insights?.headline || "Initializing Intelligence..."}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xl">
                {data?.insights?.description || "Syncing with your digital twin to generate personalized career trajectory insights."}
              </p>
              <div className="flex gap-4">
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6 font-bold" onClick={() => navigate("/saarthi")}>
                  Full Analysis
                </Button>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                       {i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    +4
                  </div>
                </div>
              </div>
            </div>

            {/* Participation Pulse */}
            <div className="glass rounded-3xl p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
               <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-orange-500" /> Participation Pulse
               </h3>
               <div className="space-y-4">
                 {holistic.participation?.length > 0 ? (
                   holistic.participation.map((p: any, i: number) => (
                     <div key={i} className="flex items-center gap-4 relative">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <div className="flex-1 py-1">
                           <p className="text-sm font-semibold text-foreground">{p.event}</p>
                           <p className="text-[10px] text-muted-foreground uppercase">{p.date} · {p.role}</p>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-orange-500/10 text-[9px] font-bold text-orange-500 border border-orange-500/20">
                          VERIFIED
                        </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-xs text-muted-foreground italic">No recent participation data synced.</p>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* Credential Vault & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                   <Award className="w-5 h-5 text-accent" /> Credential Vault
                </h3>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{holistic.achievements?.length || 0} ASSETS</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {holistic.achievements?.length > 0 ? (
                 holistic.achievements.map((a: any, i: number) => (
                   <div key={i} className="p-4 rounded-2xl bg-muted/10 border border-border/40 hover:border-accent/40 transition-colors group cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                           <ShieldCheck className="w-5 h-5 text-accent" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                      <p className="text-sm font-bold text-foreground line-clamp-1">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{a.issuer}</p>
                   </div>
                 ))
               ) : (
                 <div className="col-span-2 py-8 text-center bg-muted/5 rounded-2xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">Unlock your first credential through Saarthi challenges.</p>
                 </div>
               )}
             </div>
          </div>

          <div className="glass rounded-3xl p-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
             <h3 className="text-sm font-bold text-foreground mb-4">Focus Pipeline</h3>
             <div className="space-y-3">
               {milestones.map((m, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                   <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                     m.priority === 'urgent' ? 'bg-destructive' : 'bg-accent'
                   }`} />
                   <div className="flex-1">
                     <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{m.title}</p>
                     <p className="text-[9px] text-muted-foreground uppercase">{m.due}</p>
                   </div>
                   <ChevronRight className="w-3 h-3 text-muted-foreground" />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
