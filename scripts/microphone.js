function Microphone (_fft) {
  var FFT_SIZE = _fft || 1024
  this.spectrum = []
  this.volume = this.vol = 0
  this.peak_volume = 0
  var self = this
  
  var audioContext = new AudioContext({ sampleRate: (48000 / 2) / 2 })
  var SAMPLE_RATE = audioContext.sampleRate

  window.AudioContext = window.AudioContext || window.webkitAudioContext
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia


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
      var analyser = context.createAnalyser()
      analyser.smoothingTimeConstant = 0.2
      analyser.fftSize = FFT_SIZE
      var node = context.createScriptProcessor(FFT_SIZE, 1, 1)

      node.onaudioprocess = function () {
        self.spectrum = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(self.spectrum)

        interpret(self.spectrum, SAMPLE_RATE, FFT_SIZE)

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


//https://stackoverflow.com/questions/30013898/what-is-the-range-of-the-values-returned-by-analyser-getbytefrequencydata-in-the
//https://stackoverflow.com/questions/14789283/what-does-the-fft-data-in-the-web-audio-api-correspond-to/14789992#14789992
/*
According to the above links, the output of getByteFrequencyData is half the length of the FFT_SIZE

each bin refers to freqs:
N * (samplerate/fft_size)


So on chrome:
bin_width = (48000/1024) = 46.875
N * (bin_width)

46.875 is WAY too big for a guitar tuner


=========================================

//https://electronics.stackexchange.com/questions/12407/what-is-the-relation-between-fft-length-and-frequency-resolution

number of bins = number of samples / 2 (aka fft_size / 2)

"We can see from the above that to get smaller FFT bins we can either run a longer FFT (that is, 
take more samples at the same rate before running the FFT) or decrease our sampling rate."


=====================================
If I did 48000 / 8192, I would get a freq resolution of 5.8.  Not....awful
48000 / 16384 = 2.92.  Maybe try this?
Or...try lowering sample rate?




Test:
Sample rate = 48000
fft size = 16384
E spike was in bin 55/56

So...
Frequency bin width = 2.92
55 * 2.92 = 160.6
56 * 2.92 = 163.52

That is super close in that it is twice as much as the expected frequency of E, which is 82.41


Test 2:
High E string (expected freq of 329.63 Hz)
I definitely saw the harmonic spikes...sometimes highest spike was 225 and sometimes 338
225 * 2.92 = 657
Again...twice as much as expected frequency of high E
*/
