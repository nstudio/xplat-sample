import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take, takeUntil, debounceTime } from 'rxjs/operators';
import { isIOS } from 'tns-core-modules/platform';
import { Color } from 'tns-core-modules/color';
import { EventData } from 'tns-core-modules/data/observable';
import { SearchBar } from 'tns-core-modules/ui/search-bar';
import { Gathering } from '@sketchpoints/api';
import { WindowService } from '@sketchpoints/core';
import { TagService, TagDetailBaseComponent, TagState, TagActions } from '@sketchpoints/features';
import { AppService } from '@sketchpoints/nativescript/core';

@Component({
  selector: 'sp-tag-detail',
  moduleId: module.id,
  templateUrl: './tag-detail.component.html'
})
export class TagDetailComponent extends TagDetailBaseComponent {

  constructor(
    protected store: Store<any>,
    protected tagService: TagService,
    protected route: ActivatedRoute,
    public appService: AppService,
    private _win: WindowService,
  ) {
    super(store, tagService, route);
  }

  public listviewLoaded(e) {
    if (isIOS && e) {
      const listview = e.object;
      if (listview && listview.ios && listview.ios.pullToRefreshView) {
        listview.ios.pullToRefreshView.backgroundColor = new Color('#303030').ios;
      }
    }
  }

  public doNotShowAndroidKeyboard( args: EventData ) {
    if ( !isIOS ) {
      let searchBar = <SearchBar>args.object;
      if ( searchBar.android ) {
        searchBar.android.clearFocus();
      }
    }
  }

  public onPullRefreshInitiated(e) {
    const listview = e.object;
    if (listview) {
      this.refreshGatherings();
      this._win.setTimeout(_ => {
        listview.notifyPullToRefreshFinished();
      }, 1500);
    }
  }

  public refreshGatherings() {
    this.store.dispatch(new TagActions.FetchGatherings({tag: this.selected, force: true}));
  }
}
