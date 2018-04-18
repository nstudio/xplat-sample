import gql from 'graphql-tag';
import { api } from '../../helpers';
import { Gathering, GatheringQueryParams } from './gathering.service.models';

export async function getGathering(params: GatheringQueryParams): Promise<Gathering> {
  const gqlQuery = gql`
    query GetGathering($params: GatheringQueryParams) {
      getGathering(params: $params) {
        id
        name
      }
    }
  `;
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getGathering as Gathering;
}

export async function getGatherings(params: GatheringQueryParams): Promise<Gathering[]> {
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
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getGatherings as Gathering[];
}

export async function createGathering(gathering: Partial<Gathering>): Promise<Gathering> {
  const gqlMutation = gql`
    mutation CreateGathering($gathering: GatheringInput) {
      createGathering(gathering: $gathering) {
        id
        name
      }
    }
  `;
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { gathering }
  });

  const data = resp.data as any;
  return data.createGathering as Gathering;
}

export async function updateGathering(gatheringId: string, gatheringUpdates: Partial<Gathering>): Promise<Gathering> {
  const gqlMutation = gql`
    mutation updateGathering($gatheringId: String, $gatheringUpdates: GatheringInput) {
      updateGathering(gatheringId: $gatheringId, gatheringUpdates: $gatheringUpdates) {
        id
        name
      }
    }
  `;
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { gatheringId, gatheringUpdates }
  });

  const data = resp.data as any;
  return data.updateGathering as Gathering;
}
