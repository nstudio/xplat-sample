import gql from 'graphql-tag';
import { api } from '../../helpers';
import { Sponsored, SponsoredQueryParams } from './sponsored.service.models';

export async function getAllSponsors(params?: SponsoredQueryParams): Promise<Sponsored[]> {
  const gqlQuery = gql`
    query GetAllSponsors($params: SponsoredQueryParams) {
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
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getAllSponsors as Sponsored[];
}

export async function createSponsored(sponsored: Partial<Sponsored>): Promise<Sponsored> {
  const gqlMutation = gql`
    mutation createSponsored($sponsored: SponsoredInput) {
      createSponsored(sponsored: $sponsored) {
        id
        tagId
        users {
          id
          name
        }
      }
    }
  `;
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { sponsored }
  });

  const data = resp.data as any;
  return data.createSponsored as Sponsored;
}

export async function updateSponsored(sponsoredId: string, sponsoredUpdates: Partial<Sponsored>): Promise<Sponsored> {
  const gqlMutation = gql`
    mutation updateSponsored($sponsoredId: String, $sponsoredUpdates: SponsoredInput) {
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
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { sponsoredId, sponsoredUpdates }
  });

  const data = resp.data as any;
  return data.updateSponsored as Sponsored;
}
