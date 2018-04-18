import { Component, OnInit } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Color } from 'tns-core-modules/color';
import { isIOS } from 'tns-core-modules/platform';
import { Page } from 'tns-core-modules/ui/page';
import { EventData } from 'tns-core-modules/data/observable';
import { SearchBar } from 'tns-core-modules/ui/search-bar';
import { Tag } from '@sketchpoints/api';
import { WindowService } from '@sketchpoints/core';
import { TagsBaseComponent, TagState, IHelpTip, TagActions } from '@sketchpoints/features';
import { AppService } from '@sketchpoints/nativescript/core';

@Component({
  selector: 'sp-tags',
  moduleId: module.id,
  templateUrl: './tags.component.html'
})
export class TagsComponent extends TagsBaseComponent {

  public rightButton: string = '';
  public search$: Subject<string> = new Subject();

  constructor(
    store: Store<TagState.IState>,
    protected win: WindowService,
    protected translate: TranslateService,
    protected page: Page,
    public appService: AppService
  ) {
    super(store);
    this.appName = this.appService.appName;
  }

  ngOnInit() {
    super.ngOnInit();

    this.search$.pipe(
      debounceTime( 500 ),
      takeUntil( this.destroy$ )
    ).subscribe( ( value: string ) => {
      let lowercaseValue = '';
      if ( value ) {
        lowercaseValue = value.toLowerCase();
      }
      this.tags = this.tags.filter(t => t.name.toLowerCase().indexOf(lowercaseValue) > -1);
    } );
  }

  public clear( e ) {
    this.store.pipe(
      select(TagState.selectTags), 
      take(1)
    ).subscribe((tags: Tag[]) => {
      this.tags = this.getGroupedTags(tags);
    });
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
      this.refreshTags();
      this.win.setTimeout(_ => {
        listview.notifyPullToRefreshFinished();
      }, 1500);
    }
  }

  public refreshTags() {
    this.store.dispatch(new TagActions.FetchTags({force: true }));
  }
}
