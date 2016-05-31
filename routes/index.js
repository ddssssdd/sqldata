var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var Connection = require("tedious").Connection;
	var config = {
		userName:"sa",
		password:"s3@dm!n",
		server:"10.4.30.40",				
		options:{encrypt:false,database:"CnDB",}
	}
	var cnn = new Connection(config);
	cnn.on("connect",function(err){
		if (err){
			console.log(err);
			return;
		}
		var Request = require("tedious").Request;
		var request = new Request("select getDate() as date,'hello, world' as text,test from dbo.testtb",function(err,rowCount){

		});
		request.on('row',function(columns){
			columns.forEach(function(column){
				console.log(column.value);
			});
		});
		cnn.execSql(request);
	})
	res.render('index', { title: 'Express' });
});

module.exports = router;
