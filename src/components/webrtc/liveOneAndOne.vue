
<template>
  <v-container>
    <v-row>
      <v-col>
        room {{  roomId }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <video class="video-player" ref="user_1" autoplay playsinline></video>
      </v-col>
      <v-col cols="6">
        <video class="video-player" ref="user_2" autoplay playsinline></video>
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

const user_1 = ref();
const user_2 = ref();

if (!roomId) router.back();

let APP_ID = "84fdc6bb748c4a8db5a59bb91003ca8b";
let token: any = null;
let uid = String(Math.floor(Math.random() * 10000));

let client: any;
let channel: any;

let localStream: any;
let remoteStream: any;
let peerConnection: any;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};
let constraints = {
  video: true,
  audio: true,
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

  channel.on("MemberJoined", handleUserJoined);
  channel.on("MemberLeft", handleUserLeft);
  client.on("MessageFromPeer", handleMessageFromPeer);
  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  user_1.value.srcObject = localStream;
};

const handleUserLeft = async (memberId: string) => {
  user_2.value.style.display = "none";
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

  remoteStream = new MediaStream();
  user_2.value.srcObject = remoteStream;
  user_2.value.style.display = "block";

  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    user_1.value.srcObject = localStream;
  }

  localStream.getTracks().forEach((track: MediaStreamTrack) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event: any) => {
    event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
      remoteStream.addTrack(track);
    });
  };

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
  };
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
  await sleep(2000);
  if(!peerConnection.currentRemoteDescription) return;
  peerConnection.addIceCandidate(ice);
}

const leaveChannel = async () => {
  await channel.leave();
  await client.logout();
};

const toggleCamera = async () => {
  let videoTrack = localStream
    .getTracks()
    .find((track: MediaStreamTrack) => track.kind === "video");

  if (videoTrack.enabled) {
    videoTrack.enabled = false;
    // cameraBtn.value.style.backgroundColor = "red";
  } else {
    videoTrack.enabled = true;
    // cameraBtn.value.style.backgroundColor = "cyan";
  }
};
let toggleMic = async () => {
  let audioTrack = localStream
    .getTracks()
    .find((track: MediaStreamTrack) => track.kind === "audio");

  if (audioTrack.enabled) {
    audioTrack.enabled = false;
    // micBtn.value.style.backgroundColor = "red";
  } else {
    audioTrack.enabled = true;
    // micBtn.value.string.backgroundColor = "cyan";
  }
};

init();

</script>

<style scoped>
</style>