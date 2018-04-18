import { ApiDonation } from './donation/donation.graphql.service';
import { ApiGathering } from './gathering/gathering.graphql.service';
import { ApiLove } from './love/love.graphql.service';
import { ApiSketch } from './sketch/sketch.graphql.service';
import { ApiSponsored } from './sponsored/sponsored.graphql.service';
import { ApiTag } from './tag/tag.graphql.service';
import { ApiUser } from './user/user.graphql.service';

export const API_PROVIDERS = [ApiDonation, ApiGathering, ApiLove, ApiSketch, ApiSponsored, ApiTag, ApiUser];

export * from './donation/donation.graphql.service';
export * from './donation/donation.model';
export * from './gathering/gathering.graphql.service';
export * from './gathering/gathering.model';
export * from './love/love.graphql.service';
export * from './love/love.model';
export * from './sketch/sketch.graphql.service';
export * from './sketch/sketch.model';
export * from './sponsored/sponsored.graphql.service';
export * from './sponsored/sponsored.model';
export * from './tag/tag.graphql.service';
export * from './tag/tag.model';
export * from './user/user.graphql.service';
export * from './user/user.model';
