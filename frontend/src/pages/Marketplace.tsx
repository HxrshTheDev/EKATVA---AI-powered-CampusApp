import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { getListings, addToWishlist, checkoutItem } from "@/services/marketplaceService";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBag, MessageCircle, Shield, Heart, Grid3X3, List, Filter, Plus, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categories = ["All Items", "Gadgets", "Books", "Furniture", "Notes"];

const fallbackProducts = [
  { name: "iPad Pro M2 – 12.9\"",  price: "₹949",  originalPrice: "₹1,149", seller: "Alex Rivera",   category: "Gadgets",   verified: true,  desc: "Perfect condition, includes Apple Pencil…" },
  { name: "Algorithms & Data Structures", price: "₹45", seller: "Sarah Chen",     category: "Books",     verified: true,  desc: "Introduction to Algorithms (CLRS), 4th ed." },
  { name: "Ergonomic Office Chair", price: "₹120", seller: "Marcus Johnson", category: "Furniture", verified: false, desc: "Adjustable lumbar support, mesh back." },
  { name: "Sony WH-1000XM5",       price: "₹290", seller: "Elena Petrova",  category: "Gadgets",   verified: true,  desc: "Best-in-class noise cancelling." },
];

const chatMessages = [
  { sender: "Alex Rivera",  msg: "I can do ₹800 if you pick it up today.", time: "3M AGO" },
  { sender: "Elena Petrova", msg: "Sure, I'll send the location once payment is confirmed.", time: "14 MIN" },
];

const Marketplace = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{name: string, seller: string, price: string} | null>(null);

  const toggleWishlist = async (name: string) => {
    if (wishlist.includes(name)) {
      setWishlist(wishlist.filter(n => n !== name));
      toast.success("Removed from wishlist");
    } else {
      setWishlist([...wishlist, name]);
      if (user?.id) {
         await addToWishlist(user.id, name);
      }
      toast.success("Added to wishlist!");
    }
  };

  const { data: itemsResp, isLoading } = useQuery({
    queryKey: ["marketplace", activeCategory, searchQuery],
    queryFn: async () => {
      // In a real app we would pass activeCategory and searchQuery into the service
      const res = await getListings();
      if (!res.success) return [];
      let items = res.data;
      if (activeCategory !== "All Items") items = items.filter((i: any) => i.category === activeCategory);
      if (searchQuery) items = items.filter((i: any) => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return items;
    },
  });

  const rawItems = Array.isArray(itemsResp) ? itemsResp : [];
  const products = rawItems.length
    ? rawItems.map((item: { title?: string; price?: number; originalPrice?: number; seller?: { firstName?: string; lastName?: string } | string; category?: string; verified?: boolean; description?: string }) => ({
        name:          item.title ?? "Item",
        price:         `₹${item.price ?? 0}`,
        originalPrice: item.originalPrice ? `₹${item.originalPrice}` : undefined,
        seller:        typeof item.seller === "object"
          ? `${item.seller?.firstName ?? ""} ${item.seller?.lastName ?? ""}`.trim()
          : String(item.seller ?? "Seller"),
        category:      item.category ?? "Other",
        verified:      item.verified ?? false,
        desc:          item.description ?? "",
      }))
    : fallbackProducts;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Banner */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Marketplace v2.0</h1>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Secure, campus-wide trade powered by AI-verification. Buy, sell, and discover the next generation of academic and tech gear.
              </p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg" onClick={() => toast("Start Selling", { description: "Opening listing creator..." })}>Start Selling</Button>
                <Button size="sm" variant="outline" className="border-border/50 text-foreground rounded-lg" onClick={() => toast("Tutorial", { description: "Starting tutorial video..." })}>Watch Tutorial</Button>
              </div>
            </div>
            <div className="md:w-64 p-6 flex flex-col gap-3">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[9px] uppercase tracking-wider text-accent font-semibold">Verified</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Trust Score</p>
                <p className="text-lg font-bold text-foreground">Premium Trade</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Recommendation</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-accent" />
                  <p className="text-sm font-semibold text-foreground">Trending: Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse + Search */}
        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Browse Collections</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <button className="p-1.5 rounded bg-muted/30 text-muted-foreground hover:text-foreground" onClick={() => toast("Grid View enabled")}><Grid3X3 className="w-4 h-4" /></button>
              <button className="p-1.5 rounded text-muted-foreground hover:text-foreground" onClick={() => toast("List View enabled")}><List className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-xl max-w-sm"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {products.map((product: typeof fallbackProducts[0], i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden card-hover">
                <div className="relative h-40 bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground/20" />
                  <button className={`absolute top-3 right-3 p-1.5 rounded-full bg-background/60 transition-colors ${wishlist.includes(product.name) ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`} onClick={() => toggleWishlist(product.name)}>
                    <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.name) ? 'fill-current' : ''}`} />
                  </button>
                  <span className="absolute top-3 left-3 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold">{product.category}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-foreground leading-tight flex-1" title={product.name}>{product.name}</h3>
                    <div className="text-right shrink-0 ml-2">
                      {product.originalPrice && <span className="text-[10px] text-muted-foreground line-through block">{product.originalPrice}</span>}
                      <span className="text-base font-bold text-accent">{product.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] text-muted-foreground">{product.seller}</span>
                    {product.verified && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">{product.desc}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-border/30 text-foreground rounded-lg text-[10px] h-8" onClick={() => { setSelectedItem({name: product.name, seller: product.seller, price: product.price}); setChatOpen(true); }}>
                      <MessageCircle className="w-3 h-3 mr-1" /> Chat
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary text-primary-foreground rounded-lg text-[10px] h-8" onClick={() => { setSelectedItem({name: product.name, seller: product.seller, price: product.price}); setCheckoutOpen(true); }}>Buy Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* In-App Negotiation + Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="lg:col-span-3 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">In-App Negotiation</h2>
                <p className="text-xs text-muted-foreground">Secure messaging with end-to-end encryption</p>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-accent font-semibold px-2 py-0.5 bg-accent/10 rounded">Active Chats: 3</span>
            </div>
            <div className="space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary-foreground">{m.sender[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">{m.sender}</p>
                      <span className="text-[9px] text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">"{m.msg}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">Market Insights</p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Top Category</p>
                <p className="text-xl font-bold text-foreground">Tech Gadgets</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Listings</p>
                <p className="text-xl font-bold text-foreground">{rawItems.length ? `${rawItems.length}+ Items` : "1,248 Items"}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-xs text-muted-foreground italic">"Demand for 'Calculus Notes' has increased by 40% in the last 48 hours."</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAB */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground flex items-center justify-center shadow-lg glow-primary hover:scale-105 transition-transform" onClick={() => toast("Create Listing", { description: "Opening listing creator..." })}>
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Modals */}
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chat with {selectedItem?.seller}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-muted/10 border border-border h-48 flex items-end justify-start opacity-70">
                 <p className="text-xs text-muted-foreground text-center w-full">Say hi regarding "{selectedItem?.name}"!</p>
              </div>
              <div className="flex gap-2">
                 <Input placeholder="Type your message..." className="flex-1" />
                 <Button onClick={() => {toast.success("Message sent!"); setChatOpen(false);}}>Send</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-muted/10 border border-border">
                 <h3 className="font-semibold text-foreground mb-2">Item: {selectedItem?.name}</h3>
                 <p className="text-sm text-foreground mb-4">Total: <span className="font-bold text-accent">{selectedItem?.price}</span></p>
                 <div className="flex justify-between border-t border-border/50 pt-3">
                    <span className="text-xs text-muted-foreground">Seller: {selectedItem?.seller}</span>
                 </div>
              </div>
              <Button className="w-full bg-primary" onClick={async () => {
                if (user?.id && selectedItem) {
                   await checkoutItem(user.id, selectedItem.seller, selectedItem.name, selectedItem.price);
                }
                toast.success(`Purchase of ${selectedItem?.name} confirmed! Seller notified.`);
                setCheckoutOpen(false);
              }}>Pay and Checkout</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
