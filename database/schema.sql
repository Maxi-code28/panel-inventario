CREATE DATABASE inventario_db;
USE inventario_db;

CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    last_updated DATETIME NOT NULL
);

INSERT INTO stock (product, quantity, last_updated) VALUES
('Limones', 500, NOW()),
('Naranjas', 300, NOW()),
('Mandarinas', 200, NOW());