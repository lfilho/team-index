module.exports = function convertDocToArchie (doc) {
  var lines = Object.keys(doc).map(function (key) {
    // ignore reserved keys
    if (key[0] === '_') { return; }

    const val = doc[key];
    const isMultiLine = (typeof val === 'string' && val.indexOf('\n') > 0);
    return key + ': ' + val + (isMultiLine ? '\n:end' : '');
  });

  return lines.filter(Boolean).join('\n');
};
