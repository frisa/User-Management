import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { bootstrapApplication } from '@angular/platform-browser';
import { AuthenticationsComponent } from './authentications/authentications.component';

bootstrapApplication(AppComponent);
bootstrapApplication(AuthenticationsComponent);

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
})
export class AppModule { }
