import gql from 'graphql-tag';
import { api } from '../../helpers';
import { Sketch, SketchQueryParams } from './sketch.service.models';

export async function getSketch(params: SketchQueryParams): Promise<Sketch> {
  const gqlQuery = gql`
    query GetSketch($params: SketchQueryParams) {
      getSketch(params: $params) {
        id
        name
        streamTime
      }
    }
  `;
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getSketch as Sketch;
}

export async function getSketches(params: SketchQueryParams): Promise<Sketch[]> {
  const gqlQuery = gql`
    query GetSketches($params: SketchQueryParams) {
      getSketches(params: $params) {
        id
        gifUrl
        movUrl
        streamTime
        gatheringId
        gatheringName
        sketchPages
        createDate
      }
    }
  `;
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getSketches as Sketch[];
}

export async function createSketch(sketch: Partial<Sketch>): Promise<Sketch> {
  const gqlMutation = gql`
    mutation CreateSketch($sketch: SketchInput) {
      createSketch(sketch: $sketch) {
        id
        gifUrl
        movUrl
        streamTime
        gatheringId
        gatheringName
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
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { sketch }
  });

  const data = resp.data as any;
  return data.createSketch as Sketch;
}

export async function updateSketch(sketchId: string, sketchUpdates: Partial<Sketch>): Promise<Sketch> {
  const gqlMutation = gql`
    mutation UpdateSketch($sketchId: String, $sketchUpdates: SketchInput) {
      updateSketch(sketchId: $sketchId, sketchUpdates: $sketchUpdates) {
        id
        gifUrl
        movUrl
        streamTime
        gatheringId
        gatheringName
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
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { sketchId, sketchUpdates }
  });

  const data = resp.data as any;
  return data.updateSketch as Sketch;
}
