"use strict";

module.exports = function(grunt) {

  var child_process = require('child_process');
  var fs = require('fs');
  var ps = require('ps-node');
  var Promise = require('bluebird');

  grunt.registerTask('local-dynamodb-stop', 'Stop DynamoDB Local', function(){

    var done = this.async();

    Promise
      .bind({})

      // Check if Local DynamoDB is running
      .then(function(){
        return Promise.fromCallback(function(callback){
          ps.lookup({
            command: 'java',
            psargs: 'aux',
            arguments: '_bin/dynamodb_local/DynamoDBLocal.jar',
          }, callback);
        });
      })
      .then(function(processes){
        var isDynamoRunning = 0 < processes.length;
        if (!isDynamoRunning) {
          console.log("Local Dynamo: not running");
          return;
        }

        var process = processes[0];
        console.log('Local Dynamo PID:', process.pid);

        return Promise.fromCallback(function(callback){
          ps.kill(process.pid, callback);
        })
          .then(function(){
            console.log("Local Dynamo: Stopped");
          });
      })

      .then(function(){ done(); })
      .catch(done);
  });
};
