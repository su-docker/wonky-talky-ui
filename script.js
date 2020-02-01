function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var rec;
var server = 'https://707cccd7.ap.ngrok.io/web_connect';
var client_session_id = uuidv4();
var recordInProgress = false;

window.onload = function () {
  attachEventListener();
  initializeSocket();
}

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(handleSuccess);
}

function handleSuccess(stream) {
  rec = new MediaRecorder(stream);
  rec.ondataavailable = sendDataToBackend;
  rec.start();
}

function sendDataToBackend(e) {
  var fd = new FormData()
  fd.append('audio', e.data)
  fd.append('clientid', client_session_id)
  fetch(server, {
    method: 'POST',
    body: fd
  })
}

function attachEventListener() {
  u(".talk").on('mousedown', startRecordingHandler);
  u(".talk").on('touchstart', startRecordingHandler);
  u(".talk").on('mouseup', stopRecordingHandler);
  u(".talk").on('touchend', stopRecordingHandler);
}

function startRecordingHandler() {
  console.log("starting recording");
  recordInProgress = true;
  u(".r-message").text("Recording...");
  u(".main").addClass("recording");
  startRecording();
}

function stopRecordingHandler() {
  console.log("stop recording");
  recordInProgress = false;
  u(".r-message").text("Press to talk");
  u(".main").removeClass("recording");
  if (rec) {
    rec.stop();
  }
}

function subscribe(socket) {
  socket.send(
    JSON.stringify({
      "command": "subscribe",
      "identifier": JSON.stringify({
        channel: 'WtChannel'
      })
    })
  )
}

function initializeSocket() {
  const socket = new WebSocket('wss://707cccd7.ap.ngrok.io/ptt');
  socket.onopen = () => {
    subscribe(socket);
  }

  socket.onmessage = evt => {
    const evt_data = JSON.parse(evt.data);
    const message = evt_data.message;
    if (message && message.file) {
      if(message.clientid != client_session_id && !recordInProgress) {
        let player = document.getElementById("player");
        player.src = "data:audio/mp3;base64," + message.file;
        player.play();
      }
    }
  }

  socket.onclose = () => {
    console.log('disconnected..');
  }
}
