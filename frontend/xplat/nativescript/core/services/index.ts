import { AppService } from './app.service';
import { TNSModalService } from './tns-modal.service';
import { MobileWindowPlatformService } from './tns-window.service';
import { DrawerService } from './drawer.service';
import { TNSFirebaseService } from './tns-firebase.service';

export const PROVIDERS: any[] = [
  TNSModalService,
  DrawerService,
  AppService,
  MobileWindowPlatformService,
  TNSFirebaseService
];

export * from './app.service';
export * from './drawer.service';
