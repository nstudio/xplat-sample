import { Love, LoveQueryParams } from './love.service.models';
import { getLove, getLoves, createLove, updateLove } from './love.service';

interface LoveQueryArgs {
  params: LoveQueryParams;
}

interface CreateLoveArgs {
  love: Partial<Love>;
}

interface LoveUpdateArgs {
  loveId: string;
  loveUpdates: Partial<Love>;
}

export const loveResolver = {
  Query: {
    getLove: (root: any, { params }: LoveQueryArgs) => getLove(params),
    getLoves: (root: any, { params }: LoveQueryArgs) => getLoves(params)
  },
  Mutation: {
    createLove: (root: any, { love }: CreateLoveArgs) => createLove(love),
    updateLove: (root: any, args: LoveUpdateArgs) => updateLove(args.loveId, args.loveUpdates)
  }
};
