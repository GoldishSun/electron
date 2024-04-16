<template>
  <v-app theme="dark">
    <LeftMenu></LeftMenu>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import LeftMenu from './components/common/LeftMenu.vue';

</script>
