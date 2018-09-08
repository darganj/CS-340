var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');


var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);


app.use('/guests', require('./guests.js'));// if you wanna deal with your guests, you url should be something like "http://localhost:5000/guests"
app.use('/', express.static('public')); 


// you are missing the index.html in your public directory, 
// so that even your code looks almost the same with the template, 
// you'll get 404 error in http://localhost..../
// In fact, I saw you are using handlebar to manage your html, 
// you should have corresponding function in this main.js to send the data to your main.handlebar.

// In short words, you have 2 option to fix your problem: 
// 1. write your own index.html to represent your homepage, and then put index.html into public directory
// 2. write a function to render the data to main.handlebar such as:
//-------------------
app.get('/',function(req, res, next){
	/*var context = {
		result: "your result"
	}
	console.log("home");*/

	res.render('home', context);
});

//------------------




app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express started on flip2.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
