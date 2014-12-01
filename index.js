'use strict';
var PythonShell = require('python-shell');

function LCD() {
    this.lcdScript = 'lcdScript.py';

    this.message = function message(message, options, callback) {
        if (typeof options === 'function') {
            options =  {
                scriptPath: './python/',
                args: [message]
            };
            callback = null;
        }

        options.args = [message];

        try {
            PythonShell.run(this.lcdScript, options, function(err, results) {
                if (callback) {
                    callback(err, results);
                }
            });
        } catch (err) {
            console.log('Python is not installed on this system.');
        }
    }
}

var lcd = new LCD();
module.exports = lcd;
