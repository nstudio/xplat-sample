import { queryCollection, addToCollection, updateDocInCollection, deleteDocFromCollection, deleteDocsFromCollection } from '../../helpers';
import { Love, LoveQueryParams } from './love.service.models';

export async function createLove(loveData: Partial<Love>): Promise<Love> {
  return await addToCollection('love', loveData);
}

export async function updateLove(loveId: string, loveUpdates: Partial<Love>): Promise<Love> {
  return await updateDocInCollection('love', loveId, loveUpdates);
}

export async function getLove(params: LoveQueryParams): Promise<Love> {
  const love = (await queryCollection('love', params)) || [];
  return love[0];
}

export async function getLoves(params: LoveQueryParams): Promise<Love[]> {
  return queryCollection('love', params);
}

export async function deleteLove(id: string) {
  return deleteDocFromCollection('love', id);
}

export async function deleteLoves(params: LoveQueryParams) {
  return deleteDocsFromCollection('love', params);
}
