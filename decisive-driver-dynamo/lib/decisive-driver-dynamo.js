"use strict";

var AWS = require("aws-sdk");

var isFunction = function isFunction(val) {
  return val && {}.toString.call(val) === '[object Function]';
};

var DecisiveDriverDynamo = module.exports = function DecisiveDriverDynamo(config){
  config = config || {};
  this._dynamoDb = config.dynamoDb || config.docClient && config.docClient.service || new AWS.DynamoDB(config.options || {});
  this._docClient = config.docClient || new AWS.DynamoDB.DocumentClient({ service: this._dynamoDb });
  this._logger = new DecisiveDriverDynamo.SilentLogger();
};

DecisiveDriverDynamo.Operation = require("./operation");
DecisiveDriverDynamo.ConsoleLogger = require("./console-logger");
DecisiveDriverDynamo.SilentLogger = require("./silent-logger");

DecisiveDriverDynamo.prototype.setLogger = function(logger){
  this._logger = logger;
};

// The DeleteTable operation deletes a table and all of its items.
// this._dynamoDb.deleteTable(params = {}, callback) ⇒ AWS.Request

// Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.
// this._dynamoDb.describeTable(params = {}, callback) ⇒ AWS.Request

// Returns an array of table names associated with the current account and endpoint.
// this._dynamoDb.listTables(params = {}, callback) ⇒ AWS.Request

// Modifies the provisioned throughput settings, global secondary indexes, or DynamoDB Streams settings for a given table.
// this._dynamoDb.updateTable(params = {}, callback) ⇒ AWS.Request

DecisiveDriverDynamo.prototype.createTable = function(options){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'createTable', arguments: arguments });

  var params = {

    // An array of attributes that describe the key schema for the table and indexes.
    AttributeDefinitions: [
      {
        AttributeName: "",
        AttributeType: "S | N | B"
      },
    ],

    // The name of the table to create.
    TableName: options.tableName,

    KeySchema: [
      { AttributeName: options.key, KeyType: "HASH" }, // "partition key" or "hash attribute"
      { AttributeName: options.sortKey, KeyType: "RANGE" }, // "sort key" or "range attribute"
    ],

  };

  params.KeySchema = [];

  var HashKey =
    options.key ||
    options.hashKey;

  params.KeySchema.push({ AttributeName: HashKey, KeyType: "HASH" });

  var ReadCapacityUnits =
    options.ProvisionedThroughput !== undefined &&
    options.ProvisionedThroughput.ReadCapacityUnits !== undefined ||
    options.ReadCapacityUnits !== undefined ||
    options.readCapacity !== undefined;

  var WriteCapacityUnits =
    options.ProvisionedThroughput !== undefined &&
    options.ProvisionedThroughput.WriteCapacityUnits !== undefined ||
    options.WriteCapacityUnits !== undefined ||
    options.writeCapacity !== undefined;

  if (ReadCapacityUnits || WriteCapacityUnits) {
    params.ProvisionedThroughput = {};
  }

  if (ReadCapacityUnits) {
    params.ProvisionedThroughput.ReadCapacityUnits = ReadCapacityUnits;
  }

  if (WriteCapacityUnits) {
    params.ProvisionedThroughput.WriteCapacityUnits = WriteCapacityUnits;
  }

  // params.GlobalSecondaryIndexes = [];
  // {
  //   IndexName: 'STRING_VALUE', /* required */
  //   KeySchema: [ /* required */
  //     {
  //       AttributeName: 'STRING_VALUE', /* required */
  //       KeyType: 'HASH | RANGE' /* required */
  //     },
  //   ],
  //   Projection: { /* required */
  //     NonKeyAttributes: [
  //       'STRING_VALUE',
  //       /* more items */
  //     ],
  //     ProjectionType: 'ALL | KEYS_ONLY | INCLUDE'
  //   },
  //   ProvisionedThroughput: { /* required */
  //     ReadCapacityUnits: 0, /* required */
  //     WriteCapacityUnits: 0 /* required */
  //   }
  // },

  // params.LocalSecondaryIndexes = [];
  // {
  //   IndexName: 'STRING_VALUE', /* required */
  //   KeySchema: [ /* required */
  //     {
  //       AttributeName: 'STRING_VALUE', /* required */
  //       KeyType: 'HASH | RANGE' /* required */
  //     },
  //     /* more items */
  //   ],
  //   Projection: { /* required */
  //     NonKeyAttributes: [
  //       'STRING_VALUE',
  //       /* more items */
  //     ],
  //     ProjectionType: 'ALL | KEYS_ONLY | INCLUDE'
  //   }
  // },

  if (options.streamType !== undefined) {
    params.StreamSpecification = {};
    // The settings for DynamoDB Streams on the table. These settings consist of:
    params.StreamSpecification.StreamEnabled = !!options.streamType;
    switch(options.streamType) {
      case "new":
        params.StreamSpecification.StreamViewType = "NEW_IMAGE";
        break;
      case "old":
        params.StreamSpecification.StreamViewType = "OLD_IMAGE";
        break;
      case "both":
        params.StreamSpecification.StreamViewType = "NEW_AND_OLD_IMAGES";
        break;
      case "keys":
        params.StreamSpecification.StreamViewType = "KEYS_ONLY";
        break;
      default:
        params.StreamSpecification.StreamViewType = options.streamType;
    }
  }

  return new DecisiveDriverDynamo.Operation(this._docClient, "createTable", params)
    .setHasNextPage(function(params, resp){
      return resp.LastEvaluatedTableName;
    })
    .setGetNextParams(function(params, resp){
      return { ExclusiveStartTableName: resp.LastEvaluatedTableName };
    });
};

DecisiveDriverDynamo.prototype.listTables = function(){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'listTables', arguments: arguments });
  return new DecisiveDriverDynamo.Operation()
    .setDocClient(this._docClient)
    .setMethodName('listTables')
    .setParams({ Limit: 100 })
    .setItemsProperty('TableNames')
    .setGetNextParams(function(resp, params){
      if (resp && resp.LastEvaluatedTableName && resp.TableNames && resp.TableNames.length > 0){
        return { ExclusiveStartTableName: resp.LastEvaluatedTableName };
      }
    });
};

DecisiveDriverDynamo.prototype.findTable = function(query, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'findTable', arguments: arguments });

};

DecisiveDriverDynamo.prototype.updateTable = function(query, update, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'updateTable', arguments: arguments });

  var params = {

    TableName: 'STRING_VALUE', /* required */
    AttributeDefinitions: [
      {
        AttributeName: 'STRING_VALUE', /* required */
        AttributeType: 'S | N | B' /* required */
      },
      /* more items */
    ],
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: 'STRING_VALUE', /* required */
          KeySchema: [ /* required */
            {
              AttributeName: 'STRING_VALUE', /* required */
              KeyType: 'HASH | RANGE' /* required */
            },
            /* more items */
          ],
          Projection: { /* required */
            NonKeyAttributes: [
              'STRING_VALUE',
              /* more items */
            ],
            ProjectionType: 'ALL | KEYS_ONLY | INCLUDE'
          },
          ProvisionedThroughput: { /* required */
            ReadCapacityUnits: 0, /* required */
            WriteCapacityUnits: 0 /* required */
          }
        },
        Delete: {
          IndexName: 'STRING_VALUE' /* required */
        },
        Update: {
          IndexName: 'STRING_VALUE', /* required */
          ProvisionedThroughput: { /* required */
            ReadCapacityUnits: 0, /* required */
            WriteCapacityUnits: 0 /* required */
          }
        }
      },
      /* more items */
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 0, /* required */
      WriteCapacityUnits: 0 /* required */
    },
    StreamSpecification: {
      StreamEnabled: true || false,
      StreamViewType: 'NEW_IMAGE | OLD_IMAGE | NEW_AND_OLD_IMAGES | KEYS_ONLY'
    }
  };

  return this.exec("updateTable", params, cb);
};

DecisiveDriverDynamo.prototype.destroyTable = function(query, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'destroyTable', arguments: arguments });
  var params = { TableName: query.tableName };
  return this.exec("createTable", params, cb);
};



DecisiveDriverDynamo.prototype.createItem = function(attrs, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'createItem', arguments: arguments });

};

DecisiveDriverDynamo.prototype.listItems = function(query, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'listItems', arguments: arguments });

};

DecisiveDriverDynamo.prototype.findItem = function(query, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'findItem', arguments: arguments });

};

DecisiveDriverDynamo.prototype.findItems = function(query, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'findItems', arguments: arguments });

};

DecisiveDriverDynamo.prototype.updateItem = function(query, update, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'updateItem', arguments: arguments });

};

DecisiveDriverDynamo.prototype.destroyItem = function(query, options, cb){
  this._logger.trace({ class: 'DecisiveDriverDynamo', function: 'destroyItem', arguments: arguments });

};

/////////////////
// AWS.DynamoDB

// Account operations

// Returns the current provisioned-capacity limits for your AWS account in a region, both for the region as a whole and for any one DynamoDB table that you create there.
// this._dynamoDb.describeLimits(params = {}, callback) ⇒ AWS.Request

// Table operations

// Item operations

// The BatchGetItem operation returns the attributes of one or more items from one or more tables.
// this._dynamoDb.batchGetItem(params = {}, callback) ⇒ AWS.Request

// The BatchWriteItem operation puts or deletes multiple items in one or more tables.
// this._dynamoDb.batchWriteItem(params = {}, callback) ⇒ AWS.Request

// Deletes a single item in a table by primary key.
// this._dynamoDb.deleteItem(params = {}, callback) ⇒ AWS.Request

// The GetItem operation returns a set of attributes for the item with the given primary key.
// this._dynamoDb.getItem(params = {}, callback) ⇒ AWS.Request

// Creates a new item, or replaces an old item with a new item.
// this._dynamoDb.putItem(params = {}, callback) ⇒ AWS.Request

// A Query operation uses the primary key of a table or a secondary index to directly access items from that table or index.
// this._dynamoDb.query(params = {}, callback) ⇒ AWS.Request

// The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index.
// this._dynamoDb.scan(params = {}, callback) ⇒ AWS.Request

// Edits an existing item's attributes, or adds a new item to the table if it does not already exist.
// this._dynamoDb.updateItem(params = {}, callback) ⇒ AWS.Request

// Waits for a given DynamoDB resource.
// this._dynamoDb.waitFor(state, params = {}, callback) ⇒ AWS.Request

////////////////////////////////
// AWS.DynamoDB.DocumentClient

// Utils

// Creates a set of elements inferring the type of set from the type of the first element.
// this._docClient.createSet(list, options) ⇒ void

// Item operations

// Returns the attributes of one or more items from one or more tables by delegating to AWS.DynamoDB.batchGetItem().
// this._docClient.batchGet(params, callback) ⇒ AWS.Request

// Puts or deletes multiple items in one or more tables by delegating to AWS.DynamoDB.batchWriteItem().
// this._docClient.batchWrite(params, callback) ⇒ AWS.Request

// Deletes a single item in a table by primary key by delegating to AWS.DynamoDB.deleteItem().
// this._docClient.delete(params, callback) ⇒ AWS.Request

// Returns a set of attributes for the item with the given primary key by delegating to AWS.DynamoDB.getItem().
// this._docClient.get(params, callback) ⇒ AWS.Request

// Creates a new item, or replaces an old item with a new item by delegating to AWS.DynamoDB.putItem().
// this._docClient.put(params, callback) ⇒ AWS.Request

// Directly access items from a table by primary key or a secondary index.
// this._docClient.query(params, callback) ⇒ AWS.Request

// Returns one or more items and item attributes by accessing every item in a table or a secondary index.
// this._docClient.scan(params, callback) ⇒ AWS.Request

// Edits an existing item's attributes, or adds a new item to the table if it does not already exist by delegating to AWS.DynamoDB.updateItem().
// this._docClient.update(params, callback) ⇒ AWS.Request
