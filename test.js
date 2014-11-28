var lcd = require('./index.js');
var pin_rs = 22;
var pin_e = 18;
var pins_db = [16, 11, 13, 15];

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
