var lcd = require('./index.js');
var pin_rs = 25;
var pin_e = 24;
var pins_db = [24, 17, 27, 22];

lcd.begin(16, 2);
lcd.init(pin_rs, pin_e, pins_db);

var date = new Date();
var day = date.getDay();
var month = (date.getMonth() + 1);
var year = date.getFullYear();

var dateStr = month + '-' + day + '-' + year;

while (true) {
    lcd.message(dateStr, true);
}

lcd.cleanUp();
