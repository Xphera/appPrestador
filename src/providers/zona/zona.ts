import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ol from 'openlayers';

/*
  Generated class for the ZonaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ZonaProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ZonaProvider Provider');
  }

  guardarZona(geodata:ol.format.GeoJSON) {
    geodata = (new ol.format.GeoJSON()).writeFeature(geodata)
    let url: string = 'http://127.0.0.1:9090/api/prestadores/Zona/1/';
    let headers = this.gerHeaders();
    return this.http.put(url,{geodata},{ headers })
  }

  obtenerZona() {
    let url: string = 'http://127.0.0.1:9090/api/servicios/Zona/';
    let headers = this.gerHeaders();
    return this.http.get(url, { headers })

  }

  private gerHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Authorization': 'Token  e63c35c92599cc0c33e2341133f5df72de73abe1',
      'Content-Type': 'application/json'
    });
    return headers;
  }

}
