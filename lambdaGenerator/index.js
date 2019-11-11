var aws = require('aws-sdk');
var qr = require('qr-image');
var moment = require('moment');

const bucket = 'qrCodes';
const id = '';
const secret = '';

exports.handler = function(event, context, callback) {
    var unixTime = moment().unix().toString();
    var fileName = unixTime + '.png';
    var code = qr.imageSync(unixTime, { type: 'png' });
    var response;
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
            response = {
                statusCode: 500,
                error: err
            };
        } else {
            insertData(unixTime, fileName)
                .then(() => {
                    console.log('termino');
                    response = {
                        statusCode: 200
                    };
                });
        }
    });
    return response;
};

var insertData = async (unT, fNa) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "INSERT INTO carwashschema.codigos (codeid, filename) VALUES ($1, $2)";
    const res = await client.query(
        queryText, 
        [unT, fNa]);
    await client.end();
};