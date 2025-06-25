// Core data types for the Empathy Ledger project
// Updated to match actual Airtable schema

export interface Story {
  id: string;
  title: string;
  storyCopy?: string;
  storyTranscript?: string;
  content?: string;  // Legacy support
  transcript?: string;  // Legacy support
  excerpt: string;
  hasVideo: boolean;
  videoStoryLink?: string;
  videoEmbedCode?: string;
  videoUrl?: string | null;  // Legacy support
  hasImage?: boolean;
  image?: {
    url: string;
    thumbnails?: any;
  };
  profileImage?: string | null;  // Storyteller profile image for thumbnail
  themes?: string[];  // Legacy support
  themeIds: string[];
  themeNames: string[];
  storytellerIds: string[];
  storytellerNames: string[];
  mediaIds?: string[];
  mediaCount?: number;
  location: string;
  shifts?: string[];
  createdAt: string;
  featured?: boolean;
  // Legacy fields for compatibility
  collectionDate?: string;
  hasContentConsent?: boolean;
  privacyLevel?: string;
}

export interface Storyteller {
  id: string;
  name: string;
  role: string;
  project: string;
  location?: string;
  bio?: string;
  quote?: string;
  summary?: string;
  quotes?: string[];
  profileImage?: string;
  hasProfile?: boolean;
  storyCount: number;
  storyIds?: string[];
  mediaCount?: number;
  themes: string[];
  themeIds?: string[];
  videoDraftLink?: string;
  transcript?: string;
  createdAt?: string;
}

export interface Media {
  id: string;
  fileName: string;
  type: 'Video' | 'Photo' | 'Audio' | 'Text';
  transcript: string;
  themes: string[];
  hasAudio: boolean;
  audio?: {
    url: string;
    filename: string;
  };
  quoteCount: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  color?: string;
}

export interface Location {
  city: string;
  shift?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AnalyticsData {
  totalStories: number;
  totalStorytellers: number;
  citiesCount: number;
  themesCount: number;
  collectionPeriod: {
    start: string;
    end: string;
  };
  roleDistribution: {
    friends: number;
    volunteers: number;
  };
  locationDistribution: Record<string, number>;
  themeDistribution: Record<string, number>;
}

export interface FilterOptions {
  locations?: string[];
  roles?: ('friend' | 'volunteer')[];
  themes?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PrivacyConfig {
  showPersonalDetails: boolean;
  allowAnalytics: boolean;
  displayLevel: 'full' | 'anonymous' | 'aggregate';
}

// Component props types
export interface StoryCardProps {
  story: Story;
  showFullContent?: boolean;
  privacyConfig: PrivacyConfig;
}

export interface StorytellerCardProps {
  storyteller: Storyteller;
  privacyConfig: PrivacyConfig;
}

export interface VisualizationProps {
  data: any;
  width?: number;
  height?: number;
  interactive?: boolean;
}

// API response types
export interface AirtableResponse<T> {
  records: Array<{
    id: string;
    fields: T;
    createdTime: string;
  }>;
  offset?: string;
}

export interface WikiPage {
  slug: string;
  title: string;
  content: string;
  category: 'overview' | 'guides' | 'reflections' | 'resources';
  lastUpdated: string;
  tags: string[];
}