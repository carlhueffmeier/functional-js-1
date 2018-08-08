const fs = require('fs');
const axios = require('axios');

axios.get('https://swapi.co/api/films/').then(response => {
  fs.writeFileSync(__dirname + '/api-data.json', JSON.stringify({ data: response.data }), 'utf-8');
});
