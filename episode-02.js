// Ok, nice! But that code is pretty verbose..
// And not exactly easy to read.
// All those `i` counters seem pretty redundant 😩
// Let's make use of JavaScript's native Array methods to refactor!

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Episode 2: The Array Menace ~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var axios = require('axios');
var chalk = require('chalk');

(async () => {
  // Query all movies
  var response = await axios.get('https://swapi.co/api/films/');

  // Instead of a for loop, we can use our trusty
  // Array method to `map` each result to a new object
  var { results } = response.data;
  var movies = results.map(movie => ({
    title: movie.title,
    release_date: movie.release_date
  }));

  // Let's reduce duplication and boilerplate by creating a
  // function for property access
  var getReleaseDate = movie => new Date(movie.release_date);
  var sortedMovies = [...movies].sort(
    (movie1, movie2) => getReleaseDate(movie1) - getReleaseDate(movie2)
  );

  // Create watch list
  sortedMovies
    .map((movie, i) => `${i}: ${movie.title}`)
    .map(listEntry => chalk.cyanBright.bold(listEntry))
    .forEach(row => console.log(row));
})();
