console.log('Initial state: preview the current doc and display the Search form for navigating');
console.log('When you Search and get an exact match, we stay on this screen and the Preview updates to show new doc');
console.log('Options:');
console.log('- search(): searching for a doc that does not exist');
console.log('- edit(): edit the current doc');

function setBodyState (state) {
  var body = document.querySelector('body');
  body.className = body.className.replace(/\bstate-\w+\b/, 'state-' + state);
}

function search () {
  console.log('----');
  console.log('Searching for a doc that does not exist');
  console.log('- The Create form is pre-populated with the ID you searched for');
  console.log('- Cancel takes you back to the previous screen');

  setBodyState('search');
  document.querySelector('[name=id]').value = 'foo';
}

function edit () {
  console.log('----');
  console.log('Editing a doc');

  setBodyState('edit');
}
