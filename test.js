var lcd = require('./index.js');
var pin_rs = 22;
var pin_e = 18;
var pins_db = [16, 11, 13, 15];

lcd.init(pin_rs, pin_e, pins_db function() {
    lcd.begin(16, 2);

    lcd.message('Hello World', true);

    lcd.cleanUp();
});

