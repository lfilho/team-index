team index
====

[![Build Status](https://secure.travis-ci.org/joshwnj/team-index.png)](http://travis-ci.org/joshwnj/team-index)

See [the test cases](./tests/index.js) for example usage.

Installation
----

First, install iojs. Using a recent version of nvm:

```
nvm install iojs
nvm use iojs
```

And then:

```
npm install
gem install sass
```

Configuration
----

1. Duplicate `.env.example` and `.email-whitelist.json.example`
2. Remove the `.example` suffix of each one
3. Change theirs contents accordingly (note: they are safely gitignored).

Running the web server
----

```
npm run build-watch &
iojs .
```

See [[Team Index]] docs in [./index.js](./index.js) for more info.

Running the example
----

```
iojs example.js --source=SOURCE_FILENAME --team=TEAM_ID --ts=TIMESTAMP
```

Where:
- `SOURCE_FILENAME` points to a `.ndjson` file.
- `TEAM_ID` matches one of the teams in your source data
- `TIMESTAMP` is the date in milliseconds (eg. `Date.now()`)

Try it out with the test data:

```
iojs example.js --source=test-entries.ndjson --team=ATeam --ts=1428471302421
```

FAQ
----

### Why don't indexes catchup automatically?

- manual catchup means we can choose to catchup less frequently for more expensive indexes.
- at a later stage we'll add an easy way to opt-in to automatic catchup.

### Why isn't `hoursPerWeek` affecting the timeline?

- it's a field in the doc, so it's considered "timeless".
- if `hoursPerWeek` changes, we consider that a new "contract". Eg. end the old doc and start a new one.
