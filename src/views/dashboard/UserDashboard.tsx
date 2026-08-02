// UserDashboard.tsx — Contributor Studio overview (protected route).
// Responsibilities:
//   - Loads the signed-in user's posts and pages on mount.
//   - Quick-action cards linking to new post, new page and profile editing.
//   - Stat cards: total posts, published count and page count.
//   - Nudges the user to complete their profile if no username is set yet.
//   - Lists the 5 most recent posts with status/type badges and edit links.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { fetchMyPosts, fetchMyPages } from '../../lib/content';
import { Post, Page } from '../../types';
import { Badge, Card, EmptyState } from '../../components/ui/form';

const statCard = (label: string, value: number, icon: string, color: string) => (
  <Card className="p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-[#6f250f]">{icon}</span>
    </div>
    <div>
      <p className="font-headline-sm text-3xl text-[#1c1b1a]">{value}</p>
      <p className="font-label-md text-xs text-[#55423e] uppercase tracking-wider">{label}</p>
    </div>
  </Card>
);

export const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    fetchMyPosts(user.id).then((p) => active && setPosts(p));
    fetchMyPages(user.id).then((p) => active && setPages(p));
    return () => {
      active = false;
    };
  }, [user]);

  const published = posts.filter((p) => p.status === 'published').length;

  return (
    <DashboardShell title="Contributor Studio" subtitle="Create and manage your cultural content">
      <div className="space-y-8">
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4 bg-[#6f250f]/5 border-[#6f250f]/20">
            <div className="w-12 h-12 rounded-xl bg-[#6f250f] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">edit_note</span>
            </div>
            <div>
              <p className="font-headline-sm text-lg text-[#1c1b1a]">New Post</p>
              <p className="font-body-md text-xs text-[#55423e]">Share a blog, vlog or cultural update</p>
              <Link to="/dashboard/posts/new" className="text-[#6f250f] font-label-md text-xs hover:underline mt-1 inline-block">
                Start writing →
              </Link>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 bg-[#855400]/5 border-[#855400]/20">
            <div className="w-12 h-12 rounded-xl bg-[#855400] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">description</span>
            </div>
            <div>
              <p className="font-headline-sm text-lg text-[#1c1b1a]">New Page</p>
              <p className="font-body-md text-xs text-[#55423e]">Create your personal cultural page</p>
              <Link to="/dashboard/pages/new" className="text-[#855400] font-label-md text-xs hover:underline mt-1 inline-block">
                Create page →
              </Link>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 bg-[#264338]/5 border-[#264338]/20">
            <div className="w-12 h-12 rounded-xl bg-[#264338] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div>
              <p className="font-headline-sm text-lg text-[#1c1b1a]">Edit Profile</p>
              <p className="font-body-md text-xs text-[#55423e]">Update credentials & personal info</p>
              <Link to="/profile" className="text-[#264338] font-label-md text-xs hover:underline mt-1 inline-block">
                Manage profile →
              </Link>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCard('Total posts', posts.length, 'article', 'bg-[#6f250f]/10')}
          {statCard('Published', published, 'public', 'bg-[#264338]/10')}
          {statCard('Pages', pages.length, 'description', 'bg-[#855400]/10')}
        </div>

        {/* Welcome */}
        {!profile?.user_name && (
          <Card className="p-6 bg-[#855400]/10 border-[#855400]/30">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#855400] text-3xl">info</span>
              <div>
                <h3 className="font-headline-sm text-lg text-[#1c1b1a]">Complete your profile</h3>
                <p className="font-body-md text-sm text-[#55423e] mt-1">
                  Set your username and personal information so the community can identify you.
                </p>
                <Link
                  to="/profile"
                  className="inline-block mt-3 bg-[#855400] text-white px-4 py-2 rounded-lg font-label-md text-sm hover:bg-[#a36b00]"
                >
                  Set up profile
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Recent posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-sm text-xl text-[#1c1b1a]">Recent posts</h2>
            <Link to="/dashboard/posts" className="text-[#6f250f] font-label-md text-sm hover:underline">
              View all →
            </Link>
          </div>
          {posts.length === 0 ? (
            <Card>
              <EmptyState
                title="No posts yet"
                message="Share your first cultural post, blog or vlog with the community."
                action={
                  <Link to="/dashboard/posts/new" className="bg-[#6f250f] text-white px-5 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#8e3b24]">
                    Create your first post
                  </Link>
                }
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {posts.slice(0, 5).map((post) => (
                <Card key={post.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge color={post.status === 'published' ? 'green' : post.status === 'draft' ? 'gold' : 'red'}>
                        {post.status}
                      </Badge>
                      <Badge>{post.content_type}</Badge>
                    </div>
                    <p className="font-headline-sm text-base text-[#1c1b1a] mt-1.5 truncate">{post.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/dashboard/posts/${post.id}/edit`}
                      className="text-[#6f250f] font-label-md text-xs hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
};
