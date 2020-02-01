function initialize() {
  alert("asdfadsf")
}

u(".talk").on('mousedown', function () {
  u(".r-message").text("Recording...");
  u(".main").addClass("recording");
})

u(".talk").on('mouseup', function () {
  u(".r-message").text("Press to talk");
  u(".main").removeClass("recording");
})

