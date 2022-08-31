const APP_ID = ""


const uid = String(Math.floor(Math.random() * 10000)) //This defines the user id for the Agora Client
const token = null //This defines the user token for the Agora Client, null because we won't be using tokens

let localStream;
let remoteStream;
let peerConnection;

let constraints = {
    video: true,
    audio: false
}

let init = async () => {

    let client = await AgoraRTM.createInstance()
    console.log(client)

    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    document.getElementById("user-1").srcObject = localStream
}

init()