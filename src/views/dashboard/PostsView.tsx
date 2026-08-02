// PostsView.tsx — "My Posts" management list (protected route).
// Responsibilities:
//   - Loads the user's posts; shows a loading spinner and an empty state.
//   - Each card: cover image, status badge, content-type badge and date.
//   - Actions: Edit (goes to the editor), Publish/Unpublish (flips the
//     status via updatePost) and Delete (confirm dialog, then deletePost).
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { fetchMyPosts, deletePost, updatePost } from '../../lib/content';
import { Post } from '../../types';
import { Badge, Button, Card, EmptyState, Spinner } from '../../components/ui/form';

const statusColor = (status: Post['status']): 'green' | 'gold' | 'red' =>
  status === 'published' ? 'green' : status === 'draft' ? 'gold' : 'red';

export const PostsView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await fetchMyPosts(user.id);
    setPosts(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setError(null);
    const { error: deleteError } = await deletePost(id);
    if (deleteError) {
      setError(deleteError);
      return;
    }
    await load();
  };

  const toggleStatus = async (post: Post) => {
    const next = post.status === 'published' ? 'draft' : 'published';
    const { error: updateError } = await updatePost(post.id, { status: next });
    if (updateError) {
      setError(updateError);
      return;
    }
    await load();
  };

  return (
    <DashboardShell title="My Posts" subtitle="Manage your blogs, vlogs and cultural posts">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="font-body-md text-sm text-[#55423e]">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
          <Link to="/dashboard/posts/new" className="bg-[#6f250f] text-white px-5 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#8e3b24]">
            + New Post
          </Link>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-[#b3261e]/10 text-[#8a1c15] font-body-md text-sm border border-[#b3261e]/20">
            {error}
          </div>
        )}

        {loading ? (
          <Card className="p-10 text-center">
            <Spinner />
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <EmptyState
              title="No posts yet"
              message="Write a blog about your heritage, share a vlog from a cultural event, or post an update."
              action={
                <button
                  onClick={() => navigate('/dashboard/posts/new')}
                  className="bg-[#6f250f] text-white px-5 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#8e3b24]"
                >
                  Create your first post
                </button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.cover_image && (
                  <img src={post.cover_image} alt="" className="w-full h-36 object-cover" />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge color={statusColor(post.status)}>{post.status}</Badge>
                    <Badge>{post.content_type}</Badge>
                    <span className="font-body-md text-xs text-[#88726c] ml-auto">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-[#1c1b1a]">{post.title}</h3>
                  {post.excerpt && (
                    <p className="font-body-md text-sm text-[#55423e] line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#dbc1ba]/20">
                    <Button
                      variant="secondary"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => navigate(`/dashboard/posts/${post.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => toggleStatus(post)}>
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="danger"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};
