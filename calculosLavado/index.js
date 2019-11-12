var aws = require('aws-sdk');
var moment = require('moment');

exports.handler = async function(event, context, callback) {
    var recivedSize = event.carSizeBin;
    var carSize = 'm';
    if (recivedSize == '01110' || recivedSize == '11100' || recivedSize == '00111') {
        carSize = 'p';
    } else if (recivedSize == '11110' || recivedSize == '01111') {
        carSize = 'm';
    } else if (recivedSize == '11111') {
        carSize = 'g';
    }
    var userid = event.user;
    var metodoid = event.paymentMethod;
    var codigoqr = event.scannedCode;
    var sede = event.sede;
    var totalPago = 0;
    var details = {};
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
    console.log(details);
    return new Promise((resolve, reject) => {
        try {
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
            ]).then((err, data) => {
                if (err)
                    reject({
                        statusCode: 502,
                        error: err
                    });
                else
                    resolve({
                        statusCode: 200,
                        data: details,
                        pago: totalPago
                    });
            })
            .catch((err) => {
                reject({
                    statusCode: 502,
                    error: err
                });
            });
        } catch (e) {
            reject({
                statusCode: 502,
                error: e
            });
        }
    });
    
}

var insertData = async (data) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "INSERT INTO carwashschema.lavado (userid, metodoid, qrcode, scanfrom, carro, faseremojar, fasecepillar, faseenjaguar, fasesecar, tiempoagua, tiempocepillos, tiempoaire, precio) VALUES (" + data[0] + ", " + data[1] + ", '" + data[2] + "', " + data[3] + ", '" + data[4] + "', " + data[5] + ", " + data[6] + ", " + data[7] + ", " + data[8] + ", " + data[9] + ", " + data[10] + ", " + data[11] + ", " + data[12] + ")";
    console.log(queryText);
    const res = await client.query(
        queryText, 
        []);
    await client.end();
};