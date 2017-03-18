"use strict";

var DecisiveSupport = require("decisive-support");
var DefaultLogger = function(){ return new DecisiveSupport.DefaultLogger(); };

var DecisiveBase = module.exports = function DecisiveBase(){
  this._logger = new DefaultLogger();
};

/// Sets the logger that new instances of this class will use.
DecisiveBase.setDefaultLogger = function(Logger){
  DefaultLogger = Logger;
};

DecisiveBase.prototype.setLogger = function(logger){
  this._logger = logger;
};
