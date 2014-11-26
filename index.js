var python = require('node-python');
var charLCD = python.import('./CharLCD');

var lcd = new charLCD();
module.exports = lcd;
