import { Gathering, GatheringQueryParams } from './gathering.service.models';
import { getGathering, getGatherings, createGathering, updateGathering } from './gathering.service';

interface GatheringQueryArgs {
  params: GatheringQueryParams;
}

interface CreateGatheringArgs {
  gathering: Partial<Gathering>;
}

interface GatheringUpdateArgs {
  gatheringId: string;
  gatheringUpdates: Partial<Gathering>;
}

export const gatheringResolver = {
  Query: {
    getGathering: (root: any, { params }: GatheringQueryArgs) => getGathering(params),
    getGatherings: (root: any, { params }: GatheringQueryArgs) => getGatherings(params)
  },
  Mutation: {
    createGathering: (root: any, { gathering }: CreateGatheringArgs) => createGathering(gathering),
    updateGathering: (root: any, args: GatheringUpdateArgs) => updateGathering(args.gatheringId, args.gatheringUpdates)
  }
};
