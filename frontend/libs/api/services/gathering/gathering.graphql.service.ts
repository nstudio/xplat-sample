import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Gathering, GatheringQueryParams } from './gathering.model';

@Injectable()
export class ApiGathering {
  constructor(private _apollo: Apollo) {}

  public getGathering(params: GatheringQueryParams) {
    const gqlQuery = gql`
      query GetGathering($params: GatheringQueryParams) {
        getGathering(params: $params) {
          id
          name
          slug
          description
          timeStart
          timeEnd
          timeSpanMinutes
          tags
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
          return data.getGathering as Gathering;
        })
      );
  }

  public getGatherings(params: GatheringQueryParams) {
    const gqlQuery = gql`
      query GetGatherings($params: GatheringQueryParams) {
        getGatherings(params: $params) {
          id
          name
          slug
          description
          timeStart
          timeEnd
          timeSpanMinutes
          tags
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
          return data.getGatherings as Gathering[];
        })
      );
  }

  public createGathering(gatheringData: Partial<Gathering>) {
    const gqlMutation = gql`
      mutation createGathering($gatheringData: GatheringInput) {
        createGathering(gatheringData: $gatheringData) {
          id
          name
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { gatheringData }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.createGathering as Gathering;
        })
      );
  }

  public updateGathering(gatheringId: string, gatheringUpdates: Partial<Gathering>) {
    const gqlMutation = gql`
      mutation updateGathering($gatheringId: String, $gatheringUpdates: GatheringInput) {
        updateGathering(gatheringId: $gatheringId, gatheringUpdates: $gatheringUpdates) {
          id
          name
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { gatheringId, gatheringUpdates }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.updateGathering as Gathering;
        })
      );
  }
}
