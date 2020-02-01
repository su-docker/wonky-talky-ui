var rec;
var server = 'https://707cccd7.ap.ngrok.io/web_connect';

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
  fetch(server, {
    method: 'POST',
    body: fd
  })
}


function attachEventListener() {
  u(".talk").on('mousedown', function () {
    u(".r-message").text("Recording...");
    u(".main").addClass("recording");
    startRecording();
  })

  u(".talk").on('mouseup', function () {
    u(".r-message").text("Press to talk");
    u(".main").removeClass("recording");
    if (rec) {
      rec.stop();
    }
  })
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
      let player = document.getElementById("player");
      player.src = "data:audio/mp3;base64," + message.file;
      player.play();
    }
  }

  socket.onclose = () => {
    console.log('disconnected..');
  }
}
