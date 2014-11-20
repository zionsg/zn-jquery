/**
 * znJEditable jQuery jEditable add-on plugin
 *
 * @author  Zion Ng <zion@intzone.com>
 * @link    https://github.com/tuupola/jquery_jeditable for jEditable repository
 * @link    https://github.com/zionsg/zn-jquery/tree/master/znJEditable for canonical source repository
 * @version 1.1.0
 */

(function ($) {

    /**
     * Constructor
     *
     * @param  bool   enable  Optional. Default=true. Whether to enable jEditable and add-ons.
     *                        Set this to false if edited content is submitted back to the same page
     *                        for viewing of final result, ie. non-content and table action columns should not be shown.
     * @param  object options Optional. See $.fn.znJEditable.defaults for available options
     * @return this
     */
    $.fn.znJEditable = function (enable, options) {
        $.znJEditable.config = $.extend({}, $.fn.znJEditable.defaults, options); // merge defaults with user options
        if (enable !== false) {
            $.znJEditable.init();
        }
        return this;
    };

    /**
     * Plugin defaults – added as a property on the plugin function
     *
     * Content refers to document text comprising static HTML, jEditable elements and non-content.
     * Non-content is shown only during editing and is hidden/deleted when the form is submitted.
     *
     * @param object jEditable         jEditable settings - not applied, just a placeholder option.
     * @param string documentContent   Single selector. Parent container for content. Form should not be in container.
     * @param string nonContent        Multiple selector. Non-content elements.
     * @param string nonContentAction  Either 'hide' or 'delete'. Action to perform when populating
     *                                 editContent element for form submission. Default is 'hide' which
     *I                                allows for content to be edited again.
     * @param string edit              Multiple selector. jEditable will be applied to these elements.
     * @param string dataType          Attribute for jEditable elements to state input type, eg. data-type="text".
     * @param string dataOptions       Attribute for jEditable <select> elements to pass in options using JSON,
     *                                 eg. data-options="{'A':'Alpha','B':'Beta'}".
     * @param string editChooser       Mutiple selector for <select> elements. When value changes,
     *                                 the element set by the selected option will be displayed
     *                                 while the elements set by the rest will be hidden.
     * @param string dataChoice        Single selector. Attribute for editChooser elements to specify selected option.
     * @param string dataChooser       Attribute. When the value of an editChooser changes, elements with this attribute
     *                                 set to the editChooser id will be hidden and selected option will be displayed.
     * @param string editTable         Multiple selector. An action column will be prepended to all rows
     *                                 in these tables to allow adding and removing of rows. Each table
     *                                 must have a row set to editTableTemplate selector for adding of
     *                                 rows to work.
     * @param string editTableTemplate Single class selector for each editTable table. This row will be hidden
     *                                 and cloned when adding rows for the table.
     * @param string editTableAction   Class selector for add/remove links for each editTable table.
     * @param string addRowLink        Single selector for each editTable table. Added to link for adding rows.
     * @param string addRowText        Text to display for link to add rows.
     * @param string removeRowLink     Multiple selector for each editTable table.
     *                                 Added to links for removing rows.
     * @param string removeRowText     Text to display for links to remove rows.
     * @param string dataInitialRows   Attribute for editTable table. Table's value sets initial rows to add.
     * @param int    initalRows        Default value for initial rows to add for editTable tables.
     * @param string dataJoinFormat    Attribute for editTable tables. Tables with this attribute set
     *                                 will populate elements with dataJoiner attribute set to the table id
     *                                 upon change. Table's value specifies how values from each <td> for
     *                                 each row will be joined, with {1} referring to the 1st <td> (ignoring
     *                                 prepended action column), {2} for the 2nd <td> and so on,
     *                                 eg. data-join-format="Mr {1} {2}".
     * @param string dataJoinGlue      Attribute for editTable table. Table's value specifies text for joining
     *                                 formatted text for each row, eg. data-join-glue=" and ".
     * @param string dataJoinStart     Attribute for editTable table. Table's value specifies text to prepend to final
     *                                 joined text for table if not empty, eg. data-join-start="The people are ".
     * @param string dataJoinEnd       Attribute for editTable table. Table's value specifies text to append to final
     *                                 joined text for table if not empty, eg. data-join-end=" and we thank them.".
     * @param string dataJoiner        Attribute. Elements with this attribute set to id of table
     *                                 with dataJoinFormat attribute set will be populated dynamically when
     *                                 the table content changes.
     */
    $.fn.znJEditable.defaults = {
        jEditable: {},
        documentContent: '#document-content',
        nonContent: '.non-content',
        nonContentAction: 'hide',
        edit: '.edit',
        dataType: 'data-type',
        dataOptions: 'data-options',
        dataAttributes: 'data-attr',
        editChooser: '.edit-chooser',
        dataChoice: 'data-choice',
        dataChooser: 'data-chooser',
        editTable: '.edit-table',
        editTableTemplate: '.edit-table-template',
        editTableAction: '.edit-table-action',
        addRowLink: '.add',
        addRowText: 'add row',
        removeRowLink: '.remove',
        removeRowText: 'remove row',
        dataInitialRows: 'data-initial-rows',
        initialRows: 3,
        dataJoinFormat: 'data-join-format',
        dataJoinGlue: 'data-join-glue',
        dataJoinStart: 'data-join-start',
        dataJoinEnd: 'data-join-end',
        dataJoiner: 'data-joiner',
    };

    /**
     * Add-ons for jEditable
     *
     * Note for passing JSON string via attributes: jEditable will save the HTML contents with attributes
     * quoted with double quotes hence the JSON string will need to use single quotes
     * and use \' to escape a literal single quote. Eg: <span data-options="{'A':'Alpha','B':'Beta'}">
     */
    $.znJEditable = {
        config: {},

        init: function () {
            this.addHtml5InputType();
            $(this.config.edit).each(this.editFunc);

            $(this.config.editChooser).each(this.editChooserOnLoadFunc);
            $(this.config.editChooser).change(this.editChooserOnChangeFunc);
            $(this.config.editChooser).change(); // trigger on load

            $(this.config.editTable).each(this.editTableFunc);
            $(this.config.editTableAction + ' a' + this.config.addRowLink).click(this.addRowFunc);
            $(this.config.editTableAction + ' a' + this.config.removeRowLink).click(this.removeRowFunc);
            $('[' + this.config.dataJoinFormat + '] td').change(this.onJoinerChangeFunc).change(); // trigger on load

            // Show .non-content when editing document
            $(this.config.nonContent).show();
        },

        // Add custom HTML5 jEditable input - attributes are passed via JSON string in 'data-attr' attribute
        // Eg: <span class="edit" data-type="html5" data-attr="{'type':'number','min':0,'test':'z\'s test'}"></span>
        addHtml5InputType: function () {
            $.editable.addInputType('html5', {
                element : function (settings, original) {
                    var dataAttributes = $.znJEditable.config.dataAttributes,
                        attributes = {},
                        inputStr = '',
                        input = null;

                    try { // try-catch in case of error due to invalid JSON
                        attributes = $.parseJSON(
                            // change unescaped single quotes to double quotes to create valid JSON string for parsing
                            $(original).attr(dataAttributes).replace(
                                /(.)(')/gi,
                                function (match, $1, $2, offset, original) {
                                    return ('\\' == $1 ? "'" : ($1 + '"'));
                                }
                            )
                        );
                    } catch (e) {
                        console.log(e.message);
                    }
                    attributes.type = attributes.type || 'text'; // ensure type is set

                    $.each(attributes, function (key, value) {
                        inputStr += key + '="' + value + '" ';
                    });
                    input = $('<input ' + inputStr + '/>');
                    $(this).append(input);

                    return input;
                }
            });
        },

        // Apply jEditable to elements with 'edit' class - input type can be specified via 'data-type' attribute
        // Value-options for checkbox, radio and select elements can be set via 'data-options' attribute using JSON
        // Eg: <span class="edit" data-type="select" data-options="{'A':'Alpha','B':'Beta'}"
        //           placeholder="Name" title="Click to edit"></span>
        editFunc: function () {
            $(this).editable(function (value, settings) { return value; }, {
                type: $(this).attr($.znJEditable.config.dataType) || 'text',
                data: $(this).attr($.znJEditable.config.dataOptions) || '',
                placeholder: $(this).attr('placeholder') || 'Click to edit',
                tooltip: $(this).attr('title') || 'Click to edit...',
                cancel: 'Cancel',
                submit: 'OK'
            });
        },

        // Event handlers for <select> elements with 'edit-chooser' class to choose content to display/edit
        // Eg. 1 chooser (option values set to selectors) & 2 choices (data-chooser attribute set to chooser id):
        //     On load, the option with the value specified by data-choice attribute will be marked as selected
        // <select id="z-chooser" class="edit-chooser" data-choice="#b">
        //   <option value="#a">A</option><option value="#b">B</option>
        // </select>
        // <span id="a" data-chooser="#z-chooser">Content for A</span>
        // <span id="b" data-chooser="#z-chooser">Content for B</span>
        editChooserOnLoadFunc: function () {
            var dataChoice = $.znJEditable.config.dataChoice,
                choice = $(this).attr(dataChoice);
            if (undefined === choice) {
                return;
            }
            $(this).children('option').attr('selected', null); // clear previous selections
            $(this).children('option[value="' + choice + '"]').attr('selected', 'selected'); // save selection
        },
        editChooserOnChangeFunc: function () {
            var dataChooser = $.znJEditable.config.dataChooser,
                value = $(this).val();
            $('[' + dataChooser + '="#' + $(this).attr('id') + '"]').hide();
            $(value).show();
            $(this).children('option').attr('selected', null); // clear previous selections
            $(this).children('option[value="' + value + '"]').attr('selected', 'selected'); // save selection
        },

        // Function for editTable table
        editTableFunc: function () {
            var editTableTemplate = $.znJEditable.config.editTableTemplate,
                editTableActionClass = $.znJEditable.config.editTableAction.substr(1),
                addRowClass = $.znJEditable.config.addRowLink.substr(1),
                addRowText = $.znJEditable.config.addRowText,
                removeRowClass = $.znJEditable.config.removeRowLink.substr(1),
                removeRowText = $.znJEditable.config.removeRowText,
                dataInitialRows = $.znJEditable.config.dataInitialRows,
                initialRows = $.znJEditable.config.initialRows,
                addRowFunc = $.znJEditable.addRowFunc;

            $(editTableTemplate, this).hide();
            $('tr:first', this).prepend(
                  '<th class="' + editTableActionClass + '">'
                + '<a href="#" class="' + addRowClass + '">' + addRowText + '</a>'
                + '</th>'
            );
            $('tr', this).not(':first').prepend(
                  '<td class="' + editTableActionClass + '">'
                + '<a href="#" class="' + removeRowClass + '">' + removeRowText + '</a>'
                + '</td>'
            );

            var rowCnt = $('tr', this).length,
                $templateRow = $('tr' + editTableTemplate, this),
                newRowHtml;
            if ((rowCnt - 2) < initialRows && $templateRow.length) {
                // add initial rows if no other rows beside header & template rows
                newRowHtml = '<tr>' + $templateRow.html() + '</tr>';
                addRowFunc($(this), newRowHtml, ($(this).attr(dataInitialRows) || initialRows));
            }
        },

        // Function for adding row to editTable table
        // For every new row added, .editable must be re-applied and the click events for the 'remove row' links
        addRowFunc: function ($table, newRowHtml, rows) {
            var editTableTemplate = $.znJEditable.config.editTableTemplate,
                edit = $.znJEditable.config.edit,
                editFunc = $.znJEditable.editFunc,
                onJoinerChangeFunc = $.znJEditable.onJoinerChangeFunc,
                editTableAction = $.znJEditable.config.editTableAction,
                removeRowLink = $.znJEditable.config.removeRowLink,
                removeRowFunc = $.znJEditable.removeRowFunc,
                dataJoinFormat = $.znJEditable.config.dataJoinFormat;

            if (!$table.length) {
                $table = $(this).closest('table');
            }
            if (!newRowHtml) {
                var $templateRow = $('tr' + editTableTemplate, $table);
                if ($templateRow.length) {
                    newRowHtml = '<tr>' + $templateRow.html() + '</tr>';
                }
            }
            rows = rows || 1;

            for (var i = 1; i <= rows; i++) {
                $newRow = $(newRowHtml);
                $(edit, $newRow).each(editFunc).change(onJoinerChangeFunc); // apply editable and change event
                $(editTableAction + ' a' + removeRowLink, $newRow).click(removeRowFunc); // apply click event to remove link
                $table.append($newRow);
            }

            if ($table.attr(dataJoinFormat)) {
                $('td', $table).change(); // trigger change event for table with data-join-format
            }
            return false;
        },

        // Function for removing row from editTable table
        removeRowFunc: function () {
            var dataJoinFormat = $.znJEditable.config.dataJoinFormat,
                $table = $(this).closest('table');

            $(this).closest('tr').remove();
            if ($table.attr(dataJoinFormat)) {
                $('td', $table).change(); // trigger change event for table with data-join-format
            }
            return false;
        },

        // Tables with attribute data-join-format will populate DOM elements
        // with attribute data-joiner set to the table id.
        // The table's data-join-format attribute specifies how values from <td> for each row are combined,
        // with {1} referring to 1st <td> (action column ignored), {2} referring to 2nd <td> and so on.
        // The table's data-join-glue attribute specifies the text joining the result from each row, eg. " and ".
        onJoinerChangeFunc: function () {
            var $table = $(this).closest('table'),
                rowFormat = $table.attr($.znJEditable.config.dataJoinFormat), // table attribute
                editTableTemplateClass = $.znJEditable.config.editTableTemplate.substr(1),
                editTableActionClass = $.znJEditable.config.editTableAction.substr(1),
                dataJoinGlue  = $.znJEditable.config.dataJoinGlue,
                dataJoinStart = $.znJEditable.config.dataJoinStart,
                dataJoinEnd   = $.znJEditable.config.dataJoinEnd,
                dataJoiner = $.znJEditable.config.dataJoiner,
                tableResult = [];

            if (!rowFormat) {
                return;
            }

            // Confirm outstanding input - change() will not be called if Cancel button is pressed
            $('button[type="submit"]', this).click();
            $('tr', $table).each(function () {
                var rowResult = rowFormat;
                if (!$(this).hasClass(editTableTemplateClass) && !$('th', this).length) {
                    $('td', this).each(function (index) {
                        if (!$(this).hasClass(editTableActionClass)) {
                            rowResult = rowResult.replace('{' + index + '}', $(this).text().trim());
                        }
                    });
                    tableResult.push(rowResult);
                }
            });
            result = tableResult.join($table.attr(dataJoinGlue));
            if (result) {
                result = ($table.attr(dataJoinStart) || '') + result + ($table.attr(dataJoinEnd) || '');
            }
            $('[' + dataJoiner + '="#' + $table.attr('id') + '"]').html(result);
        },

        // Call this function upon form submission to copy content, hide non-content and remove action column from editTable tables
        // Returns HTML content from documentContent
        save: function () {
            $(this.config.documentContent + ' button[type="cancel"]').click(); // cancel all outstanding inputs
            $(this.config.nonContent).hide(); // hide all non-content
            $(this.config.editTableAction).remove(); // remove editTable action columns
            return $(this.config.documentContent).html();
        }

    }; // end $.znJEditable

}(jQuery));
