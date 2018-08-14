import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SesionProvider } from '../../providers/sesion/sesion';
import { IonicComponentProvider } from '../../providers/ionic-component/ionic-component';
import { ModalController } from 'ionic-angular';
import Map from 'ol/Map';
import View from 'ol/View';
import Vector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Style,Stroke, Text,Icon } from 'ol/style';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import {Point} from 'ol/geom';

/**
 * Generated class for the DetalleSesionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-sesion',
  templateUrl: 'detalle-sesion.html',
})
export class DetalleSesionPage {
  public sesion
  public tipoSesion
  public openMenu = false;
  public map:Map;

  public vectorSource = new Vector();
  public vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: ((feature, resolution) => {
      let style = new Style({
        fill: new Fill({
          color: '#ffcc33',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        text: new Text({
          font: '15px Calibri,sans-serif',
          // overflow: 'true',
          text: feature.get('name'),
          fill: new Fill({
            color: '#000'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 3
          })
        }),
      })
      return style
    })
  });
  private raster =  new TileLayer({
      source: new OSM()
    });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _sesionPrvdr: SesionProvider,
    public ionicComponentPrvdr: IonicComponentProvider,
    public modalCtrl: ModalController) {

    this.sesion = this.navParams.get('sesion')
    this.tipoSesion = this.navParams.get('tipoSesion')

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleSesionPage');
    this.loadMap()
  }

  ionViewDidEnter() {
    //abrir menu
    if (this.sesion.estado.id == 5) {
      this.openMenu = true
    }
  }

  loadMap() {
    parseFloat
    this.map = new Map({
      layers: [this.raster, this.vectorLayer],
      target: 'map',
      view: new View({
        projection: 'EPSG:4326',
        center: [parseFloat(this.sesion.ubicacion.longitud), parseFloat(this.sesion.ubicacion.latitud)],
        zoom: 17
      })
    });
      this.ubicarPuntos()
  }

  addPoint(longitud, latitud, vector, icono) {
    let iconFeature = new Feature({
      geometry: new Point([longitud, latitud]),
    });

    iconFeature.setStyle(new Style({
      image: new Icon(/** @type {olx.style.IconOptions} */({
        crossOrigin: 'anonymous',
        src: 'assets/imgs/markerMap/' + icono
      }))
    }));

    vector.addFeature(iconFeature);
  }

  ubicarPuntos() {
    // this.vectorLayerLocalizacion.getSource().clear()
    // this.addPoint(this._localizarUbicacionPrvdr.usuario.lng, this._localizarUbicacionPrvdr.usuario.lat, this.vectorSourceLocalizacion, 'male-2.png');
    this.addPoint(this.sesion.ubicacion.longitud, this.sesion.ubicacion.latitud, this.vectorSource, 'pin-export.png');

  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  chat() {
    this.navCtrl.push('MensajePage', { compraDetalleId: this.sesion.compraDetalleId });
  }

  cancelar() {
    this.ionicComponentPrvdr.showAlert({
      title: '',
      message: '¿Cancelar sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this._sesionPrvdr.cancelar(this.sesion).subscribe(
              (resp: any) => {
                this.ionicComponentPrvdr.showLongToastMessage('Sesión cancelada.')
                this.togglePopupMenu()
              })
          }
        }
      ]
    })
  }


  finalizar() {
    let modal = this.modalCtrl.create('ModalFinalizarSesionPage');
    modal.onDidDismiss(data => {
      if (data != undefined) {
        this._sesionPrvdr.finalizar(this.sesion, data.tipo, data.novedad).subscribe(
          (resp: any) => {
            this.ionicComponentPrvdr.showLongToastMessage('Sesión finalizada.')
            this.togglePopupMenu()
          })
      }
    });
    modal.present();
  }

  iniciar() {
    this.ionicComponentPrvdr.showAlert({
      title: '',
      message: '¿Iniciar sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this._sesionPrvdr.iniciar(this.sesion).subscribe(
              (resp: any) => {
                this.ionicComponentPrvdr.showLongToastMessage('Sesión iniciada.')
              })
          }
        }
      ]
    })


  }
}
