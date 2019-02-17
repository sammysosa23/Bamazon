// REQUIRED DEPENDENCIES
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var itemID = 0;
var itemQuantity = 0;
var selected;
var statement;

// MYSQL CONNECTION PARAMETERS
var connection = mysql.createConnection({
  host: '127.0.0.1',
  // host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazonDB'
});

connection.connect(function (error) {
  if (error) throw err;
  // console.log('connected as id: ' + connection.threadID);
  startApp();
});

function startApp() {
  console.log(`Welcome to the BAMAZON Store!`);
  inquirer.prompt(
    {
      name: 'browse',
      type: 'confirm',
      message: 'Welcome to the store front window where you can browse our available item.'
    }
  )
    .then(function (answer) {
      if (answer.browse) {
        showItems();
        setTimeout(promptUser, 1000);
      } else {
        exitApp();
      }
    });
}

function showItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log('\nList of all the products\n');
    // console.log(res);
    var products = [];
    for (var i = 0; i < res.length; i++) {
      products.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    var headings = ["Item ID", "Product", "Department", "Price", "Quantity in Stock"];
    console.table(headings, products);
  });
}

function promptUser() {
  inquirer.prompt([
    {
      name: 'id',
      type: 'input',
      message: 'Enter the ID number of the item your interested in purchasing.',
      validate: function (value) {
        if (value <= 0 || isNaN(value)) {
          console.log('Please enter a valid Item ID');
        } else {
          return true;
        }
      }
    },
    {
      name: 'quantity',
      type: 'input',
      message: 'Please enter the quantity you would are purchasing',
      validate: function (value) {
        if (isNaN(value)) {
          console.log('Please enter a valid number');
        } else {
          return true;
        }
      }
    }
  ])
    .then(function (answer) {
      itemID = answer.id;
      itemQuantity = answer.quantity;
      connection.query('SELECT * FROM products WHERE item_id= ' + itemID, function (err, res) {
        selected = res[0];

        if (itemQuantity > selected.stock_quantity && selected.stock_quantity > 1) {
          statement = "Sorry but we only have " + selected.stock_quantity + " " + selected.product_name + 's available.';
          console.log(statement);
          promptUser();
        }
        else if (itemQuantity > selected.stock_quantity && selected.stock_quantity === 1) {
          statement = "Sorry but we only have 1 " + selected.product_name + ' available.';
          console.log(statement);
          promptUser();
        }
        else if (itemQuantity > selected.stock_quantity && selected.stock_quantity < 1) {
          statement = "Sorry " + selected.product_name + " is out of stock.";
          console.log(statement);
          promptUser();
        }
        else if (+itemQuantity === 1) {
          statement = "Your purchasing " + itemQuantity + " " + selected.product_name + "s.";
          console.log(statement);
          buyProducts();
        }
      });
    });
}

function buyProducts() {
  inquirer.prompt(
    {
      name: 'buy',
      type: 'confirm',
      message: statement + 'Would you like to checkout?'
    }
  )
    .then(function (answer) {
      if (answer.buy) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id ?", [itemQuantity, itemID], function (err, res) {
          if (err) throw err;
          var totalStatement = "Your total is $ " + (itemQuantity * selected.price) + "\n";
          console.log(totalStatement);
          // setTimeout(buyDifferent, 1000);
        });
      }
      else {
        buyDifferent()
      }
    });
}

function buyDifferent() {
  inquirer.prompt(
    {
      name: 'differentItem',
      type: 'confirm',
      message: 'Would you like to purchase a different item?'
    }
  )
    .then(function (answer) {
      if (answer.differentItem) {
        showItems();
        setTimeout(promptUser, 2000);
      }
      else {
        exit();
      }
    });
}

function exit() {
  console.log('Thanks for visiting the BAMAZON store.');
  connection.end();
}
// function purchaseProduct() {
//   inquirer.prompt([
//     {
//       name: 'ID',
//       type: 'input',
//       message: 'Enter the ID of the product you would like to purchase',
//       validate: function (value) {
//         if (value <= 0 || isNaN(value)) {
//           console.log(`\nPlease enter a valid Item ID from the list above!`);
//         } else {
//           return true;
//         }
//       }
//     },
//     {
//       name: 'quantity',
//       type: 'input',
//       message: 'How many would you like to purchase?',
//       // filter: Number
//     }
//   ])
//     .then(function (input) {
//       var quantityNeeded = input.Quantity
//       var IDrequested = input.ID
//       purchaseItems(IDrequested, quantityNeeded);
//     });
// };

// function purchaseItems(ID, amountNeeded) {
//   connection.query('SELECT * FROM products WHERE item_id = ' + ID, function (err, res) {
//     if (err) throw err;
//     console.log(err);
//     if (amountNeeded <= res[0].stock_quantity) {
//       var totalCost = res[0].price * amountNeeded;
//       console.log(`We have those item in stock!\nYour total cost for ` + amountNeeded + ` ` + res[0].product_name
//         + ` is ` + totalCost + ` Thank you for your purchase!`);

//       connection.query(`UPDATE products SET stock_quantity = stock_quantity - ` + amountNeeded + `WHERE item_id = ` + ID);
//     } else {
//       console.log(`Insufficient quantity, sorry but we do not have enough ` + res[0].product_name + `in stock to complete your order!`);
//     };
//     displayProducts();
//   });
// };

// function displayInventory() {
//   var query = "SELECT * FROM products";
//   connection.query(query, function (err, res) {
//     if (err) throw err;
//     // TABLES
//     var table = new Table({
//       head: ['Item ID', 'Product Name', 'Category', 'Price', "Quantity"],
//       colWidths: [9, 30, 30, 10, 10]
//     });
//     for (var i = 0; i < res.length; i++) {
//       table.push(
//         [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
//       );
//     }
//     console.log(table.toString());
//     purchaseProduct();
//   });
// }

// displayInventory();





