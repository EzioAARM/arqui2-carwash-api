var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'mySecretTokenKey';

exports.handler = async (event, context, callback) => {
    let paymentMethods = await readData(event.username);
    return {
        statusCode: 200,
        informacion: paymentMethods.rows,
        token: jwt.encode({
            sub: event.username,
            iat: moment().unix(),
            exp: moment().add(15, "days").unix()
        }, secret)
    };
}

var readData = async (username) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "SELECT metodoid, nombretarjeta, ultimosdigitos, fechavencimiento, tipo FROM carwashschema.metodospago pago INNER JOIN carwashschema.usuarios users ON pago.userid = users.userid WHERE users.username = $1";
    const res = await client.query(
        queryText, 
        [
            username
        ]);
    await client.end();
    return res;
};