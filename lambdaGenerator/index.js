var aws = require('aws-sdk');
var qr = require('qr-image');
var moment = require('moment');
const axios = require('axios');

const bucket = 'qrcodes-carwash';
const id = 'AKIA4XYGNBVQYHB7NBBU';
const secret = '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';

exports.handler = async function(event, context, callback) {
    var unixTime = moment().unix().toString();
    var fileName = unixTime + '.png';
    var codigoAnterior = event.codigo;
    var sede = event.sede
    var user = event.userId;
    var pago = event.idPago;
    var code = qr.imageSync(unixTime + ',' + sede, { type: 'png', size : 30 });
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
    var sedeConnection = new Promise((resolve, reject) => {
        readData(sede)
            .then((data) => {
                resolve(data.rows[0].connectionid);
            });
    });
    let conId = await sedeConnection;
    console.log(conId);
    const dataToSend = {
        userId: user,
        metodoPago: pago,
        codigoLeido: codigoAnterior,
        sedeId: sede
    };
    axios.post('https://iib2b26n9c.execute-api.us-east-1.amazonaws.com/test/@connections', dataToSend)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, function(err, data) {
            if (err) {
                reject({
                    statusCode: 502,
                    error: err
                });
            } else {
                insertData(unixTime, fileName)
                    .then((data) => {
                        resolve({
                            statusCode: 200,
                            leido: codigoAnterior
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

var readData = async (sede) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "SELECT connectionid FROM carwashschema.connections WHERE sedeid = $1";
    const res = await client.query(
        queryText, 
        [sede]);
    await client.end();
    return res;
};