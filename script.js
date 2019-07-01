const uri = "https://wordsapiv1.p.rapidapi.com/words/?";
const urlAdj = uri + "letters=4&partOfSpeech=adjective&limit=1&random=true";
const urlNoun = uri + "letters=4&partOfSpeech=noun&limit=1&random=true";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    "X-RapidAPI-Key": "7438b899b8mshce25491a86b1560p1d7359jsnf3fe412aa2d7"
  }
};

let req = new Request(uri, options);
let reqAdj = new Request(urlAdj, options);
let reqNoun = new Request(urlNoun, options);

const apiRequest1 = fetch(reqAdj).then(function(response) {
  return response.json();
});
const apiRequest2 = fetch(reqNoun).then(function(response) {
  return response.json();
});
var combinedData = { apiRequest1: {}, apiRequest2: {} };
var myArray = [];

Promise.all([apiRequest1, apiRequest2])
  .then(function(values) {
    combinedData["apiRequest1"] = values[0];
    combinedData["apiRequest2"] = values[1];
    console.log("combined data is: ", combinedData);
    myArray.push(values[0], values[1]);

    return combinedData;
    //   return myArray;
  })
  .then(() => {
    console.log("something");
  });

console.log("myArray is: ", myArray);
console.log("combined data API Request 1 is: ", combinedData.apiRequest1);

myNewArray = [...myArray];
console.log("My New Array is: ", myNewArray);

// // // const getNameButton = document.querySelector("#getNameButton");
// // // let outputArea = document.querySelector("#output");
// // // let getNameText = document.querySelector("#getNameText");

// const urlAdj =
//   "https://wordsapiv1.p.rapidapi.com/words/?letters=4&partOfSpeech=adjective&limit=1&random=true";
// const urlNoun =
//   "https://wordsapiv1.p.rapidapi.com/words/?letters=4&partOfSpeech=noun&limit=1&random=true";
// const uri = "https://wordsapiv1.p.rapidapi.com/words/?letters=4&limit=3";
// const options = {
//   method: "GET",
//   headers: {
//     "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
//     "X-RapidAPI-Key": "7438b899b8mshce25491a86b1560p1d7359jsnf3fe412aa2d7"
//   }
// };

// let req = new Request(uri, options);
// let reqAdj = new Request(urlAdj, options);
// let reqNoun = new Request(urlNoun, options);

// fetch(req)
//   .then(response => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error("BAD HTTP stuff");
//     }
//   })
//   .then(jsonData => {
//     console.log(jsonData);
//   })
//   .catch(err => {
//     console.log("ERROR:", err.message);
//   });

// // let h = new Headers();
// // h.append("X-RapidAPI-Key", "a thing");
// // console.log(typeof h, h);

// // // const getNameButton = document.querySelector("#getNameButton");
// // // let outputArea = document.querySelector("#output");
// // // let getNameText = document.querySelector("#getNameText");

// // // getNameButton.addEventListener("click", getText, false);

// // // function getText() {
// // //   console.log(getNameText.value);
// // //   outputArea.innerHTML = Number(getNameText.value) + 1;
// // //   //   alert("did it");
// // // }

// // ("use strict");

// // async function getDefinitionFromWordsAPI(apiKey, word, includeHeaders) {
// //   const url = "https://wordsapiv1.p.rapidapi.com/words/";
// //   const options = {
// //     method: "GET",
// //     headers: {
// //       "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
// //       "X-RapidAPI-Key": apiKey
// //     }
// //   };
// //   const request = new Request(url + word, options);
// //   const res = await fetch(request);
// //   const headers = Object.fromEntries(res.headers);
// //   if (res.ok) {
// //     const json = await res.json();
// //     if (includeHeaders) return { headers, json };
// //     else return json;
// //   } else throw new Error("http error in fetch operation");
// // }

// // function makeNewAsyncAPICallFunction(apiKey, includeHeaders) {
// //   return async word =>
// //     await getDefinitionFromWordsAPI(apiKey, word, includeHeaders);
// // }

// // const myAPIKey = "7438b899b8mshce25491a86b1560p1d7359jsnf3fe412aa2d7";
// // const define = makeNewAsyncAPICallFunction(myAPIKey, true);
// // /* define(word) === getDefinitionFromWordsAPI(myAPIKey, word, true) */

// // (async () => {
// //   try {
// //     const word = "unequivocal";
// //     const { headers, json } = await define(word);
// //     console.log(json);
// //     /**
// //      * Here ☝️, the `json` property is the JSON data from the fetch response,
// //      * but `headers` is also available to get its `x-ratelimit-requests-
// //      * remaining` property for tracking quota usage.
// //      *
// //      * FYI: This is a pattern that's being used here for convenience, but
// //      * one typically would not include header info in the same object as
// //      * the desired information from the response. To omit the header
// //      * information and just return the response JSON data, call the higher order
// //      * function above like this instead:
// //      *
// //      * // const define = makeNewAsyncAPICallFunction(myAPIKey);
// //      *
// //      */
// //   } catch (err) {
// //     /* probably do something more useful, but for this example: */
// //     throw err;
// //   }
// // })();
