"use strict";

var merge = require('lodash.merge');
var concat = require('lodash.concat');

var isFunction = function isFunction(val) {
  return val && {}.toString.call(val) === '[object Function]';
};

var Operation = module.exports = function Operation(docClient, methodName, params){
  this.docClient = docClient;
  this.methodName = methodName;
  this.params = params;
};

Operation.prototype.log = function(){
  if (console) {
    console.log.apply(console, arguments);
  }

  return this;
};

/**
 * Sets a flat indicating this operation will attempt to paginate to load all
 * data from the operation.
 *
 * @param {bool} v - Defaults to true.
 */
Operation.prototype.loadAll = function(v){
  this.willLoadAll = v === undefined ? true : !!v;
  return this;
};

/** @callback Operation~getNextParamFn
 *
 *  @this Operation - The current operation instance
 *  @param {object} resp - The response from the last pagination request
 *  @param {object} params - The params for the last pagination request.
 */

/**
 * Defines how pagination is to be performed.
 *
 * @param {string} itemsProperty -
 * @param {Operation~getNextParamFn} getNextParamFn -
 */
Operation.prototype.definePagination = function(itemsProperty, getNextParamFn){
  this.itemsProperty = itemsProperty;
  this.getNextParamFn = getNextParamFn;
  return this;
};

Operation.prototype.hasNextPage = function(resp, params) {
  return resp &&
    this.itemsProperty &&
    resp[this.itemsProperty] &&
    resp[this.itemsProperty].length > 0 &&
    isFunction(this.getNextParamFn) &&
    this.getNextParamFn.call(this, resp, params);
};

Operation.prototype.driver = function(){
  if (isFunction(this.docClient[this.methodName])) {
    return this.docClient;
  } else if (isFunction(this.docClient.service[this.methodName])) {
    return this.docClient.service;
  }
};

Operation.prototype._send = function(params, callback){
  var startTime = Date.now();
  var self = this;

  return this.driver()[this.methodName].call(this.driver(), params, function(err, resp) {
    var duration = Date.now() - startTime;

    if (err) {
      self.log({ method: this.methodName, duration: duration, err : err });
      return callback(err);
    }

    self.log({ method: this.methodName, duration: duration, resp: resp });
    return callback(null, resp);
  });
};

Operation.prototype.exec = function(params, callback){

  if (arguments.length === 1 && isFunction(params)) {
    callback = params;
    params = this.params;
  }

  this.startTime = Date.now();
  this.log({ method: this.methodName, params : params});

  var self = this;

  var paginate = function(resp, params){

    if (! self.willLoadAll || ! self.hasNextPage(resp, params)) {
      return callback(null, resp);
    }

    var params2 = merge({}, params, self.getNextParamFn.call(self, resp, params));

    self._send(params2, function(err, resp2){
      if (err) { return callback(err); }
      resp2[self.itemsProperty] = concat(resp[self.itemsProperty], resp2[self.itemsProperty]);
      return paginate(resp2, params2);
    });
  };

  // Fetch first page
  this._send(params, function(err, resp){
    if (err) { return callback(err); }
    return paginate(resp, params);
  });
};
