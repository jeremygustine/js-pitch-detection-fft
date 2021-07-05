//lowest frequencies of guitar - standard tuning
//https://www.seventhstring.com/resources/notefrequencies.html
/*
D 73.42
D# 77.78
E 82.41
F 87.31
F# 92.50
G 98.00
G# 103.8
A 110.0
A# 116.5
B 123.5
C 130.8
C# 138.6
D 146.8
D# 155.6
*/

function interpret (spectrum, sample_rate, fft_size) {

  var spikeValue = 0
  var spikeIndex = 0
  var filterBelowIndex = getBinOfLowestFrequencyWeCareAbout(sample_rate, fft_size)

  for (i = filterBelowIndex; i < spectrum.length; i++) {
    if (spectrum[i] > spikeValue) {
      spikeValue = spectrum[i]
      spikeIndex = i
    }
  }

  console.log('Largest spike value = ' + spikeValue)
  console.log('Largest spike index = ' + spikeIndex)

  var frequency = getFrequency(spikeIndex, sample_rate, fft_size)
  var fundamental_frequency = getFundamentalFrequency(frequency)
  var closest_note = getClosestNoteFrequency(fundamental_frequency)
  var note_letter = getNoteLetter(closest_note)

  console.log('estimated frequency: ' + frequency)
  console.log('estimated fundamental frequency' + fundamental_frequency)
  console.log('estimated closest note' + closest_note)
  console.log('estimated note: ' + note_letter)

  document.getElementById('frequency').innerHTML = "Estimated Fundamental Frequency: " + fundamental_frequency
  document.getElementById('note').innerHTML = "Estimated Frequency: " + note_letter
}

function getFrequency (bin_number, sample_rate, fft_size) {
  var bin_width = getBinWidth(sample_rate, fft_size)
  return bin_number * bin_width
}

function getBinOfLowestFrequencyWeCareAbout(sample_rate, fft_size) {
  var bin_width = getBinWidth(sample_rate, fft_size)
  var lowestFrequencyWeCareAbout = 82.41 // E
  return Math.floor(lowestFrequencyWeCareAbout / bin_width)
}

function getBinWidth(sample_rate, fft_size) {
  return sample_rate / fft_size
}


