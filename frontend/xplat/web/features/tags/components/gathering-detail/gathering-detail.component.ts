import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment, WindowService, LogService, FirebaseService, UserService, ModalActions } from '@sketchpoints/core';
import { SketchViewerBaseComponent, TagService, FrameService } from '@sketchpoints/features';
import { isWebMobile } from '@sketchpoints/utils';

@Component({
  selector: 'sp-gathering-detail',
  templateUrl: './gathering-detail.component.html'
})
export class GatheringDetailComponent extends SketchViewerBaseComponent implements OnInit {

  constructor(
    store: Store<any>,
    ngZone: NgZone,
    route: ActivatedRoute,
    log: LogService,
    win: WindowService,
    tagService: TagService,
    frameService: FrameService,
    firebase: FirebaseService,
    userService: UserService,
  ) {
    super(store, ngZone, route, log, win, tagService, frameService, userService, firebase);
    this.isIOSWeb = isWebMobile.iOS();
  }
}
