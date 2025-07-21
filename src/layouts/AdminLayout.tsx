import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Menu,
  LogOut,
  Bell,
  Search,
  User,
  TrendingUp,
  DollarSign,
  Moon,
  Sun,
  Maximize2,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  color?: string;
  isNew?: boolean;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard',
        color: 'from-blue-500 to-purple-600'
      },
      {
        title: 'Analytics',
        icon: BarChart3,
        href: '/admin/analytics',
        color: 'from-green-500 to-emerald-600'
      },
    ]
  },
  {
    label: 'Management',
    items: [
      {
        title: 'Users',
        icon: Users,
        href: '/admin/users',
        badge: '12',
        color: 'from-orange-500 to-red-600'
      },
      {
        title: 'Products',
        icon: Package,
        href: '/admin/products',
        color: 'from-purple-500 to-pink-600'
      },
      {
        title: 'Orders',
        icon: ShoppingCart,
        href: '/admin/orders',
        badge: '3',
        color: 'from-teal-500 to-cyan-600',
        isNew: true
      },
      {
        title: 'User Plans',
        icon: CreditCard,
        href: '/admin/user-plans',
        color: 'from-indigo-500 to-blue-600'
      },
    ]
  },
  {
    label: 'Configuration',
    items: [
      {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings',
        color: 'from-gray-500 to-slate-600'
      },
    ]
  }
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const location = useLocation();

  // Apply dark mode class to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const SidebarContent = () => (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700">
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 p-6 border-b border-slate-200/50 dark:border-slate-700/50",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Aloha Market</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.label}>
            {!sidebarCollapsed && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <div key={item.href}>
                    {sidebarCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "group flex items-center rounded-xl transition-all duration-200 relative overflow-hidden justify-center p-3 mx-1 my-1",
                              isActive 
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-600 dark:text-white shadow-lg" 
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            )}
                          >
                            {/* Animated background for active item */}
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-50" />
                            )}
                            
                            <div className="relative z-10">
                              <Icon className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-blue-600 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                              )} />
                              {(item.badge || item.isNew) && (
                                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                              )}
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          <p>{item.title}</p>
                          {item.badge && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.badge} items
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "group flex items-center rounded-xl transition-all duration-200 relative overflow-hidden gap-3 px-3 py-3",
                          isActive 
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-600 dark:text-white shadow-lg" 
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        )}
                      >
                        {/* Animated background for active item */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-50" />
                        )}
                        
                        <div className={cn(
                          "p-2 rounded-lg relative z-10",
                          isActive && item.color ? `bg-gradient-to-r ${item.color}` : ""
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 font-medium relative z-10">{item.title}</span>
                        <div className="flex items-center gap-2 relative z-10">
                          {item.isNew && (
                            <span className="px-2 py-1 text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full">
                              New
                            </span>
                          )}
                          {item.badge && (
                            <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        {!sidebarCollapsed && (
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © 2025 Aloha Market
            </p>
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:fixed md:inset-y-0 md:flex md:flex-col transition-all duration-300",
        sidebarCollapsed ? "md:w-20" : "md:w-72"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "md:pl-20" : "md:pl-72"
      )}>
        {/* Modern Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* Collapsed sidebar toggle for desktop */}
              {sidebarCollapsed && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarCollapsed(false)}
                  className="hidden md:flex border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 transition-colors text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <DollarSign className="h-4 w-4" />
                  Sales
                </Button>
              </div>

              {/* Theme Toggle */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="relative border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Notifications */}
              <Button variant="outline" size="icon" className="relative border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                      <AvatarImage src="/avatars/01.png" alt="Admin" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-slate-900 dark:text-slate-100">John Admin</p>
                      <p className="w-48 truncate text-sm text-slate-500 dark:text-slate-400">
                        admin@alohamarket.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Maximize2 className="mr-2 h-4 w-4" />
                    <span>View Store</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 text-slate-900 dark:text-slate-100">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
