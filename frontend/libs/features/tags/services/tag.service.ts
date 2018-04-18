import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Tag, Gathering } from '@sketchpoints/api';

import { TagActions, TagState } from '../state';

/**
 * This is organized in this module just for good housekeeping
 * However it is provided via the CoreModule to ensure it's
 * a singleton the entire app can use.
 * If your module service is *only* used in this module
 * you can have the service provided by this module.
 * In this case however, we want this service to be a true singleton
 * which can be injected into any component/service anywhere and
 * it will be the same instance therefore this is provided by the CoreModule.
 */
@Injectable()
export class TagService {
  constructor(private _store: Store<TagState.IState>) {}

  getTagById(id: string): Promise<Tag> {
    return new Promise(resolve => {
      this._store.pipe(select(TagState.selectTags), take(1)).subscribe((tags: Tag[]) => {
        resolve(tags.find(i => i.id === id));
      });
    });
  }

  getTagBySlug(slug: string): Promise<Tag> {
    return new Promise((resolve, reject) => {
      this._store.pipe(select(TagState.selectTags), take(1)).subscribe((tags: Tag[]) => {
        const tag = tags.find(i => i.slug === slug);
        if (tag) {
          resolve(tag);
        } else {
          reject();
        }
      });
    });
  }
}
