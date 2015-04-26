'use strict';

module.exports = {
  isValidDbKey: function () {
    let strings = Array.prototype.slice.apply(arguments);
    // Alphanumeric plus dashes
    let regex = /^[0-9A-Z-]+$/i;
    return strings.every(regex.test, regex);
  }
}
