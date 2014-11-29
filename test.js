var lcd = require('./index.js');
var sleep = require('sleep');

var pin_rs = 25;
var pin_e = 24;
var pins_db = [23, 17, 27, 22];

lcd.init(pin_rs, pin_e, pins_db, function() {
    lcd.begin(16, 2);

    lcd.message('Hello World', true);

    setTimeout(lcd.cleanUp, 2000);
});

