CREATE TABLE Usuarios(
    userId SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimoIngreso TIMESTAMP,
    activo BOOLEAN
);

CREATE TABLE MetodosPago(
    metodoId SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES Usuarios(userId),
    nombreTarjeta VARCHAR(50) NOT NULL,
    ultimosDigitos VARCHAR(4) NOT NULL,
    fechaVencimiento VARCHAR(5) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN
);

CREATE TABLE Lavado(
    lavadoId BIGSERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES Usuarios(userId),
    metodoId INT NOT NULL REFERENCES MetodosPago(metodoId),
    qrCode VARCHAR(100) NOT NULL REFERENCES Codigos(codeId),
    carro VARCHAR(1) NOT NULL,
    faseRemojar INT NOT NULL,
    faseCepillar INT NOT NULL,
    faseEnjaguar INT NOT NULL,
    faseSecar INT NOT NULL,
    tiempoAgua INT NOT NULL,
    tiempoCepillos INT NOT NULL,
    tiempoAire INT NOT NULL,
    precio MONEY NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL
);

CREATE TABLE Sedes(
    sedeId SERIAL PRIMARY KEY,
    ubicacion VARCHAR(100) NOT NULL
);

CREATE TABLE Codigos(
    codeId VARCHAR(100) PRIMARY KEY,
    fileName VARCHAR(100) NOT NULL,
    scanFrom INT NOT NULL REFERENCES Sedes(sedeId),
    genDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);