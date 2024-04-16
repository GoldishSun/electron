<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <chart-module :main_key="'distance'"></chart-module>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import chartModule from './ChartModule.vue';

</script>

<style></style>