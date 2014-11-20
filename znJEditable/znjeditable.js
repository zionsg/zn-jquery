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
     * @param string nonContentAction  Either 'hide' or 'remove'. Action to perform when populating
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
     * @param string dataJoiner        Attribute for editTable table. Tables with this attribute set to 1
     *                                 will populate elements with dataJoin attribute set to the table id when
     *                                 the table content changes.
     * @param string dataJoin          Attribute. Elements with this attribute set to id of table
     *                                 with dataJoiner attribute set will be populated dynamically when
     *                                 the table content changes.
     * @param string dataJoinRow       Attribute for elements with dataJoin attribute. Element's value specifies format
     *                                 for joining <td> cells for each <tr> row in table specified in dataJoin attribute.
     *                                 @see $.znJEditable.onJoinerChangeFunc() for usage.
     * @param string dataJoinGlue      Attribute for elements with dataJoin attribute. Element's value specifies text
     *                                 for joining formatted text for each row.
     *                                 @see $.znJEditable.onJoinerChangeFunc() for usage.
     * @param string dataJoinLastGlue  Attribute for elements with dataJoin attribute. Element's value specifies text
     *                                 for joining formatted text for the last 2 rows.
     *                                 @see $.znJEditable.onJoinerChangeFunc() for usage.
     * @param string dataJoinResult    Attribute for elements with dataJoin attribute. Element's value specifies format
     *                                 for final joined text from the dataJoiner table.
     *                                 @see $.znJEditable.onJoinerChangeFunc() for usage.
     * @param string dataJoinEmpty     Attribute for elements with dataJoin attribute. Element's value specifies text
     *                                 to return if final joined text from the dataJoiner table is empty.
     *                                 @see $.znJEditable.onJoinerChangeFunc() for usage.
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
        dataJoiner: 'data-joiner',
        dataJoin: 'data-join',
        dataJoinRow: 'data-join-row',
        dataJoinGlue: 'data-join-glue',
        dataJoinLastGlue: 'data-join-last-glue',
        dataJoinResult: 'data-join-result',
        dataJoinEmpty: 'data-join-empty'
        // last element should not end with comma
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
            $('[' + this.config.dataJoiner + '] td').change(this.onJoinerChangeFunc).change(); // trigger on load

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

        // Apply jEditable to elements with edit class - input type can be specified via 'data-type' attribute
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

        // Event handlers for <select> elements with editChooser class to choose content to display/edit
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
            var editTableTemplate    = $.znJEditable.config.editTableTemplate,
                editTableActionClass = $.znJEditable.config.editTableAction.substr(1),
                addRowClass     = $.znJEditable.config.addRowLink.substr(1),
                addRowText      = $.znJEditable.config.addRowText,
                removeRowClass  = $.znJEditable.config.removeRowLink.substr(1),
                removeRowText   = $.znJEditable.config.removeRowText,
                dataInitialRows = $.znJEditable.config.dataInitialRows,
                initialRows = $.znJEditable.config.initialRows,
                addRowFunc  = $.znJEditable.addRowFunc;

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
        // If $table is passed in, table change event will not be triggered
        addRowFunc: function ($table, newRowHtml, rows) {
            var edit     = $.znJEditable.config.edit,
                editFunc = $.znJEditable.editFunc,
                editTableTemplate  = $.znJEditable.config.editTableTemplate,
                editTableAction    = $.znJEditable.config.editTableAction,
                removeRowLink      = $.znJEditable.config.removeRowLink,
                removeRowFunc      = $.znJEditable.removeRowFunc,
                dataJoiner         = $.znJEditable.config.dataJoiner,
                onJoinerChangeFunc = $.znJEditable.onJoinerChangeFunc,
                triggerChange      = false;

            if (!$table.length) {
                $table = $(this).closest('table');
                triggerChange = true;
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
                // apply editable, change event and click event for remove link
                $(edit, $newRow).each(editFunc).change(onJoinerChangeFunc);
                $(editTableAction + ' a' + removeRowLink, $newRow).click(removeRowFunc);
                $table.append($newRow);
            }

            if (triggerChange && $table.attr(dataJoiner)) {
                $('td', $table).change(); // trigger change event for dataJoiner table
            }
            return false;
        },

        // Function for removing row from editTable table
        removeRowFunc: function () {
            var dataJoiner = $.znJEditable.config.dataJoiner,
                $table = $(this).closest('table');

            $(this).closest('tr').remove();
            if ($table.attr(dataJoiner)) {
                $('td', $table).change(); // trigger change event for dataJoiner table
            }
            return false;
        },

        // On change, tables with dataJoiner attribute set to 1 will populate DOM elements
        // with dataJoin attribute set to the table id. The following attributes apply
        // to those elements with dataJoin attribute.
        //
        // The dataJoinRow attribute specifies how values from <td> cells for each <tr> row are combined,
        // with {1} referring to 1st <td> (action column ignored), {2} referring to 2nd <td> and so on and
        // {row} referring to current row number.
        //
        // The dataJoinGlue attribute specifies the text joining the result from each row, eg. ", ".
        // The dataJoinLastGlue attribute specifies the text joining the result for the last 2 rows, eg. " and ".
        //
        // The dataJoinResult attribute specifies the format for the final joined text from the dataJoiner table
        // if the text is not empty, with {text} referring to the joined text, {rows} referring to total no. of rows,
        // string for {0:string} shown if there are 0 rows, string for {1:string} shown if only 1 row,
        // string for {n:string} shown if there is more than 1 row and string for {+:string} shown if 1 or more rows.
        //
        // The dataJoinEmpty attribute specifies the text to return if the final joined text is empty, with the
        // same placeholders as dataJoinResult except {text}.
        //
        onJoinerChangeFunc: function () {
            var $table = $(this).closest('table'),
                editTableTemplateClass = $.znJEditable.config.editTableTemplate.substr(1),
                editTableActionClass   = $.znJEditable.config.editTableAction.substr(1),
                dataJoin         = $.znJEditable.config.dataJoin,
                dataJoinRow      = $.znJEditable.config.dataJoinRow,
                dataJoinGlue     = $.znJEditable.config.dataJoinGlue,
                dataJoinLastGlue = $.znJEditable.config.dataJoinLastGlue,
                dataJoinResult   = $.znJEditable.config.dataJoinResult,
                dataJoinEmpty    = $.znJEditable.config.dataJoinEmpty,
                noneRegex      = /(\{0:([^\}]*)\})/g, // 'g' modifier searches for all occurrences
                oneRegex       = /(\{1:([^\}]*)\})/g, // important for 2nd group not to match closing brace
                manyRegex      = /(\{n:([^\}]*)\})/g,
                oneOrManyRegex = /(\{\+:([^\}]*)\})/g,
                regexReplace   = function (match, $1, $2) { return $2; },
                regexRemove    = function (match, $1, $2) { return ''; };

            // Confirm outstanding input before joining cells - change() will not be called if Cancel button is pressed
            $('button[type="submit"]', this).click();

            // Run thru elements with dataJoin attribute set to table id and use their format
            $('[' + dataJoin + '="#' + $table.attr('id') + '"]').each(function () {
                var rowFormat   = $(this).attr(dataJoinRow) || '',
                    glue        = $(this).attr(dataJoinGlue) || '',
                    lastGlue    = $(this).attr(dataJoinLastGlue) || glue,
                    rowCnt      = 0,
                    tableResult = [],
                    resultCnt   = 0,
                    text        = '',
                    result      = '';

                // Continue even if rowFormat is empty as the element may just want to count rows in the final result
                $('tr', $table).each(function (rowIndex) {
                    var rowResult = rowFormat;
                    if (!$(this).hasClass(editTableTemplateClass) && !$('th', this).length) {
                        rowCnt++;
                        if (rowFormat) {
                            // Cannot replace {row} with rowIndex as it includes header row and template row
                            rowResult = rowResult.replace('{row}', rowCnt);

                            $('td', this).each(function (colIndex) {
                                if (!$(this).hasClass(editTableActionClass)) { // assumes action column is index 0
                                    rowResult = rowResult.replace('{' + colIndex + '}', $(this).text().trim());
                                }
                            });
                            tableResult.push(rowResult);
                        }
                    }
                });

                // Join rows
                resultCnt = tableResult.length;
                if (0 == resultCnt) {
                    text = '';
                } else if (1 == resultCnt) {
                    text = tableResult[0];
                } else {
                    text = tableResult.slice(0, resultCnt - 1).join(glue) // note that slice does not include end
                         + lastGlue
                         + tableResult[resultCnt - 1];
                }

                // Format final result
                if (text) {
                    result = ($(this).attr(dataJoinResult) || '').replace('{text}', text);
                } else {
                    result = ($(this).attr(dataJoinEmpty) || '');
                }
                result = result.replace('{rows}', rowCnt)
                               .replace(noneRegex, (!rowCnt ? regexReplace : regexRemove))
                               .replace(oneRegex,  (1 == rowCnt ? regexReplace : regexRemove))
                               .replace(manyRegex, (rowCnt > 1 ? regexReplace : regexRemove))
                               .replace(oneOrManyRegex, (rowCnt >= 1 ? regexReplace : regexRemove));

                // Populate element
                $(this).html(result);
            });
        },

        // Call this function upon form submission to copy content, hide non-content and remove action column from editTable tables
        // Returns HTML content from documentContent
        save: function () {
            var nonContent = this.config.nonContent,
                nonContentAction = this.config.nonContentAction;

            $(this.config.documentContent + ' button[type="cancel"]').click(); // cancel all outstanding inputs
            $(this.config.editTableAction).remove(); // remove editTable action columns
            if ('remove' == nonContentAction) { // remove non-content
                $(nonContent).remove();
            } else { // hide non-content by default
                $(nonContent).hide();
            }

            return $(this.config.documentContent).html();
        }

    }; // end $.znJEditable

}(jQuery));
