// https://www.andreasreiterer.at/single-result-with-promise-all/

/**
 * Part 1. Fetch words from WordsAPI.
 */

// Create the basic URL we will fetch. We are using a function because we might want to change these values dynamically.
url = (wordLength, partOfSpeech) => {
  return `https://wordsapiv1.p.rapidapi.com/words/?letters=${wordLength}&partOfSpeech=${partOfSpeech}&limit=1&letterPattern=\\S&random=true`;
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
const urls = [
  new Request(url("4", "adjective"), options),
  new Request(url("4", "noun"), options)
];

// Fetch all our URLs and return them once they've all come through.
let fetchData = () => {
  const allRequests = urls.map(url =>
    fetch(url).then(async response => {
      // Check if the response came back 200-299
      if (response.ok) {
        try {
          return response.json();
        } catch (error) {
          return Promise.reject(
            new ResponseError("Invalid JSON: " + error.message)
          );
        }
      }
      // If the reponse is NOT ok, let's do something else entirely.
      else {
        fingers404();
      }
    })
  );

  return Promise.all(allRequests);
};

// @TODO: Make a fun 404 page, or just maybe return some default finger text.
let fingers404 = () => {
  // Fill the output with a sorry message.
  console.log("Sad fingers. 404");
  outputParent.innerHTML =
    "<h1>Sad Fingers<br> >__< <br>The data source isn't playing today.</h1>";
};

// Trigger fetch command
function getWords() {
  fetchData().then(arrayOfResponses => {
    appendOutput(arrayOfResponses);
  });
}
document.getElementById("getWordsButton").addEventListener("click", getWords);

/**
 * Part 2. Display results
 */

// Let's take our processed data, pull out the bits we want, and attach them to the page by calling a few more functions.
let appendOutput = responseData => {
  console.log("appendOutput", responseData);
  let outputRow = createNode("div");
  outputRow.classList = "output__row";
  append(outputParent, outputRow);

  // @TODO: Separate the words into left fist and right fist based on part of speech, since we should not need to know the order in which the objects came back.
  responseData.forEach(datum => {
    // Check if anything came back. If not, ignore.
    if (datum) {
      // Create an element to put our word in.
      let rowCell = createNode("span");
      rowCell.classList = "row__cell";
      // If our query returned a word, put it in the element.
      if (datum.word) {
        rowCell.innerHTML = datum.word;
      }
      // If there is an error with the query and the object comes back without a word, we will hardcode one!
      else {
        rowCell.innerHTML = "oops";
      }
      // Stick that tag onto the page!
      append(outputRow, rowCell);
    }
  });
};

/**
 * Helpers
 */

//  Places where we keep the output on the page
outputParent = document.getElementById("outputHistory");

function createNode(element) {
  return document.createElement(element);
}

function append(parent, child) {
  return parent.appendChild(child);
}

// JUST FOR DEV, SO WE CAN RUN WITHOUT PRESSING ANY BUTTONS
getWords();
