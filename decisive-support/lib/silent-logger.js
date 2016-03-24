"use strict";

// console Keys => ["log", "info", "warn", "error", "dir", "time", "timeEnd", "trace", "assert", "Console"]

var SilentLogger = module.exports = function SilentLogger(){};

SilentLogger.prototype.debug   = function(){ return this; };
SilentLogger.prototype.error   = function(){ return this; };
SilentLogger.prototype.err     = function(){ return this; };
SilentLogger.prototype.info    = function(){ return this; };
SilentLogger.prototype.log     = function(){ return this; };
SilentLogger.prototype.trace   = function(){ return this; };
SilentLogger.prototype.warning = function(){ return this; };
SilentLogger.prototype.warn    = function(){ return this; };
SilentLogger.prototype.write   = function(){ return this; };
