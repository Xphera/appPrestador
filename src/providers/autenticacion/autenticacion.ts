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
import { PushNotificationProvider } from '../push-notification/push-notification';

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
  public usuario:any

  constructor(
    public http: HttpClient,
    private _peticionPrvdr: PeticionProvider,
    private _almacenamientoPrvdr: AlmacenamientoProvider,
    public app: App,
    public _pushNotificationPrvdr:PushNotificationProvider
  ) {
    console.log('Hello AutenticacionProvider Provider');

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
        this.guardarUsuario(data)
        this.nav.setRoot('TabsPage')
        this._pushNotificationPrvdr.addtagsNotificacion({ "userId": data["user_id"] })
      })
  }

  logout() {
    this.token = null;
    this._pushNotificationPrvdr.deletetagsNotificacion("userId")
    return this._almacenamientoPrvdr.eliminar('token')

  }

  restablecerPasword(data) {
    let request = this.http.post(URL_RESTABLECER_PASSWORD, data)
    return new Observable(observer => {
      this._peticionPrvdr.peticion({ request: request })
        .subscribe((resp: any) => {
          this.restablecer_pasword = data.usuario
          this._almacenamientoPrvdr.guardar('restablecer_pasword', this.restablecer_pasword)
            .then(
              () => {
                observer.next(true);
              })
        })
    })
  }

  public restablecerPaswordValidaCodigo(data) {

    let request = this.http.put(URL_RESTABLECER_PASSWORD, data)
    return new Observable(observer => {
      this._peticionPrvdr.peticion({ request: request })
        .subscribe((resp: any) => {
          this.restablecer_pasword = null
          this._almacenamientoPrvdr.eliminar('restablecer_pasword')
            .then(
              () => {

                this.nav = this.app.getActiveNav();
                this.guardarUsuario(resp)
                this.nav.setRoot('TabsPage')

                observer.next(true);
              })
        })
    })
  }

  public activo() {
    let ua = this._almacenamientoPrvdr.obtener('usuario')
    ua.then((data)=>{
      this.usuario = JSON.parse(data["data"])
    })
    return ua;
  }

  public guardarUsuario(usuario) {
    this.usuario = usuario;
    this._almacenamientoPrvdr.guardar('usuario',JSON.stringify(usuario)).then(()=>{
      // inicializar Token
      this._peticionPrvdr.cargarToken(usuario.token)
    })
  }

}
