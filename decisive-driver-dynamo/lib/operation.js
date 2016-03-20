"use strict";

var isFunction = function isFunction(val) {
  return val && {}.toString.call(val) === '[object Function]';
};

var Operation = module.exports = function Operation(docClient, methodName, params){
  this.docClient = docClient;
  this.methodName = methodName;
  this.params = params;
};

Operation.prototype.loadAll = function(val){
  this._loadAll = val === undefined ? true : !!val;
};

Operation.prototype.hasNextPage = function(fn){
  this._hasNextPage = fn;
};

Operation.prototype.getNextParams = function(fn){
  this._getNextParams = fn;
};

Operation.prototype.driver = function(){
  if (isFunction(this.docClient[this.methodName])) {
    return this.docClient;
  } else if (isFunction(this.docClient.service[this.methodName])) {
    return this.docClient.service;
  }
};

Operation.prototype.getNextPage = function(){

};

Operation.prototype.paginate = function(callback){

  var self = this;
  this.driver[this.methodName].call(this.driver, this.params, function(err, data) {
    var duration = Date.now() - self.startTime;

    if (err) {
      self.log({ method: self.methodName, duration: duration, err : err });
      return callback(err);
    }

    self.log({ method: self.methodName, duration: duration, data : data });
    return callback(null, data);
  });

};

Operation.prototype.exec = function(callback){
  this.startTime = Date.now();
  this.log.info({ method: this.methodName, params : this.params});

  var self = this;
  this.driver[this.methodName].call(this.driver, this.params, function(err, data) {
    var duration = Date.now() - self.startTime;

    if (err) {
      self.log({ method: self.methodName, duration: duration, err : err });
      return callback(err);
    }

    self.log({ method: self.methodName, duration: duration, data : data });
    return callback(null, data);
  });
};
