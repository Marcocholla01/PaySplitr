"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  ChevronUp,
  Clock,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "./notification-bell";

interface DistributorSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const navigationItems = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/distributor/dashboard",
        icon: LayoutDashboard,
        description: "Main dashboard overview",
      },
      {
        title: "Analytics",
        url: "/distributor/analytics",
        icon: BarChart3,
        description: "Your performance analytics",
      },
      {
        title: "Activity",
        url: "/distributor/activity",
        icon: Activity,
        description: "Recent activity log",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        title: "All Payments",
        url: "/distributor/payments",
        icon: CreditCard,
        description: "View all assigned payments",
      },
      {
        title: "Pending",
        url: "/distributor/payments/pending",
        icon: Clock,
        description: "Pending payments",
      },
      {
        title: "Completed",
        url: "/distributor/payments/completed",
        icon: CheckCircle,
        description: "Completed payments",
      },
      {
        title: "Today's Payments",
        url: "/distributor/payments/today",
        icon: Calendar,
        description: "Today's assigned payments",
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        title: "Payment History",
        url: "/distributor/history",
        icon: History,
        description: "Historical payment data",
      },
      {
        title: "Daily Reports",
        url: "/distributor/reports",
        icon: FileText,
        description: "Daily performance reports",
      },
      {
        title: "Export Data",
        url: "/distributor/export",
        icon: Download,
        description: "Export your payment data",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        url: "/distributor/settings",
        icon: Settings,
        description: "Account settings",
      },
      {
        title: "Notifications",
        url: "/distributor/notifications",
        icon: Bell,
        description: "Notification preferences",
      },
      {
        title: "Help & Support",
        url: "/distributor/help",
        icon: HelpCircle,
        description: "Get help and support",
      },
    ],
  },
];

export function DistributorSidebar({ user }: DistributorSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sidebar collapsible="icon" className="bg-background border-r">
      <SidebarHeader className="px-4 py-3 border-b">
        <SidebarMenu>
          <SidebarMenuButton>
            <SidebarMenuItem>
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">PaySplitr</span>
                    <Badge
                      variant="outline"
                      className="text-xs w-fit mt-1 bg-green-50 text-green-600 border-green-200"
                    >
                      Distributor
                    </Badge>
                  </div>
                </div>
                <NotificationBell />
              </div>
            </SidebarMenuItem>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-4 last:mb-0">
            <SidebarGroupLabel className="px-3 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.description}
                      className="px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                      //   activeClassName="bg-green-50 text-green-600 hover:bg-green-50"
                    >
                      <Link href={item.url} className="flex items-center">
                        <item.icon className="h-4 w-4 mr-3" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-2 py-3 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="px-3 py-2 rounded-md hover:bg-accent transition-colors w-full"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-green-100 text-green-600 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg shadow-lg border"
                side="top"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/distributor/profile"
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-green-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/distributor/account"
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-green-50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
