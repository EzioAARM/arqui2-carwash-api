var aws = require('aws-sdk');
var qr = require('qr-image');
var moment = require('moment');

const bucket = 'lambda-coding';
const id = '';
const secret = '';

exports.handler = async function(event, context, callback) {
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
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, function(err, data) {
            if (err) {
                reject({
                    statusCode: 502,
                    error: err
                });
            } else {
                insertData(unixTime, fileName)
                    .then((err, data) => {
                        if (err) 
                        reject({
                            statusCode: 502,
                            error: err
                        });
                        else
                        resolve({
                            statusCode: 200
                        });
                    });
            }
        });
    });
    
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