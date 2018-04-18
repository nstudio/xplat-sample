import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// libs
import { TranslateModule } from '@ngx-translate/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatGridListModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { UiSharedModule } from '@sketchpoints/features';

// app
import { COMPONENTS, ENTRY_COMPONENTS } from './components';
import { DIRECTIVES } from './directives';
import { PIPES } from './pipes';

const MODULES = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  FlexLayoutModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  TranslateModule,
  UiSharedModule,
];

@NgModule( {
  imports: [
    ...MODULES
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ]
} )
export class UiModule { }
