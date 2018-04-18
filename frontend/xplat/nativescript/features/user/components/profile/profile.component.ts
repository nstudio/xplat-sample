import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { knownFolders, path } from 'tns-core-modules/file-system';
import { ProfileBaseComponent, WindowService, UserState, UserService, FirebaseService, ModalActions, environment } from '@sketchpoints/core';
import { AppService } from '@sketchpoints/nativescript/core';

import { ModalWebViewComponent } from '../../../ui/components/modal-webview/modal-webview.component';

@Component({
  selector: 'sp-profile',
  moduleId: module.id,
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends ProfileBaseComponent {

  public failedFrameUploads: Array<string> = [];

  constructor(
    protected store: Store<UserState.IState>,
    protected route: ActivatedRoute,
    public userService: UserService,
    public win: WindowService,
    public appService: AppService,
    private _firebase: FirebaseService
  ) {
    super(store, route, userService);
  }

  public viewTwitter() {
    if (this.appService.user) {
      let handle = this.appService.user.twitterHandle;
      if (handle) {
        this.store.dispatch(new ModalActions.Open({
          cmpType: ModalWebViewComponent,
          modalOptions: {
            viewContainerRef: this.win.vcRef,
            context: {
              title: handle,
              url: `https://twitter.com/${handle}`
            }
          }
        }));
      }
    }
  }
}
