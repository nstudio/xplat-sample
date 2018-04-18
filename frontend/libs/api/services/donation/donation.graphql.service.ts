import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Donation, DonationQueryParams } from './donation.model';

@Injectable()
export class ApiDonation {
  constructor(private _apollo: Apollo) {}

  public getAllDonations(params: DonationQueryParams) {
    const gqlQuery = gql`
      query GetDonation($params: DonationQueryParams) {
        getAllDonations(params: $params) {
          id
          createDate
          userId
          sketchId
          productId
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
          return data.getAllDonations as Donation[];
        })
      );
  }

  public createDonation(donation: Partial<Donation>) {
    const gqlMutation = gql`
      mutation CreateDonation($donation: DonationInput) {
        createDonation(donation: $donation) {
          id
          createDate
          userId
          sketchId
          productId
        }
      }
    `;
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { donation }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.createDonation as Donation;
        })
      );
  }

  public updateDonation(donationId: string, donationUpdates: Partial<Donation>) {
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
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { donationId, donationUpdates }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.updateDonation as Donation;
        })
      );
  }
}
