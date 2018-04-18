import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from './features/core/core.module';
import { SharedModule } from './features/shared/shared.module';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
