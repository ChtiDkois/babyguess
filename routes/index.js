var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function(req, res, next) {

  var db = new sqlite3.Database('./db/babyguess.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  db.all(" select name, gender, ddn, weight, height, girlname, boyname from pronos", function(err, rows) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(rows);
      res.render('index', {pronos : rows});
    }
    db.close();
  });
});

router.get('/newProno.html', (req, res, next) => res.render('newProno'));

router.post('/newProno', function(req, res, next) {
  console.log(req.body);
  let prono = req.body;
  console.log(prono.name);
  console.log(prono.gender);
  console.log(prono.ddn);
  console.log(prono.weight);
  console.log(prono.height);
  console.log(prono.girlname);
  console.log(prono.boyname);

  var db = new sqlite3.Database('./db/babyguess.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  db.run(' INSERT INTO pronos(name, gender, ddn, weight, height, girlname, boyname) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [prono.name, prono.gender, prono.ddn, prono.weight, prono.height, prono.girlname, prono.boyname], function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log("One more prono !" + req.body);
    }
  });

  db.all(" select name, gender, ddn, weight, height, girlname, boyname from pronos", function(err, rows) {
    if (err) {
      console.error(err.message);
    } else {
      res.render('index', {pronos : rows});
    }
    db.close();
  });

});

module.exports = router;
