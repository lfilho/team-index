var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

function Store (data) {
  this.changeEmitter = new EventEmitter();
  this.data = data;
}

Store.prototype.addListener = function (func) {
  this.changeEmitter.on('change', func);
};

Store.prototype.removeListener = function (func) {
  this.changeEmitter.removeListener('change', func);
};

Store.prototype.set = function (changes) {
  assign(this.data, changes);
  this.changeEmitter.emit('change');
};

Store.prototype.get = function (key) {
  if (key === undefined) { return this.data; }
  return this.data[key];
};

module.exports = Store;
