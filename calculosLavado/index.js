var aws = require('aws-sdk');
var moment = require('moment');

exports.handler = function(event) {
    var carSize = 'g';
    var userid = '1';
    var metodoid = '1';
    var codigoqr = '1573499377';
    var sede = '1';
    var totalPago = 0;
    var details = {};
    var response = {};
    switch (carSize) {
        case 'g':
            details.remojo = 3;
            details.cepillado = 4;
            details.enjuage = 3;
            details.secado = 5;
            details.tiempoAgua = 2;
            details.tiempoCepillos = 3;
            details.tiempoAire = 5;
            totalPago = 55;
            break;
        case 'm':
            details.remojo = 3;
            details.cepillado = 3;
            details.enjuage = 3;
            details.secado = 4;
            details.tiempoAgua = 2;
            details.tiempoCepillos = 3;
            details.tiempoAire = 5;
            totalPago = 50;
            break;
        case 'p':
            details.remojo = 3;
            details.cepillado = 4;
            details.enjuage = 3;
            details.secado = 3;
            details.tiempoAgua = 2;
            details.tiempoCepillos = 3;
            details.tiempoAire = 5;
            totalPago = 45;
            break;
        default:
            details.remojo = 3;
            details.cepillado = 4;
            details.enjuage = 3;
            details.secado = 4;
            details.tiempoAgua = 2;
            details.tiempoCepillos = 3;
            details.tiempoAire = 5;
            totalPago = 50;
            break;
    }
    insertData([
        userid,
        metodoid,
        codigoqr,
        sede,
        carSize,
        details.remojo,
        details.cepillado,
        details.enjuage,
        details.secado,
        details.tiempoAgua,
        details.tiempoCepillos,
        details.tiempoAire,
        totalPago
    ]).then(() => {
        response = {
            statusCode: 200,
            data: details
        }
    });
    return response;
}

var insertData = async (data) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "INSERT INTO carwashschema.lavado (userid, metodoid, qrcode, scanfrom, carro, faseremojar, fasecepillar, faseenjuagar, fasesecar, tiempoagua, tiempocepillos, tiempoaire, precio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
    const res = await client.query(
        queryText, 
        data);
    await client.end();
};