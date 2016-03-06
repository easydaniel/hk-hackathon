var child_process = require('child_process');

child_process.exec('python2 analysis.py china > ../app/assets/analysis/china.json', function (err, stdout, stderr) {
  if (err) {
    console.log(err);
  } else {
    console.log('china done');
  }
})

child_process.exec('python2 analysis.py america > ../app/assets/analysis/america.json', function (err, stdout, stderr) {
  if (err) {
    console.log(err);
  } else {
    console.log('america done');
  }
})
