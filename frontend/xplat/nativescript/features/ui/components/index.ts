import { HeaderComponent } from './header/header.component';
import { HeaderBackComponent } from './header/header-back.component';
import { HeaderLogoComponent } from './header/header-logo.component';
import { ModalTitleBarComponent } from './modal-title-bar/modal-title-bar.component';
import { ModalWebViewComponent } from './modal-webview/modal-webview.component';

export const UI_COMPONENTS = [
  HeaderComponent,
  HeaderBackComponent,
  HeaderLogoComponent,
  ModalTitleBarComponent,
  ModalWebViewComponent,
];

export const UI_ENTRY_COMPONENTS: any[] = [
  ModalWebViewComponent,
];

export * from './modal-webview/modal-webview.component';

