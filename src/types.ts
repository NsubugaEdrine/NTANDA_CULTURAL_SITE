export type NavigationTab = 'home' | 'gallery' | 'communities' | 'search' | 'saved';

export interface RegaliaItem {
  id: string;
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
