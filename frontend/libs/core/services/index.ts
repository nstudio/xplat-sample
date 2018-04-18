import { WindowService } from './window.service';
import { LogService } from './log.service';
import { ModalPlatformService, ModalService } from './modal.service';
import { LocaleService } from './locale.service';
import { NetworkCommonService } from './network.service';
import { ApiInterceptor } from './http-interceptor.service';
import { FirebaseService } from './firebase.service';
import { AuthGuard } from './auth.guard';
import { UserService } from './user.service';

export const CORE_PROVIDERS: any[] = [
  WindowService,
  LogService,
  LocaleService,
  ModalPlatformService,
  ModalService,
  NetworkCommonService,
  ApiInterceptor,
  FirebaseService,
  AuthGuard,
  UserService
];

export * from './window.service';
export * from './log.service';
export * from './locale.service';
export * from './modal.service';
export * from './network.service';
export * from './firebase.service';
export * from './auth.guard';
export * from './user.service';
export * from './tokens';
