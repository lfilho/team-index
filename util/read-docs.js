'use strict';

const archieml = require('archieml');
const fs = require('fs');
const glob = require('glob');


function writeObj (obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

const pattern = process.argv[2];
if (!pattern) {
  console.log('Usage: iojs read-docs.js GLOB');
  process.exit();
}

glob(pattern, function (err, files) {
  if (err) { throw err; }

  files.forEach(function (file) {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = archieml.load(raw);

    writeObj(parsed);
  });
});
