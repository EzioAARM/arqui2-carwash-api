var sha256 = require('sha256');
var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'mySecretTokenKey';

exports.handler = async (event, context, callback) => {
    let rowCount = await readData(event.username, sha256(event.password));
    if (rowCount.rows[0].count == 1) 
        return new Promise((resolve, reject) => {
            updateData(event.username)
                .then((data) => {
                    resolve({
                        statusCode: 200,
                        token: jwt.encode({
                            sub: event.username,
                            iat: moment().unix(),
                            exp: moment().add(15, "days").unix()
                        }, secret)
                    });
                })
                .catch((err) => {
                    reject({
                        statusCode: 502,
                        error: err
                    });
                });
        });
    else
        return {
            statusCode: 404
        }
}

var generarToken = (username) => {
    return 
}; 

var readData = async (username, password) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "SELECT count(*) FROM carwashschema.usuarios WHERE username = $1 AND password = $2";
    const res = await client.query(
        queryText, 
        [
            username,
            password
        ]);
    await client.end();
    return res;
};

var updateData = async (username) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "UPDATE carwashschema.usuarios SET ultimoingreso = CURRENT_TIMESTAMP WHERE username = $1";
    const res = await client.query(
        queryText, 
        [username]);
    await client.end();
};