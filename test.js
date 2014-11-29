var lcd = require('./index.js');
var sleep = require('sleep');

var pin_rs = 22;
var pin_e = 18;
var pins_db = [16, 11, 13, 15];

lcd.init(pin_rs, pin_e, pins_db, function() {
    lcd.begin(16, 2);

    lcd.message('Hello World', true);

    sleep.sleep(2);
    lcd.cleanUp();
});

