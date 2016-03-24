# Decisive Driver for AWS DynamoDB

Wrapper around AWS DynamoDB functionality to standardize interface and allow alternative back ends.

# Example

    var DecisiveDriverDynamo = require("decisive-driver-dynamo");

# Running tests


# Promisifing

    var DecisiveDriverDynamo = require("decisive-driver-dynamo");
    var Promise = require("bluebird");

    Promise.promisifyAll(DecisiveDriverDynamo.prototype);
    Promise.promisifyAll(DecisiveDriverDynamo.Operation.prototype);

# Logging

    var DecisiveDriverDynamo = require("decisive-driver-dynamo");
    DecisiveDriverDynamo.setDefaultLogger(DecisiveDriverDynamo.ConsoleLogger);
    DecisiveDriverDynamo.Operation.setDefaultLogger(DecisiveDriverDynamo.ConsoleLogger);
