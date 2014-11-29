var lcd = require('./index.js');
var sleep = require('sleep');

lcd.message('Good bye moon!', function(err, result) {
    if (err) {
        console.log('Error: ', err);
    }

    if (results) {
        console.log('Results: ', results);
    }
});

