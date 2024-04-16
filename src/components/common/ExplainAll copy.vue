<template>
  <v-container>
    <v-row>
      <v-col>
        <v-switch color="warning" label="switch" hide-details @click="toggleNats"></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <canvas id="myChart" width="100" height="100"></canvas>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, Ref } from 'vue';
import Chart from 'chart.js/auto';
import { connect, StringCodec } from 'nats.ws';

const label_datas: Array<any> = ['one', 'two', 'three', 'four'];
const values_1: Array<any> = [Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10];
const values_2: Array<any> = [Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10];
const ex11 = ref(false);
const main_key = 'speed';
const line_1_color = 'rgba(255, 99, 132, 1)';
const line_2_color = 'rgba(54, 162, 235, 1)';
let ctx: any;
let myChart: any;
let natsConnection: any;
let natsSC: any;
let sub: any;

onMounted(() => {
  setNatsConnection();
  makeChart();
})

const toggleNats = () => {
  ex11.value = !ex11.value;
  if (ex11.value) {
    setNatsSubscribe();
    getNatsMessage();
  }
  else setNatsUnsubscribe();
}

const chartUpdate = (str_value: string) => {
  // Object.keys(obj).forEach(key => {
  //   myChart.data.labels.push(key);
  //   myChart.data.datasets.forEach((dataset: { data: number[]; }) => {
  //     dataset.data.push(obj[key]);
  //   });
  // })
  myChart.update();
}
const makeChart = () => {
  ctx = document.getElementById('myChart');
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: label_datas,
      datasets: [
        {
          label: `${main_key}_1`,
          data: values_1,
          borderColor: line_1_color,
          backgroundColor: line_1_color,
        },
        {
          label: `${main_key}_2`,
          data: values_2,
          borderColor: line_2_color,
          backgroundColor: line_2_color,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: main_key
        }
      },
    },
  });
}

const getNatsMessage = async () => {
  for await (const msg of sub) {
    const obj = JSON.parse(natsSC.decode(msg.data));
    chartUpdate(obj[main_key]);
    console.log(natsSC.decode(msg.data));
  }
}
const setNatsSubscribe = () => sub = natsConnection.subscribe('msg.debug.data');
const setNatsUnsubscribe = () => sub.unsubscribe();
const setNatsConnection = async () => {
  natsConnection = await connect({
    servers: "wss://nats.beyless.com:8443",
    user: "admin",
    pass: "password",
  });
  natsSC = StringCodec();
}
</script>

<style></style>