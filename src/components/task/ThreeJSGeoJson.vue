<template>
  <div ref="canvasContainer" class="initial"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvasContainer = ref();
let scene: any, camera: any, renderer: any, vehicle: any, basePoint: any;
let controls: any;
let width = window.innerWidth / 1.3;
let height = window.innerHeight / 1.3;
const scale = 1;

const init = () => {
  scene = new Three.Scene();
  scene.background = new Three.Color(0xffffff);
  scene.fog = new Three.Fog(0xffffff, 20, 80);
  
  camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.projectionMatrix.set(400, 250, 0);

  renderer = new Three.WebGLRenderer({ antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000);
  canvasContainer.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 200;
  controls.maxDistance = 400;
  controls.enableDamping = true;

  renderer.render(scene, camera);
};

const animate = () => {
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

onMounted(() => {
  init();  
  animate();
});
</script>

<style scoped>
.initial {
  all: initial;
}
</style>