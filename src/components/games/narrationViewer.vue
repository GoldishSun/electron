<template>
  <v-container>
    <v-row @click="clicked()">
      <v-col>
        <div ref="blackboard"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, Ref, defineProps, defineEmits } from 'vue';

const emit = defineEmits(['next-script'])
const props = defineProps({
  script: String,
  speed: Number,
})
const speed = 10;
const explain_text_obj = reactive({
  step1: {
    clicked: false,
    cursor: 0,
  }
});

const blackboard: Ref<HTMLElement | null> = ref(null)

let tmp: any;
const start = () => {
  if (explain_text_obj.step1.clicked) return;
  tmp = setInterval(() => {
    if(!blackboard.value) return;
    const text = props.script[explain_text_obj.step1.cursor];
    if(text === '|') blackboard.value.innerHTML += "<br/>";
    else blackboard.value.innerHTML += text;
    explain_text_obj.step1.cursor++;
    if (explain_text_obj.step1.cursor >= props.script.length) {
      clearInterval(tmp);
      tmp = null;
      explain_text_obj.step1.clicked = true;
    }
  }, 1000 / speed);
}

const optionReset = () => {
  blackboard.value.innerHTML = '';
  explain_text_obj.step1.text = '';
  explain_text_obj.step1.clicked = false;
  explain_text_obj.step1.cursor = 0;
}

const setScript = () => {
  explain_text_obj.step1.text = props.script;
} 

const clicked = () => {
  if (tmp) {
    clearInterval(tmp);
    tmp = null;
    if (!blackboard.value) return;
    const text = props.script;
    blackboard.value.innerHTML = text;
    return;
  }

  emit('next-script');
  optionReset();
  start();
}

onMounted(() => {
  start();
})


</script>

<style></style>