export interface Sponsored {
  id?: string;
  tagId: string;
  users: Array<SponsorUser>;
  // only support 1 sponsor now but 'users' collection could support more than one
  userId?: string;
  name?: string;
}

export interface SponsorUser {
  id: string;
  name: string;
}

export interface SponsoredQueryParams {
  match?: Partial<Sponsored>;
  limit?: number;
}
