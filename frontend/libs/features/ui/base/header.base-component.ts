import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '@sketchpoints/core/base';

export abstract class HeaderBaseComponent extends BaseComponent {
  @Input() title: string;
  @Input() rightButton: string;
  @Output() tappedTop: EventEmitter<boolean> = new EventEmitter();
  @Output() tappedRight: EventEmitter<boolean> = new EventEmitter();
}
