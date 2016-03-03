/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function(req, res, next) {
    // console.log(req.body);
    var payload = {
      year: req.body['year'],
      month: req.body['month'],
      data: req.body['data']
    };
    var today = new Date();
    if (payload['year'] === 'undefined') {
      payload['year'] = today.getFullYear().toString();
    }
    if (payload['month'] === 'undefined') {
      payload['month'] = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    }

    Test.create(payload).exec(function(err, data) {
      if (err) {
        return console.log(err);
      }
      return res.json(data);
    })
  }
}
