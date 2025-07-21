import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
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
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth, useApp } from '@/contexts';
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
    label: 'Management',
    items: [
      {
        title: 'Users',
        icon: Users,
        href: '/admin/users',
        badge: '12',
        color: 'from-orange-500 to-red-600',
      },
      {
        title: 'Posts',
        icon: Package,
        href: '/admin/posts',
        color: 'from-purple-500 to-pink-600',
      },
      {
        title: 'User Plans',
        icon: CreditCard,
        href: '/admin/user-plans',
        color: 'from-indigo-500 to-blue-600',
      },
    ],
  },
  {
    label: 'Configuration',
    items: [
      {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings',
        color: 'from-gray-500 to-slate-600',
      },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useApp();
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

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      <div className="flex h-full flex-col border-r border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Logo Section */}
        <div
          className={cn(
            'flex items-center gap-3 border-b border-slate-200/50 p-6 dark:border-slate-700/50',
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
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
              className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {sidebarSections.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                                'group relative mx-1 my-1 flex items-center justify-center overflow-hidden rounded-xl p-3 transition-all duration-200',
                                isActive
                                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-600 shadow-lg dark:text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
                              )}
                            >
                              {/* Animated background for active item */}
                              {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-50" />
                              )}

                              <div className="relative z-10">
                                <Icon
                                  className={cn(
                                    'h-5 w-5 transition-colors',
                                    isActive
                                      ? 'text-blue-600 dark:text-white'
                                      : 'text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white'
                                  )}
                                />
                                {(item.badge || item.isNew) && (
                                  <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                                )}
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            <p>{item.title}</p>
                            {item.badge && (
                              <p className="text-muted-foreground mt-1 text-xs">
                                {item.badge} items
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Link
                          to={item.href}
                          className={cn(
                            'group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 transition-all duration-200',
                            isActive
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-600 shadow-lg dark:text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
                          )}
                        >
                          {/* Animated background for active item */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-50" />
                          )}

                          <div
                            className={cn(
                              'relative z-10 rounded-lg p-2',
                              isActive && item.color ? `bg-gradient-to-r ${item.color}` : ''
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="relative z-10 flex-1 font-medium">{item.title}</span>
                          <div className="relative z-10 flex items-center gap-2">
                            {item.isNew && (
                              <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-2 py-1 text-xs text-white">
                                New
                              </span>
                            )}
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                              >
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

          {/* Footer */}
          <div className="border-t border-slate-200/50 p-4 dark:border-slate-700/50">
            {!sidebarCollapsed && (
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">© 2025 Aloha Market</p>
              </div>
            )}
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden transition-all duration-300 md:fixed md:inset-y-0 md:flex md:flex-col',
          sidebarCollapsed ? 'md:w-20' : 'md:w-72'
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn('transition-all duration-300', sidebarCollapsed ? 'md:pl-20' : 'md:pl-72')}
      >
        {/* Modern Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
                  >
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
                  className="hidden border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 md:flex"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search anything..."
                  className="border-slate-200 bg-slate-50/50 pl-10 text-slate-900 transition-colors placeholder:text-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-800"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <DollarSign className="h-4 w-4" />
                  Sales
                </Button>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="relative border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Notifications */}
              <Button
                variant="outline"
                size="icon"
                className="relative border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>

              {/* User Info & Logout */}
              <div className="flex items-center gap-3">
                {/* User Avatar & Name */}
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.userName || 'Admin'}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 text-slate-900 dark:text-slate-100">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
