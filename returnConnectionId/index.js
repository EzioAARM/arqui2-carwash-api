const aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    var conId = event.connectionId;
    callback(null, conId);
};
