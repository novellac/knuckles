/**
 * Part 0. Click the button
 */

let doAThing = () => {
  alert("hello");
};

document.getElementById("getWordsButton").addEventListener("click", () => {
  getWords();
});
/**
 * Part 1. Fetch words from WordsAPI.
 */

// Create the basic URL we will fetch. We are using a function because we might want to change these values dynamically.
url = (wordLength, partOfSpeech) => {
  return `https://wordsapiv1.p.rapidapi.com/words/?letters=${wordLength}&partOfSpeech=${partOfSpeech}&limit=1&random=true`;
};

// WordsAPI requires us to pass this info, so let's create an object for it to consume.
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    "X-RapidAPI-Key": "7438b899b8mshce25491a86b1560p1d7359jsnf3fe412aa2d7"
  }
};

// Create an array of requests we want to fetch.
// We use an array because later we might want to make a dynamic number of calls.
const requestsToFetch = [
  fetch(new Request(url("4", "adjective"), options)),
  fetch(new Request(url("4", "noun"), options))
];

// Promise all. Let's wait till we have all our info back to do anything.
let getWords = () => {
  Promise.all(requestsToFetch)
    .then(results => {
      // When the array of results come back, go through them one at a time and run them through the processResult function.
      results.forEach(result => {
        // The fetch returns a promise containing an object. We want to parse it into JSON.
        processResult(result.json());
      });
    })
    .catch(err => {
      console.error("The fetch didn't return correctly: ");
      throw err;
    });
};

// Each result.json() comes in as the argument, which we have called resultPromise
let processResult = resultPromise => {
  // The second .then takes the resultPromise, turns it into usable data, and sends it on!
  resultPromise.then(processedData => {
    appendOutput(processedData);
  });
};

/**
 * Part 2. Display results
 */

// Let's take our processed data, pull out the bits we want, and attach them to the page by calling a few more functions.
let appendOutput = processedData => {
  console.log(processedData);

  // We are putting our words in p tags for now, so let's create some.
  let p = createNode("p");

  // Put the word we received into the p tag we just made.
  p.innerHTML = processedData.word;

  // Stick that tag onto the page!
  append(p);
};

outputParent = document.getElementById("output");

function createNode(element) {
  return document.createElement(element);
}

function append(el) {
  return outputParent.appendChild(el);
}
