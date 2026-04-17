import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { getUserGamification, getLeaderboard } from "@/services/gamificationService";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Flame, Star, Target, Zap, Crown, Lock, Code, CheckCircle, ArrowRight, Award, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { updateXP } from "@/services/gamificationService";

const iconMap: Record<string, React.ElementType> = { Code, CheckCircle, Target, Zap, Trophy, Star };

const fallbackBadges = [
  { name: "Fast Starter", icon: "Zap",          unlocked: true  },
  { name: "Team Catalyst",icon: "Users",         unlocked: true  },
  { name: "Code Ninja",   icon: "Code",          unlocked: true  },
  { name: "Locked",       icon: "Lock",          unlocked: false },
  { name: "Locked",       icon: "Lock",          unlocked: false },
  { name: "Locked",       icon: "Lock",          unlocked: false },
];

const Gamification = () => {
  const { user } = useAuth();

  const { data: gamResp, isLoading } = useQuery({
    queryKey: ["gamification", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await getUserGamification(user.id);
      return res.success ? res.data : null;
    },
  });

  const { data: lbResp } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await getLeaderboard(6);
      return res.success ? res.data : [];
    },
  });

  const level       = gamResp?.level ?? 1;
  const totalXP     = gamResp?.xp ?? 0;
  const streak      = gamResp?.streak ?? 0;
  const xpToNext    = level * 1000;
  const xpProgress  = totalXP % 1000;
  const progressPct = Math.min((xpProgress / xpToNext) * 100, 100);
  const missions    = Array.isArray(gamResp?.dailyTasks) && gamResp.dailyTasks.length > 0 
    ? gamResp.dailyTasks 
    : [
        { title: "Attend Morning Classes", description: "Maintain 100% attendance before noon.", xpReward: 50, category: "Academic", icon: "CheckCircle", completed: false },
        { title: "Upload Algorithms Assignment", description: "Submit before the 11:59 PM deadline.", xpReward: 100, category: "Task", icon: "Code", completed: false },
        { title: "Review SAARTHI AI Match", description: "Check your placement readiness score.", xpReward: 25, category: "Discovery", icon: "Target", completed: false }
      ];
  const badges      = Array.isArray(gamResp?.badges) && gamResp.badges.length
    ? gamResp.badges.map((b: { name: string; icon?: string; unlocked?: boolean }) => ({ name: b.name, icon: b.icon ?? "Zap", unlocked: b.unlocked ?? false }))
    : fallbackBadges;

  const leaderboard: Array<{ name: string; role: string; xp: number; rank: number; isYou?: boolean }> = Array.isArray(lbResp) && lbResp.length > 0
    ? lbResp.map((u: any, i: number) => ({
        name: `${u.first_name ?? "User"} ${u.last_name ?? ""}`.trim(),
        role: u.role ?? "Student",
        xp: u.xp ?? 0,
        rank: i + 1,
        isYou: u.id === user?.id,
      }))
    : [
        { name: "Sarah Jenkins",  role: "Product Designer", xp: 32450, rank: 1 },
        { name: "Marcus Thorne",  role: "Sys Architect",    xp: 31900, rank: 2 },
        { name: `${user?.profile?.first_name ?? "You"}`,  role: "Student", xp: totalXP, rank: 14, isYou: true },
      ];

  const [localMissions, setLocalMissions] = useState<any[]>([]);
  const [localXP, setLocalXP] = useState(totalXP);

  useEffect(() => {
    if (missions.length > 0 && localMissions.length === 0) {
      setLocalMissions(missions);
    }
    setLocalXP(totalXP);
  }, [missions, totalXP]);

  const handleStartMission = async (missionTitle: string, reward: number) => {
    setLocalMissions(prev => prev.map(m => m.title === missionTitle ? { ...m, completed: true } : m));
    setLocalXP(prev => prev + reward);
    
    // Sync to Supabase
    if (user?.id) {
       await updateXP(user.id, reward);
    }
    
    toast.success(`Mission completed! +${reward} XP (Synced to Supabase)`);
  };

  const currentLevel       = gamResp?.level ?? 1;
  const currentTotalXP     = localXP;
  const xpToNextLevel      = currentLevel * 1000;
  const currentXpProgress  = currentTotalXP % 1000;
  const currentProgressPct = Math.min((currentXpProgress / xpToNextLevel) * 100, 100);

  const circumference = 2 * Math.PI * 52; // r=52

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Intelligence Hub</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent mt-1">Performance & Rewards Ecosystem</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-lg font-bold text-foreground">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${streak} Days`}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main */}
          <div className="lg:col-span-8 space-y-6">
            {/* Level Card */}
            <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Level ring */}
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity="0.3" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="8"
                      strokeDasharray={`${(currentProgressPct / 100) * circumference} ${circumference}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isLoading
                      ? <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      : <><span className="text-3xl font-bold text-foreground">{currentLevel}</span><span className="text-[10px] uppercase tracking-wider text-muted-foreground">LVL</span></>
                    }
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {currentLevel >= 20 ? "Elite Performer" : currentLevel >= 10 ? "Rising Star" : "Campus Explorer"}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Keep going — every task brings you closer to the top.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/20 rounded-xl p-3 text-center">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Total XP</p>
                      <p className="text-lg font-bold text-foreground">{isLoading ? "—" : currentTotalXP.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/20 rounded-xl p-3 text-center">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Next Level</p>
                      <p className="text-lg font-bold text-foreground">{isLoading ? "—" : `${xpToNextLevel - currentXpProgress}`}<span className="text-xs text-muted-foreground"> XP</span></p>
                    </div>
                    <div className="bg-muted/20 rounded-xl p-3 text-center">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Badges</p>
                      <p className="text-lg font-bold text-foreground">{badges.filter((b: { unlocked?: boolean }) => b.unlocked).length}</p>
                      <p className="text-[9px] text-muted-foreground">Unlocked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Missions */}
            <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Daily Intelligence Missions</h2>
                <span className="text-[9px] uppercase tracking-wider text-accent font-semibold px-2 py-0.5 bg-accent/10 rounded">
                  Resets midnight
                </span>
              </div>
              {isLoading ? (
                <div className="glass rounded-2xl p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : localMissions.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
                  No active missions — check back after midnight!
                </div>
              ) : (
                <div className="space-y-3">
                  {localMissions.map((m: { title?: string; description?: string; xpReward?: number; category?: string; icon?: string; completed?: boolean }, i: number) => {
                    const Icon = iconMap[m.icon ?? "Target"] ?? Target;
                    return (
                      <div key={i} className={`glass rounded-2xl p-5 flex items-center gap-4 ${m.completed ? "opacity-70" : ""}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.completed ? "bg-accent/10" : "bg-muted/30"}`}>
                          <Icon className={`w-5 h-5 ${m.completed ? "text-accent" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{m.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-3">
                          {m.completed ? (
                            <><span className="text-xs text-accent font-semibold">Done</span><Lock className="w-4 h-4 text-muted-foreground" /></>
                          ) : (
                            <><div><span className="text-sm font-bold text-accent">+{m.xpReward ?? 0} XP</span><p className="text-[9px] uppercase tracking-wider text-muted-foreground">{m.category}</p></div>
                            <Button size="sm" className="bg-accent text-accent-foreground rounded-lg text-xs h-8 px-3" onClick={() => handleStartMission(m.title || "", m.xpReward || 0)}>Start</Button></>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Leaderboard */}
            <div className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Leaderboard</h3>
                <span className="text-[10px] text-muted-foreground">Global</span>
              </div>
              <div className="space-y-3">
                {leaderboard.map((u, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${u.isYou ? "bg-primary/10 border border-primary/20" : "bg-muted/10"}`}>
                    <span className="w-6 text-center shrink-0 text-sm font-bold text-muted-foreground">{String(u.rank).padStart(2, "0")}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary-foreground">{u.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}{u.isYou && <span className="text-accent text-xs ml-1">(You)</span>}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{u.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-foreground">{u.xp.toLocaleString()}</span>
                      <p className="text-[9px] text-muted-foreground">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mastery Badges */}
            <div className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Mastery Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((b: { name: string; icon?: string; unlocked?: boolean }, i: number) => {
                  const Icon = iconMap[b.icon ?? ""] ?? (b.unlocked ? Star : Lock);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${b.unlocked ? "bg-gradient-to-br from-primary/20 to-secondary/20" : "bg-muted/20"}`}>
                        <Icon className={`w-5 h-5 ${b.unlocked ? "text-primary" : "text-muted-foreground/40"}`} />
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider text-center ${b.unlocked ? "text-muted-foreground" : "text-muted-foreground/40"}`}>{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* User XP Bar */}
        <div className="glass rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">{(user?.profile?.first_name ?? "U")[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "You"}</p>
            <p className="text-xs text-muted-foreground">Level {currentLevel}</p>
          </div>
          <div className="flex-1 max-w-[200px] ml-4">
            <div className="h-1.5 rounded-full bg-muted/30">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${currentProgressPct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{currentXpProgress} / {xpToNextLevel} XP</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Gamification;
