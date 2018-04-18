import { FirebaseWebService } from './firebase-web.service';
import { LinkService } from './link.service';

export const PROVIDERS: any[] = [
  FirebaseWebService,
  LinkService
];

export * from './firebase-web.service';
export * from './link.service';
