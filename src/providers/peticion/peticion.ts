import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable"
import { IonicComponentProvider } from '../ionic-component/ionic-component';
import { AlmacenamientoProvider } from '../almacenamiento/almacenamiento';
import { App } from 'ionic-angular';
import 'rxjs/add/operator/finally';

/*
  Generated class for the PeticionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PeticionProvider {
  peticionId: number = 0;
  showloader: any;
  private token: string
  protected sinAutizacion: boolean = false
  constructor(
    public http: HttpClient,
    private _almacenamientoPrvdr: AlmacenamientoProvider,
    private _ionicComponentPrvdr: IonicComponentProvider,
    public app: App) {
    console.log('Hello PeticionProvider Provider');
    this.cargarToken()
  }

  public cargarToken() {
    return new Promise((resolve, reject) => {
      this._almacenamientoPrvdr.obtener('usuario')
        .then((almacenamiento: any) => {
          if (almacenamiento.data != null) {
            let usuario = JSON.parse(almacenamiento.data)
            this.token = usuario["token"];
            resolve(true);
          }
        }
        ).catch(() => {
          reject(false);
        })
    })


  }

  public getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Authorization': 'Token ' + this.token,
      'Content-Type': 'application/json'
    });
    return headers;
  }

  peticion(input: input) {

    let loading = false
    if (input.loading == undefined || input.loading == true) {
      loading = true
    }

    let observable = new Observable((observer) => {
      if (this.peticionId == 0) {
        if (loading) {
          this.showloaderOpen(loading)
        }
      }
      ++this.peticionId


      input.request.finally(() => {
          if (this.sinAutizacion && this.peticionId == 0) {
            this.sinAutizacion = false
            this.app.getRootNavs()[0].setRoot('LoginPage',{'cerrarSesion':true})            
          }
        }).subscribe((resp) => {

        observer.next(resp);
        --this.peticionId
            if (this.peticionId == 0) {
              if (loading) {
                this.showloaderClose(loading)
              }
            }
      },
        (errores) => {
          --this.peticionId
          if (this.peticionId == 0 && loading) {
            this.showloaderClose(loading)
          }


          if (errores.status == 401) {
            this.sinAutizacion = true
          }
          else if (errores.status == 500 || errores.status == 0) {
            this._ionicComponentPrvdr.showLongToastMessage("error al conectar con servidor!")
          } else {
            let listaerrores: string = this.httpErrores(errores);
            this._ionicComponentPrvdr.showAlert({
              title: '',
              subTitle: listaerrores,
              buttons: ['OK']
            });
            observer.error(errores);
          }
        }
      )
    })
    return observable;
  }

  private httpErrores(errores) {
    const isBoolean = val => 'boolean' === typeof val;
    let listaerrores: string = '';

    for (let e of Object.keys(errores.error)) {
      if (Array.isArray(errores.error[e])) {
        for (let error of errores.error[e]) {
          if (!isBoolean(errores)) {
            listaerrores += error + "<br>"
          }
        }
      }
      else {
        if (!isBoolean(errores.error[e]))
          listaerrores += errores.error[e] + "<br>"
      }
    }
    return listaerrores;
  }

  protected showloaderOpen(loading) {
      if (loading) {
        this.showloader = this._ionicComponentPrvdr.showloaderMessage('por favor espera...')
        console.log('abrir')
      }
    }

  protected showloaderClose(loading) {
    if (loading && this.showloader) {
        this.showloader.dismiss()
        console.log('cerrar')
      }
  }
}

export interface input {
  request,
  key?: string,
  loading?: boolean
}
