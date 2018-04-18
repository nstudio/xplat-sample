import { Component, Input, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';

import { BaseComponent } from '@sketchpoints/core/base';

export abstract class LayoutBaseComponent extends BaseComponent implements AfterViewChecked {
  public appName: string;

  constructor(protected cdRef: ChangeDetectorRef) {
    super();
  }

  ngAfterViewChecked() {
    // helps solves ExpressionChangedAfterItHasBeenCheckedError exception with angular
    this.cdRef.detectChanges();
  }
}
