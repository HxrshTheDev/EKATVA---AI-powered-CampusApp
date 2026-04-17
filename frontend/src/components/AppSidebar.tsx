import {
  LayoutDashboard, Bot, TrendingUp, Briefcase, Users, Play,
  Building, ShoppingBag, Trophy, Settings, HelpCircle, Command
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import ekatvaLogo from "@/assets/ekatva-logo.png";

const coreItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Saarthi AI", url: "/saarthi", icon: Bot },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Career", url: "/career", icon: Briefcase },
];

const socialItems = [
  { title: "Community", url: "/community", icon: Users },
  { title: "Social", url: "/social", icon: Play },
  { title: "Clubs", url: "/clubs", icon: Building },
];

const otherItems = [
  { title: "Marketplace", url: "/marketplace", icon: ShoppingBag },
  { title: "Gamification", url: "/gamification", icon: Trophy },
];

const NavItems = ({ items, collapsed }: { items: typeof coreItems; collapsed: boolean }) => (
  <SidebarMenu>
    {items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            activeClassName="bg-primary/10 text-primary font-medium border border-primary/20"
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="text-sm">{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
);

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/30">
      <SidebarContent className="py-4 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 mb-8">
          <img src={ekatvaLogo} alt="EKATVA" className="w-8 h-8 shrink-0 rounded-lg invert" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground">EKATVA</span>
          )}
        </div>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 px-3 mb-1">Core Hub</SidebarGroupLabel>}
          <SidebarGroupContent>
            <NavItems items={coreItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 px-3 mb-1">Social</SidebarGroupLabel>}
          <SidebarGroupContent>
            <NavItems items={socialItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 px-3 mb-1">More</SidebarGroupLabel>}
          <SidebarGroupContent>
            <NavItems items={otherItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1" />
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <>
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 transition-colors mb-3">
              <Command className="w-4 h-4" />
              <span className="text-sm font-medium">Global Command</span>
            </button>
            <div className="flex items-center gap-2 px-1">
              <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <HelpCircle className="w-3.5 h-3.5" /> Help
              </button>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
