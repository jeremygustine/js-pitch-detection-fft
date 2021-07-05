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

  var top5 = spectrum.map((value, index) => {
    return { value: value, index: index + filterBelowIndex } 
  }).sort((a, b) => (a.value > b.value) ? -1 : 1).slice(0, 5)
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  console.log(JSON.stringify(top5))
  console.log("bin width: " + getBinWidth(sample_rate, fft_size))
  /*
  get the average number of bins between spikes
  multiple that by bin width
  is that the fundamental frequency?
  */

  var partWeCareAbout = Array.from(spectrum).slice(filterBelowIndex, spectrum.length - 1)
  var top20 = partWeCareAbout.map((value, index) => {
    return { value: value, index: index + filterBelowIndex } 
  }).sort((a, b) => (a.value > b.value) ? -1 : 1).slice(0, 20)

  console.log('Top 20:')
  console.log(top20)

  console.log('Largest spike value = ' + spikeValue)
  console.log('Largest spike index = ' + spikeIndex)
  console.log('Unsorted:')
  console.log(spectrum)

  var frequency = getFrequency(spikeIndex, sample_rate, fft_size)
  console.log('estimated frequency: ' + frequency)
  var fundamental_frequency = getFundamentalFrequency(frequency)
  console.log('estimated fundamental frequency' + fundamental_frequency)
  var closest_note = getClosestNoteFrequency(fundamental_frequency)
  console.log('estimated closest note' + closest_note)
  var note_letter = getNoteLetter(closest_note)
  console.log('estimated note: ' + note_letter)
  var how_close = howClose(fundamental_frequency, closest_note)
  console.log('How close? ', howClosePrint(how_close))

  console.log('Top 20 notes:')
  var top20notes = top20.map(element => {
    var freq = getFrequency(element.index, sample_rate, fft_size)
    var fundamental_freq = getFundamentalFrequency(freq)
    var closest = getClosestNoteFrequency(fundamental_freq)
    var note = getNoteLetter(closest)
    return {index: element.index, value: element.value, note: note }
  })
  console.log(top20notes)
  var top10 = top20notes.slice(0, 10)
  console.log('Most probable: ' + findMode(top10.slice(0, 10).map(x => x.note)))
  console.log('-------------------------------------------------------------')

  document.getElementById('frequency').innerHTML = "Estimated Fundamental Frequency: " + fundamental_frequency
  document.getElementById('note').innerHTML = "Estimated Frequency: " + note_letter
}

//-1 = low, 0 = right on, 1 = high
function howClose(fundamental_frequency, closest_note_frequency) {
  var difference = fundamental_frequency - closest_note_frequency
  if (Math.abs(difference) < 0.8) { // this should be a "resolution" variable
    return 0
  } else {
    if (difference < 0) {
      return -1
    } else {
      return 1
    }
  }
}

function howClosePrint(how_close) {
  if (how_close === -1) {
    return "a little low"
  } else if (how_close === 0) {
    return "right on!"
  } else {
    return "a little high"
  }
}

function findMode(arr) {
  var map = {};
  for (var i = 0; i < arr.length; i++) {
      if (map[arr[i]] === undefined) {
          map[arr[i]] = 0;
      }
      map[arr[i]] += 1;
  }
  var greatestFreq = 0;
  var mode;
  for (var prop in map) {
      if (map[prop] > greatestFreq) {
          greatestFreq = map[prop];
          mode = prop;
      }
  }
  return mode;
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

var freq_notes = {}

function getFundamentalFrequency (frequency) {

    for (var i = 1; i <= 5; i++) {
        frequency /= i
        if (frequency < 160) {
            return frequency
        }
    }
}

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
var n = {
    '73.42': 'D',
    '77.78': 'D#',
    '82.41': 'E',
    '87.31': 'F',
    '92.5': 'F#',
    '98': 'G',
    '103.8': 'G#',
    '110': 'A',
    '116.5': 'A#',
    '123.5': 'B',
    '130.8': 'C',
    '138.6': 'C#',
    '146.8': 'D',
    '155.6': 'D#',
}
var notes = [73.42, 77.78, 82.41, 87.31, 92.5, 98, 103.8, 110, 116.5, 123.5, 130.8, 138.6, 146.8, 155.6]
function getClosestNoteFrequency (frequency) {
    var smallestDifference = Number.MAX_SAFE_INTEGER;
    var closestNote = Number.MAX_SAFE_INTEGER
    for (var i = 0; i < notes.length; i++) {
      var difference = Math.abs(frequency - notes[i])
      if (difference < smallestDifference) {
          smallestDifference = difference
          closestNote = notes[i]
      }
    }
    return closestNote
}

function getNoteLetter(frequency) {
    return n[frequency.toString()]
}

/*
Algorithm:
- Do I need to track the largest X number of peaks as I move through the spectrum array? Maybe, but let's start by tracking the biggest one

- I need a way to convert the bin number to a note and output the note
- I need a way to determine the "closest note" based on the frequency

*/
