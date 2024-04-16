<template>
  <div class="main-map" ref="map"></div>
</template>

<script setup lang="ts">
import * as vMap from '@/util/vMapController';
import { fromLonLat, toLonLat } from 'ol/proj';
import OlLayerTile from 'ol/layer/Tile.js';
import OlMap from 'ol/Map';
import OlView from 'ol/View.js';
import OlPoint from 'ol/geom/Point';
import OLVector from 'ol/layer/Vector.js';
import { XYZ } from 'ol/source';
import { Icon, Style } from 'ol/style';
import { Vector as OSVector, sourcesFromTileGrid } from 'ol/source';
import { onMounted, ref } from 'vue';
import OlFeature from 'ol/Feature';
import Collection from 'ol/Collection';
import Translate from 'ol/interaction/Translate';
import { connect, StringCodec } from 'nats.ws';
import { Coordinate } from 'ol/coordinate';

let olMap: OlMap;
let olLayer: any;
let osVector: any;
let natsConnection: any;
let natsSC: any;

const map = ref(undefined);

const createJsonStr = (coord: Coordinate, id: number | string | undefined) => {
  const obj = {
    vehicle_class: id,
    Position_lat: coord[0],
    Position_lon: coord[1],
  }
  return obj;
};
const natsPub = (data: string) => {
  natsConnection.publish("sensorDataTest.*", natsSC.encode(data));
}

const addFeature = (id: number | string | undefined, coord: [number, number], image: string): void => {
  const feature = new OlFeature({
    geometry: new OlPoint(coord),
  });
  feature.setId(id);
  feature.setStyle(new Style({
    image: new Icon({
      color: 'white',
      scale: 0.3,
      crossOrigin: 'annoymous',
      src: image,
    })
  }))
  osVector.addFeature(feature);
  const trans = new Translate({
    features: new Collection([feature]),
  })
  olMap.addInteraction(trans);
  trans.on('translateend', function (evt) {
    const id = evt.features.getArray()[0].getId();
    const coord = evt.coordinate
    const message = [];
    const obj = createJsonStr(coord, id);
    message.push(obj);
    natsPub(JSON.stringify(message));
  })
}

onMounted(async () => {
  console.log(map.value);
  olMap = new OlMap({
    target: map.value,
    layers: [
      new OlLayerTile({
        properties: { name: 'base' }, // Custom property...
        source: new XYZ({
          url: `https://api.vworld.kr/req/wmts/1.0.0/9A00AFD8-497F-39BA-8836-BA5F34BA416E/Base/{z}/{y}/{x}.png`,
        }),
        visible: true,
      }),
    ],
    view: new OlView({
      center: fromLonLat([126.54638325519736, 35.937749138529256]), // 새만금
      zoom: 17
    })
  });
  osVector = new OSVector({
    features: [],
  });
  olLayer = new OLVector({
    source: osVector,
    zIndex: 3,
  })
  olMap.addLayer(olLayer);

  addFeature(0, [14087346.760088079, 4292302.657847003], '/images/MainVehicle.png');
  addFeature(1, [14087309.606802756, 4292281.413742149], '/images/SubVehicle.png');
  addFeature(2, [14087367.990586419, 4292248.030134335], '/images/SubVehicle.png');
  addFeature('rebar', [14087006.189497557, 4291953.667782232], '/images/RebarBundle.png');
  addFeature('worker', [14087338.810003452, 4292056.380038991], '/images/Worker.png');

  natsConnection = await connect({
    servers: "wss://nats.beyless.com:8443",
    user: "admin",
    pass: "password",
  });
  natsSC = StringCodec();
})

</script>

<style scoped>
.main-map {
  width: 100%;
  height: 100%;
}
</style>