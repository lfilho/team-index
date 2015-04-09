UI
====

I'm imagining the end result will be something like a wiki, but each "wiki page" can also contain data that you can query and use as the data source for any other application (like the chart / dashboard).

- [http://screencast.com/t/N4vS3aPIwdO](Mockup)
- you can also run the mockup from the files in [./ui-mockup](ui-mockup/)

Enter an ID
----

- as you start typing a Doc ID, you get autocomplete suggestions for an existing doc with that ID.
- if you select an existing doc the form populates with that doc's info for an update.
- if you enter an ID with no matching doc this is considered a new doc.

Enter a Type
----

- in the case of updating an existing doc, the Type field will be populated and readonly.
- for new docs, the Type field functions similarly to the ID field. You get autocomplete to match known types, or you can enter a brand new type.

Enter body information
----

- using [http://archieml.org/](ArchieML) format gives an easy way to write key/values, arrays, object etc.
- as you type the Preview section is live-updated.
- the way Preview is rendered can be customized by registering a javascript function for a certain `_type`.

Save
----

- saving generates a new entry containing any changes you made and appends it to the source index.
