// 'Stop handholding me man, you make me sick!'
// Ok, ok.. you asked for it, so don't come crying to me later

// ~~~~~~~~~~~~~~~~~~~~~~~
// Episode 6: Epilogue   ~
// ~~~~~~~~~~~~~~~~~~~~~~~

var axios = require('axios');
var chalk = require('chalk');
var { forEach, pipe, path, map, pick, sortBy, prop, construct, addIndex, add } = require('ramda');

// 🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃
// 🧙‍ Wizard Level Functional-Style Programming™️
// 🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃🍃

axios
  .get('https://swapi.co/api/films/')
  .then(
    pipe(
      path(['data', 'results']), // Films are stored in `response.data.results`
      map(pick(['title', 'release_date'])), // For every film get `.title` and `.release_date`
      // Now, sort by release date
      sortBy(
        // Movies are compared with this function
        pipe(
          prop('release_date'), // Get release date
          construct(Date) // Make it 'comparable' by constructing a new `Date` object
        )
      ),
      // Loop over list passing the item and an index
      addIndex(forEach)(
        pipe(
          (movie, index) => `${add(1)(index)}: ${prop('title', movie)}`, // Format the output
          chalk.cyanBright.bold, // Make the font fancy
          console.log // Log it to the console
        )
      )
    )
  )
  .catch(
    pipe(
      error => `An error occurred: ${error.message}`,
      chalk.redBright.bold,
      console.error
    )
  );

// ⚠️ Please proceed with caution ⚠️

// Let's keep our style of programming compatible with other people 👫

// The most important goal of your code should be the readability for
// other people on your team or in your company.

// Consider how much other people reading the code will be familiar
// with functional programming and adapt your style accordingly.

// And, of course, add comments if you think a concept might be
// unfamiliar to them.

// 🧙‍✌️
