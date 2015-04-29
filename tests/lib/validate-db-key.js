'use strict';

let test = require('tape');
const isValidDbKey = require('../../lib/validate-db-key');

test('DB Key validator', function (t) {
  const validKeys = ['valid', '1234', '-yes', 'yeap12', 'yay34-a'];
  const invalidKeys = ['', 'no@', 'nuh!uh', 'don\'t'];

  t.equal(isValidDbKey.apply(null, validKeys), true);
  t.equal(isValidDbKey.apply(null, invalidKeys), false);

  t.end();
});
