CREATE DATABASE IF NOT EXISTS vivero_takumi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vivero_takumi;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'manager', 'empleado', 'cliente') NOT NULL DEFAULT 'cliente',
  telefono VARCHAR(50) NULL,
  dni VARCHAR(20) NULL,
  direccion VARCHAR(255) NULL,
  ciudad VARCHAR(100) NULL,
  fecha_creacion DATETIME NOT NULL,
  fecha_modificacion DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  fecha_creacion DATETIME NOT NULL,
  fecha_modificacion DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS plantas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen TEXT NULL,
  dificultad VARCHAR(50) NULL,
  descripcion TEXT NULL,
  guia_cuidado JSON NULL,
  rating DECIMAL(3, 1) NOT NULL DEFAULT 4.5,
  habilitada TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL,
  fecha_modificacion DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_email VARCHAR(150) NOT NULL,
  cliente_nombre VARCHAR(150) NOT NULL,
  cliente_telefono VARCHAR(50) NULL,
  cliente_dni VARCHAR(20) NULL,
  cliente_direccion VARCHAR(255) NULL,
  cliente_ciudad VARCHAR(100) NULL,
  items JSON NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  metodo_envio VARCHAR(50) NULL,
  fecha DATE NOT NULL,
  fecha_creacion DATETIME NOT NULL,
  fecha_modificacion DATETIME NOT NULL
);
