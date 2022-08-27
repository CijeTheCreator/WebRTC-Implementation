const APP_ID = "baaf8f04d086423f867f219de52be6bb";
let token = null;
let uid = String(Math.floor(Math.random() * 100000));
console.log(uid);

let localStream;
let remoteStream;
let peerConnection;

let client;
let channel;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let init = async () => {
  client = await AgoraRTM.createInstance(APP_ID);
  await client.login({ uid, token });

  //index.html?room-234234
  channel = client.createChannel("main");
  await channel.join();

  channel.on("MemberJoined", handleUserJoined);

  client.on("MessageFromPeer", handleMessageFromPeer);

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  document.getElementById("user-1").srcObject = localStream;
};

let handleUserJoined = async (MemberId) => {
  console.log("A new user joined the stream:", MemberId);
  createOffer(MemberId);
};

let handleMessageFromPeer = async (message, memberId) => {
  message = JSON.parse(message.text);
  console.log(message);
};

let createOffer = async (MemberId) => {
  peerConnection = new RTCPeerConnection(servers);
  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  //What is generating these ice candidates and why
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log("New Ice Candidate:", event.candidate);
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer); //look up localDescription later

  client.sendMessageToPeer(
    {
      text: JSON.stringify({
        type: "offer",
        offer: offer,
      }),
    },
    MemberId
  );
};

init();
