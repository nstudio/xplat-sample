import { Component, OnInit, Optional } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// libs
import { Store, select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { Tag, Gathering } from '@sketchpoints/api';
import { BaseComponent } from '@sketchpoints/core/base';

import { TagService } from '../services/tag.service';
import { TagState } from '../state/tag.state';

export abstract class GatheringsBaseComponent extends BaseComponent implements OnInit {
  activeUrl: string;
  selectedTag: Tag;
  gatherings: Gathering[];

  constructor(protected store: Store<TagState.IState>, protected router: Router) {
    super();
    this.activeUrl = this.homePath;
  }

  ngOnInit(): void {
    this.store.pipe(select(TagState.selectState), takeUntil(this.destroy$)).subscribe((state: TagState.IState) => {
      this.selectedTag = state.selectedTag;
      this.gatherings = state.gatherings;
    });

    this.router.events
      .pipe(takeUntil(this.destroy$), filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.activeUrl = e.url;
      });
  }
}
