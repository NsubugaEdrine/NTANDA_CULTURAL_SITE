// useContent.ts — React hooks that wrap the content data layer.
// Responsibilities:
//   - useRegalia / useArtifacts / useCommunities load the matching table
//     once on mount and expose { items, loading, reload }.
//   - The DB rows use snake_case columns (e.g. origin_region) while the UI
//     types use camelCase (originRegion). The map* helpers convert each raw
//     row into the front-end shape, falling back to the slug (if present) as
//     the item id for stable bookmarking.
//   - reload() lets callers re-fetch after mutations (e.g. admin edits).
import { useEffect, useState, useCallback } from 'react';
import { fetchRegalia, fetchArtifacts, fetchCommunities } from './content';
import { RegaliaItem, ArtifactItem, CommunityItem } from '../types';

const slugId = (row: { id: string; slug?: string | null }): string => row.slug ?? row.id;

const mapRegalia = (row: Record<string, unknown>): RegaliaItem => ({
  id: slugId(row as never),
  slug: row.slug as string | undefined,
  title: row.title as string,
  tribe: row.tribe as string,
  category: row.category as RegaliaItem['category'],
  description: row.description as string,
  fullDetails: (row.full_details as string) ?? undefined,
  image: row.image as string,
  era: row.era as string,
  material: row.material as string,
  originRegion: row.origin_region as string,
  spiritualSignificance: (row.spiritual_significance as string) ?? undefined,
  isFeatured: (row.is_featured as boolean) ?? false,
});

const mapArtifact = (row: Record<string, unknown>): ArtifactItem => ({
  id: slugId(row as never),
  slug: row.slug as string | undefined,
  title: row.title as string,
  culture: row.culture as string,
  refNumber: row.ref_number as string,
  estimatedAge: row.estimated_age as string,
  location: row.location as string,
  image: row.image as string,
  description: row.description as string,
  material: row.material as string,
  addedTime: row.added_time as string,
  significanceDetails: (row.significance_details as string) ?? undefined,
  historicalContext: (row.historical_context as string) ?? undefined,
  audioTrack: row.audio_track as ArtifactItem['audioTrack'],
});

const mapCommunity = (row: Record<string, unknown>): CommunityItem => ({
  id: slugId(row as never),
  slug: row.slug as string | undefined,
  name: row.name as string,
  region: row.region as string,
  description: row.description as string,
  fullHistory: (row.full_history as string) ?? undefined,
  avatarImage: row.avatar_image as string,
  bannerImage: row.banner_image as string,
  population: (row.population as string) ?? undefined,
  language: (row.language as string) ?? undefined,
  royaltyLeader: (row.royalty_leader as string) ?? undefined,
  totems: row.totems as CommunityItem['totems'],
  keyTraditions: row.key_traditions as CommunityItem['keyTraditions'],
});

export const useRegalia = (): { items: RegaliaItem[]; loading: boolean; reload: () => void } => {
  const [items, setItems] = useState<RegaliaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const data = await fetchRegalia();
    setItems(data.map((row) => mapRegalia(row as unknown as Record<string, unknown>)));
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return { items, loading, reload: load };
};

export const useArtifacts = (): { items: ArtifactItem[]; loading: boolean; reload: () => void } => {
  const [items, setItems] = useState<ArtifactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const data = await fetchArtifacts();
    setItems(data.map((row) => mapArtifact(row as unknown as Record<string, unknown>)));
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return { items, loading, reload: load };
};

export const useCommunities = (): { items: CommunityItem[]; loading: boolean; reload: () => void } => {
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const data = await fetchCommunities();
    setItems(data.map((row) => mapCommunity(row as unknown as Record<string, unknown>)));
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return { items, loading, reload: load };
};
