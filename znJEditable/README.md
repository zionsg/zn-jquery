znJEditable jQuery plugin
-------------------------

##### version 1.1.0

Add-on for jEditable plugin.

##### Requirements

This add-on requires the jEditable in-place editing jQuery plugin (https://github.com/tuupola/jquery_jeditable).

##### Added features
- Input type for HTML5 elements such as number, date, time
- Use a `<select>` element to display or hide other elements
- Prepend action column to tables to add or delete rows
- Join text from cells for each row in a table using specified format and populate another element

##### Usage

See demo at http://demo.intzone.com/znjeditable

```
<link href="znJEditable/znjeditable.css" rel="stylesheet" type="text/css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="jeditable/jquery.jeditable.js"></script>
<script src="znJEditable/znjeditable.js"></script>
<script>
  $(body).znJEditable(true, {
      documentContent: '#document-content',
      nonContent: '.non-content',
      edit: '.edit',
      addRowText: 'add row',
      removeRowText: 'remove row'
  });
  
  $('#form-submit-button').click(function () {
      $('#form_hidden_textarea_field').html($.znJEditable.save());
  });
</script>
```
