import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Tag, TagQueryParams } from './tag.model';

@Injectable()
export class ApiTag {
  constructor(private _apollo: Apollo) {}

  public getTag(params: TagQueryParams) {
    const gqlQuery = gql`
      query GetTag($params: TagQueryParams) {
        getTag(params: $params) {
          id
          name
          slug
          link
          description
          loveIcon
        }
      }
    `;
    return this._apollo
      .query({
        query: gqlQuery,
        variables: { params }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.getTag as Tag;
        })
      );
  }

  public getTags(params?: TagQueryParams) {
    const gqlQuery = gql`
      query GetTags($params: TagQueryParams) {
        getTags(params: $params) {
          id
          name
          slug
          description
          logoUrl
          link
          loveIcon
          category
          primaryFlag
        }
      }
    `;
    return this._apollo
      .query({
        query: gqlQuery,
        variables: { params }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.getTags as Tag[];
        })
      );
  }

  public createTag(tagData: Partial<Tag>) {
    const gqlMutation = gql`
      mutation createTag($tagData: TagInput) {
        createTag(tagData: $tagData) {
          id
          name
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { tagData }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.createTag as Tag;
        })
      );
  }

  public updateTag(tagId: string, tagUpdates: Partial<Tag>) {
    const gqlMutation = gql`
      mutation updateTag($tagId: String, $tagUpdates: TagInput) {
        updateTag(tagId: $tagId, tagUpdates: $tagUpdates) {
          id
          name
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { tagId, tagUpdates }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.updateTag as Tag;
        })
      );
  }
}
