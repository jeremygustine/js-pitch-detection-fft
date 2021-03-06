/*
Since the most prominent frequency could be a harmonic, divide it continually until the frequency
is one the first available octave of the guitar
*/
function getFundamentalFrequency (frequency) {
    var fundamental = frequency

    for (var i = 1; i <= 5; i++) {
        var currentHarmonic = frequency  / i
        if (currentHarmonic < 80) {
            return fundamental
        } else {
            fundamental = currentHarmonic
        }
    }

    return frequency
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
