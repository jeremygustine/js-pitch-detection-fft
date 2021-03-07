document.body.addEventListener('click', start)

function start () {
  const audioCtx = new AudioContext()
  const analyser = audioCtx.createAnalyser()
  const source = audioCtx.createMediaElementSource(audio)

  source.connect(analyser)
  analyser.connect(audioCtx.destination)
  analyser.fftSize = 32

  let frequencyData = new Uint8Array(analyser.frequencyBinCount)

  function renderFrame () {
    analyser.getByteFrequencyData(frequencyData)
    P10.style.height = (frequencyData[0] * 100) / 256 + '%'
    P20.style.height = (frequencyData[1] * 100) / 256 + '%'
    P30.style.height = (frequencyData[2] * 100) / 256 + '%'
    P40.style.height = (frequencyData[3] * 100) / 256 + '%'
    P50.style.height = (frequencyData[4] * 100) / 256 + '%'
    P60.style.height = (frequencyData[5] * 100) / 256 + '%'
    P70.style.height = (frequencyData[6] * 100) / 256 + '%'
    P80.style.height = (frequencyData[7] * 100) / 256 + '%'
    P90.style.height = (frequencyData[8] * 100) / 256 + '%'
    console.log(frequencyData)
    requestAnimationFrame(renderFrame)
  }
  audio.crossOrigin = "anonymous";
  audio.pause()
  audio.play()
  renderFrame()
}
