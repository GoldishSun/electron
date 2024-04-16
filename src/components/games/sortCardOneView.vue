<template>
  <v-container>
    <v-row>
      <v-col cols="auto">
        Let's Sort<br />
        - 이 게임의 목표는 최소 횟수로 보이지 않는 카드 뒷면의 숫자를 오름차순으로 정렬하는 것입니다. <br />
        - 두개의 카드를 고르고 Call을 하면 더 높은 숫자의 카드가 무엇인지 표시가 됩니다. <br />
        - 6개의 칸으로 나눠진 덱 위에 카드를 Drag&Drop하여 오름차순으로 나열해 주세요. <br />
        - 전부 나열을 마쳤다면 Arrange를 눌러주세요.<br />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        Call Count : {{ callCount }}
      </v-col>
      <v-col cols="7"></v-col>
      <v-col cols="2">
        <v-btn @click="isArrange">Arrange</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container id="SubmitArea">
    <v-row>
      <v-col cols="2" class="dropIt area"></v-col>
      <v-col cols="2" class="dropIt area"></v-col>
      <v-col cols="2" class="dropIt area"></v-col>
      <v-col cols="2" class="dropIt area"></v-col>
      <v-col cols="2" class="dropIt area"></v-col>
      <v-col cols="2" class="dropIt area"></v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="2" class="dragIt area">
        <div class="casinoCard" id="one">
          <span>Ⅰ</span>
        </div>
      </v-col>
      <v-col cols="2" class="dragIt area">
        <div class="casinoCard" id="two">
          <span>Ⅱ</span>
        </div>
      </v-col>
      <v-col cols="2" class="dragIt area">
        <div class="casinoCard" id="three">
          <span>Ⅲ</span>
        </div>
      </v-col>
      <v-col cols="2" class="dragIt area">
        <div class="casinoCard" id="four">
          <span>Ⅳ</span>
        </div>
      </v-col>
      <v-col cols="2" class="dragIt area">
        <div class="casinoCard" id="five">
          <span>Ⅴ</span>
        </div>
      </v-col>
      <v-col cols="2" class="dragIt area">
        <div class="casinoCard" id="six">
          <span>Ⅵ</span>
        </div>
      </v-col>
    </v-row>
    <v-row justify="end" :class="isSelected ? '' : 'd-none'">
      <v-col cols="1">
        <v-btn @click="showMeResult">Call</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">　</v-col>
    </v-row>
    <v-row>
      <v-col cols="12">　</v-col>
    </v-row>
    <v-row>
      <v-col cols="12">　</v-col>
    </v-row>
    <v-row>
      <v-col cols="12">　</v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="faultDialog" width="auto">
    <v-card>
      <v-card-text>Fault !</v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="goodDialog" width="auto">
    <v-card>
      <v-card-text>Good !</v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const callCount = ref(0);
const isSelected = ref(false);
const selected: Array<string> = reactive([]);
const faultDialog = ref(false);
const goodDialog = ref(false);
const limit = {
  max: 100,
  min: 1
}
const hasBeen: Map<number, number> = reactive(new Map());
const getRandom = (): number => {
  let result = -1;
  let isUnable = true;
  while (isUnable) {
    const tmp = (Math.random() * (limit.max - limit.min)) + limit.min;
    if (!hasBeen.has(tmp)) {
      hasBeen.set(tmp, tmp);
      result = tmp;
      isUnable = false;
    }
  }
  return result;
}

const isArrange = () => {
  const targets = document.querySelectorAll(".dropIt.area");
  const temp: Array<number> = [];
  targets.forEach((ele) => {
    temp.push(Number(ele.childNodes[0]?.dataset.number));
  });
  console.log(temp);
  let isGood = true;
  for(let g = 0; g < temp.length - 1; ++ g){
    if(temp[g] <= temp[g + 1]) continue; 
    else {
      isGood = false;
      break;
    }
  }
  if(isGood) goodDialog.value = true;
  else faultDialog.value = true;
}

const showMeResult = () => {
  if (selected.length != 2) return;
  const e1 = document.getElementById(selected[0]);
  const c1 = Number(e1?.dataset.number);
  const e2 = document.getElementById(selected[1]);
  const c2 = Number(e2?.dataset.number);
  if (c1 > c2) signingEle(e1);
  else signingEle(e2);
  setTimeout(() => {
    deactivateEle(e1);
    deactivateEle(e2);
    selected.pop();
    selected.pop();
  }, 1000);
  callCount.value++;
}

const signingEle = (ele: HTMLElement | null) => {
  ele?.classList.add("blinking");
  setTimeout(() => ele?.classList.remove("blinking"), 1000);
}

const deactivateEle = (ele: HTMLElement | null) => {
  ele?.classList.remove('activeCard');
}

const deactivateEleById = (id: any) => {
  const ele = document.getElementById(id);
  ele?.classList.remove('activeCard');
}

const drag = (event: any) => {
  console.log(event);
}

onMounted(() => {
  const isAdmin = window.location.search.substring(1) === 'super' ? true : false;
  const cards = document.querySelectorAll(".casinoCard");
  cards.forEach((ele: any) => {
    const id = ele.id;
    const rnN = Number(getRandom().toFixed(0));
    ele.setAttribute("draggable", true);
    ele.dataset.number = rnN;
    if (isAdmin) ele.innerHTML += rnN;
    ele.innerHTML += '____________';
    ele.addEventListener("mouseover", () => {
      ele.classList.add('hoverCard')
    });
    ele.addEventListener("mouseout", () => {
      ele.classList.remove('hoverCard');
    });
    ele.addEventListener("click", () => {
      isSelected.value = false;
      if (ele.classList.contains('activeCard')) {
        ele.classList.remove('activeCard');
        selected.splice(selected.findIndex(x => x == id));
      } else {
        ele.classList.add('activeCard');
        selected.push(id);
        if (selected.length > 2) deactivateEleById(selected.shift());
      }
      if (selected.length === 2) isSelected.value = true;
    });
    ele.addEventListener("dragstart", (evt: any) => {
      evt.dataTransfer.setData("card", evt.target.id);
    });
  })

  const areas = document.querySelectorAll(".area");
  areas.forEach((ele: any) => {
    ele.addEventListener("dragover", (evt: any) => {
      evt.preventDefault();
    });
    ele.addEventListener("drop", (evt: any) => {
      evt.preventDefault();
      var data = evt.dataTransfer.getData("card");
      const tmp = document.getElementById(data);
      evt.target.appendChild(tmp);
      while (selected.length > 0) {
        const id = selected.pop();
        deactivateEleById(id);
      }
    })
  })
})
</script>

<style scoped>
.dropIt {
  width: 11vw;
  height: 15vw;
  border: 1px #333333 solid;
  align-items: center;
  vertical-align: middle;
}

.dragIt {
  vertical-align: middle;
  width: 11vw;
  height: 15vw;
}

.casinoCard {
  width: 10vw;
  height: 14vw;
  border: 1px white solid;
  background: #888888;
  position: relative;
}

.casinoCard span {
  position: absolute;
  top: 40%;
  left: 40%;
}

.hoverCard {
  background: #555555;
}

.activeCard {
  background: #333333;
}

.blinking {
  animation: blink 1s ease 0s;
}

@keyframes blink {

  0%,
  100% {
    border-color: transparent;
  }

  50% {
    border-color: #ff0000;
  }
}
</style>