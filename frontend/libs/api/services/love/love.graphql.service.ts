import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Love, LoveQueryParams } from './love.model';

@Injectable()
export class ApiLove {
  constructor(private _apollo: Apollo) {}

  public getLove(params: LoveQueryParams) {
    const gqlQuery = gql`
      query GetLove($params: LoveQueryParams) {
        getLove(params: $params) {
          id
          userId
          sketchId
          total
          bonus
          badgeId
          color
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
          return data.getLove as Love;
        })
      );
  }

  public getLoves(params?: LoveQueryParams) {
    const gqlQuery = gql`
      query GetLoves($params: LoveQueryParams) {
        getLoves(params: $params) {
          id
          userId
          sketchId
          total
          bonus
          badgeId
          color
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
          return data.getLoves as Love[];
        })
      );
  }

  public createLove(love: Partial<Love>) {
    const gqlMutation = gql`
      mutation createLove($love: LoveInput) {
        createLove(love: $love) {
          id
          userId
          sketchId
          total
          bonus
          badgeId
          color
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { love }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.createLove as Love;
        })
      );
  }

  public updateLove(loveId: string, loveUpdates: Partial<Love>) {
    const gqlMutation = gql`
      mutation updateLove($loveId: String, $loveUpdates: LoveInput) {
        updateLove(loveId: $loveId, loveUpdates: $loveUpdates) {
          id
          userId
          sketchId
          total
          bonus
          badgeId
          color
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { loveId, loveUpdates }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.updateLove as Love;
        })
      );
  }
}
