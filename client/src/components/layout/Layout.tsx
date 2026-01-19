import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { GlowBackground } from './GlowBackground';

export function Layout() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <GlowBackground />
      <Sidebar />
      <main className="lg:ml-64 min-h-screen relative z-10">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
