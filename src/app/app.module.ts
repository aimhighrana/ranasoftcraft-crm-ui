import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptorService } from './_services/jwt-interceptor.service';
import { SubstringPipe } from './_pipes/substringpipe.pipe';
import { LoadingInterceptorService } from './_services/loading-interceptor.service';
import { SharedModule } from './_modules/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickStopPropagationDirective } from './_directives/click-stop-propagation.directive';
import { SchemaCollaboratorsComponent } from './_components/home/schema/schema-collaborators/schema-collaborators.component';

@NgModule({
  declarations: [
    AppComponent,
    ClickStopPropagationDirective,
    SubstringPipe,
    SchemaCollaboratorsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
