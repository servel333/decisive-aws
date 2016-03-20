"use strict";

module.exports = function(grunt) {

  var Download = require('download');
  var fs = require('fs');
  var Promise = require('bluebird');

  grunt.registerTask('local-dynamodb-download', function(){

    grunt.file.mkdir("_bin/dynamodb_local");
    grunt.file.mkdir("_var/dynamodb");
    grunt.file.mkdir("_var/log");

    var done = this.async();

    Promise
      .bind({})

      .then(function(){

        if (fs.existsSync('_bin/dynamodb_local/DynamoDBLocal.jar')) {
          console.log('  Local DynamoDB: Exists in _bin/dynamodb_local/');
          return;
        }

        console.log('  Local DynamoDB: Downloading to _bin/dynamodb_local/');
        return Promise.fromCallback(function(callback){
          new Download({ extract: true })
            .get('http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz', '_bin/dynamodb_local')
            .run(callback);
        })
        .tap(function(files){
          console.log('  Local DynamoDB: Download complete');
        });
      })
      .then(function(files){
      })

      .then(function(){ done(); })
      .catch(done);
  });
};
