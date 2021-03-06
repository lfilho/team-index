Wiki
====

Loading an existing doc
----

Actions:
- browse to the Wiki
- expect to see all fields empty, and the "Type" field hidden
- enter the ID of an existing doc into the "ID" field
- click the "load" button
- expect to see the "Type" and "Body" fields populated with doc state, and the "Type" field appear
- expect the "ID" and "Type" fields to be readonly

Creating a new doc
----

Actions:
- enter the ID of a doc which doesn't exist into the "ID" field
- click the "load" button
- expect to see the "Type" field appear with no content
- enter data into "Type" and "Body" fields
- click "Save"
- expect to see a message indicating that the doc was saved

Live preview
----

Actions:
- after loading a doc, update the "Body" with data in ArchieML format
- expect to see the Preview update as you type
