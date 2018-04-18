import { queryCollection, addToCollection, updateDocInCollection, deleteDocFromCollection, deleteDocsFromCollection } from '../../helpers';
import { Sponsored, SponsoredQueryParams } from './sponsored.service.models';

export async function createSponsored(sponsoredData: Partial<Sponsored>): Promise<Sponsored> {
  return await addToCollection('sponsored', sponsoredData);
}

export async function updateSponsored(sponsoredId: string, sponsoredUpdates: Partial<Sponsored>): Promise<Sponsored> {
  return await updateDocInCollection('sponsored', sponsoredId, sponsoredUpdates);
}

export async function getAllSponsors(params: SponsoredQueryParams): Promise<Sponsored[]> {
  return queryCollection('sponsored', params);
}

export async function deleteSponsored(id: string) {
  return deleteDocFromCollection('sponsored', id);
}

export async function deleteSponsoreds(params: SponsoredQueryParams) {
  return deleteDocsFromCollection('sponsored', params);
}
