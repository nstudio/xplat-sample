import { Component, Input } from '@angular/core';

import { BaseComponent } from '@sketchpoints/core';
import { AppService } from '@sketchpoints/nativescript';

@Component({
  moduleId: module.id,
  selector: 'sp-badge',
  templateUrl: './badge.component.html'
})
export class BadgeComponent extends BaseComponent {
  @Input() public badge: any;
  public badgeBound: any;
  public reinit = true;

  constructor(public appService: AppService) {
    super();
  }

  // ngOnInit() {
  //   this.badgeBound = this.badge;
  // }

  ngOnChanges() {
    if (this.badge) {
      // trying to cause the FavBtn to recreate itself
      // currently the icon/name can become out of sync due to something weird with nativeview creation in plugin and binding change
      this.badge = { ...this.badge };
    }
  }
}
