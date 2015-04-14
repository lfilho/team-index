team index
====

[![Build Status](https://secure.travis-ci.org/joshwnj/team-index.png)](http://travis-ci.org/joshwnj/team-index)

See [the test cases](./tests/index.js) for example usage.

App Config
----

The application expects some environment variables to be set:

- `PORT` (optional, default: 8000)
- `GOOGLE_CLIENT` (clientID for google OAuth)
- `GOOGLE_SECRET` (secret for google OAuth)
- `BASE_URL` (base URL for the site, eg. `http://localhost:8000`)

Setup
----

1. Install iojs. If you're running a recent version of nvm, `nvm install iojs && nvm use iojs` will suffice.
2. `npm install`

Startup
----

```
iojs index.js
```

Usage
----

`iojs . --source=SOURCE_FILENAME --team=TEAM_ID --ts=TIMESTAMP`

Where:
- `TIMESTAMP` is in milliseconds and
- `SOURCE_FILENAME` points to a `.ndjson` file.

To do
----

- [ ] trial archieml format for inputs
- [ ] add option to automatically catchup

FAQ
----

### Why don't indexes catchup automatically?

- manual catchup means we can choose to catchup less frequently for more expensive indexes.
- at a later stage we'll add an easy way to opt-in to automatic catchup.

### Why isn't `hoursPerWeek` affecting the timeline?

- it's a field in the doc, so it's considered "timeless".
- if `hoursPerWeek` changes, we consider that a new "contract". Eg. end the old doc and start a new one.
