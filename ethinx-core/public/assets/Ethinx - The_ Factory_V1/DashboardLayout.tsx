import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Target,
  Flame,
  Brain,
  FileText,
  Wifi,
  WifiOff,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useAudioContext } from "@/contexts/AudioContext";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Command Center", path: "/" },
  { icon: Target, label: "Execution Tracker", path: "/execution" },
  { icon: Flame, label: "Revenue Forge", path: "/revenue-forge" },
  { icon: Brain, label: "Neural Recon", path: "/neural-recon" },
  { icon: FileText, label: "Blueprint", path: "/blueprint" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full industrial-border gold-glow">
          <div className="flex flex-col items-center gap-4">
            <div className="text-primary text-xs tracking-[0.3em] font-semibold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              ETHINX EMPIRE OS
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-center text-foreground" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              ACCESS REQUIRED
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Authentication is required to access the Empire OS Command Center. Initiate login sequence to proceed.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem" }}
          >
            INITIATE LOGIN
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find((item) => item.path === location);
  const isMobile = useIsMobile();
  const [wsConnected] = useState(false);
  const { isMuted, toggleMute } = useAudioContext();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft =
        sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-20 justify-center border-b border-border">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4 text-primary" />
              </button>
              {!isCollapsed ? (
                <div className="flex flex-col min-w-0">
                  <span
                    className="text-primary text-xs tracking-[0.2em] font-bold truncate"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    EMPIRE OS
                  </span>
                  <span className="text-[10px] text-muted-foreground tracking-wider mt-0.5">
                    T-DOG COMMAND CENTER
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 pt-2">
            {/* WebSocket Status */}
            {!isCollapsed && (
              <div className="px-4 py-2 mb-2">
                <div className="flex items-center gap-2 text-[10px] tracking-wider">
                  {wsConnected ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">HETZNER LIVE</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">SIMULATION MODE</span>
                    </>
                  )}
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                  91.99.162.243:3001
                </div>
              </div>
            )}

            {/* Audio Toggle */}
            <div className="px-4 py-1.5 mb-1">
              <button
                onClick={toggleMute}
                className="flex items-center gap-2 text-[10px] tracking-wider w-full group hover:text-primary transition-colors"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? (
                  <>
                    <VolumeOff className="h-3.5 w-3.5 text-red-400 group-hover:text-red-300 shrink-0" />
                    {!isCollapsed && (
                      <span className="text-red-400 group-hover:text-red-300">AUDIO MUTED</span>
                    )}
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-green-500 group-hover:text-green-400 shrink-0" />
                    {!isCollapsed && (
                      <span className="text-green-500 group-hover:text-green-400">AUDIO ACTIVE</span>
                    )}
                  </>
                )}
              </button>
            </div>

            <SidebarMenu className="px-2 py-1">
              {menuItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={item.label}
                      className="h-11 transition-all font-normal rounded-none"
                    >
                      <item.icon
                        className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-sm tracking-wider ${isActive ? "text-primary font-semibold" : ""}`}
                      >
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-none px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border border-primary/30 rounded-none shrink-0">
                    <AvatarFallback className="text-xs font-bold text-primary bg-primary/10 rounded-none">
                      {user?.name?.charAt(0).toUpperCase() || "T"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-semibold truncate leading-none text-foreground">
                      {user?.name || "T-Dog"}
                    </p>
                    <p className="text-[10px] text-primary/60 truncate mt-1 tracking-wider">
                      EMPIRE COMMANDER
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-none">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive rounded-none"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b border-border h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-none bg-background" />
              <div className="flex items-center gap-3">
                <span
                  className="tracking-wider text-primary text-sm"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {activeMenuItem?.label ?? "EMPIRE OS"}
                </span>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
