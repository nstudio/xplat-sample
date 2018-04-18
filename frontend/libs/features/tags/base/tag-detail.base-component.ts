import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { Store, select } from '@ngrx/store';
import { take, takeUntil, skip, debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Tag, Gathering } from '@sketchpoints/api';
import { BaseComponent } from '@sketchpoints/core/base';

import { TagService } from '../services/tag.service';
import { TagActions, TagState } from '../state';

export abstract class TagDetailBaseComponent extends BaseComponent implements OnInit {
  public selected: Tag;
  public selectedGathering: Gathering;
  public title: string = '';
  public gatherings: Gathering[];
  public search$: Subject<string> = new Subject();

  constructor(
    protected store: Store<TagState.IState>,
    protected tagService: TagService,
    protected route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.search$.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((value: string) => {
      let lowercaseValue = '';
      if (value) {
        lowercaseValue = value.toLowerCase();
      }

      // always reset so full search
      this.clear();
      this.gatherings = this.gatherings.filter(g => g.name.toLowerCase().indexOf(lowercaseValue) > -1);
    });

    this.store
      .pipe(select(TagState.selectState), skip(1), takeUntil(this.destroy$))
      .subscribe((state: TagState.IState) => {
        this.selected = state.selectedTag;
        this.gatherings = state.gatherings;
        this.selectedGathering = state.selectedGathering;
        if (this.selectedGathering) {
          this.title = this.selectedGathering.name;
        } else if (this.selected) {
          this.title = this.selected.name;
        }
      });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params['slug'];
      this.store.dispatch(new TagActions.SelectTag(slug));
    });
  }

  public clear(e?: any) {
    this.store.pipe(select(TagState.selectGatherings), take(1)).subscribe((gatherings: Gathering[]) => {
      this.gatherings = [...gatherings];
    });
  }
}
