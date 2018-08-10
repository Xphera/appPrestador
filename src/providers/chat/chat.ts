import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeticionProvider } from '../peticion/peticion';
import {
  URL_CHAT
} from '../../config/url.config';
import {Chat} from '../../model/models.index';
import { Subject } from 'rxjs/Subject';
/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  public chat:Array<Chat> = new Array<Chat>()
  public mensajeSubject = new Subject();
  constructor(
    public http: HttpClient,
    private _peticionPrvdr:PeticionProvider) {
    console.log('Hello ChatProvider Provider');

  }

  public obtenerChat(){
    let headers = this._peticionPrvdr.getHeaders();
    let request = this.http.get(URL_CHAT,{ headers })
    this._peticionPrvdr.peticion({ request: request })
    .subscribe((data:Chat[])=>{
      this.chat = data
    })
  }
  public obtenerMensaje(compraDetalleId){
    let headers = this._peticionPrvdr.getHeaders();
    let request =  this.http.get(URL_CHAT+'?compraDetalleId='+compraDetalleId,{ headers })
    return this._peticionPrvdr.peticion({ request: request })
  }

  public enviarMensaje(compraDetalleId,mensaje){
    let headers = this._peticionPrvdr.getHeaders();
    let request = this.http.post(URL_CHAT,{compraDetalleId,mensaje},{ headers })
    return this._peticionPrvdr.peticion({ request: request })
  }

  public nuevoMensaje(data){
    this.mensajeSubject.next(data)
  }

}
