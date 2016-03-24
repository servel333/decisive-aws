"use strict";

var DecisiveSupport = module.exports;

DecisiveSupport.SilentLogger = require('./silent-logger');
DecisiveSupport.ConsoleLogger = require('./console-logger');

DecisiveSupport.DefaultLogger = exports.SilentLogger;

DecisiveSupport.isFunction = function isFunction(val) {
  return val && {}.toString.call(val) === '[object Function]';
};

