function startMicrophoneRecording() {
  document.body.removeEventListener('click', startMicrophoneRecording)
  document.getElementById('title').style.display = 'none'
  document.getElementById('footer').style.display = 'block'

  var Mic = new Microphone(1024 * 16)

  var ctx = createCanvas('canvas1')
  var grid = new Grid(200, 1)

  function draw () {
    ctx.clearRect(0, 0, w, h)

    for (var i = 0; i < grid.length; i++) {
      var s = Mic.mapSound(i, grid.length, 5, h / 4)
      ctx.fillStyle = rgb(0)
      ctx.fillRect(grid.x[i], grid.y[i] - s, grid.spacing_x - 0.5, s)
    }

    requestAnimationFrame(draw)
  }

  Mic.init()
  draw()
}

document.body.addEventListener('click', startMicrophoneRecording)