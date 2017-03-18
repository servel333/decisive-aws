"use strict";

var _ = require('lodash');
var AWS = require('aws-sdk');
var crypto = require('crypto');
var DecisiveDriverDynamo = require('../../lib/decisive-driver-dynamo');
var DecisiveSupport = require("decisive-support");
var Promise = require("bluebird");
var should = require('should');

var dynamoDb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  region: 'us-east-1',
  accessKeyId: '********************',
  secretAccessKey: '****************************************',
});

var docClient = new AWS.DynamoDB.DocumentClient({ service: dynamoDb });
Promise.promisifyAll(DecisiveDriverDynamo.prototype);
Promise.promisifyAll(DecisiveDriverDynamo.Operation.prototype);
Promise.promisifyAll(dynamoDb);
Promise.promisifyAll(docClient);
DecisiveSupport.setDefaultLogger(DecisiveSupport.ConsoleLogger);

var d3 = new DecisiveDriverDynamo({ docClient: docClient });

describe("DecisiveDriverDynamo", function(){
  this.timeout(10000);

  describe("#createTable", function(){

    it("Create a basic table", function(done){
      return d3
        .createTable({
          tableName: "TEST_"+crypto.randomBytes(16).toString("hex"),
          key: "_id",
          columns: { _id: String },
          readCapacity: 2,
          writeCapacity: 2,
        })
        .execAsync()
        .then(function(resp){
          console.log('createTable =>', JSON.stringify(resp));
          resp.should.not.have.propertyByPath('TableDescription');
          resp.should.be.Array();
          // resp.should.have.length(10);
        })
        .then(function(){ done(); })
        .catch(done);
    });

  });

  describe("#listTables", function(){

    it("List first page of tables", function(done){
      return d3
        .listTables()
        .execAsync()
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

    it("List all tables", function(done){
      return d3
        .listTables()
        .loadAll()
        .execAsync()
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

  describe("#findTable", function(){
  });

  describe("#updateTable", function(){
  });

  describe("#destroyTable", function(){
  });

  describe("#createItem", function(){
  });

  describe("#listItems", function(){
  });

  describe("#findItem", function(){
  });

  describe("#findItems", function(){
  });

  describe("#updateItem", function(){
  });

  describe("#destroyItem", function(){
  });

});
