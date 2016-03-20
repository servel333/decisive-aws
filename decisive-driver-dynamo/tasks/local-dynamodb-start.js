"use strict";

module.exports = function(grunt) {

  var child_process = require('child_process');
  var fs = require('fs');
  var ps = require('ps-node');
  var Promise = require('bluebird');

  grunt.registerTask('local-dynamodb-start', function(){

    grunt.file.mkdir("_bin/dynamodb_local");
    grunt.file.mkdir("_var/dynamodb");
    grunt.file.mkdir("_var/log");

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
        this.isDynamoRunning = 0 < processes.length;
      })

      // Start Local DynamoDB if it's not running
      .then(function(){

        if (this.isDynamoRunning) {
          console.log('  Local DynamoDB: Already running');
          return;
        }

        console.log('  Local DynamoDB: Starting...');
        this.child_out = fs.openSync('_var/log/DynamoDBLocal.log', 'a');
        this.child_err = fs.openSync('_var/log/DynamoDBLocal.log', 'a');

        this.child = child_process.spawn('java', [
          '-Djava.library.path=_bin/dynamodb_local/DynamoDBLocal_lib',
          '-jar', '_bin/dynamodb_local/DynamoDBLocal.jar',
          '-sharedDb',
          '-dbPath', '_var/dynamodb/',
          '-port', '8000',
        ], {
          detached: true,
          stdio: [ 'ignore', this.child_out, this.child_err ],
          env: process.env,
        });

        this.child.unref();

        console.log('  Local DynamoDB: Started');

        var self = this;
        return Promise.fromCallback(function(callback){
          fs.writeFile('_var/dynamodb.pid', self.child.pid, {}, callback);
        });
      })
      .then(function(){
        console.log('    Logs writen to: _var/log/DynamoDBLocal.log');
        console.log('    PID written to: _var/dynamodb.pid');
      })

      .then(function(){ done(); })
      .catch(done);
  });
};
