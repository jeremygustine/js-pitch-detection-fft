function Microphone (_fft) {
  var FFT_SIZE = _fft || 1024
  this.spectrum = []
  this.volume = this.vol = 0
  this.peak_volume = 0
  var self = this
  var audioContext = new AudioContext()
  var SAMPLE_RATE = audioContext.sampleRate

  // this is just a browser check to see
  // if it supports AudioContext and getUserMedia
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia

  // now just wait until the microphone is fired up
  // window.addEventListener('load', init, false);

  //document.body.addEventListener('click', init) //I had to add this line instead - JAG

  this.init = function () {
    try {
      startMic(new AudioContext())
    } catch (e) {
      console.error(e)
      alert('Web Audio API is not supported in this browser')
    }
  }

  function startMic (context) {
    navigator.getUserMedia({ audio: true }, processSound, error)
    function processSound (stream) {
      // analyser extracts frequency, waveform, etc.
      var analyser = context.createAnalyser()
      analyser.smoothingTimeConstant = 0.2
      analyser.fftSize = FFT_SIZE
      var node = context.createScriptProcessor(FFT_SIZE * 2, 1, 1)
      node.onaudioprocess = function () {
        // bitcount returns array which is half the FFT_SIZE
        self.spectrum = new Uint8Array(analyser.frequencyBinCount)
        // getByteFrequencyData returns amplitude for each bin
        analyser.getByteFrequencyData(self.spectrum)
        // getByteTimeDomainData gets volumes over the sample time
        // analyser.getByteTimeDomainData(self.spectrum);

        self.vol = self.getRMS(self.spectrum)
        // get peak - a hack when our volumes are low
        if (self.vol > self.peak_volume) self.peak_volume = self.vol
        self.volume = self.vol
      }
      var input = context.createMediaStreamSource(stream)
      input.connect(analyser)
      analyser.connect(node)
      node.connect(context.destination)
    }
    function error () {
      console.log(arguments)
    }
  }

  this.getRMS = function (spectrum) {
    var rms = 0
    for (var i = 0; i < spectrum.length; i++) {
      rms += spectrum[i] * spectrum[i]
    }
    rms /= spectrum.length
    rms = Math.sqrt(rms)
    return rms
  }

  function map (value, min1, max1, min2, max2) {
    var returnvalue = ((value - min1) / (max1 - min1)) * (max2 - min2) + min2
    return returnvalue
  }

  this.mapSound = function (_me, _total, _min, _max) {
    if (self.spectrum.length > 0) {
      // map to defaults if no values given
      var min = _min || 0
      var max = _max || 100
      //actual new freq
      var new_freq = Math.floor((_me * self.spectrum.length) / _total)
      // map the volumes to a useful number
      return map(self.spectrum[new_freq], 0, self.peak_volume, min, max)
    } else {
      return 0
    }
  }
  //////// SOUND UTILITIES  ////////
  ///// ..... we going to put more stuff here....
  return this
}

function rgb (r, g, b) {
  if (g == undefined) g = r
  if (b == undefined) b = r
  return (
    'rgb(' +
    clamp(Math.round(r), 0, 255) +
    ', ' +
    clamp(Math.round(g), 0, 255) +
    ', ' +
    clamp(Math.round(b), 0, 255) +
    ')'
  )
}

function clamp (value, min, max) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max))
}

document.body.addEventListener('click', function () {
  var Mic = new Microphone()

  var ctx = createCanvas('canvas1')
  // make a grid 200 wide
  // I covered how to make grids here
  var grid = new Grid(200, 1)
  function draw () {
    //ctx.background(235);
    ctx.clearRect(0, 0, w, h)

    for (var i = 0; i < grid.length; i++) {
      var s = Mic.mapSound(i, grid.length, 5, h / 4)
      ctx.fillStyle = rgb(0)
      ctx.fillRect(grid.x[i], grid.y[i] - s / 2, grid.spacing_x - 0.5, s)
    }

    requestAnimationFrame(draw)
  }

  Mic.init()
  draw()
})
