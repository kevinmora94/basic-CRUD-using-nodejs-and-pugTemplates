var express = require('express');
var	mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require("path");
var urlencodedParser = bodyParser.urlencoded({extended: false});
var app = express();
app.set('view engine', 'pug');
app.set('views', __dirname+'/views/');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname));

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'Write your username here',
	password: 'Write your password here',
	database: 'lab5',
	port: '3306'
});

connection.connect(function(error){
	if(error){
		throw error;
	}else{
		console.log("Conexión exitosa");
	}
});

app.get('/', function(req, res){
	res.sendFile(__dirname + "/" + "index.html");
})
app.get('/add', function(req, res){
	res.sendFile(__dirname + "/views" + "/add.html");
})
app.get('/update', function(req, res){
	res.sendFile(__dirname + "/views" + "/update.html");
})
app.get('/delete', function(req, res){
	res.sendFile(__dirname + "/views" + "/delete.html");
})

app.get('/contactos', function(req, res){
	var query =
	connection.query('Select * from contactos',
		function(error, rows, fields){
			if(!error){
				res.render('select', {users : rows});
			} else {
				console.log('Error while performing query'+error);
			}
		});
});

app.post('/insertContacto', urlencodedParser, function(req, res){
	
	data = {
		nombre: req.body.name,
		apellidos: req.body.lastname,
		telefono: req.body.phone,
		email: req.body.email
	};

	connection.query("INSERT INTO contactos set ?", [data], function(err, result){
		if(err) throw err;
		 res.redirect('/add');
		
	});
});

app.post('/updateContact', urlencodedParser, function(req, res){
	var id = req.body.id;
	data = {
		nombre: req.body.name
	};

	connection.query("UPDATE contactos set ? WHERE ID = ?",[data,id], function(err, rows){
		if(err) console.log("error al actualizar ", err);
		res.send("Contacto Actualizado");
	});
});

app.post('/deleteContact', urlencodedParser, function(req, res){
	var id = req.body.id;
	
	connection.query("DELETE FROM contactos WHERE ID = ?",[id], function(err,result){
		if(err) console.log("Error al eliminar", err);
		res.send("Contacto Eliminado");
	});
});

var server = app.listen(8081, function(){
	console.log('Ejemplo corriendo como loco...');
});
