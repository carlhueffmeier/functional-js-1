// Alright, this is not bad!

// If the code wasn't any more complex than this, this could be a good place to stop.
// But... we can do better 😎
// Let me show you the hidden treasures on the other side of function river.

// So, you notice how
//  - `Picking properties of objects`
//  - `Apply function to variables`
// are pretty common operations that are repeated
// over and over in most of our code.
// Let's see whether we can generalize those operations ✌️

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Episode 3: Return of the Function ~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var axios = require('axios');
var chalk = require('chalk');

// Let's define some general functions to make those repeated operations easier.

// These might look scary and complicated at first, but do not despair!
// Just like the functions we saw in underline, we only need to write them *once*
// After that, we don't have to worry about it!

// One core principal functional programming is relying on your functions
// to work as intended.

// 🆕 identity: Returns the element itself
// Let's start easy!
function identity(x) {
  return x;
}

// 🆕 prop: Gets a single property of an object
function prop(key, obj) {
  return obj[key];
}

// 🆕 pick: Grabs several properties of an object
// Returns a new object with only the specified properties
function pick(keysToPick, obj) {
  return Object.entries(obj).reduce(
    (target, [key, val]) =>
      keysToPick.includes(key) ? { ...target, [key]: val } : target,
    {}
  );
}

// 🆕 path: Returns the value stored at the specified path
// Example
// var luke = {
//   name: { first: 'Luke', last: 'Skywalker' },
//   occupation: 'Jedi'
// };
// path(['name', 'last'], luke) -> 'Skywalker'
function path(keys, obj) {
  return keys.reduce((target, key) => target[key], obj);
}

// 🆕 sortBy: Returns a sorted copy of the input array
// The `evaluate` function is used to produce a value that can
// be compared via `<`
function sortBy(evaluate, array) {
  return [...array].sort((a, b) => (evaluate(a) < evaluate(b) ? -1 : 1));
}

// 🆕 map: Applies a function to every list item
// But you knew that already..
function map(mapFn, array) {
  return array.map(mapFn);
}

// ~~~~~~~~~~~~~~~~~~~~ End of general functions ~~~~~~~~~~~~~~~~~~~

// Make the API request
var queryStarWarsMovies = async () =>
  await axios.get('https://swapi.co/api/films/');

// Instead of storing our data,
// let's just define `what` should happen to our data
var getMovies = response => path(['data', 'results'], response);
var pickTitleAndReleaseDate = movie => pick(['title', 'release_date'], movie);
var pickTitleAndReleaseDates = movies => map(pickTitleAndReleaseDate, movies);

// How do we sort by release date?
var getReleaseDateString = movie => prop('release_date', movie);
var convertToDate = dateString => new Date(dateString);
var getReleaseDate = movie => convertToDate(getReleaseDateString(movie));
var sortByReleaseDate = array => sortBy(getReleaseDate, array);

// Create watch list
var formatMovieListItem = (movie, index) => `${index}: ${prop('title', movie)}`;
var typeset = string => chalk.cyanBright.bold(string);
var logToConsole = output => console.log(output);

var printMovie = (movie, index) => {
  var listItem = formatMovieListItem(movie, index);
  listItem = typeset(listItem);
  logToConsole(listItem);
};

var printListOfMovies = movieList => map(printMovie, movieList);

// Phew... A job well done 👍

// Wait, you are still here? 🧐

// Oh yeah! We haven't actually DONE anything yet. 😯
// All we did is define functions!
// Let's go ahead and do the actual work 💪
queryStarWarsMovies()
  .then(getMovies)
  .then(pickTitleAndReleaseDates)
  .then(sortByReleaseDate)
  .then(printListOfMovies);

// If you aren't comfortable with promises yet, this is the same as:
// var response = await queryStarWarsMovies();
// var results = getMovies(response);
// var movies = pickTitleAndReleaseDates(results);
// var sortedMovies = sortByReleaseDate(movies);
// printListOfMovies(sortedMovies);
