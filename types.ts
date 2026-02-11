
export type AwardStatus = 'official' | 'shortlist' | 'contender';

export interface Nominee {
  id: string;
  movieTitle: string;
  individualName?: string;
  isWinner: boolean;
  predictionRank: number; // 1 = most likely
  seen: boolean;
  userResult?: 'correct' | 'incorrect' | 'pending';
}

export interface Category {
  id: string;
  name: string;
  nominees: Nominee[];
}

export interface AwardData {
  id: string;
  name: string;
  year: number;
  announced: boolean; // whether winners have been revealed
  status: AwardStatus; // The reliability level of this data
  categories: Category[];
  lastUpdated: number;
  dataFound: boolean;
  sources?: { title: string; uri: string }[];
}

export interface MovieDetails {
  title: string;
  year: string;
  director: string;
  cast: string[];
  summary: string;
  rating: string;
  posterUrl: string;
}

export enum ViewMode {
  CATEGORY = 'CATEGORY',
  MOVIE = 'MOVIE',
  PREDICTIONS = 'PREDICTIONS'
}

export enum FilterMode {
  ALL = 'ALL',
  SEEN = 'SEEN',
  UNSEEN = 'UNSEEN'
}
