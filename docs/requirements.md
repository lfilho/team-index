Auth
====

Site and API are restricted to authorized users
----

- accessing the API without a valid session gives you an error response.
- accessing the site without a valid session gives you a prompt to login.
- logging in with a non-whitelisted account gives you an error message.


UI displays info about current user
----

- name and profile pic are displayed in the header.


Wiki UI
====

Select a default doc
----

- on app initialization, create a placeholder doc with ID of `home` and type of `wikiPage`.
- when the user visits the wiki they return to the last doc they viewed. If this is their first visit, default to `home` doc.


Display a doc in View mode
----

- doc is rendered along with an Edit button.
- doc may have a custom render method, based on its `_type`.
- clicking the Edit button puts the doc into Edit mode: [[.][ Display a doc in Edit mode ]]


Display a doc in Edit mode
----

- a textarea displays the contents of the doc in archieml format.
- the doc preview live-updates as the textarea is edited.
- Close button can be clicked to return to View mode.
- if there are any unsaved changes, the Close button is relabeled to Cancel and prompts user for confirmation before closing.
- Save button can be clicked to save changes: [[.][ Save changes to a doc ]]


Save changes to a doc
----

- saving changes sends a patch object to the API with any values that are different to the original.
- UI displays confirmation of a succesful save.


Search for a docs
----

- user can enter a doc ID into the search bar and submit to be taken to that doc: [[.][ Display a doc in Edit mode ]]
- if the doc doesn't exist user is shown a form to create a new one: [[.][ Create a doc ]]


Browse to a doc
----

- user can enter a doc ID into the browser location bar to be taken to that doc: [[.][ Display a doc in View mode ]]
- if the doc doesn't exist user is shown a form to create a new one: [[.][ Create a doc ]]


Create a doc
----

- the Create form may have a pre-populated ID if the user arrived via search or direct browsing.
- if an ID is entered with invalid characters the user is prompted to fix.
- if an ID is entered with the ID of a doc that already exists, the user is prompted to fix and also given a link to view that doc.
- Doc type is selected from a dropdown of available types.
- clicking Create sends a request to the API to create the doc, and displays the Edit form: [[.][ Display a doc in Edit mode ]]
