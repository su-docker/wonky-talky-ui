function subscribe(socket){
  socket.send(
    JSON.stringify({
      "command": "subscribe",
      "identifier": JSON.stringify({
        channel: 'WtChannel'
      })
    })
  )
}

function initialize() {
  const socket = new WebSocket('wss://707cccd7.ap.ngrok.io/ptt');
  socket.onopen = () => {
    console.log('connected..');
    subscribe(socket);
  }

  socket.onmessage = evt => {
    const evt_data = JSON.parse(evt.data);
    const message = evt_data.message;
    if(message){
      console.log(message.file);
    }
  }

  socket.onclose = () => {
    console.log('disconnected..');
  }
}

u(".talk").on('mousedown', function () {
  u(".r-message").text("Recording...");
  u(".main").addClass("recording");
})

u(".talk").on('mouseup', function () {
  u(".r-message").text("Press to talk");
  u(".main").removeClass("recording");
})

