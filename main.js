/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, CSSLint */

define(function (require, exports, module) {
    'use strict';

    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        Menus                   = brackets.getModule("command/Menus"),
        Resizer                 = brackets.getModule("utils/Resizer");


    require("csslint/csslint");
    
    //commands
    var VIEW_HIDE_CSSLINT = "csslint.run";
    
    function _handleLint() {
        var messages, results;
        
        var editor = EditorManager.getCurrentFullEditor();
        if (!editor) {
            _handleShowCSSLint();
            return;
        }
        var text = editor.document.getText();
        results = CSSLint.verify(text);
        messages = results.messages;
                
        if (results.messages.length) {

            var $csslintTable = $("<table class='zebra-striped condensed-table' style='table-layout: fixed; width: 100%'>").append("<tbody>");
            $("<tr><th>Line</th><th>Declaration</th><th>Type</th><th>Message</th></tr>").appendTo($csslintTable);

            var $selectedRow;
            
            results.messages.forEach(function (item) {
                var makeCell = function (content) {
                    return $("<td style='word-wrap: break-word' />").text(content);
                };

                //sometimes line is blank, as is evidence
                if (!item.line) { item.line = ""; }
                if (!item.evidence) { item.evidence = ""; }

                var $row = $("<tr/>")
                            .append(makeCell(item.line))
                            .append(makeCell(item.evidence))
                            .append(makeCell(item.type))
                            .append(makeCell(item.message))
                            .appendTo($csslintTable);
                $row.click(function () {
                    if ($selectedRow) {
                        $selectedRow.removeClass("selected");
                    }
                    $row.addClass("selected");
                    $selectedRow = $row;

                    var editor = EditorManager.getCurrentFullEditor();
                    editor.setCursorPos(item.line - 1, item.col - 1);
                    EditorManager.focusEditor();
                });

            });

            $("#csslint .table-container")
                .empty()
                .append($csslintTable);
                
        } else {
            //todo - tell the user no issues
            $("#csslint .table-container")
                .empty()
                .append("<p>No issues.</p>");
        }
    }

    function _handleShowCSSLint() {
        var $csslint = $("#csslint");
        
        if ($csslint.css("display") === "none") {
            $csslint.show();
            CommandManager.get(VIEW_HIDE_CSSLINT).setChecked(true);
            _handleLint();
            $(DocumentManager).on("currentDocumentChange documentSaved", _handleLint);
        } else {
            $csslint.hide();
            CommandManager.get(VIEW_HIDE_CSSLINT).setChecked(false);
            $(DocumentManager).off("currentDocumentChange documentSaved", null,  _handleLint);
        }
        EditorManager.resizeEditor();

    }
    
    CommandManager.register("Enable CSSLint", VIEW_HIDE_CSSLINT, _handleShowCSSLint);

    function init() {
        
        //add the HTML UI
        var content = '  <div id="csslint" class="bottom-panel">'
                             + '  <div class="toolbar simple-toolbar-layout">'
                             + '    <div class="title">CSSLint</div><a href="#" class="close">&times;</a>'
                             + '  </div>'
                             + '  <div class="table-container"/>'
                             + '</div>';

        $(content).insertBefore("#status-bar");

        $('#csslint').hide();
        
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(VIEW_HIDE_CSSLINT, "", Menus.AFTER, "menu-view-sidebar");

        $('#csslint .close').click(function () {
            CommandManager.execute(VIEW_HIDE_CSSLINT);
        });

        // AppInit.htmlReady() has already executed before extensions are loaded
        // so, for now, we need to call this ourself
        Resizer.makeResizable($('#csslint').get(0), "vert", "top", 200);

    }
    
    init();
    
});