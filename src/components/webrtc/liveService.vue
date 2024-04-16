<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="2">
        <v-chip>Room Number</v-chip>
      </v-col>
      <v-col cols="6">
        <v-text-field label="Input room number you wanna go" v-model="roomNum"></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-btn @click="enterStream">Streamer</v-btn>
        <v-btn class="mr-1" @click="enterView">Viewer</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const roomNum = ref('');
const enterStream = () => {
  if (!roomNum.value) return;
  router.push({ path: 'oAoStreamer', query: { id: roomNum.value } });
}
const enterView = () => {
  if (!roomNum.value) return;
  router.push({ path: 'oAoViewer', query: { id: roomNum.value } });
}
</script>

<style scoped></style>