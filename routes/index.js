var express = require('express');
var router = express.Router();
var child = require('child_process')

function update() {
  child.exec('python ../ExcelReader.py', function (err, stdout, stderr) {
    console.log(stdout);
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {

  update();
  res.render('index', { title: 'Express' });
});

module.exports = router;
