team index
====

Install
----

- download `raw-entries.ndjson` to the team-index directory.
- `iojs . --source=SOURCE_FILENAME --team=TEAM_ID --ts=TIMESTAMP`

eg.

```
iojs . --source=./test-entries.ndjson --team=ATeam --ts=1428471352420
```

To do
----

- trial archieml format for inputs
- add option to automatically catchup


FAQ
----

### Why don't indexes catchup automatically?

- manual catchup means we can choose to catchup less frequently for more expensive indexes.
- at a later stage we'll add an easy way to opt-in to automatic catchup.

### Why isn't hoursPerWeek affecting the timeline?

- it's a field in the doc, so it's considered "timeless".
- if `hoursPerWeek` changes, we consider that a new "contract". Eg. end the old doc and start a new one.
