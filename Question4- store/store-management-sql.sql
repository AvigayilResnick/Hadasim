create database store_management;
 use store_management;
 -- Table: Suppliers
CREATE TABLE Suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    contact_name VARCHAR(100)
);


-- Table: Products
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    min_quantity INT NOT NULL,

    FOREIGN KEY (supplier_id) REFERENCES Suppliers(id)
);

-- Table: Orders
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'in_process', 'completed') DEFAULT 'pending',

    FOREIGN KEY (supplier_id) REFERENCES Suppliers(id)
);

-- Table: OrderItems (products within an order)
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,

    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);
