export interface Donation {
  id?: string;
  createDate: Date;
  userId: string;
  sketchId: string;
  productId: string;
}

export interface DonationQueryParams {
  match?: Partial<Donation>;
  limit?: number;
}