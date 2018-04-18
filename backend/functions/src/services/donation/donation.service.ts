import { queryCollection, addToCollection, updateDocInCollection, deleteDocFromCollection, deleteDocsFromCollection } from '../../helpers';
import { Donation, DonationQueryParams } from './donation.service.models';

export async function createDonation(donationData: Partial<Donation>): Promise<Donation> {
  return await addToCollection('donation', donationData);
}

export async function updateDonation(donationId: string, donationUpdates: Partial<Donation>): Promise<Donation> {
  return await updateDocInCollection('donation', donationId, donationUpdates);
}

export async function getAllDonations(params: DonationQueryParams): Promise<Donation[]> {
  return queryCollection('donation', params);
}

export async function deleteDonation(id: string) {
  return deleteDocFromCollection('donation', id);
}

export async function deleteDonations(params: DonationQueryParams) {
  return deleteDocsFromCollection('donation', params);
}
