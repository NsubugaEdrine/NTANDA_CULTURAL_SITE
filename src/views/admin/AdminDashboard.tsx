// AdminDashboard.tsx — Admin console home (admin-only route).
// Responsibilities:
//   - Counts rows across all core tables (profiles, posts, pages, regalia,
//     artifacts, communities) with HEAD queries fired in parallel.
//   - Renders stat tiles that deep-link into the Content Manager with the
//     matching tab pre-selected, or into User Management.
//   - Explains administrator privileges and links to the Content Manager.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/form';

interface Stats {
  users: number;
  posts: number;
  pages: number;
  regalia: number;
  artifacts: number;
  communities: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ users: 0, posts: 0, pages: 0, regalia: 0, artifacts: 0, communities: 0 });

  useEffect(() => {
    let active = true;
    (async () => {
      const [profiles, posts, pages, regalia, artifacts, communities] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('pages').select('id', { count: 'exact', head: true }),
        supabase.from('regalia').select('id', { count: 'exact', head: true }),
        supabase.from('artifacts').select('id', { count: 'exact', head: true }),
        supabase.from('communities').select('id', { count: 'exact', head: true }),
      ]);
      if (!active) return;
      setStats({
        users: profiles.count ?? 0,
        posts: posts.count ?? 0,
        pages: pages.count ?? 0,
        regalia: regalia.count ?? 0,
        artifacts: artifacts.count ?? 0,
        communities: communities.count ?? 0,
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  const tiles = [
    { label: 'Registered users', value: stats.users, icon: 'group', to: '/admin/users', color: 'bg-[#6f250f]' },
    { label: 'Community posts', value: stats.posts, icon: 'article', to: '/admin/content?tab=posts', color: 'bg-[#855400]' },
    { label: 'User pages', value: stats.pages, icon: 'description', to: '/admin/content?tab=pages', color: 'bg-[#264338]' },
    { label: 'Regalia items', value: stats.regalia, icon: 'account_balance', to: '/admin/content?tab=regalia', color: 'bg-[#6f250f]' },
    { label: 'Artifacts', value: stats.artifacts, icon: 'museum', to: '/admin/content?tab=artifacts', color: 'bg-[#855400]' },
    { label: 'Communities', value: stats.communities, icon: 'groups', to: '/admin/content?tab=communities', color: 'bg-[#264338]' },
  ];

  return (
    <DashboardShell title="Admin Panel" subtitle="Full control over the UBUNTU-GEN platform">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <Link key={tile.label} to={tile.to}>
              <Card className="p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tile.color}`}>
                  <span className="material-symbols-outlined text-white">{tile.icon}</span>
                </div>
                <div>
                  <p className="font-headline-sm text-3xl text-[#1c1b1a]">{tile.value}</p>
                  <p className="font-label-md text-xs text-[#55423e] uppercase tracking-wider">{tile.label}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="p-6 bg-[#6f250f]/5 border-[#6f250f]/20">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[#6f250f] text-3xl">verified_user</span>
            <div>
              <h3 className="font-headline-sm text-lg text-[#1c1b1a]">Administrator privileges</h3>
              <p className="font-body-md text-sm text-[#55423e] mt-1">
                As an administrator you can perform full CRUD operations on all cultural content,
                manage user-generated posts and pages, and control user roles. Use the Content
                Manager to add, edit and delete site records.
              </p>
              <Link
                to="/admin/content"
                className="inline-block mt-3 bg-[#6f250f] text-white px-5 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#8e3b24]"
              >
                Open Content Manager
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
};
