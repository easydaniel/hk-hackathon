var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

function update() {
  request.get({
    url: 'http://www.censtatd.gov.hk/hkstat/sub/sp230_tc.jsp?productCode=D5220409'
  }, function (err, resp, body) {
    $ = cheerio.load(body);
    var fileUrl = 'http://www.censtatd.gov.hk/' + $('.productbottomtabletitle a').attr('href');
    request.get({
      url: fileUrl,
      encoding: 'binary'
    }, function (err, resp, body) {
      fs.writeFile('./file.xls', body, 'binary', function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('File saved');
        }
      })
    });
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {

  update();
  res.render('index', { title: 'Express' });
});

module.exports = router;
