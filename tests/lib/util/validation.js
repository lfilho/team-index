'use strict';

let test = require('tape');
let validator = require('../../../lib/util/validation');

test('DB Key validator', function (t) {
  const validKeys = ['valid', '1234', '-yes', 'yeap12', 'yay34-a'];
  const invalidKeys = ['', 'no@', 'nuh!uh', 'don\'t'];

  t.equal(validator.isValidDbKey.apply(null, validKeys), true);
  t.equal(validator.isValidDbKey.apply(null, invalidKeys), false);

  t.end();
});
