export interface Gathering {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  timeStart?: Date;
  timeEnd?: Date;
  timeSpanMinutes?: number;
  tags?: string[];
  createDate?: Date;
}

export interface GatheringQueryParams {
  match?: Partial<Gathering>;
  limit?: number;
}
