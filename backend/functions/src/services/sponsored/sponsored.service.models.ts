export interface Sponsored {
  id?: string;
  tagId: string;
  users: Array<SponsorUser>;
}

export interface SponsorUser {
  id: string;
  name: string;
}

export interface SponsoredQueryParams {
  match?: Partial<Sponsored>;
  limit?: number;
}
