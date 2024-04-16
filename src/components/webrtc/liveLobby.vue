<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="2">
        <v-chip>Room Number</v-chip>
      </v-col>
      <v-col cols="8">
        <v-text-field label="Input room number you wanna go" v-model="roomNum"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn @click="enterRoom">Enter</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const roomNum = ref('');
const enterRoom = () => {
  if(!roomNum.value) return;
  router.push({ path: 'oAoRoom', query: { id: roomNum.value }});
}
</script>

<style scoped>
</style>