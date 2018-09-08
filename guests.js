module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getRides(res, mysql, context, complete) {
		mysql.pool.query("SELECT id, name FROM Ride", function(error, results, fields) {
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.rides = results;
			complete();
		});
	}

	function getGuestsWithNameLike(req, res, mysql, context, complete) {
		var query = "SELECT Guest.id AS ID, Name, Brithdate, Height FROM Guest WHERE guest.Name LIKE " + mysql.pool.escape(req.params.s + '%');
		mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
				}
			context.guests = results;
			complete();
			});
		}
	

	function getGuests(res, mysql, context, complete){
                mysql.pool.query("SELECT Guest.Id AS Id, Guest.Name AS Name, Birthdate, Height, Ride.Name AS Ride FROM Guest INNER JOIN Experience ON Guest.Id = Experience.Guest_Id INNER JOIN Ride ON Experience.Ride_Id = Ride.Id", function(error, results, fields) {
                        if(error){
                                res.write(JSON.stringify(error));
                                res.end();
                        }
                        context.guests = results;
                        complete();
                });
        }


	function getGuest(res, mysql, context, id, complete){
		var sql = "SELECT Guest.Id AS Id, Guest.Name AS Name, Birthdate, Height FROM Guest WHERE ID = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.guest = results[0];
			console.log(context.guest);
			complete();
		});
	}

	//Displays all people
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteGuest.js"];
		var mysql = req.app.get('mysql');
		getGuests(res, mysql, context, complete);
		getRides(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2) {
				res.render('guests', context);
			}
		}
	});
	
	//Displays one guest
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["selectedRide.js", "updateGuest.js"];
		var mysql = req.app.get('mysql');
		getGuest(res, mysql, context, req.params.id, complete);
		getRides(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2) {
				res.render('update-guest', context);
			}
		}
	});
	
	//Adds a guest, redirects to the guests page after adding
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Guest (name, birthdate, height) VALUES (?,?,?); INSERT INTO Experience (Guest_ID, Ride_ID) VALUES ((SELECT id FROM Guest ORDER BY id DESC LIMIT 1), (SELECT id FROM Ride ORDER BY RAND() LIMIT 1))";

		var inserts = [req.body.name, req.body.birthdate, req.body.height];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/guests');
			}
		});
	});


	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "UPDATE Guest SET Name=?, Birthdate=?, Height=? WHERE ID=?";
		var inserts = [req.body.name, req.body.birthdate, req.body.height, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.status(200);
				res.end();
			}
		});
	});
	
	//Route to delete a person
	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Guest WHERE ID = ?";
		console.log(req.params.id);
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
				console.log('Data deleted');
				res.status(202).end();
			}
		})
	})
	return router;
}();

