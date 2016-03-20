"use strict";

module.exports = function(grunt) {

  grunt.registerTask('local-dynamodb', [
    'local-dynamodb-download',
    'local-dynamodb-start',
  ]);

  // var _ = require('lodash');
  // // var AWS = require('aws-sdk');
  // var Download = require('download');
  // var child_process = require('child_process');
  // var fs = require('fs');
  // // var moment = require('moment');
  // // var path = require('path');
  // var ps = require('ps-node');
  // var Promise = require('bluebird');

  // var isRunning = function (pid) {
  //   try {
  //     return process.kill(pid,0);
  //   }
  //   catch (e) {
  //     return e.code === 'EPERM';
  //   }
  // };

  // grunt.registerTask('__boot-local-dynamodb', function(){

  //   grunt.file.mkdir("_bin/dynamodb_local");
  //   grunt.file.mkdir("_var/dynamodb");
  //   grunt.file.mkdir("_var/log");

  //   var done = this.async();

  //   Promise
  //     .bind({})

  //     .then(function(){

  //       if (fs.existsSync('_bin/dynamodb_local/DynamoDBLocal.jar')) {
  //         console.log('  Local DynamoDB: Already downloaded');
  //         return;
  //       }

  //       console.log('  Local DynamoDB: Downloading...');
  //       return Promise.fromCallback(function(callback){
  //         new Download({ extract: true })
  //           .get('http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz', '_bin/dynamodb_local')
  //           .run(callback);
  //       })
  //       .tap(function(files){
  //         console.log('  Local DynamoDB: Download complete');
  //       });
  //     })
  //     .then(function(files){
  //     })

  //     // Check if Local DynamoDB is running
  //     .then(function(){
  //       return Promise.fromCallback(function(callback){
  //         ps.lookup({
  //           command: 'java',
  //           psargs: 'aux',
  //           arguments: '_bin/dynamodb_local/DynamoDBLocal.jar',
  //         }, callback);
  //       });
  //     })
  //     // .tap(function(processes){
  //     //   if (processes.length === 0) {
  //     //     console.log('  Local DynamoDB is not running');
  //     //     return;
  //     //   }

  //     //   processes.forEach(function(process){
  //     //     if (process) {
  //     //       console.log('  PID:', process.pid);
  //     //       console.log('    command:', process.command);
  //     //       console.log('    arguments:', process.arguments);
  //     //       console.log('    PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
  //     //     }
  //     //   });
  //     // })
  //     .then(function(processes){
  //       this.isDynamoRunning = 0 < processes.length;
  //     })

  //     // .then(function(){
  //     //   if (fs.existsSync('_var/dynamodb.pid')) {
  //     //     var pid = fs.readFileSync('_var/dynamodb.pid').toString();
  //     //     console.log('  PID:', pid);
  //     //     this.isDynamoRunning = isRunning(pid);
  //     //   }
  //     //   else {
  //     //     this.isDynamoRunning = false;
  //     //   }
  //     // })

  //     // Start Local DynamoDB if it's not running
  //     .then(function(){

  //       if (this.isDynamoRunning) {
  //         console.log('  Local DynamoDB: Already running');
  //         return;
  //       }

  //       console.log('  Local DynamoDB: Starting...');
  //       this.child_out = fs.openSync('_var/log/DynamoDBLocal.log', 'a');
  //       this.child_err = fs.openSync('_var/log/DynamoDBLocal.log', 'a');

  //       this.child = child_process.spawn('java', [
  //         '-Djava.library.path=_bin/dynamodb_local/DynamoDBLocal_lib',
  //         '-jar', '_bin/dynamodb_local/DynamoDBLocal.jar',
  //         '-sharedDb',
  //         '-dbPath', '_var/dynamodb/',
  //         '-port', '8000',
  //       ], {
  //         detached: true,
  //         stdio: [ 'ignore', this.child_out, this.child_err ],
  //         env: process.env,
  //       });

  //       this.child.unref();

  //       console.log('  Local DynamoDB: Started');

  //       var self = this;
  //       return Promise.fromCallback(function(callback){
  //         fs.writeFile('_var/dynamodb.pid', self.child.pid, {}, callback);
  //       });
  //     })
  //     .then(function(){
  //       console.log('    Logs writen to: _var/log/DynamoDBLocal.log');
  //       console.log('    PID written to: _var/dynamodb.pid');
  //     })

  //     .then(function(){ done(); })
  //     .catch(done);
  // });
};
