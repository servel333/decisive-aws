"use strict";

exports.isString = function(s){
  return typeof s === 'string' || s instanceof String;
};
