var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'mySecretTokenKey';

exports.handler = async (event, context, callback) => {
    let userData = await readData(event.username);
    return {
        statusCode: 200,
        informacion: userData.rows[0],
        token: jwt.encode({
            sub: 'julitapineda',
            iat: moment().unix(),
            exp: moment().add(15, "days").unix()
        }, secret)
    };
}

var readData = async (username) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "SELECT nombre, apellido, username, email FROM carwashschema.usuarios WHERE username = $1 AND activo = true";
    const res = await client.query(
        queryText, 
        [
            username
        ]);
    await client.end();
    return res;
};