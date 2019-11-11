var aws = require('aws-sdk');
var qr = require('qr-image');
var moment = require('moment');

const bucket = '';
const id = '';
const secret = '';

exports.handler = function(event, context, callback) {
    var unixTime = moment().unix().toString();
    var fileName = unixTime + '.png';
    var code = qr.imageSync(unixTime, { type: 'png' });

    const s3Bucket = new aws.S3({
        credentials : {
            accessKeyId: id,
            secretAccessKey: secret
        }
    });
    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: code
    };
    s3Bucket.upload(params, function(err, data) {
        if (err) {
            return callback({
            statusCode: 500
            }, null);
        } else {
            return callback({
            statusCode: 200
            }, null);
        }
    });
};