'use strict';

module.exports = function arrayFrom (iter) {
  let arr = [];
  for (let i of iter) {
    arr.push(i);
  }
  return arr;
};
