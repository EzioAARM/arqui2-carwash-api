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