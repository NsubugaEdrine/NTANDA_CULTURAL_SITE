// content.ts — Data-access layer for all site content.
// Every function here talks to the Supabase Postgres database via the shared
// client and returns normalized results ({ data | error }).
// Sections:
//   - slugify/toSlug  : turns a title into a URL-safe slug.
//   - Profiles        : fetch own profile by id or public profile by username.
//   - Posts           : list/fetch/create/update/delete user posts.
//   - Pages           : list/fetch/create/update/delete user pages.
//   - Regalia         : CRUD for regalia collection items.
//   - Artifacts       : CRUD for digital artifact records.
//   - Communities     : CRUD for ethnic community records.
//   - Storage         : uploadContentFile -> uploads a file to a Supabase
//                       Storage bucket ('content' or 'avatars') and returns
//                       its public URL for saving onto a row.
// All fetches return [] instead of throwing when the query errors, so the
// UI can degrade gracefully.
import { supabase } from './supabase';
import { Post, PostStatus, PostType, Profile, Page, RegaliaItem, ArtifactItem, CommunityItem } from '../types';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const toSlug = slugify;

// ---------------- Profiles ----------------
export const fetchProfile = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  return error ? null : (data as Profile);
};

export const fetchPublicProfile = async (userName: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_name', userName)
    .maybeSingle();
  return error || !data ? null : (data as Profile);
};

export const fetchPublishedPostsByAuthor = async (userId: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return error ? [] : (data as Post[]);
};

export const fetchPublicPagesByAuthor = async (userId: string): Promise<Page[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('author_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });
  return error ? [] : (data as Page[]);
};

// ---------------- Posts ----------------
export const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : (data as Post[]);
};

export const fetchMyPosts = async (userId: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });
  return error ? [] : (data as Post[]);
};

export const createPost = async (input: {
  author_id: string;
  title: string;
  content: string;
  excerpt?: string;
  content_type: PostType;
  cover_image?: string | null;
  media_urls?: string[];
  status?: PostStatus;
}): Promise<{ data: Post | null; error: string | null }> => {
  const slug = toSlug(input.title);
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: input.author_id,
      title: input.title,
      slug,
      excerpt: input.excerpt ?? input.content.slice(0, 180),
      content: input.content,
      content_type: input.content_type,
      cover_image: input.cover_image ?? null,
      media_urls: input.media_urls ?? [],
      status: input.status ?? 'draft',
    })
    .select()
    .single();
  return { data: data as Post | null, error: error ? error.message : null };
};

export const updatePost = async (
  id: string,
  input: Partial<Post>
): Promise<{ data: Post | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('posts')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  return { data: data as Post | null, error: error ? error.message : null };
};

export const deletePost = async (id: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  return { error: error ? error.message : null };
};

// ---------------- Pages ----------------
export const fetchMyPages = async (userId: string): Promise<Page[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });
  return error ? [] : (data as Page[]);
};

export const fetchPublicPages = async (): Promise<Page[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });
  return error ? [] : (data as Page[]);
};

export const createPage = async (input: {
  author_id: string;
  title: string;
  description?: string;
  content?: string;
  cover_image?: string | null;
  is_public?: boolean;
}): Promise<{ data: Page | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('pages')
    .insert({
      author_id: input.author_id,
      title: input.title,
      slug: toSlug(input.title),
      description: input.description ?? null,
      content: input.content ?? null,
      cover_image: input.cover_image ?? null,
      is_public: input.is_public ?? true,
    })
    .select()
    .single();
  return { data: data as Page | null, error: error ? error.message : null };
};

export const updatePage = async (
  id: string,
  input: Partial<Page>
): Promise<{ data: Page | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('pages')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  return { data: data as Page | null, error: error ? error.message : null };
};

export const deletePage = async (id: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('pages').delete().eq('id', id);
  return { error: error ? error.message : null };
};

// ---------------- Regalia ----------------
export const fetchRegalia = async (): Promise<RegaliaItem[]> => {
  const { data, error } = await supabase
    .from('regalia')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : (data as RegaliaItem[]);
};

export const createRegalia = async (input: Partial<RegaliaItem> & { created_by: string }): Promise<{ data: RegaliaItem | null; error: string | null }> => {
  const { data, error } = await supabase.from('regalia').insert(input).select().single();
  return { data: data as RegaliaItem | null, error: error ? error.message : null };
};

export const updateRegalia = async (
  id: string,
  input: Partial<RegaliaItem>
): Promise<{ data: RegaliaItem | null; error: string | null }> => {
  const { data, error } = await supabase.from('regalia').update(input).eq('id', id).select().single();
  return { data: data as RegaliaItem | null, error: error ? error.message : null };
};

export const deleteRegalia = async (id: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('regalia').delete().eq('id', id);
  return { error: error ? error.message : null };
};

// ---------------- Artifacts ----------------
export const fetchArtifacts = async (): Promise<ArtifactItem[]> => {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : (data as ArtifactItem[]);
};

export const createArtifact = async (input: Partial<ArtifactItem> & { created_by: string }): Promise<{ data: ArtifactItem | null; error: string | null }> => {
  const { data, error } = await supabase.from('artifacts').insert(input).select().single();
  return { data: data as ArtifactItem | null, error: error ? error.message : null };
};

export const updateArtifact = async (
  id: string,
  input: Partial<ArtifactItem>
): Promise<{ data: ArtifactItem | null; error: string | null }> => {
  const { data, error } = await supabase.from('artifacts').update(input).eq('id', id).select().single();
  return { data: data as ArtifactItem | null, error: error ? error.message : null };
};

export const deleteArtifact = async (id: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('artifacts').delete().eq('id', id);
  return { error: error ? error.message : null };
};

// ---------------- Communities ----------------
export const fetchCommunities = async (): Promise<CommunityItem[]> => {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : (data as CommunityItem[]);
};

export const createCommunity = async (input: Partial<CommunityItem> & { created_by: string }): Promise<{ data: CommunityItem | null; error: string | null }> => {
  const { data, error } = await supabase.from('communities').insert(input).select().single();
  return { data: data as CommunityItem | null, error: error ? error.message : null };
};

export const updateCommunity = async (
  id: string,
  input: Partial<CommunityItem>
): Promise<{ data: CommunityItem | null; error: string | null }> => {
  const { data, error } = await supabase.from('communities').update(input).eq('id', id).select().single();
  return { data: data as CommunityItem | null, error: error ? error.message : null };
};

export const deleteCommunity = async (id: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('communities').delete().eq('id', id);
  return { error: error ? error.message : null };
};

// ---------------- Storage ----------------
export const uploadContentFile = async (file: File, folder: 'content' | 'avatars'): Promise<{ url: string | null; error: string | null }> => {
  const ext = file.name.split('.').pop() ?? 'bin';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bucket = folder;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) return { url: null, error: error.message };
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: urlData.publicUrl, error: null };
};
