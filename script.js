u(".talk").on('mousedown', function () {
  u(".message").text("Recording...");
})

u(".talk").on('mouseup', function () {
  u(".message").text("Press to talk");
})