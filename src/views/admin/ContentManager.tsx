// ContentManager.tsx — Admin full CRUD manager for all site content.
// Responsibilities:
//   - Tabbed interface (regalia / artifacts / communities / posts / pages)
//     driven by the ?tab= URL param so tiles in AdminDashboard can deep-link.
//   - FIELD_DEFS declares, per tab, which fields are editable and their input
//     type (text / textarea / select / checkbox). This single table drives
//     both the create/edit form AND the payload builder, so adding a field
//     to a type is a one-line change.
//   - Each tab loads its rows through the matching fetch* helper and renders
//     a table with thumbnail, title, detail and updated date.
//   - Create/Edit modal: renders a form from FIELD_DEFS; JSON-array fields
//     (totems, key_traditions, media_urls) are edited as textarea JSON;
//     checkbox fields become booleans; image fields offer an inline file
//     upload that returns a public storage URL.
//   - Save routes the payload to the correct create/update helper, and
//     Delete confirms with the browser dialog before removing the row.
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import type { ArtifactItem, CommunityItem, Page, Post, PostStatus, PostType, RegaliaItem } from '../../types';
import {
  fetchRegalia,
  createRegalia,
  updateRegalia,
  deleteRegalia,
  fetchArtifacts,
  createArtifact,
  updateArtifact,
  deleteArtifact,
  fetchCommunities,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  fetchMyPages,
  createPage,
  updatePage,
  deletePage,
  uploadContentFile,
} from '../../lib/content';
import { Alert, Badge, Button, Card, EmptyState, Input, Select, Spinner, TextArea } from '../../components/ui/form';

type Tab = 'regalia' | 'artifacts' | 'communities' | 'posts' | 'pages';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  options?: string[];
  placeholder?: string;
}

const FIELD_DEFS: Record<Tab, FieldDef[]> = {
  regalia: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'tribe', label: 'Tribe', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: ['Garments', 'Jewelry', 'Headwear', 'Footwear', 'Ceremonial'] },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'full_details', label: 'Full details', type: 'textarea' },
    { key: 'image', label: 'Image URL', type: 'text' },
    { key: 'era', label: 'Era', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'origin_region', label: 'Origin region', type: 'text' },
    { key: 'spiritual_significance', label: 'Spiritual significance', type: 'textarea' },
    { key: 'is_featured', label: 'Featured', type: 'checkbox' },
  ],
  artifacts: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'culture', label: 'Culture', type: 'text' },
    { key: 'ref_number', label: 'Reference number', type: 'text' },
    { key: 'estimated_age', label: 'Estimated age', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'image', label: 'Image URL', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'significance_details', label: 'Significance details', type: 'textarea' },
    { key: 'historical_context', label: 'Historical context', type: 'textarea' },
  ],
  communities: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'region', label: 'Region', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'full_history', label: 'Full history', type: 'textarea' },
    { key: 'avatar_image', label: 'Avatar image URL', type: 'text' },
    { key: 'banner_image', label: 'Banner image URL', type: 'text' },
    { key: 'population', label: 'Population', type: 'text' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'royalty_leader', label: 'Royalty / Leader', type: 'text' },
    { key: 'totems', label: 'Totems (JSON array)', type: 'textarea' },
    { key: 'key_traditions', label: 'Key traditions (JSON array)', type: 'textarea' },
  ],
  posts: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'content_type', label: 'Content type', type: 'select', options: ['post', 'blog', 'vlog'] },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
  ],
  pages: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'is_public', label: 'Public', type: 'checkbox' },
  ],
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'regalia', label: 'Regalia' },
  { id: 'artifacts', label: 'Artifacts' },
  { id: 'communities', label: 'Communities' },
  { id: 'posts', label: 'Posts' },
  { id: 'pages', label: 'Pages' },
];

type Row = { id: string; created_at?: string; [key: string]: unknown };

export const ContentManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const tabParam = searchParams.get('tab') ?? 'regalia';
  const tab = (TABS.some((t) => t.id === tabParam) ? tabParam : 'regalia') as Tab;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    let data: Row[] = [];
    switch (tab) {
      case 'regalia':
        data = (await fetchRegalia()) as unknown as Row[];
        break;
      case 'artifacts':
        data = (await fetchArtifacts()) as unknown as Row[];
        break;
      case 'communities':
        data = (await fetchCommunities()) as unknown as Row[];
        break;
      case 'posts':
        data = (await fetchPosts()) as unknown as Row[];
        break;
      case 'pages':
        data = (await fetchMyPages(user?.id ?? '')) as unknown as Row[];
        break;
    }
    setRows(data);
    setLoading(false);
  }, [tab, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormValues({});
    setShowForm(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    const values: Record<string, string> = {};
    for (const field of FIELD_DEFS[tab]) {
      const raw = row[field.key];
      if (Array.isArray(raw)) values[field.key] = JSON.stringify(raw, null, 2);
      else values[field.key] = raw == null ? '' : String(raw);
    }
    setFormValues(values);
    setShowForm(true);
  };

  const setValue = (key: string, value: string) =>
    setFormValues((prev: Record<string, string>) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const { url, error: uploadError } = await uploadContentFile(file, 'content');
    setUploadingImage(false);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    setValue(targetKey, url ?? '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);

    const buildPayload = (): Record<string, unknown> => {
      const payload: Record<string, unknown> = {};
      for (const field of FIELD_DEFS[tab]) {
        const raw = formValues[field.key] ?? '';
        if (field.type === 'checkbox') {
          payload[field.key] = raw === 'true';
        } else if (['totems', 'key_traditions', 'media_urls'].includes(field.key)) {
          try {
            payload[field.key] = JSON.parse(raw || '[]');
          } catch {
            payload[field.key] = [];
          }
        } else if (field.key === 'slug') {
          payload[field.key] = raw || null;
        } else {
          payload[field.key] = raw;
        }
      }
      if (tab === 'posts') {
        payload.content_type = (payload.content_type as string) || 'post';
        payload.status = (payload.status as string) || 'draft';
      }
      return payload;
    };

    const payload = buildPayload();
    let result: { error: string | null };
    if (tab === 'regalia') {
      result = editing
        ? await updateRegalia(editing.id, payload as Partial<RegaliaItem>)
        : await createRegalia({ ...(payload as Partial<RegaliaItem>), created_by: user.id });
    } else if (tab === 'artifacts') {
      result = editing
        ? await updateArtifact(editing.id, payload as Partial<ArtifactItem>)
        : await createArtifact({ ...(payload as Partial<ArtifactItem>), created_by: user.id });
    } else if (tab === 'communities') {
      result = editing
        ? await updateCommunity(editing.id, payload as Partial<CommunityItem>)
        : await createCommunity({ ...(payload as Partial<CommunityItem>), created_by: user.id });
    } else if (tab === 'posts') {
      result = editing
        ? await updatePost(editing.id, payload as Partial<Post>)
        : await createPost({
            author_id: user.id,
            title: (payload.title as string) ?? 'Untitled',
            content: (payload.content as string) ?? '',
            excerpt: payload.excerpt as string | undefined,
            content_type: (payload.content_type as PostType) ?? 'post',
            status: (payload.status as PostStatus) ?? 'draft',
          });
    } else {
      result = editing
        ? await updatePage(editing.id, payload as Partial<Page>)
        : await createPage({
            author_id: user.id,
            title: (payload.title as string) ?? 'Untitled',
            description: payload.description as string | undefined,
            content: payload.content as string | undefined,
            is_public: payload.is_public as boolean | undefined,
          });
    }

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setShowForm(false);
    await load();
  };

  const handleDelete = async (row: Row) => {
    const name = String(row.title ?? row.name ?? row.id);
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setError(null);
    let result: { error: string | null };
    if (tab === 'regalia') result = await deleteRegalia(row.id);
    else if (tab === 'artifacts') result = await deleteArtifact(row.id);
    else if (tab === 'communities') result = await deleteCommunity(row.id);
    else if (tab === 'posts') result = await deletePost(row.id);
    else result = await deletePage(row.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    await load();
  };

  const displayTitle = (row: Row): string => String(row.title ?? row.name ?? '(untitled)');
  const imageKey = FIELD_DEFS[tab].find((f) => f.key.includes('image'))?.key ?? 'image';

  return (
    <DashboardShell title="Content Manager" subtitle="Full CRUD management of all site content">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#dbc1ba]/20 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSearchParams({ tab: t.id })}
              className={`px-4 py-2 rounded-lg font-label-md text-sm transition-colors cursor-pointer ${
                tab === t.id
                  ? 'bg-[#6f250f] text-white'
                  : 'bg-[#f1edeb] text-[#55423e] hover:bg-[#ece7e5]'
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto">
            <Button onClick={openCreate}>+ Add {TABS.find((t) => t.id === tab)?.label.slice(0, -1)}</Button>
          </div>
        </div>

        {error && <Alert>{error}</Alert>}

        {loading ? (
          <Card className="p-10 text-center">
            <Spinner />
          </Card>
        ) : rows.length === 0 ? (
          <Card>
            <EmptyState title={`No ${tab} records`} message={`Add your first ${tab} record.`} action={<Button onClick={openCreate}>Add record</Button>} />
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#dbc1ba]/30 text-[#55423e]">
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider w-16">#</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider hidden md:table-cell">Details</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider hidden lg:table-cell">Updated</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id} className="border-b border-[#dbc1ba]/15 hover:bg-[#f7f3f1] transition-colors">
                    <td className="px-5 py-3 font-body-md text-sm text-[#88726c]">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {(row[imageKey] as string) && (
                          <img
                            src={row[imageKey] as string}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-[#dbc1ba]/30"
                          />
                        )}
                        <div>
                          <p className="font-body-md text-sm font-semibold text-[#1c1b1a]">{displayTitle(row)}</p>
                          <Badge color={tab === 'posts' ? 'green' : 'brown'}>{tab.slice(0, -1)}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="font-body-md text-xs text-[#55423e] line-clamp-1">
                        {String((row as Record<string, unknown>)['description'] ?? (row as Record<string, unknown>)['culture'] ?? '')}
                      </p>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="font-body-md text-xs text-[#88726c]">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => openEdit(row)}>
                          Edit
                        </Button>
                        <Button variant="danger" className="!px-3 !py-1.5 text-xs" onClick={() => handleDelete(row)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Create/Edit modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowForm(false)} />
            <div className="relative w-full max-w-2xl bg-[#fdf8f6] rounded-xl shadow-2xl border border-[#dbc1ba]/30 z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#dbc1ba]/20 px-6 py-4">
                <h3 className="font-headline-sm text-xl text-[#6f250f] font-bold">
                  {editing ? 'Edit' : 'Add'} {TABS.find((t) => t.id === tab)?.label.slice(0, -1)}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-[#55423e] hover:text-[#1c1b1a]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {FIELD_DEFS[tab].map((field) => {
                  const isImage = field.key.includes('image');
                  const common = {
                    id: field.key,
                    label: field.label,
                    value: formValues[field.key] ?? '',
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                      setValue(field.key, e.target.value),
                    required: field.key === 'title' || field.key === 'name',
                  };
                  return (
                    <div key={field.key}>
                      {field.type === 'text' && <Input {...common} placeholder={field.placeholder} />}
                      {field.type === 'textarea' && <TextArea {...common} placeholder={field.placeholder} />}
                      {field.type === 'select' && (
                        <Select {...common}>
                          <option value="">Select...</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Select>
                      )}
                      {field.type === 'checkbox' && (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formValues[field.key] ?? 'false') === 'true'}
                            onChange={(e) => setValue(field.key, String(e.target.checked))}
                            className="w-5 h-5 accent-[#6f250f]"
                          />
                          <span className="font-body-md text-sm text-[#1c1b1a]">{field.label}</span>
                        </label>
                      )}
                      {isImage && (
                        <div className="mt-2 flex items-center gap-3">
                          <label className="text-[#6f250f] font-label-md text-xs hover:underline cursor-pointer">
                            {uploadingImage ? 'Uploading...' : 'or upload a file'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, field.key)} />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}

                {error && <Alert>{error}</Alert>}

                <div className="flex flex-wrap gap-3 pt-2 border-t border-[#dbc1ba]/20">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};
