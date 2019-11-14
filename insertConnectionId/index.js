var aws = require('aws-sdk');

exports.handler = async function(event, context, callback) {
    var datos = event.body;return new Promise((resolve, reject) => {
        try {
            insertData(datos.sedeId, datos.connectionId)
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

var insertData = async (sede, con) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "INSERT INTO carwashschema.connections (connectionid, sedeid) VALUES ('" + con + "', " + sede + ")";
    const res = await client.query(
        queryText, 
        []);
    await client.end();
};