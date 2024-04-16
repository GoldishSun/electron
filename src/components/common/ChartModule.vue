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
          <canvas id="myChart" width="200" height="100"></canvas>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps } from 'vue';
import Chart from 'chart.js/auto';
import { connect, StringCodec } from 'nats.ws';

const label_datas: Array<any> = [];
const values_1: Array<any> = [];
const values_2: Array<any> = [];
const ex11 = ref(false);
const props = defineProps({
  main_key: String,
})
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
  const ary = str_value.split(',');
  myChart.data.labels.push(Date.now());
  myChart.data.datasets[0].data.push(Number(ary[0]));
  myChart.data.datasets[1].data.push(Number(ary[1]));
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
          label: `${props.main_key}_1`,
          data: values_1,
          borderColor: line_1_color,
          backgroundColor: line_1_color,
        },
        {
          label: `${props.main_key}_2`,
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
          text: props.main_key
        }
      },
    },
  });
}

const getNatsMessage = async () => {
  for await (const msg of sub) {
    const data = natsSC.decode(msg.data); 
    console.log(data);
    const obj = JSON.parse(natsSC.decode(msg.data));
    chartUpdate(obj[props.main_key]);
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