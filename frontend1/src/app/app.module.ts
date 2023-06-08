import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { GraphQLModule } from './graphql/graphql.module';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent);

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [],
})
export class AppModule { }
