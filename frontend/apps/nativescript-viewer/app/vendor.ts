// Snapshot the ~/app.css and the theme
const application = require('application');
require('ui/styling/style-scope');
const appCssContext = require.context('~/', false, /^\.\/app\.(css|scss|less|sass)$/);
global.registerWebpackModules(appCssContext);
application.loadAppCss();

import './vendor-platform';

import 'reflect-metadata';

// ng
import '@angular/core';
import '@angular/common';
import '@angular/forms';
import '@angular/platform-browser';
import '@angular/router';

// ng libs
import '@ngrx/effects';
import '@ngrx/router-store';
import '@ngrx/store';
import '@ngx-translate/core';

// ns-ng
import 'nativescript-angular/platform-static';
import 'nativescript-angular/common';
import 'nativescript-angular/forms';
import 'nativescript-angular/http-client';
import 'nativescript-angular/router';

// shared libs across all apps in Nx workspace
import '@sketchpoints/api';
import '@sketchpoints/core';
import '@sketchpoints/features';
import '@sketchpoints/nativescript';
import '@sketchpoints/utils';

// ns plugins
import 'nativescript-fancyalert';
import 'nativescript-loading-indicator';
import 'nativescript-ngx-fonticon';
import 'nativescript-social-share';
import 'nativescript-ui-listview';
import 'nativescript-ui-listview/angular';
import 'nativescript-ui-sidedrawer';
import 'nativescript-ui-sidedrawer/angular';

// must go last
import 'nativescript-plugin-firebase';
