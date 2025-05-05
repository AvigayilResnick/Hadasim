CREATE DATABASE IF NOT EXISTS store_management;
USE store_management;

-- Table: Suppliers
CREATE TABLE IF NOT EXISTS Suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    contact_name VARCHAR(100),
    password VARCHAR(255) NOT NULL
);

-- Table: StoreOwners
CREATE TABLE IF NOT EXISTS StoreOwners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    code VARCHAR(100) NOT NULL
);

-- Table: Products
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    min_quantity INT NOT NULL,

    FOREIGN KEY (supplier_id) REFERENCES Suppliers(id)
);

-- Table: Orders
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    store_owner_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'in_process', 'completed') DEFAULT 'pending',

    FOREIGN KEY (store_owner_id) REFERENCES StoreOwners(id),
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(id)
);

-- Table: OrderItems (products within an order)
CREATE TABLE IF NOT EXISTS OrderItems (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,

    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);


