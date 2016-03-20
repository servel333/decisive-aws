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

Operation.prototype.log = function(){};

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

        return Promise.fromCallback(function(callback){
          new Operation(dynamoDb, 'createTable', params)
            .exec(callback);
        });
      })
      .then(function(resp){
        // console.log('createTable =>', resp);
        resp.should.have.propertyByPath('TableDescription', 'TableName').and.equal(this.tableName);
      })

      .then(function(){
        var params = { TableName: this.tableName };

        return Promise.fromCallback(function(callback){
          new Operation(dynamoDb, 'deleteTable', params)
            .exec(callback);
        });
      })
      .then(function(resp){
        // console.log('deleteTable =>', resp);
        resp.should.have.propertyByPath('TableDescription', 'TableName').and.equal(this.tableName);
      })
      .then(function(){ done(); })
      .catch(done);
  });

  it("can paginate", function(done){
    Promise
      .bind({})

      .then(function(){
        return Promise.fromCallback(function(callback){
          dynamoDb.listTables({ Limit: 100 }, callback);
        });
      })
      .get('TableNames')
      .map(function(tableName){
        return Promise.fromCallback(function(callback){
          dynamoDb.deleteTable({ TableName: tableName }, callback);
        });
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

        return Promise.fromCallback(function(callback){
          new Operation(dynamoDb, 'createTable', params)
            .exec(callback);
        })
          .then(function(resp){
            // console.log('createTable =>', JSON.stringify(resp));
            resp.should.have.propertyByPath('TableDescription', 'TableName').and.equal(tableName);
          });
      })

      .then(function(){
        return Promise.fromCallback(function(callback){
          new Operation(dynamoDb, 'listTables', { Limit: 3 })
            .definePagination('TableNames', function(resp, params){
              if (resp && resp.LastEvaluatedTableName && resp.TableNames && resp.TableNames.length > 0){
                return { ExclusiveStartTableName: resp.LastEvaluatedTableName };
              }
            })
            .loadAll()
            .exec(callback);
        });
      })
      .then(function(resp){
        console.log('listTables =>', JSON.stringify(resp));
        resp.should.have.propertyByPath('TableNames').and.length(10);
        resp.should.not.have.propertyByPath('LastEvaluatedTableName');
      })

      // Clean the tables
      .then(function(){ return this.tableNames; })
      .map(function(tableName){
        var params = { TableName: tableName };

        return Promise.fromCallback(function(callback){
          new Operation(dynamoDb, 'deleteTable', params)
            .exec(callback);
        })
          .then(function(resp){
            // console.log('deleteTable =>', JSON.stringify(resp));
            resp.should.have.propertyByPath('TableDescription', 'TableName').and.equal(tableName);
          });
      })

      .then(function(){ done(); })
      .catch(done);
  });

});
