var child_process = require('child_process');

child_process.exec('python3 ExcelReader.py', function (err, stdout, stderr) {
  console.log(stdout);
})
