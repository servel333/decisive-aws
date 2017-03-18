"use strict";

var DecisiveSupport = module.exports;

DecisiveSupport.SilentLogger = require('./silent-logger');
DecisiveSupport.ConsoleLogger = require('./console-logger');

DecisiveSupport.DefaultLogger = function(){ return new DecisiveSupport.SilentLogger(); };

DecisiveSupport.setDefaultLogger = function(Logger){
  DecisiveSupport.DefaultLogger = Logger;
};

DecisiveSupport.isFunction = function isFunction(val) {
  return val && {}.toString.call(val) === '[object Function]';
};

DecisiveSupport.isString = function isFunction(val) {
  return typeof val === 'string' || val instanceof String;
};

