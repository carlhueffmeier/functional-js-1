// Ok ok, I *know* you want me to stop refactoring this piece of code
// into oblivion 🔥

// But hang in there for a little longer!
// There actually a point to all this, and one piece of the picture
// is still missing 🕵️‍

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Episode 4: Attack of the Curry ~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var axios = require('axios');
var chalk = require('chalk');

// Alright, so notice how our functions usually look like this:
//   stuff => someFunction(stuff)

// That seems really redundant!
// Let's see.. maybe there is another 'think once, use everywhere' solution 🤔

// 🆕 curry: Returns a new function that can receive its arguments `bit by bit`
// Example
// var add = curry((a, b) => a + b);
// add(5, 5) -> 10
// add(5)(5) -> 10
// var add5 = add(5)
// add5(5) -> 10
function curry(fn) {
  return (...args) => (args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args)));
}

// Another common pattern we see in our code:
// var eggs = getEggs();
// var eggsWithBacon = addBacon(eggs);
// var breakfast = cook(eggsWithBacon);

// Of course we can shorten that to
// cook(addBacon(getEggs()))

// But that is kind of confusing, right?
// Let's imagine a utility that allows us to write the same code in
// natural reading order 🤔

// var prepareBreakfast = pipe(getEggs, addBacon, cook)
// prepareBreakfast() -> 🍳

// 🆕 pipe: Executes a list of functions "piping" the result of the previous
// to the next function in the list
function pipe(firstFn = x => x, ...fns) {
  return (...args) => fns.reduce((value, fn) => fn(value), firstFn(...args));
}

// ~~~~~~~~~~~~~~~~~~~~ Our functions from Episode 3 ~~~~~~~~~~~~~~~~~~~

var episodeThreeFunctions = {
  identity: function identity(x) {
    return x;
  },
  prop: function prop(key, obj) {
    return obj[key];
  },
  pick: function pick(keysToPick, obj) {
    return Object.entries(obj).reduce(
      (target, [key, val]) => (keysToPick.includes(key) ? { ...target, [key]: val } : target),
      {}
    );
  },
  path: function path(keys, obj) {
    return keys.reduce((target, key) => target[key], obj);
  },
  sortBy: function sortBy(evaluate, array) {
    return [...array].sort((a, b) => (evaluate(a) < evaluate(b) ? -1 : 1));
  },
  map: function map(mapFn, array) {
    return array.map(mapFn);
  },
  forEach: function forEach(fn, array) {
    return array.forEach(fn);
  }
};

// Let's go ahead and curry all of our utilities from Episode 3™️!

var prop = curry(episodeThreeFunctions.prop);
var pick = curry(episodeThreeFunctions.pick);
var path = curry(episodeThreeFunctions.path);
var sortBy = curry(episodeThreeFunctions.sortBy);
var map = curry(episodeThreeFunctions.map);
var forEach = curry(episodeThreeFunctions.forEach);

// And notice how we don't need to curry unary functions 👌
var identity = episodeThreeFunctions.identity;

// ~~~~~~~~~~~~~~~~~~~~ End of general functions ~~~~~~~~~~~~~~~~~~~

// Getting the data we need
var queryStarWarsMovies = async () => await axios.get('https://swapi.co/api/films/');

var getMoviesWithReleaseDate = pipe(
  path(['data', 'results']),
  map(pick(['title', 'release_date']))
);

// Constructing our sorting function
var getReleaseDate = pipe(
  prop('release_date'),
  dateString => new Date(dateString)
);
var sortByReleaseDate = sortBy(getReleaseDate);

// Constructing the formatting function for a single movie
var formatMovieListItem = (movie, index) => `${index}: ${prop('title', movie)}`;
var typeset = chalk.cyanBright.bold;
var printMovie = pipe(
  formatMovieListItem,
  typeset,
  console.log
);
var printListOfMovies = forEach(printMovie);

// Now, let's put everything together ✌️
var printMoviesOrderedByRelease = pipe(
  getMoviesWithReleaseDate,
  sortByReleaseDate,
  printListOfMovies
);

// Now that all the behaviour of our script is wrapped into
// a single neet function, we just need to execute it! 🧙‍
queryStarWarsMovies().then(printMoviesOrderedByRelease);

// A few things to notice:
// - We don't store data *anywhere*
// - Our script is extremely flexible

// "But that's not actually any *shorter*",
// I hear one young Padawan in the back say in a condescending tone.

// Whow, ok now!
// Let me stress that point: The benefit isn't the reduction of code,
// but in the flexibility and deterministic behaviour of our code.

// *But*..
// Just for fun, let's see how it would look like to
// print the movies in alphabetical order (in a more concise way)

// var printMoviesInAlphabeticalOrder = pipe(
//   path(['data', 'results']),
//   map(prop('title')),
//   sortBy(identity),
//   array => array.join('\n'),
//   console.log
// );
// queryStarWarsMovies().then(printMoviesInAlphabeticalOrder);
