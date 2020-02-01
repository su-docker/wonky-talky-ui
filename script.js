window.onload = function () {
  attachEventListener();
  initializeSocket();
}

var rec;

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
  fetch('https://707cccd7.ap.ngrok.io/web_connect', {
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
    if (message) {
      console.log("Got message...");
      console.log(message.file);
    }
  }

  socket.onclose = () => {
    console.log('disconnected..');
  }
}
