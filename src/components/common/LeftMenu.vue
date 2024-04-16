<template>
  <v-app-bar app dark>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app dark>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> ADCM </v-list-item-title>
        <v-list-item-subtitle> Logs </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-spacer></v-spacer>

    <v-list density="comfortable">
      <v-list-item v-for="menu in oneDepthItems" :key="menu.id" :to="menu.to" :prepend-icon="menu.icon">
        <v-list-item-title>{{ menu.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true);
const oneDepthItems = [
{ title: "speed_chart", icon: "mdi-cube", to: "/speed", id: 1 },
{ title: "distance_chart", icon: "mdi-cube", to: "/distance", id: 2 },
{ title: "acceleration_chart", icon: "mdi-cube", to: "/acceleration", id: 3 },
]
</script>

<style scoped></style>