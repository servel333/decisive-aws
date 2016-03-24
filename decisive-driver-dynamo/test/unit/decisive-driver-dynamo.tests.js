"use strict";

var _ = require('lodash');
var AWS = require('aws-sdk');
var crypto = require('crypto');
var DecisiveDriverDynamo = require('../../lib/decisive-driver-dynamo');
var Promise = require("bluebird");
var should = require('should');

var dynamoDb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  region: 'us-east-1',
  accessKeyId: '********************',
  secretAccessKey: '****************************************',
});

var docClient = new AWS.DynamoDB.DocumentClient({ service: dynamoDb });
Promise.promisifyAll(DecisiveDriverDynamo);
Promise.promisifyAll(DecisiveDriverDynamo.prototype);
Promise.promisifyAll(DecisiveDriverDynamo.Operation);
Promise.promisifyAll(DecisiveDriverDynamo.Operation.prototype);
Promise.promisifyAll(dynamoDb);
Promise.promisifyAll(docClient);
DecisiveDriverDynamo.prototype.log = function(){};
DecisiveDriverDynamo.Operation.prototype.log = function(){};

var d3 = new DecisiveDriverDynamo({ docClient: docClient });

describe("DecisiveDriverDynamo", function(){
  this.timeout(10000);

  it("#listTables", function(done){
    Promise
      .bind({})

      .then(function(){
        return d3.listTables().loadAll().execAsync();
      })
      .then(function(resp){
        // console.log('listTables =>', JSON.stringify(resp));
        resp.should.not.have.propertyByPath('LastEvaluatedTableName');
        resp.should.not.have.propertyByPath('TableNames');
        resp.should.be.Array();
        // resp.should.have.length(10);
      })

      .then(function(){ done(); })
      .catch(done);
  });

});
