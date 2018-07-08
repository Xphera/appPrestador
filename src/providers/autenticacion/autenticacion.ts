import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  URL_LOGIN,
  URL_RESTABLECER_PASSWORD
} from '../../config/url.config';
import { PeticionProvider } from '../peticion/peticion';
import { AlmacenamientoProvider } from '../almacenamiento/almacenamiento';
import { App } from "ionic-angular";
import { Observable } from "rxjs/Observable";

/*
  Generated class for the AutenticacionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutenticacionProvider {

  protected token: string;
  protected nav;
  public restablecer_pasword

  constructor(
    public http: HttpClient,
    private _peticionPrvdr: PeticionProvider,
    private _almacenamientoPrvdr: AlmacenamientoProvider,
    public app: App
  ) {
    console.log('Hello AutenticacionProvider Provider');
    this.cargarToken();
    this._almacenamientoPrvdr.obtener('restablecer_pasword').then(
      (data: any) => {
        this.restablecer_pasword = data.data;
      })
  }


  login(username, password) {
    this.nav = this.app.getActiveNav();
    let request = this.http.post(URL_LOGIN, { username, password })
    this._peticionPrvdr.peticion({ request: request })
      .subscribe((data) => {
        this.guardarToken(data["token"])
        this.nav.setRoot('TabsPage')
      })
  }

  logout() {
    this.token = null;
    return this._almacenamientoPrvdr.eliminar('token')
  }

  restablecerPasword(data) {
    let request =  this.http.post(URL_RESTABLECER_PASSWORD, data)
    return new Observable(observer => {
      this._peticionPrvdr.peticion({ request: request })
        .subscribe((resp:any) => {
          this.restablecer_pasword = data.usuario
          this._almacenamientoPrvdr.guardar('restablecer_pasword', this.restablecer_pasword)
            .then(
              () => {
                observer.next(true);
              })
        })
    })
  }

  restablecerPaswordValidaCodigo(data) {

    let request =  this.http.put(URL_RESTABLECER_PASSWORD, data)
    return new Observable(observer => {
      this._peticionPrvdr.peticion({ request: request })
        .subscribe((resp:any) => {
          this.restablecer_pasword = null
          this._almacenamientoPrvdr.eliminar('restablecer_pasword')
            .then(
              () => {

                this.nav = this.app.getActiveNav();
                this.guardarToken(resp["token"])
                this.nav.setRoot('TabsPage')

                observer.next(true);
              })
        })
    })
  }


  public gerHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Authorization': 'Token ' + this.token,
      'Content-Type': 'application/json'
    });
    return headers;
  }

  public activo() {
    return this._almacenamientoPrvdr.obtener('token');
  }


  public guardarToken(token) {
    this.token = token;
    this._almacenamientoPrvdr.guardar('token', this.token)
  }
  protected cargarToken(): void {
    this._almacenamientoPrvdr.obtener('token')
      .then((almacenamiento: any) => {
        this.token = almacenamiento.data;
      }
      )
  }
}
