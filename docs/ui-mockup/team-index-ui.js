var data = {
  id: 'MyTeam',
  type: 'team',
  body: 'body of the doc goes here\n\ntitle: My Team'
};

var previewHtml = document.getElementById('preview-example').innerHTML;

function populate () {
  Object.keys(data).forEach(function (key) {
    var elem = document.querySelector('[name=' + key + ']');
    elem.value = data[key];
  });

  document.querySelector('.form .preview').innerHTML = previewHtml;
}

console.log('Run the `populate()` function to fill in some data');
