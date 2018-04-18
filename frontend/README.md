# SketchPoints

## PWA app

PWA web app to allow consumer to view live stream of sketches.

```
npm start
```
To clean deps at anytime and run a clean install:

```
npm run clean
```

To deploy web app to production run:

```
npm run deploy.pwa.prod
```

## iOS app: `SPArtist`
  
Artist app to provide sketches to the live stream.

```
npm run start.nativescript.artist.ios
```

To clean deps at anytime and run a clean install:

```
npm run clean.nativescript.artist
```

## iOS app: `SketchPoints`
  
Viewer app to allow consumer to view live stream of sketches.

```
npm run start.nativescript.viewer.ios
```

To clean deps at anytime and run a clean install:

```
npm run clean.nativescript.viewer
```

# Shared code

  * `/libs`: Shared code which is platform agnostic.
  * `/xplat`: Platform specific shared code.
    * `/nativescript`: NativeScript specific shared code.
    * `/web`: Web specific shared code.
    * `/ssr`: We are preparing this portion for the open source sample and will be made available soon. Server-side rendered shared code. ie: [Angular Universal](https://universal.angular.io/)

To clean any build artifacts from the shared code (which can happen during NativeScript builds):

```
npm run clean.shared
```

### Credits

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0 using [Nrwl Nx](https://nrwl.io/nx).

## Nrwl Extensions for Angular (Nx)

<a href="https://nrwl.io/nx"><img src="https://preview.ibb.co/mW6sdw/nx_logo.png"></a>

Nx is an open source toolkit for enterprise Angular applications.

## Build

Run `ng build --app=myapp` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
