// import gql from 'graphql-tag';
// import { api } from '../graphql.client';
// import { Love, LoveQueryParams } from './love.service.models';

// export async function getLove(params: LoveQueryParams): Promise<Love> {
//   const gqlQuery = gql`
//     query GetLove($params: LoveQueryParams) {
//       getTag(params: $params) {
//         id
//         name
//       }
//     }
//   `;
//   const resp = await api().query({
//     query: gqlQuery,
//     variables: { params }
//   });

//   const data = resp.data as any;
//   return data.getTag as Tag;
// }

// export async function getTags(params?: TagQueryParams): Promise<Tag[]> {
//   const gqlQuery = gql`
//     query GetTags($params: TagQueryParams) {
//       getTags(params: $params) {
//         id
//         name
//         slug
//         description
//         category
//         primaryFlag
//       }
//     }
//   `;
//   const resp = await api().query({
//     query: gqlQuery,
//     variables: { params }
//   });

//   const data = resp.data as any;
//   return data.getTags as Tag[];
// }

// export async function createTag(tag: Partial<Tag>): Promise<Tag> {
//   const gqlMutation = gql`
//     mutation createTag($tag: TagInput) {
//       createTag(tag: $tag) {
//         id
//         name
//       }
//     }
//   `;
//   const resp = await api().mutate({
//     mutation: gqlMutation,
//     variables: { tag }
//   });

//   const data = resp.data as any;
//   return data.createTag as Tag;
// }

// export async function updateTag(tagId: string, tagUpdates: Partial<Tag>): Promise<Tag> {
//   const gqlMutation = gql`
//     mutation updateTag($tagId: String, $tagUpdates: TagInput) {
//       updateTag(tagId: $tagId, tagUpdates: $tagUpdates) {
//         id
//         name
//       }
//     }
//   `;
//   const resp = await api().mutate({
//     mutation: gqlMutation,
//     variables: { tagId, tagUpdates }
//   });

//   const data = resp.data as any;
//   return data.updateTag as Tag;
// }
