"use strict";

var DecisiveSupport = require("decisive-support");
var DefaultLogger = function(){ return new DecisiveSupport.DefaultLogger(); };

var DecisiveModel = module.exports = function DecisiveModel(driver){
  this.driver = driver;
  this._logger = new DefaultLogger();
};

DecisiveModel.Document = require('./document');
DecisiveModel.Model = require('./model');
DecisiveModel.Schema = require('./schema');

/// Sets the logger that new instances of this class will use.
DecisiveDriverDynamo.setDefaultLogger = function(Logger){
  DefaultLogger = Logger;
};

DecisiveDriverDynamo.prototype.setLogger = function(logger){
  this._logger = logger;
};

DecisiveModel.prototype.log = function(){ var c = global.console; if (c) { c.log.apply(c, arguments); }};

DecisiveModel.prototype.define = function(name, modelDefinition){
  return new DecisiveModel.Model(name, modelDefinition);
};

DecisiveModel.types = DecisiveModel.Schema.types;
