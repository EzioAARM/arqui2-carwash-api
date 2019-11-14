var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'mySecretTokenKey';

exports.handler = async (event, context, callback) => {
    let userServices = await readData(event.username);
    return {
        statusCode: 200,
        informacion: userServices.rows,
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
    var queryText = "SELECT CONCAT('**** ', pagos.ultimosdigitos) AS numeroTarjeta, CASE when lavado.carro = 'g' THEN 'grande' when lavado.carro = 'm' THEN 'mediano' when lavado.carro = 'p' THEN 'pequeño' END AS CarSize, lavado.precio, lavado.fechacreacion FROM carwashschema.lavado lavado INNER JOIN carwashschema.metodospago pagos ON lavado.metodoid = pagos.metodoid INNER JOIN carwashschema.usuarios users ON users.userid = lavado.userid WHERE users.username = $1";
    const res = await client.query(
        queryText, 
        [
            username
        ]);
    await client.end();
    return res;
};