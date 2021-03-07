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
  for (i = 0; i < spectrum.length; i++) {
    if (spectrum[i] > spikeValue) {
      spikeValue = spectrum[i]
      spikeIndex = i
    }
  }
  console.log('Largest spike value = ' + spikeValue)
  console.log('Largest spike index = ' + spikeIndex)
  console.log(spectrum)

  var frequency = getFrequency(spikeIndex, sample_rate, fft_size)
  console.log('estimated frequency: ' + frequency)
  var fundamental_frequency = getFundamentalFrequency(frequency)
  console.log('estimated fundamental frequency' + fundamental_frequency)
  var closest_note = getClosestNote(fundamental_frequency)
  console.log('estimated closest note' + closest_note)
  var note_letter = getNoteLetter(closest_note)
  console.log('estimated note: ' + note_letter)
}

function getFrequency (bin_number, sample_rate, fft_size) {
  var bin_width = sample_rate / fft_size
  return bin_number * bin_width
}

var freq_notes = {}

function getFundamentalFrequency (frequency) {

    for (var i = 1; i <= 5; i++) {
        frequency /= i
        if (frequency < 160) {
            return frequency;
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
    '92.50': 'F#',
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
var notes = [73.42, 77.78, 82.41, 87.31, 92.50, 98, 103.8, 110, 116.5, 123.5, 130.8, 138.6, 146.8, 155.6]
function getClosestNote (frequency) {
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
