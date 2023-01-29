/**
 * 1a. Choose the source - either the URL or the WordsAPI
 */

//  Get an aray with all of our arguments.
let searchArg = window.location.search

// Take the rest of the string after the first question mark. This lets us keep question marks as valid letters for the fist.
// @TODO We will need to rethink the way we take in arguements when we want to add colors to the custom links!
// We should use something like URLSearchParams (https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams)
let dataFromUrl = searchArg.substring(searchArg.indexOf('?') + 1)

// Fetch words from URL or API
function chooseSource() {
  if (window.location.search) {
    getDataFromUrl()
  } else {
    getDataFromApi()
  }
}

let getDataFromUrl = () => {
  populateFist(dataFromUrl)
  appendHistory(dataFromUrl)
}

let getDataFromApi = () => {
  fetchData().then((arrayOfResponses) => {
    appendHistory(arrayOfResponses)
    createFistWord(arrayOfResponses)
  })
}

/**
 * Part 1b. Fetch words from WordsAPI.
 */
// https://www.andreasreiterer.at/single-result-with-promise-all/

// Create the basic URL we will fetch. We are using a function because we might want to change these values dynamically.
url = (wordLength, partOfSpeech) => {
  return `https://wordsapiv1.p.rapidapi.com/words/?letters=${wordLength}&partOfSpeech=${partOfSpeech}&limit=1&letterPattern=^[a-zA-Z0-9]*$&random=true`
}

// WordsAPI requires us to pass this info, so let's create an object for it to consume.
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
    'X-RapidAPI-Key': '7438b899b8mshce25491a86b1560p1d7359jsnf3fe412aa2d7'
  }
}

// Create an array of requests we want to fetch.
const urls = [
  new Request(url('4', 'adjective'), options),
  new Request(url('4', 'noun'), options)
]

// Fetch all our URLs and return them once they've all come through.
let fetchData = () => {
  const allRequests = urls.map((url) =>
    fetch(url).then(async (response) => {
      // Check if the response came back 200-299
      if (response.ok) {
        try {
          return response.json()
        } catch (error) {
          return Promise.reject(
            new ResponseError('Invalid JSON: ' + error.message)
          )
        }
      }
      // If the reponse is NOT ok, let's do something else entirely.
      else {
        fingers404()
      }
    })
  )

  return Promise.all(allRequests)
}

// @TODO: Make a fun 404 page, or just maybe return some default finger text.
let fingers404 = () => {
  // Fill the output with a sorry message.
  console.log('Sad fingers. 404')
  outputParent.innerHTML =
    "<h1>Sad Fingers<br> >__< <br>The data source isn't playing today.</h1>"
}

/**
 * Part 2. Put the letters on the fists
 */
// HELPERS
let svg = document.getElementById('svg2')

let createFistWord = (responseData) => {
  // Create one long string from the data words we got back.
  // This will let us iterate through the fingers and assign letters to each.
  let fistWord = ''
  responseData.map((datum) => {
    fistWord += datum.word
  })

  // Let's populate the knuckles!
  populateFist(fistWord)
}

let populateFist = (fistWord) => {
  // Split the string into an array
  if (fistWord.length < 8) {
    while (fistWord.length < 8) {
      fistWord += ' '
      console.log(fistWord)
    }
  } else if (fistWord.length > 8) {
    fistWord = fistWord.substring(0, 8)
    console.log(fistWord)
  }
  fistWord.split('').map((letter, index) => {
    // Replace the default letters in the SVG with our new text.
    let fingerId = svg.getElementById(`finger__tspan--${index}`)
    fingerId.textContent = letter
  })

  // @TODO: This outputs the word that was just changed - so it's old and done now!
  createSrWords(fistWord)
}

let setNewUrl = (fistArg) => {
  window.location.search = fistArg
}

/**
 * Part 2a. Output the new word for screen readers.
 */

//  Helpers
let srWords = Array.from(document.getElementsByClassName('sr-word'))

let createSrWords = (fistWord) => {
  srWords.forEach((word) => {
    word.textContent = fistWord
  })
}

// Let's console log because this feature is still in testing
console.log('sr word', srWords)

/**
 * Part 3. Display results hisory
 */

// Helpers

//  Places where we keep the output on the page
outputParent = document.getElementById('outputHistory')

let createNode = (element) => {
  return document.createElement(element)
}

let append = (parent, child) => {
  return parent.append(child)
}

// Let's take our processed data, pull out the bits we want, and attach them to the page by calling our helper functions.
let appendHistory = (responseData) => {
  console.log('appendHistory', responseData)
  let outputRow = createNode('li')
  outputRow.classList = 'history__suggestion'
  append(outputParent, outputRow)

  // If responseData is just a string, we know it came from the URL
  if (typeof responseData === 'string') {
    let rowCell = createNode('a')
    rowCell.classList = 'history__suggestion--custom'
    rowCell.href = `?${responseData}`
    rowCell.innerHTML = responseData
    rowCell.target = '_blank'
    // Stick that tag onto the page!
    append(outputRow, rowCell)
  }
  // If responseData isn't a string, it must have come from our API.
  else {
    // Create an element to put our word in.
    let rowCell = createNode('a')
    rowCell.classList = 'history__suggestion--word'
    rowCell.href = '?'
    rowCell.target = '_blank'

    responseData.forEach((datum) => {
      // Check if anything came back. If not, ignore.
      if (datum) {
        if (datum.word) {
          // If our query returned a word, put it in the element.
          rowCell.href += datum.word
          rowCell.innerHTML += `${datum.word} `
        } else {
          // If there is an error with the query and the object comes back without a word, we will hardcode one!
          rowCell.href = `?oopsfist`
          rowCell.innerHTML = 'oops'
        }
        // Stick that tag onto the page!
        append(outputRow, rowCell)
      }
    })
  }
}

/**
 * Part 4. Control Skin Color
 */

//  Helpers
skinElements = Array.from(svg.querySelectorAll('path.skin'))
skinButton = document.getElementById('skin')
skinButton.addEventListener('input', getSkinColor)

function getSkinColor() {
  for (let element of skinElements) {
    element.style.fill = skinButton.value
  }
}

/**
 * Part 5. Control Fingernails Color
 */

//  Helpers
fingernailsElements = Array.from(svg.querySelectorAll('path.fingernail'))
fingernailsButton = document.getElementById('fingernails')
fingernailsButton.addEventListener('input', getfingernailsColor)

function getfingernailsColor() {
  for (let element of fingernailsElements) {
    element.style.fill = fingernailsButton.value
  }
}

/**
 * Part 6. Control Font Color
 */

//  Helpers
fontColorElements = Array.from(svg.querySelectorAll('tspan.letter'))
fontColorButton = document.getElementById('fontColor')
fontColorButton.addEventListener('input', getfontColor)

function getfontColor() {
  for (let element of fontColorElements) {
    element.style.fill = fontColorButton.value
  }
}

/**
 * Welcome to the page! Let's choose source on page load and go from there!
 */

// Get a random word on page load
chooseSource()
document
  .getElementById('getWordsButton')
  .addEventListener('click', getDataFromApi)
