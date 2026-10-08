'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  Menu,
  X,
  LogOut,
  BarChart3,
  MessageSquare,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else if (!isLoginPage) {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🍛</div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page renders bare, with no sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🍛</div>
          <p className="text-muted">Redirecting...</p>
        </div>
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Leads', icon: Users, href: '/admin/leads' },
    { label: 'Blogs', icon: FileText, href: '/admin/blogs' },
    { label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-screen w-72 bg-card border-r border-border z-40 overflow-y-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🍛</span>
            <div>
              <p className="font-bold text-lg">Daddu&apos;s</p>
              <p className="text-xs text-muted">Admin</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive ? 'bg-accent/15 text-accent' : 'hover:bg-card-hover'
                }`}
              >
                <item.icon
                  size={20}
                  className={isActive ? 'text-accent' : 'text-muted group-hover:text-accent'}
                />
                <span className={isActive ? '' : 'group-hover:text-accent transition-colors'}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-0'} transition-all`}>
        {/* Top Bar */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-card-hover rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="text-lg font-semibold">Admin Panel</h1>

          <div className="text-sm text-muted">{new Date().toLocaleDateString()}</div>
        </div>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
