const archieml = require('archieml');

function isNumeric (val) {
  const re = /^(-)?[0-9]+(\.[0-9]+)?$/;
  return re.test(val);
}

module.exports = function (raw) {
  const doc = archieml.load(raw);
  Object.keys(doc).forEach(function (key) {
    let val = doc[key].trim();

    if (isNumeric(val)) {
      val = Number(val);
    }

    doc[key] = val;
  });
  return doc;
};
