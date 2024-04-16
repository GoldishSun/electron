<template>
  <v-container>
    <narrationViewer :script="script" @next-script="next"/>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import narrationViewer from './narrationViewer.vue';

const script = ref(['비가 억수 같이 쏟아지는 어느 여름날, 빗줄기는 모든 하늘을 가리고 있어 한점의 빛도 세어나올 곳이 없었다.', ]);
const next = (): void => {
  script.value = '대차게 내리는 빗소리에 놀란 동물들은 자취를 감췄다.';
  console.log('next', script.value)
}
const pathFinder = (key: string) => {
  console.log(key);
}
</script>

<stype scoped>
</stype>