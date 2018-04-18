import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Sponsored, SponsoredQueryParams } from './sponsored.model';

@Injectable()
export class ApiSponsored {
  constructor(private _apollo: Apollo) {}

  public getAllSponsors(params: SponsoredQueryParams) {
    const gqlQuery = gql`
      query GetSponsored($params: SponsoredQueryParams) {
        getAllSponsors(params: $params) {
          id
          tagId
          users {
            id
            name
          }
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
          return data.getAllSponsors as Sponsored[];
        })
      );
  }

  public createSponsored(sketch: Partial<Sponsored>) {
    const gqlMutation = gql`
      mutation CreateSketch($sketch: SketchInput) {
        createSponsored(sketch: $sketch) {
          id
          tagId
          users {
            id
            name
          }
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { sketch }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.createSponsored as Sponsored;
        })
      );
  }

  public updateSponsored(sponsoredId: string, sponsoredUpdates: Partial<Sponsored>) {
    const gqlMutation = gql`
      mutation updateSponsored($sponsoredId: String, $sponsoredUpdates: SketchInput) {
        updateSponsored(sponsoredId: $sponsoredId, sponsoredUpdates: $sponsoredUpdates) {
          id
          tagId
          users {
            id
            name
          }
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { sponsoredId, sponsoredUpdates }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.updateSponsored as Sponsored;
        })
      );
  }
}
