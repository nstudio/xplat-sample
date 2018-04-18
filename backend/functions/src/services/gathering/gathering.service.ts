import { queryCollection, addToCollection, updateDocInCollection, deleteDocFromCollection, deleteDocsFromCollection } from '../../helpers';
import { Gathering, GatheringQueryParams } from './gathering.service.models';

export async function createGathering(GatheringData: Partial<Gathering>): Promise<Gathering> {
  return await addToCollection('gathering', GatheringData);
}

export async function updateGathering(gatheringId: string, gatheringUpdates: Partial<Gathering>): Promise<Gathering> {
  return await updateDocInCollection('gathering', gatheringId, gatheringUpdates);
}

export async function getGathering(params: GatheringQueryParams): Promise<Gathering> {
  const gatherings = (await queryCollection('gathering', params)) || [];
  return gatherings[0];
}

export async function getGatherings(params: GatheringQueryParams): Promise<Gathering[]> {
  return queryCollection('gathering', params);
}

export async function deleteGathering(id: string) {
  return deleteDocFromCollection('gathering', id);
}

export async function deleteGatherings(params: GatheringQueryParams) {
  return deleteDocsFromCollection('gathering', params);
}
