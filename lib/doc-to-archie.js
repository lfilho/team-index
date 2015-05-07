function isMultiline (val) {
  return (typeof val === 'string' && val.indexOf('\n') > 0);
}

module.exports = function convertDocToArchie (doc) {
  const lines = Object.keys(doc).map(function (key) {
    // ignore reserved keys
    if (key[0] === '_') { return; }

    let val = doc[key];
    if (isMultiline(val)) {
      return key + ': ' + val + '\n:end';
    }
    else {
      return key + ': ' + val;
    }
  });

  return lines.filter(Boolean).join('\n');
};
