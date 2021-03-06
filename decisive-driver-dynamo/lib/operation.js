"use strict";

var concat = require('lodash.concat');
var DecisiveSupport = require("decisive-support");
var merge = require('lodash.merge');
var DefaultLogger = function(){ return new DecisiveSupport.DefaultLogger(); };

var Operation = module.exports = function Operation(){
  this._logger = new DefaultLogger();
};

/// Sets the logger that new instances of this class will use.
Operation.setDefaultLogger = function(Logger){
  DefaultLogger = Logger;
};

Operation.prototype.setLogger = function(logger){
  this._logger = logger;
};

Operation.prototype.setDocClient = function(v){ this._docClient = v; return this; };
Operation.prototype.setMethodName = function(v){ this._methodName = v; return this; };
Operation.prototype.setItemsProperty = function(v){ this._itemsProperty = v; return this; };
Operation.prototype.setItemProperty = function(v){ this._itemProperty = v; return this; };

Operation.prototype.setParams = function(v){
  this._logger.trace({ function: 'Operation.setParams', params: v });
  this._params = v;
  return this;
};

/** @callback Operation~GetNextParams
 *
 *  Returns the params to fetch the next page of items if there is another
 *  page; otherwise, returns undefined.
 *
 *  @this Operation - The current operation instance
 *  @param {object} resp - The response from the last pagination request
 *  @param {object} params - The params for the last pagination request.
 */

/// @param {Operation~GetNextParams} v
Operation.prototype.setGetNextParams = function(v){ this._getNextParams = v; return this; };

Operation.prototype.loadAll = function(){ this._loadAll = true; return this; };

Operation.prototype.getError = function(){
  this._logger.trace({ function: 'Operation.getError', arguments: arguments });
  var errors = [];
  if (! this._docClient) { errors.push({ message: "Operation missing _docClient" }); }
  if (! this._methodName) { errors.push({ message: "Operation missing _methodName" }); }
  if (! this._params) { errors.push({ message: "Operation missing _params" }); }
  if (! this._itemsProperty && ! this._itemProperty) {
    if (! this._itemsProperty) { errors.push({ message: "Operation missing _itemsProperty" }); }
    if (! this._itemProperty) { errors.push({ message: "Operation missing _itemProperty" }); }
  }
  if (this._itemsProperty && this._itemProperty) { errors.push({ message: "Operation cannot have both _itemsProperty and _itemProperty" }); }

  if (errors.length === 0) { return; }

  var err = new Error("Invalid operation state");
  err.statusCode = 500;
  err.errors = errors;
  return err;
};

Operation.prototype.isValid = function(){ return !this.getError(); };

Operation.prototype.isSingle = function(){ return   this._itemProperty && ! this._itemsProperty; };
Operation.prototype.isMulti  = function(){ return ! this._itemProperty &&   this._itemsProperty; };

Operation.prototype.hasNextPage = function(resp, params) {
  this._logger.trace({ function: 'Operation.hasNextPage', arguments: arguments });
  return ! this._itemProperty &&
    resp &&
    this._itemsProperty &&
    resp[this._itemsProperty] &&
    resp[this._itemsProperty].length > 0 &&
    DecisiveSupport.isFunction(this._getNextParams) &&
    this._getNextParams.call(this, resp, params);
};

Operation.prototype.driver = function(){
  this._logger.trace({ function: 'Operation.driver', arguments: arguments });
  if (DecisiveSupport.isFunction(this._docClient[this._methodName])) {
    return this._docClient;
  } else if (DecisiveSupport.isFunction(this._docClient.service[this._methodName])) {
    return this._docClient.service;
  }
};

Operation.prototype._send = function(params, callback){
  this._logger.trace({ function: 'Operation._send', arguments: arguments });

  var startTime = Date.now();
  var self = this;

  try{
    return this.driver()[this._methodName].call(this.driver(), params, function(err, resp) {
      self._logger.trace({ function: 'Operation._send driver.'+self._methodName+'>callback', arguments: arguments });

      var duration = Date.now() - startTime;

      if (err) {
        self._logger.info({ function: 'Operation._send driver.'+self._methodName, duration: duration, err : err });
        return callback(err);
      }

      self._logger.info({ function: 'Operation._send driver.'+self._methodName, duration: duration, resp: resp });

      return callback(null, resp);
    });
  }
  catch(err){
    callback(err);
  }
};

Operation.prototype.exec = function(callback){
  this._logger.trace({ function: 'Operation.exec', arguments: arguments });

  var err = this.getError();
  if (err) {
    this._logger.info({ function: 'Operation.exec '+this._methodName, duration: 0, err : err });
    return callback(err);
  }

  this.startTime = Date.now();
  this._logger.info({ function: 'Operation.exec '+this._methodName, params : this._params});

  var self = this;

  var paginate = function(resp, params){
    self._logger.trace({ function: 'Operation.exec paginate', arguments: arguments });

    if (! self._loadAll || ! self.hasNextPage(resp, params)) {
      if (self._itemsProperty) { return callback(null, resp[self._itemsProperty]); }
      if (self._itemProperty) { return callback(null, resp[self._itemProperty]); }
      return callback(null, resp);
    }

    var params2 = merge({}, params, self._getNextParams.call(self, resp, params));

    self._send(params2, function(err, resp2){
      if (err) { return callback(err); }
      resp2[self._itemsProperty] = concat(resp[self._itemsProperty], resp2[self._itemsProperty]);
      return paginate(resp2, params2);
    });
  };

  // Fetch first page
  this._send(this._params, function(err, resp){
    if (err) { return callback(err); }
    return paginate(resp, self._params);
  });
};
