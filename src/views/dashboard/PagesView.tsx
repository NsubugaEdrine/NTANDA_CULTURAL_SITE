// PagesView.tsx — "My Pages" management list (protected route).
// Responsibilities:
//   - Loads the user's pages with loading and empty states.
//   - Each card: cover image, public/private badge and date.
//   - Actions: Edit (goes to the editor), Make Public/Private (toggles
//     is_public) and Delete (confirm dialog, then deletePage).
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { fetchMyPages, deletePage, updatePage } from '../../lib/content';
import { Page } from '../../types';
import { Badge, Button, Card, EmptyState, Spinner } from '../../components/ui/form';

export const PagesView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setPages(await fetchMyPages(user.id));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete page "${title}"? This cannot be undone.`)) return;
    setError(null);
    const { error: deleteError } = await deletePage(id);
    if (deleteError) {
      setError(deleteError);
      return;
    }
    await load();
  };

  const toggleVisibility = async (page: Page) => {
    const { error: updateError } = await updatePage(page.id, { is_public: !page.is_public });
    if (updateError) {
      setError(updateError);
      return;
    }
    await load();
  };

  return (
    <DashboardShell title="My Pages" subtitle="Create and manage your personal cultural pages">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="font-body-md text-sm text-[#55423e]">
            {pages.length} {pages.length === 1 ? 'page' : 'pages'}
          </p>
          <Link to="/dashboard/pages/new" className="bg-[#855400] text-white px-5 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#a36b00]">
            + New Page
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
        ) : pages.length === 0 ? (
          <Card>
            <EmptyState
              title="No pages yet"
              message="Create a personal page to showcase your cultural posts, vlogs and blogs in one place."
              action={
                <button
                  onClick={() => navigate('/dashboard/pages/new')}
                  className="bg-[#855400] text-white px-5 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#a36b00]"
                >
                  Create your first page
                </button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pages.map((page) => (
              <Card key={page.id} className="overflow-hidden">
                {page.cover_image && <img src={page.cover_image} alt="" className="w-full h-32 object-cover" />}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge color={page.is_public ? 'green' : 'gold'}>
                      {page.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <span className="font-body-md text-xs text-[#88726c] ml-auto">
                      {new Date(page.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-[#1c1b1a]">{page.title}</h3>
                  {page.description && (
                    <p className="font-body-md text-sm text-[#55423e] line-clamp-2">{page.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#dbc1ba]/20">
                    <Button
                      variant="secondary"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => navigate(`/dashboard/pages/${page.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => toggleVisibility(page)}>
                      {page.is_public ? 'Make Private' : 'Make Public'}
                    </Button>
                    <Button
                      variant="danger"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => handleDelete(page.id, page.title)}
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
