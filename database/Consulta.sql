CREATE DATABASE IF NOT EXISTS coffeehouse CHARACTER SET utf8mb4;
USE coffeehouse;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  `contraseña` VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inicio (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(100) NOT NULL,
  subtitulo VARCHAR(255) DEFAULT NULL,
  video VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS servicios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  icono VARCHAR(100) DEFAULT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS especialidades (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productos (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(100) DEFAULT NULL,
  descripcion VARCHAR(100) DEFAULT NULL,
  imagen VARCHAR(100) DEFAULT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS nosotros (
  id INT NOT NULL AUTO_INCREMENT,
  historia TEXT,
  direccion VARCHAR(255) DEFAULT NULL,
  telefono VARCHAR(50) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  horario VARCHAR(255) DEFAULT NULL,
  foto VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contactos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
INSERT INTO inicio (titulo, subtitulo, video) VALUES
('El Mejor Café de la Ciudad', 'Calidad, sabor y experiencia en cada taza', '/videos/cafeteria.mp4');

INSERT INTO servicios (nombre, descripcion, icono) VALUES
('Café de especialidad', 'Granos seleccionados de Bolivia, tostados a diario', 'coffee'),
('Desayunos', 'Opciones dulces y saladas todas las mañanas', 'bakery'),
('Pastelería artesanal', 'Tortas, galletas y postres hechos en casa', 'cake'),
('Wi-Fi y coworking', 'Espacio cómodo para trabajar o estudiar', 'wifi'),
('Eventos privados', 'Reserva el local para tus reuniones', 'event');

INSERT INTO especialidades (nombre, descripcion) VALUES
('Espresso', 'Intenso y aromático, extracción perfecta'),
('Cappuccino', 'Espresso con leche vaporizada y espuma cremosa'),
('Latte', 'Suave y cremoso, ideal para cualquier hora'),
('Café filtrado', 'Método V60, notas frutales y florales');

INSERT INTO productos (titulo, descripcion, precio, categoria) VALUES
('Espresso', 'Shot simple', 12.00, 'Café'),
('Cappuccino', 'Con espuma de leche', 18.00, 'Café'),
('Latte', 'Con leche cremosa', 20.00, 'Café'),
('Croissant', 'Mantequilla artesanal', 15.00, 'Pastelería'),
('Torta de chocolate', 'Porción individual', 25.00, 'Pastelería');

INSERT INTO nosotros (historia, direccion, telefono, email, horario) VALUES
('CoffeeHouse nació en Cochabamba con la pasión por el café boliviano. Trabajamos con productores locales para ofrecer una experiencia única en cada taza.',
 'Av. Ejemplo #123, Cochabamba, Bolivia', '+591 4 000 0000', 'hola@coffeehouse.com', 'Lun a Sáb 8:00 - 22:00');