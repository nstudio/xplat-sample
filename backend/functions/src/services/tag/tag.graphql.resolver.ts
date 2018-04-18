import { Tag, TagQueryParams } from './tag.service.models';
import { getTag, getTags, createTag, updateTag } from './tag.service';

interface TagQueryArgs {
  params: TagQueryParams;
}

interface CreateTagArgs {
  tag: Partial<Tag>;
}

interface TagUpdateArgs {
  tagId: string;
  tagUpdates: Partial<Tag>;
}

export const tagResolver = {
  Query: {
    getTag: (root: any, { params }: TagQueryArgs) => getTag(params),
    getTags: (root: any, { params }: TagQueryArgs) => getTags(params)
  },
  Mutation: {
    createTag: (root: any, { tag }: CreateTagArgs) => createTag(tag),
    updateTag: (root: any, args: TagUpdateArgs) => updateTag(args.tagId, args.tagUpdates)
  }
};
