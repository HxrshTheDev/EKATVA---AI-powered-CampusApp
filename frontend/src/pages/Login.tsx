import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginUser, signUpUser } from "@/services/authService";
import { Brain, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ekatvaLogo from "@/assets/ekatva-logo.png";

type Mode = "login" | "register";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading: authLoading } = useAuth() as any; // Ignore old context methods

  const [mode, setMode] = useState<Mode>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    college: "",
    course: "B.Tech",
    year: "3",
    rollNumber: "",
  });

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (mode === "login") {
        const res = await loginUser(form.email, form.password);
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await signUpUser(form.email, form.password, {
          firstName: form.firstName,
          lastName: form.lastName,
          college: form.college || "EKATVA University",
          course: ["B.Tech","M.Tech","BCA","MCA","B.Sc","M.Sc","MBA","Other"].includes(form.course)
            ? form.course : "B.Tech",
          year: Math.min(4, Math.max(1, parseInt(form.year) || 3)),
          rollNumber: form.rollNumber || "ROLL-001",
          role: "student",
        });
        if (!res.success) throw new Error(res.error);
      }
      navigate("/dashboard");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.12)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.12)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <img src={ekatvaLogo} alt="EKATVA" className="w-8 h-8 invert" />
            <span className="text-2xl font-black tracking-tight text-foreground">EKATVA</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
            {mode === "login" ? "Access your Intelligence Hub" : "Initialize your Campus Identity"}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-border/30">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-muted/20 p-1 mb-6">
            {(["login", "register"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register-only fields */}
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">First Name</label>
                    <Input
                      value={form.firstName}
                      onChange={e => set("firstName", e.target.value)}
                      placeholder="Arjun"
                      required
                      className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl h-10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Last Name</label>
                    <Input
                      value={form.lastName}
                      onChange={e => set("lastName", e.target.value)}
                      placeholder="Sharma"
                      required
                      className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl h-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">College</label>
                  <Input
                    value={form.college}
                    onChange={e => set("college", e.target.value)}
                    placeholder="IIT Bombay"
                    className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Course</label>
                    <select
                      value={form.course}
                      onChange={e => set("course", e.target.value)}
                      className="w-full bg-muted/20 border border-border/40 text-foreground rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {["B.Tech","M.Tech","BCA","MCA","B.Sc","M.Sc","MBA","Other"].map(c => (
                        <option key={c} value={c} className="bg-background">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Year</label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={form.year}
                      onChange={e => set("year", e.target.value)}
                      placeholder="3"
                      className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl h-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Roll Number</label>
                  <Input
                    value={form.rollNumber}
                    onChange={e => set("rollNumber", e.target.value)}
                    placeholder="CS2024001"
                    className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl h-10"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="you@college.edu"
                required
                className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl h-10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl h-11 font-semibold mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Access Hub" : "Initialize Account"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick demo */}
          <div className="mt-5 pt-5 border-t border-border/30">
            <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-wider mb-3">Quick Demo</p>
            <Button
              type="button"
              variant="outline"
              className="w-full border-border/40 text-muted-foreground hover:text-foreground rounded-xl h-9 text-xs"
              onClick={async () => {
                setForm(f => ({ ...f, email: "demo@ekatva.campus", password: "Demo@12345" }));
                setMode("login");
                setIsLoading(true);
                try {
                  const loginRes = await loginUser("demo@ekatva.campus", "Demo@12345");
                  if (loginRes.success) {
                    navigate("/dashboard");
                  } else {
                    const regRes = await signUpUser("demo@ekatva.campus", "Demo@12345", {
                      firstName: "Demo", lastName: "User",
                      college: "EKATVA University", course: "B.Tech",
                      year: 3, rollNumber: "EC-DEMO-001", role: "student",
                    });
                    if (regRes.success) navigate("/dashboard");
                    else throw new Error(regRes.error);
                  }
                } catch (err: any) {
                  setError(err.message || "Demo login failed");
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <Brain className="w-3.5 h-3.5 mr-2 text-accent" />
              Enter with Demo Credentials
            </Button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-6 uppercase tracking-wider">
          © 2026 EKATVA OS · All systems operational
        </p>
      </div>
    </div>
  );
};

export default Login;
