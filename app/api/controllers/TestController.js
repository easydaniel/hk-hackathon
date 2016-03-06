/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  china: function (req, res, next) {

    // var chinaData = require('fs').readFileSync(__dirname + '/../../assets/analysis/china.json');
    // return res.json(JSON.stringify(chinaData));
    return res.json(req.param);
  },

  america: function (req, res, next) {


    return res.json(req.param);
  },

  find: function(req, res, next) {
    var payload = {}
    if (req.query.month) {
      payload['month'] = req.query.month;
      payload['year'] = new Date().getFullYear();
    }
    if (req.query.year) {
      payload['year'] = req.query.year;
    }

    Test.find(payload).sort('year ASC').sort('month ASC').exec(function (err, result) {
      if (err) {
        return res.status(403, 'Server error');
      }
      return res.json(result);
    })
  },


  create: function(req, res, next) {

    var payload = {
      year: req.body['year'],
      month: req.body['month'],
      data: JSON.parse(req.body['data'])
    };

    console.log(payload);
    Test.findOne({
      year: payload.year,
      month: payload.month
    }).exec(function (err, result) {
      if (err) {
        return console.log(err);
      }
      // console.log(result);
      if (!result) {
        Test.create(payload).exec(function(err, data) {
          if (err) {
            return console.log(err);
          }
          return res.json(data);
        })
      }
      // result.data = payload.data;
      // result.save(function (err, re) {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   return res.json(re);
      // })
    })
  }
}
