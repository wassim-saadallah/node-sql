var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var sql = require('./sql.js-master/js/sql.js');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var filebuffer = fs.readFileSync('db.sqlite');
var db = new sql.Database(filebuffer);

var port = process.env.PORT || 8083;
var router = express.Router();              

var id_post = 1;
var id_comment = 1;

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


router.get('/create', function(req, res) {

        var db = new sql.Database();
     
         sqlstr = "CREATE TABLE Posts (id int auto_increment primary key , name varchar(20), content varchar(100));";
         sqlstr += "INSERT INTO Posts VALUES (0,'wassim', 'hello');"
         
         sqlstr += "CREATE TABLE Comments (id int primary key, name varchar(20), content varchar(100), id_post int ,"+
          "FOREIGN KEY (id_post) REFERENCES Posts(id) );";
         sqlstr += "INSERT INTO Comments VALUES (0,'wassim', 'hello',0);"

         db.run(sqlstr); 
     
         var data = db.export();
         var buffer = new Buffer(data);
         fs.writeFileSync("db.sqlite", buffer);

         res.json({message : "ALL GOOD"})
});



router.get('/posts', function(req, res)  {
    var result = db.exec("SELECT * FROM Posts");
    console.log(result)
        res.json(result);
});

router.get('/posts/:id', function(req, res) {
    var stmt = db.prepare("SELECT * FROM Posts where id=:id");
    var result = stmt.getAsObject({':id' : req.params.id});
    console.log(result);
    res.json(result);
    stmt.free();
});

router.post('/posts', function(req, res) {
    var stmt = 'INSERT INTO Posts VALUES (' + id_post + ',"'+ req.body.name + '","' + req.body.content+'");';
    console.log(stmt);
    db.run(stmt);
    id_post++;
    res.json({done : id_post-1});
});




router.get('/posts/:id/comments', function(req, res) {
    var result = db.exec("SELECT * FROM Comments where id_post=" +req.params.id);
    console.log(result);
    res.json(result);
});

router.post('/posts/:id/comments', function(req, res) {
    var stmt = 'INSERT INTO Comments VALUES (' + id_comment + ',"'+ req.body.name + '","' + req.body.content+'",' + req.params.id +');';
    console.log(stmt);
    db.run(stmt);
    id_comment++;
    res.json({done : id_comment-1});
});


app.use('/', router);
app.listen(port);
console.log('Server started at port : ' + port);


