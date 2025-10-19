-- =====================================================
-- Centro Médico Sur - Datos de Prueba
-- =====================================================

USE centro_medico_sur;

-- =====================================================
-- Usuarios de Prueba
-- Password para todos: "password123"
-- Hash generado con bcrypt (10 rounds)
-- =====================================================
INSERT INTO Usuario (nombre, email, password, rol) VALUES
('Admin Sistema', 'admin@centromedicosur.com', '$2b$10$It1er1VviRkeuOu/LzwweOfWO1u5rXu8ZyQmaTmiLGHh8ZgXNTj1K', 'admin'),
('Dr. Juan Pérez', 'juan.perez@centromedicosur.com', '$2b$10$It1er1VviRkeuOu/LzwweOfWO1u5rXu8ZyQmaTmiLGHh8ZgXNTj1K', 'profesional'),
('Dra. María González', 'maria.gonzalez@centromedicosur.com', '$2b$10$It1er1VviRkeuOu/LzwweOfWO1u5rXu8ZyQmaTmiLGHh8ZgXNTj1K', 'profesional'),
('Dr. Carlos Rodríguez', 'carlos.rodriguez@centromedicosur.com', '$2b$10$It1er1VviRkeuOu/LzwweOfWO1u5rXu8ZyQmaTmiLGHh8ZgXNTj1K', 'profesional'),
('Ana Martínez', 'ana.martinez@centromedicosur.com', '$2b$10$It1er1VviRkeuOu/LzwweOfWO1u5rXu8ZyQmaTmiLGHh8ZgXNTj1K', 'recepcion'),
('Pedro López', 'pedro.lopez@centromedicosur.com', '$2b$10$It1er1VviRkeuOu/LzwweOfWO1u5rXu8ZyQmaTmiLGHh8ZgXNTj1K', 'recepcion'),
('Director Médico', 'director@centromedicosur.com', '$2b$10$It1er1VviRkeuOu/LzwweOfWO1u5rXu8ZyQmaTmiLGHh8ZgXNTj1K', 'director');

-- =====================================================
-- Sectores
-- =====================================================
INSERT INTO Sector (nombre) VALUES
('Cardiología'),
('Pediatría'),
('Traumatología'),
('Medicina General'),
('Emergencias');

-- =====================================================
-- Profesionales
-- =====================================================
INSERT INTO Profesional (id_usuario, especialidad) VALUES
(2, 'Cardiología'),
(3, 'Pediatría'),
(4, 'Traumatología');

-- =====================================================
-- Consultorios
-- =====================================================
INSERT INTO Consultorio (nombre, id_sector) VALUES
('Consultorio 1 - Cardiología', 1),
('Consultorio 2 - Pediatría', 2),
('Consultorio 3 - Traumatología', 3),
('Consultorio 4 - Medicina General', 4),
('Sala de Emergencias 1', 5),
('Sala de Emergencias 2', 5);

-- =====================================================
-- Pacientes de Prueba
-- =====================================================
INSERT INTO Paciente (dni, nombre, apellido, fecha_nacimiento, telefono, email) VALUES
('12345678', 'Roberto', 'Fernández', '1985-03-15', '1234567890', 'roberto.fernandez@email.com'),
('23456789', 'Laura', 'Sánchez', '1990-07-22', '2345678901', 'laura.sanchez@email.com'),
('34567890', 'Miguel', 'Torres', '1978-11-30', '3456789012', 'miguel.torres@email.com'),
('45678901', 'Carmen', 'Ramírez', '1995-02-14', '4567890123', 'carmen.ramirez@email.com'),
('56789012', 'José', 'Díaz', '1982-09-05', '5678901234', 'jose.diaz@email.com'),
('67890123', 'Patricia', 'Morales', '1988-12-18', '6789012345', 'patricia.morales@email.com'),
('78901234', 'Fernando', 'Castro', '1975-06-25', '7890123456', 'fernando.castro@email.com'),
('89012345', 'Sofía', 'Vargas', '2010-04-10', '8901234567', 'sofia.vargas@email.com'),
('90123456', 'Diego', 'Herrera', '2015-08-20', '9012345678', 'diego.herrera@email.com'),
('01234567', 'Elena', 'Ruiz', '1992-01-08', '0123456789', 'elena.ruiz@email.com');

-- =====================================================
-- Agendas (Horarios de los profesionales)
-- =====================================================
-- Agenda para Dr. Juan Pérez (Cardiólogo) - Próxima semana
INSERT INTO Agenda (id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 30),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '18:00:00', 30),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '12:00:00', 30),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '08:00:00', '12:00:00', 30);

-- Agenda para Dra. María González (Pediatra)
INSERT INTO Agenda (id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min) VALUES
(2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '13:00:00', 30),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', '19:00:00', 30),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '13:00:00', 30);

-- Agenda para Dr. Carlos Rodríguez (Traumatólogo)
INSERT INTO Agenda (id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min) VALUES
(3, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 30),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '12:00:00', 30),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '18:00:00', 30);

-- =====================================================
-- Turnos de Prueba
-- =====================================================
-- Turnos para mañana
INSERT INTO Turno (id_agenda, id_paciente, descripcion, fecha_hora, duracion_min, estado) VALUES
(1, 1, 'Control cardiológico', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 08:00:00'), 30, 'confirmado'),
(1, 2, 'Consulta por dolor de pecho', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 08:30:00'), 30, 'reservado'),
(1, 3, 'Control post-operatorio', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 09:00:00'), 30, 'confirmado'),
(5, 8, 'Control pediátrico', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 09:00:00'), 30, 'confirmado'),
(5, 9, 'Vacunación', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 09:30:00'), 30, 'reservado');

-- =====================================================
-- Lista de Espera
-- =====================================================
INSERT INTO ListaEspera (id_paciente, fecha_solicitud, estado) VALUES
(4, NOW(), 'activa'),
(5, NOW(), 'activa'),
(6, DATE_SUB(NOW(), INTERVAL 2 DAY), 'activa');

-- =====================================================
-- Emergencias
-- =====================================================
INSERT INTO Emergencia (id_paciente, id_profesional, id_consultorio, fecha_hora, motivo, estado) VALUES
(7, 1, 5, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Dolor torácico agudo', 'atendida'),
(10, 3, 6, DATE_SUB(NOW(), INTERVAL 1 HOUR), 'Fractura de brazo', 'en_atencion');

-- =====================================================
-- Atenciones
-- =====================================================
INSERT INTO Atencion (id_turno, id_emergencia, fecha_registro, notas, diagnostico, tratamiento, usuario_registro) VALUES
(NULL, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Paciente ingresa con dolor torácico', 'Angina de pecho estable', 'Nitroglicerina sublingual, reposo', 2);
