import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Speed from '@/components/common/Speed.vue'
import Distance from '@/components/common/Distance.vue';
import Acceleration from '@/components/common/Acceleration.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/speed",
  },
  {
    path: "/speed",
    name: "speed",
    component: Speed,
  },
  {
    path: "/distance",
    name: "distance",
    component: Distance,
  },
  {
    path: "/acceleration",
    name: "acceleration",
    component: Acceleration,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
