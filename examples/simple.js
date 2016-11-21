var fsJSON = require('../index.js');

var result = fsJSON.open('../');

console.log(JSON.stringify(result));

var flat = fsJSON.flatten(result);

console.log(JSON.stringify(flat));