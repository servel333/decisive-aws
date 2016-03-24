"use strict";

module.exports = function(grunt) {

  grunt.registerTask('local-dynamodb', 'Download and start local DynamoDB', [
    'local-dynamodb-download',
    'local-dynamodb-start',
  ]);

};
