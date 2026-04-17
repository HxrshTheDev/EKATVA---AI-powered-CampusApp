import DashboardLayout from "@/components/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getAllPosts, likePost, commentOnPost } from "@/services/postService";
import { Users, Award, MessageSquare, Heart, Share2, ArrowRight, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fallbackPosts = [
  {
    author: "Sara Valarie",
    role: "Senior Architect · AI Inclusion",
    time: "2hr ago",
    content: "Just deployed the core module for the #EkatvaPulse engine. The predictive depth we're achieving with SAARTHI AI is truly transformative. 🚀",
    likes: 1268,
    comments: 86,
    shares: 310,
    liked: false,
  },
];

const trendingIntel = [
  { tag: "#QuantumComputing",   title: "The breakthrough in topological qubits" },
  { tag: "#NeuralArchitecture", title: "Mastering the Ghost Border technique..." },
  { tag: "#WebDev",             title: "Is 2024 the year of native browser power?" },
];

const reels = [
  { title: "Gradient Boost Patterns", views: "3.2k views", author: "ML Lab" },
  { title: "Cloud Native Intro",      views: "1.8k views", author: "GK Audit 101" },
  { title: "AI Integration",          views: "7.5k views", author: "BI Integration" },
];

const Community = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const { data: postsResp, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await getAllPosts();
      return res.success ? res.data : [];
    },
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => likePost(postId, user?.id || ""),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, text }: { postId: string, text: string }) => commentOnPost(postId, user?.id || "", text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      setCommentText("");
      toast.success("Comment added & synced to backend!");
    },
  });

  const rawPosts = Array.isArray(postsResp) ? postsResp : [];
  const posts = rawPosts.length
    ? rawPosts.map((p: any) => ({
        id:       p.id,
        author:   `${p.users?.first_name ?? "User"} ${p.users?.last_name ?? ""}`.trim(),
        role:     p.users?.role ?? "Student",
        time:     p.created_at ? new Date(p.created_at).toLocaleString() : "recently",
        content:  p.content ?? "",
        likes:    p.likes?.length ?? 0,
        commentsList: Array.isArray(p.comments) ? p.comments : [],
        commentsCount: Array.isArray(p.comments) ? p.comments.length : 0,
        shares:   p.shares ?? 0,
        liked:    Array.isArray(p.likes) && !!user && p.likes.includes(user.id),
      }))
    : fallbackPosts;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Career Reels */}
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Career Reels</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {reels.map((r, i) => (
                  <div key={i} className="relative rounded-2xl aspect-[4/5] bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden cursor-pointer group card-hover">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-xs font-semibold text-foreground">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{r.author} · {r.views}</p>
                    </div>
                    <div className="absolute top-3 right-3"><Play className="w-4 h-4 text-foreground/60" /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            {isLoading ? (
              <div className="glass rounded-2xl p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : (
              posts.map((p: typeof fallbackPosts[0] & { id?: string }, i) => (
                <div key={i} className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">{p.author[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.author}</p>
                      <p className="text-[10px] text-muted-foreground">{p.role}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-auto">{p.time}</span>
                  </div>
                  <p className="text-sm text-foreground/90 my-4 leading-relaxed">{p.content}</p>
                  <div className="flex items-center gap-6 text-muted-foreground pt-2 border-t border-border/30">
                    <button
                      onClick={() => { if(p.id) likeMutation.mutate(p.id); else toast.success("Liked post!"); }}
                      className={`flex items-center gap-1.5 text-xs hover:text-destructive transition-colors ${p.liked ? "text-destructive" : ""}`}
                    >
                      <Heart className={`w-4 h-4 ${p.liked ? "fill-current" : ""}`} /> {p.likes}
                    </button>
                    <Dialog open={activeCommentPost === p.id} onOpenChange={(v) => !v && setActiveCommentPost(null)}>
                      <DialogTrigger border-none asChild>
                        <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors" onClick={() => setActiveCommentPost(p.id)}>
                          <MessageSquare className="w-4 h-4" /> {p.commentsCount || p.comments}
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Community Discussion</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="max-h-[300px] overflow-y-auto space-y-3">
                            {p.commentsList && p.commentsList.length > 0 ? (
                               p.commentsList.map((c: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-muted/20 rounded-lg">
                                   <p className="text-xs font-semibold mb-1">Scholar</p>
                                   <p className="text-sm text-foreground/80">{c.text || c}</p>
                                 </div>
                               ))
                            ) : (
                              <p className="text-sm text-muted-foreground text-center">Start the discussion!</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Input placeholder="Type your insights..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                            <Button onClick={() => {
                              if (!p.id) return toast.error("Only synced posts can be commented on.");
                              commentMutation.mutate({ postId: p.id, text: commentText });
                            }} disabled={commentMutation.isPending}>Post</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors" onClick={() => toast.success("Post shared successfully!")}>
                      <Share2 className="w-4 h-4" /> {p.shares}
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Network Achievement */}
            <div className="glass rounded-2xl p-6 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-accent" />
                <p className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold">Network Achievement</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Marcus Zhao published 10 Github Repos.</h3>
                  <p className="text-sm text-muted-foreground">Contributing to the Open-Source Intelligence Initiative.</p>
                </div>
                <div className="flex gap-6">
                  {[{ v: 42, l: "AI Forks" }, { v: "12k", l: "XP Gain" }].map(s => (
                    <div key={s.l} className="text-center">
                      <p className="text-2xl font-bold text-foreground">{s.v}</p>
                      <p className="text-[10px] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Button size="sm" className="mt-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg" onClick={() => toast.success("Congratulated Marcus Zhao! 👏")}>Congratulate</Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile card */}
            <div className="glass rounded-2xl p-5 animate-fade-in-up text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary-foreground">{(user?.profile?.first_name ?? "U")[0]}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "You"}</h3>
              <p className="text-xs text-muted-foreground mb-3">{user?.profile?.course ?? "Student"} · @ EKATVA</p>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xl font-bold text-foreground">0</p><p className="text-[10px] text-muted-foreground">Connections</p></div>
                <div><p className="text-xl font-bold text-foreground">0</p><p className="text-[10px] text-muted-foreground">Posts</p></div>
              </div>
            </div>

            {/* Trending Intel */}
            <div className="glass rounded-2xl p-5 animate-fade-in-up">
              <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">Trending Intel</h3>
              <div className="space-y-4">
                {trendingIntel.map((t, i) => (
                  <div key={i} className="cursor-pointer group">
                    <p className="text-xs text-accent">{t.tag}</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
