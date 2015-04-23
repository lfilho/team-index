team index
====

[![Build Status](https://secure.travis-ci.org/joshwnj/team-index.png)](http://travis-ci.org/joshwnj/team-index)

See [the test cases](./tests/index.js) for example usage.

Install and run
----

```
npm install
gem install sass
npm run build-watch &
iojs index.js
```

See [[Team Index]] docs in [./index.js](./index.js) for more info.


To do
----

- trial archieml format for inputs
- add option to automatically catchup


FAQ
----

### Why don't indexes catchup automatically?

- manual catchup means we can choose to catchup less frequently for more expensive indexes.
- at a later stage we'll add an easy way to opt-in to automatic catchup.

### Why isn't `hoursPerWeek` affecting the timeline?

- it's a field in the doc, so it's considered "timeless".
- if `hoursPerWeek` changes, we consider that a new "contract". Eg. end the old doc and start a new one.
