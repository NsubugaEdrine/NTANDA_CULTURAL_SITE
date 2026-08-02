// types.ts — Shared TypeScript type definitions used across the whole app.
// These are the contracts between the Supabase data layer, the content hooks
// and the UI components. Keeping them in one file avoids circular imports.

// Which of the 5 main tabs of the public site is currently active.
export type NavigationTab = 'home' | 'gallery' | 'communities' | 'search' | 'saved';

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  user_name: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  personal_info: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type PostType = 'post' | 'blog' | 'vlog';
export type PostStatus = 'draft' | 'published' | 'archived';

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  content_type: PostType;
  cover_image: string | null;
  media_urls: string[];
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  author_id: string;
  title: string;
  slug: string | null;
  description: string | null;
  content: string | null;
  cover_image: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegaliaItem {
  id: string;
  slug?: string;
  title: string;
  tribe: string;
  category: 'Garments' | 'Jewelry' | 'Headwear' | 'Footwear' | 'Ceremonial';
  description: string;
  fullDetails?: string;
  image: string;
  era: string;
  material: string;
  originRegion: string;
  spiritualSignificance?: string;
  isFeatured?: boolean;
}

export interface ArtifactItem {
  id: string;
  slug?: string;
  title: string;
  culture: string;
  refNumber: string;
  estimatedAge: string;
  location: string;
  image: string;
  description: string;
  material: string;
  addedTime: string;
  significanceDetails?: string;
  historicalContext?: string;
  audioTrack?: 'talking_drums' | 'ennanga_harp' | 'flute' | 'ambient_savannah';
}

export interface ClanTotem {
  name: string;
  lugandaName?: string;
  meaning: string;
  symbol: string;
  description: string;
}

export interface CommunityItem {
  id: string;
  slug?: string;
  name: string;
  region: string;
  description: string;
  fullHistory?: string;
  avatarImage: string;
  bannerImage: string;
  population?: string;
  language?: string;
  royaltyLeader?: string;
  totems?: ClanTotem[];
  keyTraditions?: string[];
}
