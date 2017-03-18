"use strict";

var isFunction = function isFunction(val) {
  return val && {}.toString.call(val) === '[object Function]';
};

// console Keys => ["log", "info", "warn", "error", "dir", "time", "timeEnd", "trace", "assert", "Console"]

var ConsoleLogger = module.exports = function ConsoleLogger(){};

var _log = function(args, name){
  args = Array.prototype.slice.call(args);
  args = args.map(function(val, i){
    if (typeof val === "string") { return val; }
    return JSON.stringify(val);
  });

  /* jshint eqnull: true */
  if (typeof console === "undefined" || console == null) {
    return this;
  }

  if (name && isFunction(console[name])) {
    console[name].apply(console, args);
    return this;
  }

  if (! isFunction(console.log)) {
    return this;
  }

  console.log.apply(console, args);
  return this;
};

ConsoleLogger.prototype.debug   = function(){ return _log(arguments         ); };
ConsoleLogger.prototype.error   = function(){ return _log(arguments, 'error'); };
ConsoleLogger.prototype.err     = function(){ return _log(arguments, 'error'); };
ConsoleLogger.prototype.info    = function(){ return _log(arguments, 'info' ); };
ConsoleLogger.prototype.log     = function(){ return _log(arguments         ); };
ConsoleLogger.prototype.silly   = function(){ return _log(arguments         ); };
ConsoleLogger.prototype.trace   = function(){ return _log(arguments         ); };
ConsoleLogger.prototype.warning = function(){ return _log(arguments, 'warn' ); };
ConsoleLogger.prototype.warn    = function(){ return _log(arguments, 'warn' ); };
ConsoleLogger.prototype.write   = function(){ return _log(arguments         ); };

// Logger.prototype.debug = function(){ return this; }; // disables #debug()
// Logger.prototype.silly = function(){ return this; }; // disables #silly()
// Logger.prototype.trace = function(){ return this; }; // disables #trace()
