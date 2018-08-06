// You notice how our code got way more declarative
// compared to the beginning?

// We write `what` we want to do, and not `how` we go about doing it.
// Now, our logic consists of very short functions using proven utilities.

// Although it might look very unfamiliar at first,
// there are many advantages to functional programming.

// Every part of our code has defined behaviour with deterministic output.
// That minimizes risk of bugs and allows you to focus on the problem
// you actually want to solve.

// 'All good..
// But you blew up fourty lines of code to nearly ONE HUNDRED fourty!
// What is up with *that*?'🤨

// You're right!
// So let me introduce you to Ramda.js 🐐

// ~~~~~~~~~~~~~~~~~~~~~~~
// Episode 5: A New Hope ~
// ~~~~~~~~~~~~~~~~~~~~~~~

var axios = require('axios');
var chalk = require('chalk');
var R = require('ramda');

// Getting data
var queryStarWarsMovies = async () =>
  await axios.get('https://swapi.co/api/films/');

var getMoviesWithReleaseDate = R.pipe(
  R.path(['data', 'results']),
  R.map(R.pick(['title', 'release_date']))
);

// Sorting
var getReleaseDate = R.pipe(
  R.prop('release_date'),
  dateString => new Date(dateString)
);
var sortByReleaseDate = R.sortBy(R.ascend(getReleaseDate));

// Formatting
var formatMovieListItem = (movie, index) =>
  `${index}: ${R.prop('title', movie)}`;
var printMovie = R.pipe(
  formatMovieListItem,
  chalk.cyanBright.bold,
  console.log
);
var printListOfMovies = R.addIndex(R.map)(printMovie);

// Composition
var printMoviesOrderedByRelease = R.pipe(
  getMoviesWithReleaseDate,
  sortByReleaseDate,
  printListOfMovies
);
queryStarWarsMovies().then(printMoviesOrderedByRelease);
