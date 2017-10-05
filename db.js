var sql = require('sql.js');
var fs = require('fs');


function createDB(){
    // Create a database
    var db = new sql.Database();

    // Execute some sql
    sqlstr = "CREATE TABLE Post (id int primary key, name varchar(20), content varchar(100));";
    sqlstr += "INSERT INTO hello VALUES (0,'wassim', 'hello');"
    db.run(sqlstr); // Run the query without returning anything

    var data = db.export();
    var buffer = new Buffer(data);
    fs.writeFileSync("db.sqlite", buffer);

    return 1;
}

// var res = db.exec("SELECT * FROM hello");
// /*
// [
// 	{columns:['a','b'], values:[[0,'hello'],[1,'world']]}
// ]
// */

// // Prepare an sql statement
// var stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

// // Bind values to the parameters and fetch the results of the query
// var result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
// console.log(result); // Will print {a:1, b:'world'}

// // Bind other values
// stmt.bind([0, 'hello']);
// while (stmt.step()) console.log(stmt.get()); // Will print [0, 'hello']

// // You can also use javascript functions inside your SQL code
// // Create the js function you need
// function add(a, b) {return a+b;}
// // Specifies the SQL function's name, the number of it's arguments, and the js function to use
// db.create_function("add_js", add);
// // Run a query in which the function is used
// db.run("INSERT INTO hello VALUES (add_js(7, 3), add_js('Hello ', 'world'));"); // Inserts 10 and 'Hello world'

// // free the memory used by the statement
// stmt.free();
// // You can not use your statement anymore once it has been freed.
// // But not freeing your statements causes memory leaks. You don't want that.
