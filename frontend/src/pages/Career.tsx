import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { getJobs, getUserApplications } from "@/services/jobService";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, CheckCircle, FileText, Video, Shield, Sparkles, Download, CircleDot, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { enrollInProgram, generateAndSaveExam, analyzeResumeAI, enhanceResumeAI } from "@/services/saarthiService";

const fallbackJobs = [
  { title: "Senior Neural Engineer",       company: "OpenAI",               location: "San Francisco (Remote)", tags: ["PYTHON", "LLMS", "CUDA"],    match: 96, color: "from-primary to-secondary" },
  { title: "Principal Product Designer",   company: "Linear",               location: "London (Hybrid)",        tags: ["DESIGN OPS", "FRAMER"],      match: 85, color: "from-secondary to-accent"  },
  { title: "Blockchain Architect",         company: "Ethereum Foundation",  location: "Global",                 tags: ["SOLIDITY", "RUST"],          match: 0,  isSkillGap: true, color: "from-accent to-primary" },
];

const eligibility = [
  { tier: "FAANG Tier",        desc: "Your DSA scores meet 92% of historical hire bars.",           eligible: true  },
  { tier: "Y-Combinator Roles", desc: "80% match based on early-stage project experience.",          eligible: true  },
  { tier: "FinTech Core",       desc: "Missing 'Financial Regulations' certification. 15% gap.",     eligible: false },
];

const Career = () => {
  const { user } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  const [examTopic, setExamTopic] = useState("");
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [examFile, setExamFile] = useState<File | null>(null);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [enrolledPrograms, setEnrolledPrograms] = useState<Record<string, boolean>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnroll = async (title: string) => {
    setEnrolledPrograms(prev => ({ ...prev, [title]: true }));
    if (user?.id) {
       await enrollInProgram(user.id, title);
    }
    toast.success(`Successfully enrolled in ${title}!`);
  };

  const handleDownloadAnalysis = async () => {
    if (!user?.id) return toast.error("Please login to analyze resume");
    setIsAnalyzing(true);
    toast("AI is analyzing...", { description: "Saarthi is reviewing your resume against market standards." });
    
    try {
      const res = await analyzeResumeAI(user.id);
      if (res.success) {
        const text = res.data;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Resume_Analysis_SAARTHI.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Detailed AI analysis downloaded!");
      } else {
        throw new Error(res.error);
      }
    } catch (e: any) {
      toast.error("Analysis failed: " + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnhanceResume = async () => {
    if (!user?.id) return toast.error("Please login to enhance resume");
    setIsEnhancing(true);
    toast("AI is enhancing...", { description: "Generating targeted bullet point improvements." });
    
    try {
      const res = await enhanceResumeAI(user.id);
      if (res.success) {
        toast.success("AI Enhancement suggestions generated!", {
          description: "Check your email for the optimized bullet points.",
          duration: 5000
        });
        console.log("AI Resume Enhancement:", res.data);
      } else {
        throw new Error(res.error);
      }
    } catch (e: any) {
      toast.error("Enhancement failed: " + e.message);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const { data: jobsResp, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await getJobs();
      return res.success ? res.data : [];
    },
  });

  const { data: myApps } = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await getUserApplications(user.id);
      return res.success ? res.data : [];
    },
  });

  // Merge live jobs with fallback
  const rawJobs = Array.isArray(jobsResp) ? jobsResp : [];
  const jobs = rawJobs.length
    ? rawJobs.map((j: { title?: string; company?: string; location?: string; skills?: string[]; matchScore?: number }) => ({
        title: j.title,
        company: j.company ?? "Company",
        location: j.location ?? "Remote",
        tags: (j.skills ?? []).slice(0, 3).map((s: string) => s.toUpperCase()),
        match: j.matchScore ?? 70,
        color: "from-primary to-secondary",
      }))
    : fallbackJobs;

  const applications = Array.isArray(myApps) && myApps.length > 0
    ? myApps.slice(0, 3).map((a: any) => ({
        company: a.jobs?.company ?? "Company",
        role:    a.jobs?.title  ?? "Role",
        status:  a.status      ?? "Applied",
        date:    "Pending",
        color:   "text-primary",
      }))
    : [
        { company: "Google",    role: "SDE Role",       status: "Interview", date: "Oct 24, 7:00 PM",  color: "text-accent"   },
        { company: "Anthropic", role: "AI Alignment",   status: "Applied",   date: "Wait: 4 Days",    color: "text-primary"  },
        { company: "Stripe",    role: "Product Eng",    status: "Feedback",  date: "Feedback lim.",   color: "text-secondary"},
      ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in-up">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-1">Career Architecture</p>
            <h1 className="text-3xl font-bold text-foreground">Future Hub</h1>
          </div>
          <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">AI Readiness</span>
          </div>
        </div>

        {/* Resume Intelligence + Eligibility */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="lg:col-span-3 glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">Resume Intelligence</h2>
            <p className="text-sm text-muted-foreground mb-5">SAARTHI has analyzed your latest resume. We found high alignment with Quant Finance and ML Research roles.</p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: "ATS Score",    value: "88",      sub: "/100",   bar: 88 },
                { label: "Keyword Match",value: "72",      sub: "%",      bar: 72 },
                { label: "Formatting",   value: "Optimal", sub: "",       bar: 100 },
              ].map(s => (
                <div key={s.label} className="bg-muted/20 rounded-xl p-4 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{s.label}</p>
                  <p className="text-3xl font-bold text-foreground">{s.value}</p>
                  {s.sub && <p className="text-xs text-muted-foreground">{s.sub}</p>}
                  <div className="mt-2 h-1 rounded-full bg-muted/30">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${s.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg gap-2" onClick={handleEnhanceResume} disabled={isEnhancing}>
                {isEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Enhance with AI
              </Button>
              <Button size="sm" variant="outline" className="border-border/50 text-foreground rounded-lg gap-2" onClick={handleDownloadAnalysis} disabled={isAnalyzing}>
                {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Download Analysis
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Eligibility Checker</h2>
            <div className="space-y-4">
              {eligibility.map((e, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center ${e.eligible ? "bg-accent/20" : "bg-destructive/20"}`}>
                    {e.eligible ? <CheckCircle className="w-3 h-3 text-accent" /> : <CircleDot className="w-3 h-3 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{e.tier}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Neural Opportunities */}
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Neural Opportunities</h2>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobs.map((job, i) => (
              <div key={i} className="glass rounded-2xl p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center`}>
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {job.isSkillGap
                    ? <span className="text-[10px] uppercase tracking-wider text-destructive font-semibold px-2 py-0.5 bg-destructive/10 rounded">Skills Gap</span>
                    : <span className="text-[10px] uppercase tracking-wider text-accent font-semibold px-2 py-0.5 bg-accent/10 rounded">{job.match}% Match</span>
                  }
                </div>
                <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{job.company} · {job.location}</p>
                <div className="flex gap-1.5 mb-4">
                  {job.tags.map((t: string) => (
                    <span key={t} className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted/30 text-muted-foreground">{t}</span>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full border-border/50 text-foreground rounded-lg text-xs" onClick={() => toast.success(`Viewing analytics for ${job.title}`)}>View Analytics</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Simulator + Active Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Video className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Interview Simulator</h2>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-accent mb-4">Powered by SAARTHI Voice-AI</p>
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary/50" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">Practice behavioral and technical responses with real-time sentiment, eye contact, and accuracy feedback.</p>
                <div className="space-y-2 mb-4">
                  {["Real-time tone analysis", "Company-specific question banks"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-accent" /> {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-glow-pulse" />
                  <span className="text-xs text-destructive font-semibold">LIVE SESSION</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground rounded-lg">Enter Portal</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] bg-background border-border">
                    <DialogHeader>
                      <DialogTitle>Interview Simulator: Live Session</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video bg-muted/20 border border-border/50 rounded-xl relative overflow-hidden flex flex-col items-center justify-center mt-4">
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 px-2 py-1 rounded border border-border/50">
                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        <span className="text-[10px] font-bold">REC</span>
                      </div>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-4">
                        <Video className="w-8 h-8 text-primary/50" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Waiting for camera access...</p>
                      <p className="text-xs text-muted-foreground mt-2">Saarthi is initializing behavioral tracking.</p>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                        <Button variant="outline" className="bg-background/80 rounded-full w-10 h-10 p-0"><Video className="w-4 h-4" /></Button>
                        <Button variant="default" className="bg-destructive text-destructive-foreground rounded-full px-6">Leave Simulator</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Active Journey</h2>
            </div>
            <div className="space-y-4">
               {applications.slice(0, showHistory ? applications.length : 3).map((j, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                  <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-foreground">{j.company[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{j.company}</p>
                    <p className="text-xs text-muted-foreground">{j.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${j.color}`}>{j.status}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{j.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-1 text-xs text-primary font-medium mt-4 hover:gap-2 transition-all" onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? "Hide History" : "View Full History"} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        {/* Training & Placement + Syllabus Test Generation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          {/* Training & Placement */}
          <div className="glass rounded-2xl p-6">
             <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Training & Placement Program</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Join structured training cohorts led by industry experts. Gain practical skills required by top recruiters.</p>
            <div className="space-y-3 mb-5">
              {[
                { title: "Full-Stack Web Dev Bootcamp", status: "Admissions Open", accent: "text-green-500" },
                { title: "Advanced Python & Data Science", status: "Ongoing", accent: "text-blue-500" },
              ].map(prog => (
                <div key={prog.title} className="flex justify-between items-center p-3 rounded-lg bg-muted/20 border border-muted/50">
                   <div>
                      <p className="font-medium text-sm text-foreground">{prog.title}</p>
                      <p className={`text-[10px] uppercase font-bold mt-1 ${prog.accent}`}>{prog.status}</p>
                   </div>
                   <Button size="sm" variant={enrolledPrograms[prog.title] ? "default" : "ghost"} className={enrolledPrograms[prog.title] ? "bg-primary text-primary-foreground" : ""} onClick={() => handleEnroll(prog.title)} disabled={enrolledPrograms[prog.title]}>
                      {enrolledPrograms[prog.title] ? "Enrolled" : "Enroll"}
                   </Button>
                </div>
              ))}
            </div>
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20" onClick={() => toast.info("Opening Placement Guidelines")}>View Placement Guidelines</Button>
          </div>

          {/* Targeted Syllabus Testing */}
          <div className="glass rounded-2xl p-6">
             <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Custom Syllabus Test</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Select a subject from your syllabus to generate a highly targeted proficiency test. E.g., Python, React.</p>
            
            <Dialog>
              <DialogTrigger asChild>
                <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center cursor-pointer hover:bg-muted/10 transition-colors">
                   <div className="w-12 h-12 bg-accent/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                     <FileText className="w-6 h-6 text-accent" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-1">Generate Test</h3>
                   <p className="text-xs text-muted-foreground">Click to customize your next mock exam</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Specific Concept Test</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                   {!isTakingExam ? (
                     <>
                       <div>
                         <label className="text-xs font-semibold text-foreground mb-2 block">Upload Syllabus Document (PDF/TXT) <span className="text-muted-foreground font-normal ml-1">Optional</span></label>
                         <Input type="file" className="w-full text-xs file:bg-primary file:text-primary-foreground file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 cursor-pointer mb-4" onChange={(e) => setExamFile(e.target.files ? e.target.files[0] : null)} accept=".pdf,.txt,.doc,.docx" />
                         <label className="text-xs font-semibold text-foreground mb-2 block">Or Enter Subject/Topic</label>
                         <Input placeholder="e.g. Python, Object Oriented Programming, Networking" className="w-full" value={examTopic} onChange={(e) => setExamTopic(e.target.value)} />
                       </div>
                       <Button className="w-full bg-accent text-accent-foreground" disabled={isGenerating} onClick={async () => {
                          if(!examTopic && !examFile) return toast.error("Please enter a topic or upload a document");
                          setIsGenerating(true);
                          toast("Analyzing...", { description: `Requesting SAARTHI AI to generate your test.` });
                          
                          try {
                            const actualTopic = examTopic || (examFile ? examFile.name : "General Concept");
                            if (user?.id) {
                               const res = await generateAndSaveExam(user.id, actualTopic, !!examFile);
                               if (res.success && res.data && res.data.questions) {
                                  setExamQuestions(res.data.questions);
                               } else {
                                  throw new Error("Failed to parse test format");
                               }
                            } else {
                               throw new Error("User not found");
                            }
                          } catch (e) {
                             console.error(e);
                             toast.error("Failed to connect to Supabase, falling back to mock test.");
                             setExamQuestions([{
                                id: 1,
                                text: `What is the optimal algorithm complexity relevant to ${examTopic}?`,
                                options: ["O(N)", "O(N log N)", "O(N^2)", "O(1)"]
                             }]);
                          } finally {
                             setIsGenerating(false);
                             setIsTakingExam(true);
                          }
                       }}>
                         {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Generating Test...</> : "Generate Exam Now"}
                       </Button>
                     </>
                   ) : (
                     <div className="space-y-4">
                       {examQuestions.map((q, qIndex) => (
                         <div key={q.id} className="p-4 rounded-xl border border-border bg-muted/10">
                           <h3 className="font-semibold text-foreground mb-4">Question {qIndex + 1}: {examTopic || "Document Concepts"}</h3>
                           <p className="text-sm text-foreground/80 mb-4">{q.text}</p>
                           <div className="space-y-2">
                             {q.options.map((opt: string, idx: number) => (
                               <label key={idx} className="flex items-center gap-2 p-2 border border-border/50 rounded cursor-pointer hover:bg-muted/20">
                                 <input type="radio" name={`pseudo-exam-${q.id}`} className="accent-primary" />
                                 <span className="text-sm text-muted-foreground">{opt}</span>
                               </label>
                             ))}
                           </div>
                         </div>
                       ))}
                       <div className="flex gap-2">
                          <Button className="w-full" onClick={() => {
                             setIsTakingExam(false);
                             setExamTopic("");
                             setExamFile(null);
                             toast.success(`Exam submitted successfully! Score: 10/10`);
                          }}>Submit Test</Button>
                       </div>
                     </div>
                   )}
                </div>
              </DialogContent>
            </Dialog>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Career;
