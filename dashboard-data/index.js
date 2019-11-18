exports.handler = async (event, context, callback) => {
    let bestDay = await readData("select  concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) as fecha, sum(precio) as totalMejorDia from carwashschema.lavado group by  concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) order by sum(precio) desc limit 1;");
    let totalEarn = await readData("select sum(precio) as totalGeneral from carwashschema.lavado;");
    let sedesActivas = await readData("select count(sedesFuncionando) as sedesTrabajando from (select sedeid as sedesFuncionando from carwashschema.connections group by sedeid) as CantSedes;");
    let totalUsuarios = await readData("select count(userid) as usuariosRegistrados from carwashschema.usuarios;");
    let dataPrimeraGrafica = await readData("select concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) as fecha, sum(precio)::money::numeric::float8 as ganadoDiario from carwashschema.lavado group by concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) order by concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) asc;");
    let dataSegundaGrafica = await readData("select carro, count(1) from carWashSchema.lavado group by carro");
    return {
        statusCode: 200,
        mejorDia: bestDay.rows[0],
        ganado: totalEarn.rows[0],
        sedes: sedesActivas.rows[0],
        usuarios: totalUsuarios.rows[0],
        grafica1: dataPrimeraGrafica.rows,
        grafica2: dataSegundaGrafica.rows
    };
}

var readData = async (query) => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    const res = await client.query(
        query, 
        []);
    await client.end();
    return res;
};