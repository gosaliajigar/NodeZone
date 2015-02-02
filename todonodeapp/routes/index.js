var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Todo Node App',
  	urllist: [ '/todolist', '/newtodo', '/deletetodo' ]
  });
});

/* GET TodoList page. */
router.get('/todolist', function(req, res) {
  var db = req.db;

  var collection = db.get('todolist');

  collection.find({}, {}, function(error, docs) {
       res.render('todolist', {
           "todolist" : docs
       });
    });
});

/* GET New User page. */
router.get('/newtodo', function(req, res) {
  res.render('newtodo', { title: 'Add New Todo Item'} );
});

/* POST to Add Todo Service. */
router.post('/addtodo', function(req, res) {
  var db = req.db;

  var collection = db.get('todolist');

  var priority = req.body.priority;
  var category = req.body.category;
  var date = req.body.date;
  var details = req.body.details;

  collection.insert({
      "priority" : priority,
      "category" : category,
      "date" : date,
      "details" : details
  }, function(err, doc) {
  	   if (err) {
          res.send("There was a problem in adding todo to the database : " + err.message);
  	   } else {
			// If it worked, set the header so the address bar
			// doesn't still say /addtodo
			res.location("todolist");
			// And forward to sucess page
			res.redirect("todolist");
	   }
  });
});

/* GET Delete Todo page. */
router.get('/deletetodo', function(req, res) {
	res.render('deletetodo', { title: 'Delete Todo' });
});

/* POST to Remove Todo Service. */
router.post('/removetodo', function(req, res) {
  var priority = req.body.priority;
  var category = req.body.category;
  var date = req.body.date;
  var details = req.body.details;

  var db = req.db;

  var collection = db.get('todolist');

  var query = '';

  collection.remove({
        $and: [{ "priority": priority }, { "category": category }, { "date": date }, { "details": details }]}, function(err, doc) {
            if (err) {
               res.send("There was a problem in removing todo from the database : " + err.message);
            } else {
                res.location("todolist");
                res.redirect("todolist");
            }
        });
});

module.exports = router;
