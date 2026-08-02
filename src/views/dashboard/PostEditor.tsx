// PostEditor.tsx — Create / edit a post (protected route).
// Responsibilities:
//   - Route /dashboard/posts/new creates; /dashboard/posts/:id/edit loads the
//     existing post via fetchPosts and pre-fills the form.
//   - Fields: content type (blog/post/vlog), status, title (required),
//     excerpt, body content, cover image (uploaded to the 'content' bucket)
//     and, for vlogs, media URLs (one per line).
//   - Save as Draft or Publish; both call createPost/updatePost with the
//     author_id from the signed-in user, then return to the posts list.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { createPost, updatePost, fetchPosts, uploadContentFile } from '../../lib/content';
import { Post, PostType } from '../../types';
import { Alert, Button, Input, Select, TextArea } from '../../components/ui/form';

export const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<PostType>('blog');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [mediaUrls, setMediaUrls] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    fetchPosts().then((posts) => {
      const post = posts.find((p) => p.id === id);
      if (!active) return;
      if (!post) {
        navigate('/dashboard/posts', { replace: true });
        return;
      }
      setTitle(post.title);
      setContentType(post.content_type);
      setExcerpt(post.excerpt ?? '');
      setContent(post.content ?? '');
      setCoverImage(post.cover_image);
      setMediaUrls((post.media_urls ?? []).join('\n'));
      setStatus(post.status === 'published' ? 'published' : 'draft');
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, isEdit, navigate]);

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

  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    setError(null);
    if (!user) return;
    if (!title.trim()) {
      setError('A title is required.');
      return;
    }
    setSaving(true);
    const finalStatus = targetStatus ?? status;
    const payload = {
      title: title.trim(),
      content_type: contentType,
      excerpt: excerpt.trim() || undefined,
      content,
      cover_image: coverImage,
      media_urls: mediaUrls
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean),
      status: finalStatus,
    };

    const result = isEdit
      ? await updatePost(id!, payload)
      : await createPost({ author_id: user.id, ...payload });

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/dashboard/posts');
  };

  return (
    <DashboardShell
      title={isEdit ? 'Edit Post' : 'New Post'}
      subtitle={isEdit ? 'Update your published content' : 'Share a cultural story with the community'}
    >
      {loading ? (
        <div className="text-center py-16 text-[#55423e] font-body-md">Loading post...</div>
      ) : (
        <form
          className="space-y-6 max-w-3xl"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="contentType"
              label="Content type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as PostType)}
            >
              <option value="blog">Blog</option>
              <option value="post">Cultural Post</option>
              <option value="vlog">Vlog</option>
            </Select>
            <Select
              id="status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>

          <Input
            id="title"
            label="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Story of the Omukama's Crown"
            required
          />

          <TextArea
            id="excerpt"
            label="Short description"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary shown on cards..."
            className="min-h-[70px]"
          />

          <TextArea
            id="content"
            label={contentType === 'vlog' ? 'Video description & details' : 'Content'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              contentType === 'vlog'
                ? 'Describe the vlog, context, location and cultural significance...'
                : 'Write your story here...'
            }
            className="min-h-[240px]"
          />

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-[#dbc1ba]/30 p-5 space-y-3">
            <p className="font-label-md text-xs text-[#55423e] uppercase tracking-wider">Cover image</p>
            {coverImage && (
              <img src={coverImage} alt="Cover" className="w-full max-h-56 object-cover rounded-lg border border-[#dbc1ba]/40" />
            )}
            <label className="inline-block bg-[#6f250f] text-white px-4 py-2 rounded-lg font-label-md text-sm hover:bg-[#8e3b24] cursor-pointer">
              {uploading ? 'Uploading...' : coverImage ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          </div>

          {contentType === 'vlog' && (
            <TextArea
              id="mediaUrls"
              label="Video / media URLs (one per line)"
              value={mediaUrls}
              onChange={(e) => setMediaUrls(e.target.value)}
              placeholder={'https://youtube.com/watch?v=...\nhttps://...'}
              className="min-h-[80px]"
            />
          )}

          {error && <Alert>{error}</Alert>}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button type="button" variant="secondary" disabled={saving} onClick={() => handleSave('published')}>
              Publish
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/posts')}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </DashboardShell>
  );
};
