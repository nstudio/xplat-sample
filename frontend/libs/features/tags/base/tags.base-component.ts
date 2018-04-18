import { Component, OnInit } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Tag, TagCategory } from '@sketchpoints/api';
import { groupBy } from '@sketchpoints/utils';
import { BaseComponent } from '@sketchpoints/core/base';

import { TagActions, TagState } from '../state';

export abstract class TagsBaseComponent extends BaseComponent implements OnInit {
  public appName: string;
  public tags: Tag[];
  private _helpOn = false;

  // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
  // Angular knows about this service because it is included in your app’s CoreModule.
  // Providing it via the CoreModule ensures it's a singleton across the entire app
  constructor(protected store: Store<TagState.IState>) {
    super();
  }

  public get helpOn() {
    return this._helpOn;
  }

  public set helpOn(value: boolean) {
    this._helpOn = value;
  }

  ngOnInit(): void {
    this.store.pipe(select(TagState.selectTags), takeUntil(this.destroy$)).subscribe((tags: Tag[]) => {
      if (tags) {
        this.tags = this.getGroupedTags(tags);
      }
    });
    // always empty gatherings and selectedGathering
    this.store.dispatch(
      new TagActions.Changed({
        selectedGathering: null,
        gatherings: []
      })
    );
  }

  public getGroupedTags(tags: Tag[]) {
    // for now put technology and conferences at top
    // TODO: provide filter for users to sort tag list easily
    const groupedTags: Array<Tag> = [];
    const grouped: any = groupBy(tags, 'category');
    if (grouped) {
      const tech = grouped[TagCategory.TECHNOLOGY];
      if (tech && tech.length) {
        groupedTags.push(...tech);
      }
      delete grouped[TagCategory.TECHNOLOGY];
      const conf = grouped[TagCategory.CONFERENCE];
      if (conf && conf.length) {
        groupedTags.push(...conf);
      }
      delete grouped[TagCategory.CONFERENCE];

      // push the rest
      for (const key in grouped) {
        groupedTags.push(...grouped[key]);
      }
    }
    return groupedTags;
  }
}
