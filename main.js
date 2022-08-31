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

    channel = client.createChannel("someChannelID")
    channel.join()
    channel.on("MemberJoined", handleUserJoined)
    

    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    document.getElementById("user-1").srcObject = localStream
}

let handleUserJoined = async (memberID) => {
    console.log(memberID)
}

init()