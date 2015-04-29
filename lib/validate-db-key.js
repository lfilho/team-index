'use strict';

// Alphanumeric plus dashes
const regex = /^[0-9A-Z-]+$/i;

module.exports = function isValidDbKey () {
  let strings = Array.prototype.slice.apply(arguments);

  return strings.every(regex.test, regex);
};
