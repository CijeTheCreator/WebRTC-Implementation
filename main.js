const APP_ID = "baaf8f04d086423f867f219de52be6bb"


const uid = String(Math.floor(Math.random() * 10000)) //This defines the user id for the Agora Client
const token = null //This defines the user token for the Agora Client, null because we won't be using tokens

let localStream;
let remoteStream;
let peerConnection;

let channel;
let client;

let constraints = {
    video: true,
    audio: false
}

let init = async () => {

    client = await AgoraRTM.createInstance(APP_ID)
    await client.login({uid, token})

    client.on("MessageFromPeer", handleMessageFromPeer)

    channel = client.createChannel("someChannelID")
    channel.join()
    channel.on("MemberJoined", handleUserJoined)
    

    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    document.getElementById("user-1").srcObject = localStream
}

init()

let createOffer = async (memberID) => {
  peerConnection = new RTCPeerConnection()
  let offer = await peerConnection.createOffer()
  
  await client.sendMessageToPeer({text: JSON.stringify({
    type: "offer",
    offer: offer
  })}, memberID)
}

let handleUserJoined = async (memberID) => {
    console.log(memberID)
    createOffer(memberID)
}

let handleMessageFromPeer = async (message) => {
  console.log(JSON.parse(message.text))
}

