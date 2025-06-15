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
  ChevronUp,
  Database,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Upload,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "./notification-bell";

interface AdminSidebarProps {
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
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        description: "Main dashboard overview",
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
        description: "Performance analytics",
      },
      {
        title: "Activity Log",
        url: "/admin/activity",
        icon: Activity,
        description: "System activity tracking",
      },
    ],
  },
  {
    title: "Payment Management",
    items: [
      {
        title: "Upload CSV",
        url: "/admin/upload",
        icon: Upload,
        description: "Upload payment records",
      },
      {
        title: "Payment Records",
        url: "/admin/payments",
        icon: FileText,
        description: "View all payment records",
      },
      {
        title: "Daily Reports",
        url: "/admin/reports",
        icon: Calendar,
        description: "Daily payment reports",
      },
      {
        title: "Export Data",
        url: "/admin/export",
        icon: Download,
        description: "Export payment data",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Distributors",
        url: "/admin/distributors",
        icon: Users,
        description: "Manage distributors",
      },
      {
        title: "User Accounts",
        url: "/admin/users",
        icon: UserCheck,
        description: "User account management",
      },
      {
        title: "Permissions",
        url: "/admin/permissions",
        icon: Shield,
        description: "Role & permissions",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        description: "System configuration",
      },
      {
        title: "Database",
        url: "/admin/database",
        icon: Database,
        description: "Database management",
      },
      {
        title: "Notifications",
        url: "/admin/notifications",
        icon: Bell,
        description: "Notification settings",
      },
    ],
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sidebar collapsible="icon" className="bg-background border-r">
      <SidebarHeader className="px-4 py-3 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">PaySplitr</span>
                  <Badge variant="secondary" className="text-xs w-fit mt-1">
                    Admin Panel
                  </Badge>
                </div>
              </div>
              <NotificationBell />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-6 last:mb-0">
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                      //   activeClassName="bg-blue-50 text-blue-600 hover:bg-blue-50"
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
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 font-medium">
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
                    href="/admin/profile"
                    className="cursor-pointer px-3 py-2 text-sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/account"
                    className="cursor-pointer px-3 py-2 text-sm"
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
