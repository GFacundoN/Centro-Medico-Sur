-- =====================================================
-- Centro Médico Sur - Base de Datos
-- =====================================================

DROP DATABASE IF EXISTS centro_medico_sur;
CREATE DATABASE centro_medico_sur;
USE centro_medico_sur;

-- =====================================================
-- Tabla: Usuario
-- =====================================================
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('recepcion', 'profesional', 'admin', 'director') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Tabla: Sector
-- =====================================================
CREATE TABLE Sector (
    id_sector INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- =====================================================
-- Tabla: Profesional
-- =====================================================
CREATE TABLE Profesional (
    id_profesional INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- =====================================================
-- Tabla: Consultorio
-- =====================================================
CREATE TABLE Consultorio (
    id_consultorio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_sector INT NOT NULL,
    FOREIGN KEY (id_sector) REFERENCES Sector(id_sector) ON DELETE CASCADE
);

-- =====================================================
-- Tabla: Paciente
-- =====================================================
CREATE TABLE Paciente (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Tabla: ListaEspera
-- =====================================================
CREATE TABLE ListaEspera (
    id_lista INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa', 'asignada', 'cancelada') NOT NULL DEFAULT 'activa',
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente) ON DELETE CASCADE
);

-- =====================================================
-- Tabla: Turno
-- =====================================================
CREATE TABLE Turno (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    id_agenda INT NOT NULL,
    id_paciente INT,
    descripcion VARCHAR(255),
    fecha_hora DATETIME NOT NULL,
    duracion_min INT NOT NULL DEFAULT 30,
    estado ENUM('reservado', 'confirmado', 'cancelado', 'atendido', 'no-show') NOT NULL DEFAULT 'reservado',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Tabla: Agenda
-- =====================================================
CREATE TABLE Agenda (
    id_agenda INT AUTO_INCREMENT PRIMARY KEY,
    id_profesional INT NOT NULL,
    id_consultorio INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_turno_min INT NOT NULL DEFAULT 30,
    FOREIGN KEY (id_profesional) REFERENCES Profesional(id_profesional) ON DELETE CASCADE,
    FOREIGN KEY (id_consultorio) REFERENCES Consultorio(id_consultorio) ON DELETE CASCADE
);

-- Agregar la foreign key de Turno a Agenda después de crear Agenda
ALTER TABLE Turno 
ADD FOREIGN KEY (id_agenda) REFERENCES Agenda(id_agenda) ON DELETE CASCADE,
ADD FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente) ON DELETE SET NULL;

-- =====================================================
-- Tabla: Emergencia
-- =====================================================
CREATE TABLE Emergencia (
    id_emergencia INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_profesional INT,
    id_consultorio INT,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255) NOT NULL,
    estado ENUM('activa', 'en_atencion', 'atendida', 'derivada') NOT NULL DEFAULT 'activa',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_profesional) REFERENCES Profesional(id_profesional) ON DELETE SET NULL,
    FOREIGN KEY (id_consultorio) REFERENCES Consultorio(id_consultorio) ON DELETE SET NULL
);

-- =====================================================
-- Tabla: Atencion
-- =====================================================
CREATE TABLE Atencion (
    id_atencion INT AUTO_INCREMENT PRIMARY KEY,
    id_turno INT,
    id_emergencia INT,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    diagnostico TEXT,
    tratamiento TEXT,
    usuario_registro INT NOT NULL,
    FOREIGN KEY (id_turno) REFERENCES Turno(id_turno) ON DELETE CASCADE,
    FOREIGN KEY (id_emergencia) REFERENCES Emergencia(id_emergencia) ON DELETE CASCADE,
    FOREIGN KEY (usuario_registro) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- =====================================================
-- Índices para mejorar el rendimiento
-- =====================================================
CREATE INDEX idx_usuario_email ON Usuario(email);
CREATE INDEX idx_usuario_rol ON Usuario(rol);
CREATE INDEX idx_paciente_dni ON Paciente(dni);
CREATE INDEX idx_turno_fecha ON Turno(fecha_hora);
CREATE INDEX idx_turno_estado ON Turno(estado);
CREATE INDEX idx_agenda_fecha ON Agenda(fecha);
CREATE INDEX idx_emergencia_estado ON Emergencia(estado);
CREATE INDEX idx_lista_espera_estado ON ListaEspera(estado);
