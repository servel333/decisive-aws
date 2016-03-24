"use strict";

var _ = require('lodash');
var AWS = require('aws-sdk');
var crypto = require('crypto');
var Operation = require('../../lib/operation');
var Promise = require("bluebird");
var should = require('should');

var dynamoDb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  region: 'us-east-1',
  accessKeyId: '********************',
  secretAccessKey: '****************************************',
});

var docClient = new AWS.DynamoDB.DocumentClient({ service: dynamoDb });
Promise.promisifyAll(Operation);
Promise.promisifyAll(Operation.prototype);
Promise.promisifyAll(dynamoDb);

describe("Operation", function(){

  it("can create and delete tables", function(done){
    Promise
      .bind({})

      .then(function(){
        var tableName = this.tableName = 'TEST_'+crypto.randomBytes(16).toString('hex');
        var params = {
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: '_id', AttributeType: 'S', },
          ],
          KeySchema: [
            { AttributeName: '_id', KeyType: 'HASH' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        };

        return new Operation()
          .setDocClient(docClient)
          .setMethodName('createTable')
          .setParams(params)
          .setItemProperty('TableDescription')
          .execAsync();
      })
      .then(function(resp){
        // console.log('createTable =>', resp);
        resp.should.have.propertyByPath('TableName').and.equal(this.tableName);
      })

      .then(function(){
        var params = { TableName: this.tableName };

        return new Operation()
          .setDocClient(docClient)
          .setMethodName('deleteTable')
          .setParams(params)
          .setItemProperty('TableDescription')
          .execAsync();
      })
      .then(function(resp){
        // console.log('deleteTable =>', resp);
        resp.should.have.propertyByPath('TableName').and.equal(this.tableName);
      })
      .then(function(){ done(); })
      .catch(done);
  });

  it("can paginate", function(done){
    Promise
      .bind({})

      // Clean any previous tables
      .then(function(){
        return dynamoDb.listTablesAsync({ Limit: 100 });
      })
      .get('TableNames')
      .map(function(tableName){
        return dynamoDb.deleteTableAsync({ TableName: tableName });
      })
      .then(function(resp){
      })

      .then(function(){
        this.tableNames = _(10).times().map(function(index){
          return 'TEST_'+index+'_'+crypto.randomBytes(16).toString('hex');
        });
      })

      // Create a bunch of tables to paginate over
      .then(function(){ return this.tableNames; })
      .map(function(tableName){
        var params = {
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: '_id', AttributeType: 'S', },
          ],
          KeySchema: [
            { AttributeName: '_id', KeyType: 'HASH' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        };

        return new Operation()
          .setDocClient(docClient)
          .setMethodName('createTable')
          .setParams(params)
          .setItemProperty('TableDescription')
          .execAsync()
          .tap(function(resp){
            // console.log('createTable =>', JSON.stringify(resp));
            resp.should.have.propertyByPath('TableName').and.equal(tableName);
          });
      })

      // Test loadAll function
      .then(function(){
        return new Operation()
          .setDocClient(docClient)
          .setMethodName('listTables')
          .setParams({ Limit: 3 })
          .setItemsProperty('TableNames')
          .setGetNextParams(function(resp, params){
            if (resp && resp.LastEvaluatedTableName && resp.TableNames && resp.TableNames.length > 0){
              return { ExclusiveStartTableName: resp.LastEvaluatedTableName };
            }
          })
          .loadAll()
          .execAsync();
      })
      .then(function(resp){
        // console.log('listTables =>', JSON.stringify(resp));
        resp.should.not.have.propertyByPath('LastEvaluatedTableName');
        resp.should.not.have.propertyByPath('TableNames');
        resp.should.have.length(10);
      })

      // Clean the tables
      .then(function(){ return this.tableNames; })
      .map(function(tableName){
        return dynamoDb.deleteTableAsync({ TableName: tableName });
      })

      .then(function(){ done(); })
      .catch(done);
  });

});
