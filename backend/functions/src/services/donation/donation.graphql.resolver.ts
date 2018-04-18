import { Donation, DonationQueryParams } from './donation.service.models';
import { getAllDonations, createDonation, updateDonation } from './donation.service';

interface DonationQueryArgs {
  params: DonationQueryParams;
}

interface CreateDonationArgs {
  donation: Partial<Donation>;
}

interface DonationUpdateArgs {
  donationId: string;
  donationUpdates: Partial<Donation>;
}

export const donationResolver = {
  Query: {
    getAllDonations: (root: any, { params }: DonationQueryArgs) => getAllDonations(params)
  },
  Mutation: {
    createDonation: (root: any, { donation }: CreateDonationArgs) => createDonation(donation),
    updateDonation: (root: any, args: DonationUpdateArgs) => updateDonation(args.donationId, args.donationUpdates)
  }
};
