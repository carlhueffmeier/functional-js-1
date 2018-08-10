// How many Star Wars movies are there now? .. 7?
// Got to watch them again sometime, let's check on Wikipedia..
// Wait! I'm a programmer, right 🤔
// Let's write a script 🤓

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Episode 1: The for Loop Awakens ~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var axios = require('axios');
var chalk = require('chalk');

(async () => {
  // Query all movies
  var response = await axios.get('https://swapi.co/api/films/');

  // Gather the information we want into `movies` array
  var { results } = response.data;
  var movies = [];
  for (let i = 0; i < results.length; i += 1) {
    movies.push({
      title: results[i].title,
      release_date: results[i].release_date
    });
  }

  // Sort movies by release date
  var sortedMovies = movies.slice();
  var compareMovies = function compareMovies(movie1, movie2) {
    let movie1_release = new Date(movie1.release_date);
    let movie2_release = new Date(movie2.release_date);
    return movie1_release - movie2_release;
  };
  sortedMovies.sort(compareMovies);

  // Format and print the watch list
  for (let i = 0; i < sortedMovies.length; i += 1) {
    let listEntry = `${i+1}: ${sortedMovies[i].title}`;
    listEntry = chalk.cyanBright.bold(listEntry);
    console.log(listEntry);
  }
})();
