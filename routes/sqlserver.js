var express = require("express");
var router = express.Router();


router.get("/",function(req,res){
	res.redirect("index");
});
router.get("/index",function(req,res){
	res.render("sqlserver/index",{id:'0'});
});
router.get("/add",function(req,res){
	res.render("sqlserver/add");
});

router.post('/execute', function(req, res, next) {
	console.log(req.body);
	var p = req.body;
	var Connection = require("tedious").Connection;
	var config = {
		userName:p.username,
		password:p.password,
		server: p.ip,				
		options:{encrypt:false,database:p.database, rowCollectionOnDone:false}
	}
	var cnn = new Connection(config);
	var Request = require("tedious").Request;
	cnn.on("connect",function(err){
		if (err){
			console.log(err);
			return;
		}
		executeSql();
	});
	function executeSql(){
		var request = new Request(p.sql,function(err,rowCount){
			cnn.close();
			if (!err){
				res.json({status:true,result:{cols:cols,data:table}});	
			}else{
				res.json({status:false,message:err});
			}
			
		});
		var table =[];
		var cols = []
		request.on("columnMetadata",function(columns){
			cols = columns;
		})
		request.on('row',function(columns){			

			var row ={}; 
			columns.forEach(function(column){
				//console.log(column);
				row[column.metadata.colName] = column.value;
			});
			table.push(row);
		});
		request.on("done",function(rowCount,more,rows){
			console.log(rowCount);
			
		})
		cnn.execSql(request);
	}

});

module.exports = router;