'use strict';
var PythonShell = require('python-shell');

function LCD() {
    this.lcdScript = './lcdScript.py';

    this.message = function message(message, callback) {

        var options = {
            args: [message]
        };

        PythonShell.run(this.lcdScript, options, function(err, results) {
            if (callback) {
                callback(err, results);
            }
        });
    }
}

var lcd = new LCD();
module.exports = lcd;
