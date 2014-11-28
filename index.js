var gpio = require('rpi-gpio');
var sleep = require('sleep');

gpio.on('export', function(channel) {
    console.log('Channel set: ', channel);
});

function LCD() {
    'use strict';

    this.CLEARDISPLAY            = 0x01;
    this.RETURNHOME              = 0x02;
    this.ENTRYMODESET            = 0x04;
    this.DISPLAYCONTROL          = 0x08;
    this.CURSORSHIFT             = 0x10;
    this.FUNCTIONSET             = 0x20;
    this.SETCGRAMADDR            = 0x40;
    this.SETDDRAMADDR            = 0x80;

    this.ENTRYRIGHT              = 0x00;
    this.ENTRYLEFT               = 0x02;
    this.ENTRYSHIFTINCREMENT     = 0x01;
    this.ENTRYSHIFTDECREMENT     = 0x00;

    this.DISPLAYON               = 0x04;
    this.DISPLAYOFF              = 0x00;
    this.CURSORON                = 0x02;
    this.CURSOROFF               = 0x00;
    this.BLINKON                 = 0x01;
    this.BLINKOFF                = 0x00;

    this.DISPLAYMOVE             = 0x08;
    this.CURSORMOVE              = 0x00;
    this.MOVERIGHT               = 0x04;
    this.MOVELEFT                = 0x00;

    this._BITMODE                = 0x10;
    this._4BITMODE                = 0x00;
    this._2LINE                   = 0x08;
    this._1LINE                   = 0x00;
    this._5x10DOTS                = 0x04;
    this._5x8DOTS                 = 0x00;

    this.rowOffsets               = [0x00, 0x40, 0x14, 0x54];

    this.pin_rs = 22;
    this.pin_e = 18;
    this.pins_db = [16, 11, 13, 15];

    function gpioError(err) {
        if (err) {
            console.log('Error:', err);
        }
    }

    function setupRS(rs, db, callback) {
        console.log('Setting up RS: ', rs);
        gpio.setup(rs, gpio.DIR_OUT, function (err) {
            gpioError(err);
            console.log('GPIO setup', rs);

            setupDB(0, db, callback);
        });
    }

    function setupDB(pin, db, callback) {
        console.log('Setting up DB: ', db[pin]);
        gpio.setup(db[pin], gpio.DIR_OUT, function (err) {
            gpioError(err);
            console.log('GPIO setup', db[pin]);
            pin += 1;
             if (pin < db.length) {
                 setupDB(pin, db, callback);
             } else {
                callback();
             }
        });
    }

    this.init = function init(rs, e, db, callback) {
        'use strict';
        console.log('Initializing:', rs, e, db);
        this.pins_rs = rs;
        this.pin_e = e;
        this.pins_db = db;

        var waiting = true;
        this.cleanUp();

        var setup = false;
        gpio.setup(e, gpio.DIR_OUT, function (err) {
            gpioError(err);
            console.log('GPIO setup', e);

            setupRS(rs, db, function() {
                setup = true;
            });
        });

        var lcd = this;

        var interval = setInterval(function() {
            'use strict';
            if (setup) {
                lcd.write4bits(0x33);
                lcd.write4bits(0x32);
                lcd.write4bits(0x28);
                lcd.write4bits(0x0C);
                lcd.write4bits(0x06);

                lcd.displayControl = lcd.DISPLAYON | lcd.CURSOROFF | lcd.BLINKOFF;
                lcd.displayFunction = lcd._4BITMODE | lcd._1LINE | lcd._5x8DOTS | lcd._2LINE;

                lcd.displayMode = lcd.ENTRYLEFT | lcd.ENTRYSHIFTDECREMENT;
                lcd.write4bits(lcd.ENTRYMODESET | lcd.displayMode);

                lcd.clear();
                clearInterval(interval);
                callback();
            }
        }, 1000);
    }

    this.cleanUp = function cleanUp() {
        gpio.destroy();
    }

    this.begin = function begin(columns, lines) {
        console.log('Begin:', columns, lines);
        if (lines > 1) {
            this.numLines = lines;
            this.displayFunction |= this._2LINE;
            this.currLine = 0;
        }
    }

    this.home = function home() {
        this.write4bits(this.RETURNHOME);
        sleep.usleep(3000);
    }

    this.clear = function clear() {
        this.write4bits(this.CLEARDISPLAY);
        sleep.usleep(3000);
    }

    this.setCursor = function setCursor(columns, row) {
        if (row > this.numLines) {
            row = this.numLines - 1;
        }

        this.write4bits(this.SETDDRAMADDR | (columns + this.rowOffsets[row]));
    }

    this.noDisplay = function noDisplay() {
        this.displayControl &= ~this.DISPLAYON;
        this.write4bits(this.DISPLAYCONTROL | this.displayControl);
    }

    this.display = function display() {
        this.displayControl |= this.DISPLAYON;
        this.write4bits(this.DISPLAYCONTROL | this.displayControl);
    }

    this.noCursor = function noCursor() {
        this.displayControl &= ~this.CURSORON;
        this.write4bits(this.DISPLAYCONTROL | this.displayControl);
    }

    this.cursor = function cursor() {
        this.displayControl |= this.CURSORON;
        this.write4bits(this.DISPLAYCONTROL | this.displayControl);
    }

    this.noBlink = function noBlink() {
        this.displayControl &= ~this.BLINKON;
        this.write4bits(this.DISPLAYCONTROL | this.displayControl);
    }

    this.blink = function blink() {
        this.displayControl |= this.BLINKON;
        this.write4bits(this.DISPLAYCONTROL | this.displayControl);
    }

    this.displayLeft = function displayLeft() {
        this.write4bits(this.CURSORSHIFT | this.DISPLAYMOVE | this.MOVELEFT);
    }

    this.displayRight = function displayRight() {
        this.write4bits(this.CURSORSHIFT | this.DISPLAYMOVE | this.MOVERIGHT);
    }

    this.leftToRight = function leftToRight() {
        this.displayMode |= this.ENTRYLEFT;
        this.write4bits(this.ENTRYMODESET | this.displayMode);
    }

    this.rightToLeft = function rightToLeft() {
        this.displayMode &= ~this.ENTRYLEFT;
        this.write4bits(this.ENTRYMODESET | this.displayMode);
    }

    this.autoScroll = function autoScroll() {
        this.displayMode |= this.ENTRYSHIFTINCREMENT;
        this.write4bits(this.ENTRYMODESET | this.displayMode);
    }

    this.noAutoScroll = function noAutoScroll() {
        this.displayMode &= ~this.ENTRYSHIFTINCREMENT;
        this.write4bits(this.ENTRYMODESET | this.displayMode);
    }

    function zfill(bits, size) {
        var s = bits + "";
        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    }

    this.write4bits = function write4bits(bits, charMode) {
        sleep.usleep(1000);

        bits = zfill(bits.toString(2), 8);
        var rs = !charMode ? false : true;

        gpio.write(this.pin_rs, rs, gpioError);

        for (var i = 0; i < this.pins_db.length; ++i) {
            gpio.write(this.pins_db[i], false, gpioError);
        }

        for (var i = 0; i < 4; ++i) {
            if (bits[i] == "1") {
                gpio.write(this.pins_db[i], true, gpioError);
            }
        }

        this.pulseEnable();

        for (var i = 0; i < this.pins_db.length; ++i) {
            gpio.write(this.pins_db[i], false, gpioError);
        }

        for (var i = 4; i < 8; ++i) {
            if (bits[i] == "1") {
                gpio.write(this.pins_db[i - 4], true, gpioError);
            }
        }

        this.pulseEnable();
    }

    this.pulseEnable = function pulseEnable() {
        gpio.write(this.pin_e, 0, gpioError);
        sleep.usleep(100);
        gpio.write(this.pin_e, 1, gpioError);
        sleep.usleep(100);
        gpio.write(this.pin_e, 0, gpioError);
        sleep.usleep(100);
    }

    function ord(string) {
        var str = string + '';
        var code = str.charCodeAt(0);

        if (0xD800 <= code && code <= 0xDBFF) {
            var hi = code;

            if (str.length === 1) {
                return code;
            }

            var low = str.charCodeAt(1);

            return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
        }

        if (0xDC00 <= code && code <= 0xDFFF) {
            return code;
        }

        return code;
    }

    this.message = function message(text, clear) {
        console.log('Printing message: ', text);
        if (clear) {
            this.clear();
        }

        var count = 0;
        for (var i = 0 ; i < text.length; ++i) {
            var char = text[i];
            if (char == '\n') {
                count = 0;
                this.write4bits(0xC0);
            } else {
                this.write4bits(ord(char), true);
                count += 1;
                if (count > 15) {
                    count = 0;
                    this.write4bits(0xC0);
                }
            }
        }
    }
}

var lcd = new LCD();
module.exports = lcd;
