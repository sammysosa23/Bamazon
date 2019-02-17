DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products
(
  item_id INT NOT NULL
  AUTO_INCREMENT,
  product_name VARCHAR
  (100) NOT NULL,
  department_name VARCHAR
  (100) NOT NULL,
  price DECIMAL
  (6,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY
  (item_id)   
);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Bose Bluetooth Headphones", "Electronics", 199.99, 3);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Interstellar 4K UltraHD", "Movies & TV", 22.99, 50);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Casio G-Shock MUDMASTER (M)", "Clothing, Shoes, & Jewelry", 479.99, 10);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Canon EOS 6D Mark II Digital SLR Camera Body", "Electronics", 1499.99, 2);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("iPhone Xs Max", "Electronics", 1099.99, 30);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Nest Thermostat", "Electronics", 175.99, 23);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("The North Face Talus 2 Tent", "Equipment", 175.99, 5);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Patagonia Down With It Parka (W)", "Cothing, Shoes, & Jerelry", 224.99, 5);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Levi's 511 (M)", "Clothing, Shoes, & Jewelry", 34.99, 15);

  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Apple Watch Series 4", "Electronics", 399.99, 40);
