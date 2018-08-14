import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ZonaProvider } from '../../providers/zona/zona';
import { PrestadorProvider } from '../../providers/prestador/prestador';
import { IonicComponentProvider } from '../../providers/ionic-component/ionic-component';

import Map from 'ol/Map';
import View from 'ol/View';
import Vector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Style,Stroke, Text,Icon } from 'ol/style';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { getCenter } from 'ol/extent';
/**
 * Generated class for the ZonaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-zona',
  templateUrl: 'zona.html',
})
export class ZonaPage {

  public selectZona: number
  private dataGeoJson
  private map:Map
  public dataGeoJsonSeleccionado

  public vectorSource = new Vector();

  public vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: ((feature, resolution) => {
      let style = new Style({
        fill: new Fill({
          color: feature.get('color')
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

  private raster = new TileLayer({
    source: new OSM()
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _zonaPrvdr: ZonaProvider,
    public ionicComponentPrvdr: IonicComponentProvider,
  public _prestadorPrvdr:PrestadorProvider ) {

  }



  ionViewDidLoad() {
    this.loadMap();
    this._zonaPrvdr.obtenerZona()
      .subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.dataGeoJson = new GeoJSON().readFeatures(data)
          // buscar zona prestadores
          this._prestadorPrvdr.zonaPrestador()
            .subscribe((zona: any) => {
              let id: number
              let p = this.dataGeoJson.find((data: any, index: number) => {
                if (data.getId() == zona.id) {
                  id = index
                  return data
                }
              })
              if (id != undefined) {
                this.selectZona = id
                this.pintarZona(p)
              }

            })

        }
      })



  }

  pintarZona(geodata) {
    this.vectorSource.clear();
    this.vectorSource.addFeature(geodata);
    let extent = geodata.getGeometry().getExtent();
    this.map.getView().setCenter(getCenter(extent));
    this.map.getView().setZoom(12);
    this.dataGeoJsonSeleccionado = geodata;
    (new GeoJSON()).writeFeature(geodata);
  }



  loadMap() {
    this.map = new Map({
      layers: [this.raster, this.vectorLayer],
      target: 'map',
      view: new View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 12
      })
    });
  }

  onSelectChange(selectedValue: any) {
    this.pintarZona(this.dataGeoJson[selectedValue])
  }

  guardar() {
    let geodata = (new GeoJSON()).writeFeature(this.dataGeoJsonSeleccionado)
    this._prestadorPrvdr.guardarZona(geodata)
      .subscribe((data) => {
        this.ionicComponentPrvdr.showLongToastMessage('Zona guardada.')
      })
  }

}
