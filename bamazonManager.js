// REQUIRED DEPENDENCIES
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

// MYSQL CONNECTION PARAMETERS
var connection = mysql.createConnection({
  host: '127.0.0.1',
  // host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazonDB'
});

connection.connect(function (err) {
  if (err) throw err;
  startApp();
});

function startApp() {
  console.log("Welcome MANAGER to your PORTAL");
  prompt();
}

function prompt() {
  inquirer.prompt(
    {
      name: "managerMenu",
      type: "rawlist",
      message: "Please select a menu option",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
  )
    .then(function (answer) {
      if (answer.managerMenu === "View Products for Sale") {
        showItems();
      }
      else if (answer.managerMenu === "View Low Inventory") {
        lowInv();
      }
      else if (answer.managerMenu === "Add to Inventory") {
        addInv();
      }
      else if (answer.managerMenu === "Add New Product") {
        newProduct();
      }
      else if (answer.managerMenu === "Exit") {
        exit();
      }
    });
}

function printTable(res) {
  var items = [];
  var headings = ["Item ID", "Product", "Department", "Price", "Quantity in Stock"];

  for (var i = 0; i < res.length; i++) {
    items.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
  }
  console.table(headings, items);
}

function showItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("All products");
    printTable(res);
    setTimeout(menu, 1000);
  });
}

function menu() {
  inquirer.prompt(
    {
      name: "menu",
      type: "confirm",
      message: "Would you like to view the menu?"
    }
  )
    .then(function (answer) {
      if (answer.menu) {
        prompt();
      }
      else {
        exit();
      }
    });
}
function lowInv() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw err;
    if (res.length === 0) {
      console.log("There are no items low in stock");
    }
    else {
      console.log("Low inventory, time to place an order");
      printTable(res);
      setTimeout(menu, 1000);
    }
  });
}

function addInv() {
  var selected;
  inquirer.prompt([
    {
      name: "itemID",
      type: "input",
      message: "Please enter the ID number of the item to be updated",
      validate: function (value) {
        if (value <= 0 || isNaN(value)) {
          console.log("Please enter a valid ID");
        }
        else {
          return true;
        }
      }
    }
  ])
    .then(function (answer) {
      connection.query("SELECT * FROM products WHERE item_id = ?", [answer.itemID], function (err, res) {
        if (err) throw err;
        selected = res[0];
      });
      connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id ?", [answer.quantity, answer.item], function (err, res) {
        if (err) throw err;
        console.log("The inventory has been successfully updated");

        inquirer.prompt(
          {
            name: "addAnother",
            type: "confirm",
            message: "Would you like to update another item?"
          }
        )
          .then(function (answer) {
            if (answer.addAnother) {
              addInv();
            }
            else {
              menu();
            }
          });
      });
    });
}

function newProduct() {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Please enter the product name: "
    },
    {
      name: "department",
      type: "input",
      message: "Please enter the department name: "
    },
    {
      name: "price",
      type: "input",
      message: "Please enter the price: "
    },
    {
      name: "quantity",
      type: "input",
      message: "Please enter the quantity: "
    }
  ])
    .then(function (answer) {
      connection.query("INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function (err, res) {
          if (err) throw err;
          var message = "\n" + answer.name + " was added to the inventory!\n";
          console.log(message);
          menu();
        });
    });
}
function exit() {
  console.log("Ended application")
  connection.end();
}