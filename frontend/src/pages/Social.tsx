import DashboardLayout from "@/components/DashboardLayout";
import { Play, TrendingUp, Flame, Heart, MessageSquare, Share2, Bookmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createPost, commentOnPost } from "@/services/postService";
import { useAuth } from "@/hooks/useAuth";

const stories = [
  { name: "Your Story", isAdd: true },
  { name: "Priya" },
  { name: "Rahul" },
  { name: "Ananya" },
  { name: "Dev" },
  { name: "Sneha" },
];

const reels = [
  { title: "DSA in 60 seconds", views: "12K", author: "CodeGuru", duration: "0:58" },
  { title: "System Design Basics", views: "8.5K", author: "TechTalk", duration: "1:24" },
  { title: "ML Interview Prep", views: "15K", author: "AI Academy", duration: "2:10" },
  { title: "Resume Tips", views: "6.2K", author: "CareerBoost", duration: "1:45" },
];

const posts = [
  {
    author: "Priya Sharma",
    role: "ML Researcher · 3rd Year",
    content: "Just published my first research paper on federated learning! The journey from concept to publication took 8 months, but every late night was worth it. 🎉📄",
    likes: 142,
    comments: 28,
    shares: 45,
    time: "2h ago",
  },
  {
    author: "Rahul Verma",
    role: "Full Stack Dev · 2nd Year",
    content: "Looking for teammates for the upcoming hackathon. Need a designer and ML engineer. Project idea: AI-powered campus navigation. DM if interested! 🚀",
    likes: 67,
    comments: 35,
    shares: 12,
    time: "5h ago",
  },
];

const trending = [
  "#PlacementSeason", "#CodeChallenge", "#StartupLife", "#ResearchPaper", "#Hackathon2026", "#AIRevolution", "#CampusLife"
];

const Social = () => {
  const { user } = useAuth();
  const [localPosts, setLocalPosts] = useState(posts.map((p, i) => ({ ...p, id: i, liked: false, saved: false, commentsList: [] as string[] })));
  const [newPostContent, setNewPostContent] = useState("");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleLike = (id: number) => {
    setLocalPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleSave = (id: number) => {
    setLocalPosts(prev => prev.map(p => {
      if (p.id === id) {
        toast.success(p.saved ? "Removed from bookmarks" : "Post bookmarked!");
        return { ...p, saved: !p.saved };
      }
      return p;
    }));
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return toast.error("Post cannot be empty.");
    
    // Sync to Supabase
    if (user?.id) {
       await createPost(user.id, newPostContent);
    }
    
    const newPost = {
      id: Date.now(),
      author: user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "You",
      role: user?.profile?.course ?? "Student",
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      time: "Just now",
      liked: false,
      saved: false
    };
    setLocalPosts([newPost, ...localPosts]);
    setNewPostContent("");
    setIsPostDialogOpen(false);
    toast.success("Post created & synced successfully!");
  };

  const handleCreateComment = async () => {
    if (!commentText.trim() || activeCommentPost === null) return;
    setLocalPosts(prev => prev.map(p => {
      if (p.id === activeCommentPost) {
         return { ...p, comments: p.comments + 1, commentsList: [...(p.commentsList || []), commentText] };
      }
      return p;
    }));
    
    // Sync to Supabase
    if (user?.id) {
       await commentOnPost(activeCommentPost.toString(), user.id, commentText);
    }
    
    toast.success("Comment posted!");
    setCommentText("");
  };

  return (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Social Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">Stories, reels & campus pulse</p>
        </div>
        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Create Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new post</DialogTitle>
            </DialogHeader>
            <div className="pt-4 space-y-4">
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="What's mind-blowing today?"
                className="w-full bg-muted/20 border-border/50 rounded-xl p-3 min-h-[100px] text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button className="w-full bg-primary text-primary-foreground" onClick={handleCreatePost}>Publish Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto pb-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {stories.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
            <div className={`w-16 h-16 rounded-full p-0.5 ${s.isAdd ? 'border-2 border-dashed border-muted-foreground/30' : 'bg-gradient-to-br from-primary to-secondary'}`}>
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                {s.isAdd ? <Plus className="w-5 h-5 text-muted-foreground" /> : <span className="text-sm font-bold text-foreground">{s.name[0]}</span>}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Career Reels */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Career Reels</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reels.map((reel, i) => (
                <div key={i} className="glass rounded-2xl aspect-[3/4] flex flex-col justify-end cursor-pointer card-hover relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Play className="w-4 h-4 text-foreground/60 group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="absolute top-3 left-3 text-[9px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">{reel.duration}</div>
                  <div className="relative p-3">
                    <p className="text-sm font-semibold text-foreground">{reel.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{reel.author} · {reel.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          {localPosts.map((post, i) => (
            <div key={post.id} className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: `${300 + i * 100}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">{post.author[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{post.author}</p>
                  <p className="text-[10px] text-muted-foreground">{post.role} · {post.time}</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground">•••</button>
              </div>
              <p className="text-sm text-foreground/90 mb-4 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-5 text-muted-foreground pt-3 border-t border-border/30">
                <button className={`flex items-center gap-1.5 text-xs transition-colors ${post.liked ? 'text-destructive' : 'hover:text-destructive'}`} onClick={() => handleLike(post.id)}>
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} /> {post.likes}
                </button>
                <Dialog open={activeCommentPost === post.id} onOpenChange={(v) => !v && setActiveCommentPost(null)}>
                  <DialogTrigger border-none asChild>
                    <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors" onClick={() => setActiveCommentPost(post.id)}>
                      <MessageSquare className="w-4 h-4" /> {post.comments}
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Comments</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="max-h-[300px] overflow-y-auto space-y-3">
                        {post.commentsList && post.commentsList.length > 0 ? (
                           post.commentsList.map((c, idx) => (
                             <div key={idx} className="p-3 bg-muted/20 rounded-lg">
                               <p className="text-xs font-semibold mb-1">{(user?.profile?.first_name || "User")}</p>
                               <p className="text-sm text-foreground/80">{c}</p>
                             </div>
                           ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center">No comments yet. Be the first to start the conversation!</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Type a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                        <Button onClick={handleCreateComment}>Post</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors" onClick={() => {
                  toast.success("Shared successfully!");
                  setLocalPosts(prev => prev.map(p => p.id === post.id ? { ...p, shares: p.shares + 1 } : p));
                }}>
                  <Share2 className="w-4 h-4" /> {post.shares}
                </button>
                <button className={`flex items-center gap-1.5 text-xs transition-colors ml-auto ${post.saved ? 'text-primary' : 'hover:text-primary'}`} onClick={() => handleSave(post.id)}>
                  <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trending */}
          <div className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-destructive" />
              <h2 className="font-semibold text-foreground">Trending Now</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trending.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border border-border/20 cursor-pointer hover:border-primary/40 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Who to Follow */}
          <div className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="font-semibold text-foreground mb-4">Who to Follow</h2>
            <div className="space-y-3">
              {[
                { name: "Ananya Patel", role: "UI/UX Designer" },
                { name: "Dev Kumar", role: "Backend Engineer" },
                { name: "Sneha Mishra", role: "Data Scientist" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">{p.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.role}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-3 rounded-lg border-primary/30 text-primary" onClick={() => toast.success(`Following ${p.name}`)}>
                    Follow
                  </Button>
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

export default Social;
