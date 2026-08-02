// PageEditor.tsx — Create / edit a personal page (protected route).
// Responsibilities:
//   - Route /dashboard/pages/new creates; /dashboard/pages/:id/edit loads the
//     existing page via fetchMyPages and pre-fills the form.
//   - Fields: title (required), description, page content, optional cover
//     image (uploaded to the 'content' bucket) and a public/private toggle.
//   - Save calls createPage/updatePage and returns to the pages list.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { createPage, updatePage, fetchMyPages, uploadContentFile } from '../../lib/content';
import { Alert, Button, Input, TextArea } from '../../components/ui/form';

export const PageEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !user) return;
    let active = true;
    fetchMyPages(user.id).then((pages) => {
      const page = pages.find((p) => p.id === id);
      if (!active) return;
      if (!page) {
        navigate('/dashboard/pages', { replace: true });
        return;
      }
      setTitle(page.title);
      setDescription(page.description ?? '');
      setContent(page.content ?? '');
      setCoverImage(page.cover_image);
      setIsPublic(page.is_public);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, isEdit, user, navigate]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const { url, error: uploadError } = await uploadContentFile(file, 'content');
    setUploading(false);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    setCoverImage(url);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) {
      setError('A page title is required.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      content,
      cover_image: coverImage,
      is_public: isPublic,
    };
    const result = isEdit
      ? await updatePage(id!, payload)
      : await createPage({ author_id: user.id, ...payload });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/dashboard/pages');
  };

  return (
    <DashboardShell
      title={isEdit ? 'Edit Page' : 'New Page'}
      subtitle="Build a personal page for your cultural content"
    >
      {loading ? (
        <div className="text-center py-16 text-[#55423e] font-body-md">Loading page...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          <Input
            id="title"
            label="Page title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Baganda Heritage Journey"
            required
          />

          <TextArea
            id="description"
            label="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this page about?"
            className="min-h-[70px]"
          />

          <TextArea
            id="content"
            label="Page content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add an introduction, links to your posts and vlogs, and any cultural context..."
            className="min-h-[240px]"
          />

          <div className="bg-white rounded-xl border border-[#dbc1ba]/30 p-5 space-y-3">
            <p className="font-label-md text-xs text-[#55423e] uppercase tracking-wider">Cover image</p>
            {coverImage && (
              <img src={coverImage} alt="Cover" className="w-full max-h-52 object-cover rounded-lg border border-[#dbc1ba]/40" />
            )}
            <label className="inline-block bg-[#855400] text-white px-4 py-2 rounded-lg font-label-md text-sm hover:bg-[#a36b00] cursor-pointer">
              {uploading ? 'Uploading...' : coverImage ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 accent-[#6f250f]"
            />
            <span className="font-body-md text-sm text-[#1c1b1a]">Make this page public</span>
          </label>

          {error && <Alert>{error}</Alert>}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Page'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/pages')}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </DashboardShell>
  );
};
