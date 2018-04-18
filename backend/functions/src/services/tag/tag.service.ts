import { queryCollection, addToCollection, updateDocInCollection, deleteDocFromCollection, deleteDocsFromCollection } from '../../helpers';
import { Tag, TagQueryParams } from './tag.service.models';

export async function createTag(tagData: Partial<Tag>): Promise<Tag> {
  return await addToCollection('tag', tagData);
}

export async function updateTag(tagId: string, tagUpdates: Partial<Tag>): Promise<Tag> {
  return await updateDocInCollection('tag', tagId, tagUpdates);
}

export async function getTag(params: TagQueryParams): Promise<Tag> {
  const tags = (await queryCollection('tag', params)) || [];
  return tags[0];
}

export async function getTags(params: TagQueryParams): Promise<Tag[]> {
  return queryCollection('tag', params);
}

export async function deleteTag(id: string) {
  return deleteDocFromCollection('tag', id);
}

export async function deleteTags(params: TagQueryParams) {
  return deleteDocsFromCollection('tag', params);
}
