"use strict";

var Model = module.exports = function Model(name, schema, driver){
  this.name = name;
  this.schema = schema;
  this.driver = driver;
  driver.integrateModel(this);
};

Model.prototype.create = function(attrs, options, cb){ return this.driver.create(attrs, options, cb); };
Model.prototype.find = function(query, options, cb){ return this.driver.find(query, options, cb); };
Model.prototype.update = function(query, update, options, cb){ return this.driver.update(query, options, cb); };
Model.prototype.destroy = function(query, options, cb){ return this.driver.destroy(query, options, cb); };
