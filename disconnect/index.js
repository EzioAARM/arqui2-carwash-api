var aws = require('aws-sdk');

exports.handler = async function(event, context, callback) {
    var datos = event.connectionId;
    return new Promise((resolve, reject) => {
        try {
            deleteData(datos)
            .then((err, data) => {
                if (err)
                    reject({
                        statusCode: 500,
                        error: err
                    });
                else
                    resolve({
                        statusCode: 200
                    });
            })
            .catch((err) => {
                reject({
                    statusCode: 500,
                    error: err
                });
            });
        } catch (err) {
            reject({
                statusCode: 500,
                error: err
            });
        }
    });
};

var deleteData = async (con) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "DELETE FROM carwashschema.connections WHERE connectionid = '" + con + "'";
    const res = await client.query(
        queryText, 
        []);
    await client.end();
};