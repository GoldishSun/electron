<template>
  <v-container>
    <v-row>
      <v-col>
        room {{ roomId }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <video class="video-player" ref="video1" id="video1" autoplay playsinline></video>
      </v-col>
      <v-col cols="4">
        <video class="video-player" ref="video2" id="video2" autoplay playsinline></video>
      </v-col>
      <v-col cols="4">
        <video class="video-player" ref="video3" id="video3" autoplay playsinline></video>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AgoraRTM from 'agora-rtm-sdk'

const router = useRouter();
const route = useRoute();
const roomId = route.query.id;

const video1 = ref();
const video2 = ref();

if (!roomId) router.back();

let APP_ID = "84fdc6bb748c4a8db5a59bb91003ca8b";
let token: any = null;
let uid = String(Math.floor(Math.random() * 10000));

let client: any;
let channel: any;

let localStream: any;
let peerConnection: any;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};

const sleep = (millisec: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, millisec);
  });
};

const init = async () => {
  await sleep(1000);
  client = await AgoraRTM.createInstance(APP_ID);
  await client.login({ uid, token });

  channel = client.createChannel(roomId);
  await channel.join();

  // await navigator.mediaDevices.enumerateDevices().then((devices) => {
  //   const videoDevices = devices.filter((device) => device.kind === 'videoinput');
  //   const constraints = videoDevices.map((ele, idx, ori) => {
  //     return navigator.mediaDevices.getUserMedia({
  //       video: { deviceId: videoDevices[idx].deviceId }
  //     })
  //   });
  //   return Promise.all(constraints)
  // })
  //   .then((res) => {
  //     res.forEach((ele, idx) => {
  //       const v = document.getElementById(`video${idx + 1}`);
  //       if (v) v.srcObject = ele;
  //     })
  //   })

  channel.on("MemberJoined", handleUserJoined);
  channel.on("MemberLeft", handleUserLeft);
  client.on("MessageFromPeer", handleMessageFromPeer);
};

const handleUserLeft = () => {
  console.log("user Left");
};
const handleMessageFromPeer = async (message: any, memberId: string) => {
  message = JSON.parse(message.text);
  if (message.type === "offer") {
    createAnswer(memberId, message.offer);
  }
  if (message.type === "answer") {
    addAnswer(message.answer);
  }
  if (message.type === "candidate" && peerConnection) {
    addIce(message.candidate);
  }
};
const handleUserJoined = async (memberId: string) => {
  console.log("A new user joined the channel", memberId);
  createOffer(memberId);
};
const createPeerConnection = async (memberId: string) => {
  peerConnection = new RTCPeerConnection(servers);

  await navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      const constraints = videoDevices.map((ele, idx) => {
        return navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoDevices[idx].deviceId }
        })
      });
      return Promise.all(constraints)
    })
    .then((res) => {
      res.forEach((ele, idx) => {
        ele.getTracks().forEach((track: MediaStreamTrack) => {
          peerConnection.addTrack(track, ele);
        })
      })
    })

  peerConnection.onicecandidate = async (event: any) => {
    if (event.candidate) {
      client.sendMessageToPeer(
        {
          text: JSON.stringify({
            "type": "candidate",
            "candidate": event.candidate,
          }),
        },
        memberId
      );
    }
  }
};
const createOffer = async (memberId: string) => {
  await createPeerConnection(memberId);

  let offer = await peerConnection.createOffer();
  peerConnection.setLocalDescription(offer);

  client.sendMessageToPeer(
    { text: JSON.stringify({ "type": "offer", "offer": offer }) },
    memberId
  );
};
const createAnswer = async (memberId: string, offer: any) => {
  await createPeerConnection(memberId);
  await peerConnection.setRemoteDescription(offer);

  let answer = await peerConnection.createAnswer();
  peerConnection.setLocalDescription(answer);

  client.sendMessageToPeer(
    { text: JSON.stringify({ "type": "answer", "answer": answer }) },
    memberId
  );
};
const addAnswer = async (answer: any) => {
  if (peerConnection.currentRemoteDescription) return;
  await peerConnection.setRemoteDescription(answer);
 };
const addIce = async (ice: any) => {
  if(!peerConnection.currentRemoteDescription) return;
  peerConnection.addIceCandidate(ice);
 };

init();
</script>

<style scoped></style>