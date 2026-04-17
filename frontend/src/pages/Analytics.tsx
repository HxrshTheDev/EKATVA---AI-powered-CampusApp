import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Brain, TrendingUp, AlertTriangle, Target, Activity, Sliders, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const semesterData = [
  { sem: "SEM 1", actual: 3.4, predicted: null },
  { sem: "SEM 2", actual: 3.6, predicted: null },
  { sem: "SEM 3", actual: 3.5, predicted: null },
  { sem: "SEM 4", actual: 3.8, predicted: 3.8 },
  { sem: "PRED", actual: null, predicted: 3.9 },
];

const Analytics = () => {
  const [studyHours, setStudyHours] = useState(6.5);
  const [extracurricular, setExtracurricular] = useState<'LOW' | 'MOD' | 'HIGH'>('MOD');

  const maxGPA = Math.max(...semesterData.map(d => d.actual || d.predicted || 0));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Predictive Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time Digital Twin analysis of your academic trajectory.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border/50 rounded-lg gap-2">
              <Bell className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg gap-2">
              <Sliders className="w-3.5 h-3.5" /> Run Sync
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="glass rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-primary mb-3">Projected GPA</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">3.92</p>
              <span className="text-sm text-accent">+0.08</span>
            </div>
            <p className="text-xs text-accent mt-1">Predicted</p>
            <div className="mt-3 h-1 rounded-full bg-muted/30">
              <div className="h-full rounded-full bg-primary" style={{ width: '78%' }} />
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-accent mb-3">Placement Readiness</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">88</p>
              <span className="text-lg text-muted-foreground">/100</span>
              <span className="text-sm text-accent ml-1">Top 5%</span>
            </div>
            <div className="mt-3 flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-accent' : 'bg-muted/30'}`} />
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3">Burnout Risk</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">Low-Medium</p>
                <p className="text-xs text-muted-foreground">Slight trend up in stress markers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart & What-If */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* GPA Prediction Chart */}
          <div className="lg:col-span-3 glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">GPA Prediction Chart</h2>
                <p className="text-xs text-muted-foreground">Past semesters vs. AI-driven projections</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground/50" /> Actual</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Predicted</span>
              </div>
            </div>
            <div className="flex items-end gap-4 h-52 mt-6">
              {semesterData.map((d, i) => {
                const val = d.actual || d.predicted || 0;
                const height = ((val - 3) / 1.2) * 100;
                const isPredicted = d.predicted && !d.actual;
                return (
                  <div key={d.sem} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{val.toFixed(1)}</span>
                    <div className="w-full bg-muted/10 rounded-lg h-40 flex items-end justify-center p-1">
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          isPredicted
                            ? 'bg-accent/30 border-2 border-dashed border-accent'
                            : 'bg-gradient-to-t from-muted-foreground/30 to-muted-foreground/10'
                        }`}
                        style={{ height: `${Math.max(height, 10)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider ${isPredicted ? 'text-accent font-semibold' : 'text-muted-foreground'}`}>{d.sem}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What-If Simulator */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">What-If Simulator</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-6">Adjust parameters to see prediction changes.</p>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Daily Study Hours</p>
                  <span className="text-sm font-bold text-accent">{studyHours} hrs</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={0.5}
                  value={studyHours}
                  onChange={e => setStudyHours(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-muted/30 accent-accent cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Extracurricular Load</p>
                  <span className="text-sm text-muted-foreground">{extracurricular === 'LOW' ? 'Low' : extracurricular === 'MOD' ? 'Moderate' : 'High'}</span>
                </div>
                <div className="flex gap-2">
                  {(['LOW', 'MOD', 'HIGH'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setExtracurricular(level)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        extracurricular === level
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-card/80 border border-border/30">
              <p className="text-[10px] uppercase tracking-[0.15em] text-accent mb-2">Simulated Impact</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-accent">+0.12</p>
                  <p className="text-xs text-muted-foreground">GPA</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">+15%</p>
                  <p className="text-xs text-muted-foreground">Readiness</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Bar */}
        <div className="glass rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Arjun Sharma</p>
            <p className="text-xs text-muted-foreground">B.Tech CS, Year 3</p>
          </div>
          <div className="flex-1" />
          <p className="text-xs text-muted-foreground">Last sync: 2 minutes ago</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
