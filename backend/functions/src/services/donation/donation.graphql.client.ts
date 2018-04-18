import gql from 'graphql-tag';
import { api } from '../../helpers';
import { Donation, DonationQueryParams } from './donation.service.models';

export async function getAllDonations(params?: DonationQueryParams): Promise<Donation[]> {
  const gqlQuery = gql`
    query GetAllDonations($params: DonationQueryParams) {
      getAllDonations(params: $params) {
        id
        createDate
        userId
        sketchId
        productId
      }
    }
  `;
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getAllDonations as Donation[];
}

export async function createDonation(donation: Partial<Donation>): Promise<Donation> {
  const gqlMutation = gql`
    mutation createDonation($donation: DonationInput) {
      createDonation(donation: $donation) {
        id
        createDate
        userId
        sketchId
        productId
      }
    }
  `;
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { donation }
  });

  const data = resp.data as any;
  return data.createDonation as Donation;
}

export async function updateDonation(donationId: string, donationUpdates: Partial<Donation>): Promise<Donation> {
  const gqlMutation = gql`
    mutation updateDonation($donationId: String, $donationUpdates: DonationInput) {
      updateDonation(donationId: $donationId, donationUpdates: $donationUpdates) {
        id
        createDate
        userId
        sketchId
        productId
      }
    }
  `;
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { donationId, donationUpdates }
  });

  const data = resp.data as any;
  return data.updateDonation as Donation;
}
