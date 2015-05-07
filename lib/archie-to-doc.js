const archieml = require('archieml');

function isNumeric (val) {
  const re = /^(-)?[0-9]+(\.[0-9]+)?$/;
  return re.test(val);
}

const dateRe = /^date\((.*)\)$/;
function isDate (val) {
  return extractDate(val) !== null;
}

function extractDate (val) {
  if (typeof val !== 'string') { return null; }

  const matches = val.match(dateRe);
  if (!matches) { return null; }

  const dateVal = matches[1];
  if (isNumeric(dateVal)) { return parseInt(dateVal, 10); }

  const date = new Date(dateVal);
  const ts = date.getTime();
  return isNaN(ts) ? null : ts;
}

module.exports = function (raw) {
  const doc = archieml.load(raw);
  Object.keys(doc).forEach(function (key) {
    let val = doc[key].trim();

    if (isNumeric(val)) {
      val = Number(val);
    }
    else if (isDate(val)) {
      val = extractDate(val);
    }

    doc[key] = val;
  });
  return doc;
};

module.exports.isNumeric = isNumeric;
module.exports.isDate = isDate;
module.exports.extractDate = extractDate;
