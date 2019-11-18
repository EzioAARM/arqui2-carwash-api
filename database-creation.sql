CREATE DATABASE carwashdb;

CREATE SCHEMA carWashSchema; 

CREATE TABLE carWashSchema.Sedes(
    sedeId SERIAL PRIMARY KEY,
    ubicacion VARCHAR(100) NOT NULL
);

CREATE TABLE carWashSchema.Codigos(
    codeId VARCHAR(100) PRIMARY KEY,
    fileName VARCHAR(100) NOT NULL,
    genDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carWashSchema.Usuarios(
    userId SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimoIngreso TIMESTAMP,
    activo BOOLEAN
);

CREATE TABLE carWashSchema.MetodosPago(
    metodoId SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES carWashSchema.Usuarios(userId),
    nombreTarjeta VARCHAR(50) NOT NULL,
    ultimosDigitos VARCHAR(4) NOT NULL,
    fechaVencimiento VARCHAR(5) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN
);

CREATE TABLE carWashSchema.Lavado(
    lavadoId BIGSERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES carWashSchema.Usuarios(userId),
    metodoId INT NOT NULL REFERENCES carWashSchema.MetodosPago(metodoId),
    qrCode VARCHAR(100) NOT NULL REFERENCES carWashSchema.Codigos(codeId),
    scanFrom INT NOT NULL REFERENCES carWashSchema.Sedes(sedeId),
    carro VARCHAR(1) NOT NULL,
    faseRemojar INT NOT NULL,
    faseCepillar INT NOT NULL,
    faseEnjaguar INT NOT NULL,
    faseSecar INT NOT NULL,
    tiempoAgua INT NOT NULL,
    tiempoCepillos INT NOT NULL,
    tiempoAire INT NOT NULL,
    precio MONEY NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/*
Funcion para el dashboard
*/

/* Mejor dia */
select  concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) as fecha, sum(precio) as totalMejorDia from carwashschema.lavado group by  concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) order by sum(precio) desc limit 1;

/* Total ganado */
select sum(precio) as totalGeneral from carwashschema.lavado;

/* Sedes activas */
select count(sedesFuncionando) as sedesTrabajando from (select sedeid as sedesFuncionando from carwashschema.connections group by sedeid) as CantSedes;

/* Usuarios registrados */
select count(userid) as usuariosRegistrados from carwashschema.usuarios;

/* Primera grafica */
select concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) as fecha, sum(precio) as ganadoDiario from carwashschema.lavado group by concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) order by concat(cast(date_part('day', fechacreacion) as varchar), '/', cast(date_part('month', fechacreacion) as varchar), '/', cast(date_part('year', fechacreacion) as varchar)) asc;

/* Segunda grafica */
select carro, count(1) from carWashSchema.lavado group by carro

