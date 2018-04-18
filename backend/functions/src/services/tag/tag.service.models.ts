export interface Tag {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  link?: string;
  loveIcon?: string;
  category?: TagCategory;
  primaryFlag?: boolean;
  createDate?: Date;
}

export enum TagCategory {
  CONFERENCE = 'conference',
  LEGAL = 'legal',
  MOVEMENTS = 'movements',
  MUSIC = 'music',
  SPORTS = 'sports',
  TECHNOLOGY = 'technology',
  TV = 'tv'
}

export interface TagQueryParams {
  match?: Partial<Tag>;
  limit?: number;
}
