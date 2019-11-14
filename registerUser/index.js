var sha256 = require('sha256');

exports.handler = async (event) => {
    let existe = await readData(event.username);
    if (existe.rows[0].count == 1) {
        return {
            statusCode: 409
        }
    } else {
        return new Promise((resolve, reject) => {
            insertData(event.nombre, event.apellido, event.username, event.password, event.email, true)
                .then(() => {
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
        });
    }
};

var readData = async (username) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "SELECT count(*) FROM carwashschema.usuarios WHERE username = $1";
    const res = await client.query(
        queryText, 
        [
            username
        ]);
    await client.end();
    return res;
};

var insertData = async (nombre, apellido, username, password, email, activo) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    var queryText = "INSERT INTO carwashschema.usuarios (nombre, apellido, username, password, email, activo) VALUES ($1, $2, $3, $4, $5, $6)";
    const res = await client.query(
        queryText, 
        [
            nombre, apellido, username, sha256(password), email, activo
        ]);
    await client.end();
};