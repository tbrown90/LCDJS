var lcd = require('./index.js');
var sleep = require('sleep');

var pin_rs = 8;
var pin_e = 10;
var pins_db = [12, 18, 22, 24];

lcd.init(pin_rs, pin_e, pins_db, function() {
    lcd.begin(16, 2);

    lcd.message('Good Bye Moon', true);

    setTimeout(function() {
        lcd.cleanUp();
    }, 2000);
});

