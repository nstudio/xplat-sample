import { Sponsored, SponsoredQueryParams } from './sponsored.service.models';
import { getAllSponsors, createSponsored, updateSponsored } from './sponsored.service';

interface SponsoredQueryArgs {
  params: SponsoredQueryParams;
}

interface CreateSponsoredArgs {
  sponsored: Partial<Sponsored>;
}

interface SponsoredUpdateArgs {
  sponsoredId: string;
  sponsoredUpdates: Partial<Sponsored>;
}

export const sponsoredResolver = {
  Query: {
    getAllSponsors: (root: any, { params }: SponsoredQueryArgs) => getAllSponsors(params)
  },
  Mutation: {
    createSponsored: (root: any, { sponsored }: CreateSponsoredArgs) => createSponsored(sponsored),
    updateSponsored: (root: any, args: SponsoredUpdateArgs) => updateSponsored(args.sponsoredId, args.sponsoredUpdates)
  }
};
