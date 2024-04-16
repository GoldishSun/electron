import {
  Circle as CircleStyle,
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { Coordinate } from 'ol/coordinate';
import { createXYZ } from 'ol/tilegrid';
import { defaults as defaultControls } from 'ol/control';
import { defaults } from 'ol/interaction/defaults';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { messageBox } from '@/composeables/toastMessage';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { Point } from 'ol/geom';
import { Ref } from 'vue';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { VWORLD_KEY } from '@/key';
import { XYZ } from 'ol/source';

export const DEFAULT_PANGYO_POSITION = [127.09482589464538, 37.41206149222896];
export const DEFAULT_KOREA_CENTER_POSITION = [
  127.9837490909433, 35.95752856288591,
];
export const DEFAULT_DEMO_POSITION = [126.54629025680366, 35.937926781941584];
export const DEFAULT_SITE_ZOOM_LEVEL = 18;
export const WHOLE_KOREA_ZOOM_LEVEL = 8;
export const MAX_ZOOM_LEVEL = 21;
export const MAX_SIZE_ZOOM_LEVEL = 20;
export const MIN_ZOOM_LEVEL = 8;
export const KOREA_EXTENT = [13800000, 3900000, 14700000, 4670000]; // 한국 영역 [minX, minY, maxX, maxY]

// '+' 문자를 나타내는 Text 스타일 설정
const textStyle = new Text({
  text: '+', // '+' 문자 표시
  fill: new Fill({
    color: '#EC5D5D', // '+' 문자의 색상
  }),
  font: 'bold 15px sans-serif',
  offsetY: 2, // y축 방향으로 텍스트 이동
});

// SnapPoint Circle 스타일 설정
const circleStyle = new CircleStyle({
  radius: 7, // 점의 반지름
  fill: new Fill({
    color: '#FFD5D5', // 점의 채우기 색상
  }),
  stroke: new Stroke({
    color: '#EC5D5D', // 점의 테두리 색상
    width: 3, // 점의 테두리 두께
  }),
});

export const styles = {
  Polygon: {
    'circle-radius': 7,
    'circle-fill-color': '#F0D092',
    'stroke-color': '#F0D092',
    'stroke-width': 3,
    'fill-color': '#F0D09233',
  },
  SnapPoint: new Style({
    image: circleStyle, // Circle 스타일을 가져와서 설정
    text: textStyle,
  }),
  entrancePoint: new Style({
    image: new Icon({
      src: '/public/images/gps.png',
      width: 100,
      height: 100,
    }),
    text: new Text({
      text: '입구',
      scale: 2,
      fill: new Fill({
        color: 'black',
      }),
    }),
  }),
  exitPoint: new Style({
    image: new Icon({
      src: '/public/images/gps.png',
      width: 100,
      height: 100,
    }),
    text: new Text({
      text: '출구',
      scale: 2,
      fill: new Fill({
        color: 'black',
      }),
    }),
  }),
};

export const getAreaDraw = (source: VectorSource): Draw => {
  return new Draw({
    source,
    type: 'Polygon',
    style: styles.Polygon,
  });
};

export const getAreaSnap = (source: VectorSource): Snap => {
  return new Snap({
    source,
  });
};

export const getAreaModify = (source: VectorSource): Modify => {
  return new Modify({
    source,
    style: styles.SnapPoint,
  });
};

// TODO: 중심 좌표를 받아서 해당 좌표로 초기화
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGateVectorLayer = (
  initX: number,
  initY: number
): VectorLayer<VectorSource> => {
  const entrance = new Feature({
    geometry: new Point([initX - 20, initY]),
    name: 'entrance',
  });
  const exit = new Feature({
    geometry: new Point([initX + 20, initY]),
    name: 'exit',
  });
  entrance.setStyle(styles.entrancePoint);
  exit.setStyle(styles.exitPoint);
  const source = new VectorSource({
    features: [entrance, exit],
  });
  const gateVector = new VectorLayer({
    properties: { name: 'gate' },
    source,
  });
  return gateVector;
};

export const getGateModify = (
  source: VectorSource,
  layer: VectorLayer<VectorSource>
): Modify => {
  const gateModify = new Modify({
    source,
    hitDetection: layer,
  });
  return gateModify;
};

let mapTypeBtnToggle = false;

export const initMap = (map: Ref<undefined>, center: Coordinate): OlMap => {
  return new OlMap({
    // OlMap 객체 생성 및 타겟 엘리먼트에 부착
    target: map.value,
    layers: [
      new OlLayerTile({
        properties: { name: 'base' }, // Custom property...
        source: new XYZ({
          url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`,
        }),
        visible: true,
      }),
      new OlLayerTile({
        properties: { name: 'stellite' },
        source: new XYZ({
          url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`,
        }),
        visible: false,
      }),
    ],
    controls: [],
    view: new OlView({
      center,
      zoom: WHOLE_KOREA_ZOOM_LEVEL,
      maxZoom: MAX_ZOOM_LEVEL,
      minZoom: MIN_ZOOM_LEVEL,
    }),
  });
};

export const initDrawMap = (map: Ref<undefined>, center: Coordinate): OlMap => {
  return new OlMap({
    // 불필요한 조작 차단(회전, 방향키 줌)
    interactions: defaults({
      shiftDragZoom: false,
      altShiftDragRotate: false,
      pinchRotate: false,
    }),
    // 상단 컨트롤러 제거
    controls: defaultControls({ rotate: false, zoom: false }),
    target: map.value,
    layers: [
      new OlLayerTile({
        source: new XYZ({
          url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`,
          tileGrid: createXYZ({ tileSize: 512 }),
        }),
        extent: KOREA_EXTENT,
        visible: true,
      }),
      new OlLayerTile({
        source: new XYZ({
          url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Hybrid/{z}/{y}/{x}.png`,
          // 기본값인 256px을 확장하여 최대 ZOOM LEVEL에서도 렌더링 가능
          tileGrid: createXYZ({ tileSize: 512 }),
        }),
        extent: KOREA_EXTENT,
        visible: true,
      }),
    ],
    view: new OlView({
      center,
      zoom: DEFAULT_SITE_ZOOM_LEVEL,
      maxZoom: MAX_SIZE_ZOOM_LEVEL,
      minZoom: 1,
      extent: KOREA_EXTENT,
    }),
  });
};

export const changeMapType = (olMap: OlMap): void => {
  mapTypeBtnToggle = !mapTypeBtnToggle;

  olMap.getLayers().forEach((layer) => {
    const layerName = layer.get('name');
    if (layerName) {
      layer.setVisible(!layer.getVisible());
    }
  });
};

export const panTo = (olMap: OlMap, position: Coordinate): void => {
  olMap.getView().animate({
    center: position,
    duration: 1500,
  });
};

export const zoomControl = (olMap: OlMap, type: string): OlView | void => {
  let currentZoomLevel = olMap.getView().getZoom();
  if (currentZoomLevel !== undefined) {
    if (type === 'plus') {
      if (currentZoomLevel < MAX_ZOOM_LEVEL) {
        currentZoomLevel += 1;
        return olMap.getView().setZoom(currentZoomLevel);
      }
    } else if (currentZoomLevel > MIN_ZOOM_LEVEL) {
      currentZoomLevel -= 1;
      return olMap.getView().setZoom(currentZoomLevel);
    }
  }
  return olMap.getView(); // 모든 경우에 값을 반환
};

export const getCurrentLocation = (
  callback: (position: number[]) => void
): void => {
  // Try HTML5 geolocation.
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const currentPosition = fromLonLat([pos.lng, pos.lat]);
      if (callback) {
        return callback(currentPosition);
      }
      return console.log('Error! from getCurrentLocation');
    },
    (error) => {
      console.log("Browser doesn't support Geolocation\n", error);
      messageBox('warn', '브라우저에서 위치사용 기능을 허용해주세요.');
    },
    {
      enableHighAccuracy: true,
    }
  );
};

export const renderCurrentPosition = (olMap: OlMap): void => {
  return getCurrentLocation((position: Coordinate) => {
    console.log(`현재위치 - ${position}`);
    return panTo(olMap, position);
  });
};
