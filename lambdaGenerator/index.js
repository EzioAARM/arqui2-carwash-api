var aws = require('aws-sdk');
var qr = require('qr-image');
var moment = require('moment');

const bucket = 'qrCodes';
const id = '';
const secret = '';

exports.handler =  async function(event, context, callback) {
    var unixTime = moment().unix().toString();
    var code = qr.image(unixTime, { type: 'png' });
    const s3Bucket = new aws.S3({
        accessKeyId: id,
        secretAccessKey: secret
    });
    const params = {
        Bucket: bucket,
        Key: unixTime + '.png',
        Body: code
    };
    s3Bucket.upload(params, (err, data) => {
        if (err) callback(err, null);
        callback(null, {
            statusCode: 200
        });
    });
}