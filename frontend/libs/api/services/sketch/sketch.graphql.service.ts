import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Sketch, SketchQueryParams } from './sketch.model';

@Injectable()
export class ApiSketch {
  constructor(private _apollo: Apollo) {}

  public getSketch(params: SketchQueryParams) {
    const gqlQuery = gql`
      query GetSketch($params: SketchQueryParams) {
        getSketch(params: $params) {
          id
          gifUrl
          movUrl
          streamTime
          userId
          gatheringId
          gatheringName
          artistName
          createDate
          sketchPages {
            createDate
            completed
            sketchFrames {
              url
              streamTime
              createDate
            }
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
          return data.getSketch as Sketch;
        })
      );
  }

  public getSketches(params: SketchQueryParams) {
    const gqlQuery = gql`
      query GetSketches($params: SketchQueryParams) {
        getSketches(params: $params) {
          id
          gifUrl
          movUrl
          streamTime
          userId
          gatheringId
          gatheringName
          artistName
          createDate
          sketchPages {
            createDate
            completed
            sketchFrames {
              url
              streamTime
              createDate
            }
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
          return data.getSketches as Sketch[];
        })
      );
  }

  public createSketch(sketch: Partial<Sketch>) {
    const gqlMutation = gql`
      mutation CreateSketch($sketch: SketchInput) {
        createSketch(sketch: $sketch) {
          id
          gifUrl
          movUrl
          streamTime
          userId
          gatheringId
          gatheringName
          artistName
          createDate
          sketchPages {
            createDate
            completed
            sketchFrames {
              url
              streamTime
              createDate
            }
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
          return data.createSketch as Sketch;
        })
      );
  }

  public updateSketch(sketchId: string, sketchUpdates: Partial<Sketch>) {
    const gqlMutation = gql`
      mutation updateSketch($sketchId: String, $sketchUpdates: SketchInput) {
        updateSketch(sketchId: $sketchId, sketchUpdates: $sketchUpdates) {
          id
          gifUrl
          movUrl
          streamTime
          userId
          gatheringId
          gatheringName
          artistName
          createDate
          sketchPages {
            createDate
            completed
            sketchFrames {
              url
              streamTime
              createDate
            }
          }
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { sketchId, sketchUpdates }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.updateSketch as Sketch;
        })
      );
  }
}
