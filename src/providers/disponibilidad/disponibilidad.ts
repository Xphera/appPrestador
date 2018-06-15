import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DisponibilidadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DisponibilidadProvider {
  public disponibiliad: Array<any>;

  constructor(public http: HttpClient) {
    console.log('Hello DisponibilidadProvider Provider');
  }


  enviarDisponibiliad(disponibilidad: any) {
    console.log(disponibilidad)
    this.http.post('http://127.0.0.1:9090/api/prestadores/Disponibilidad/', {disponibilidad})
      .subscribe(
        (resp) => {
          console.log(resp)
        })
  }

  obtenerDisponibiliad() {
    this.http.get('http://127.0.0.1:9090/api/prestadores/Disponibilidad/')
      .subscribe(
        (resp: Array<any>) => {
          this.disponibiliad = resp
        })
  }
}
