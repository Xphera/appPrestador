import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { PeticionProvider } from '../providers/peticion/peticion';
import { SesionProvider } from '../providers/sesion/sesion';

import {HttpClientModule} from '@angular/common/http';
import { IonicComponentProvider } from '../providers/ionic-component/ionic-component';
import { DisponibilidadProvider } from '../providers/disponibilidad/disponibilidad';
import { ZonaProvider } from '../providers/zona/zona';
import { AutenticacionProvider } from '../providers/autenticacion/autenticacion';
import { AlmacenamientoProvider } from '../providers/almacenamiento/almacenamiento';

import { NativeStorage } from '@ionic-native/native-storage';
import { PrestadorProvider } from '../providers/prestador/prestador';
import { LocalizarUbicacionProvider } from '../providers/localizar-ubicacion/localizar-ubicacion';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PeticionProvider,
    SesionProvider,
    IonicComponentProvider,
    DisponibilidadProvider,
    ZonaProvider,
    AutenticacionProvider,
    AlmacenamientoProvider,
    NativeStorage,
    PrestadorProvider,
    LocalizarUbicacionProvider
  ]
})
export class AppModule {}
