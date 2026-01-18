import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  BarChart3,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/initiatives', icon: Kanban, label: 'Initiatives' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-bg-secondary/80 backdrop-blur-xl border-r border-border transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center glow-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">MotionVii</h1>
              <p className="text-xs text-text-muted">SAAP 2026</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary glow-sm border border-primary/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )
              }
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-text-muted mb-1">Revenue Target 2026</p>
            <p className="text-xl font-bold text-primary">RM 1,000,000</p>
            <div className="mt-2 h-2 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'fixed top-4 left-4 z-50 p-3 rounded-lg glass lg:hidden',
          sidebarOpen && 'hidden'
        )}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
