/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, CSSLint, Mustache */

define(function (require, exports, module) {
    'use strict';

    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        Menus                   = brackets.getModule("command/Menus"),
        Resizer                 = brackets.getModule("utils/Resizer"),
        ExtensionUtils          = brackets.getModule("utils/ExtensionUtils");

    var panelHtml               = require("text!templates/bottom-panel.html"),
        tableHtml               = require("text!templates/csslint-table.html"),
        HEADER_HEIGHT           = 27;

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
            var $selectedRow;

            var html = Mustache.render(tableHtml, {reportList: results.messages});

            $("#csslint .resizable-content")
                .empty()
                .append(html);
            
            $("#csslint .resizable-content").find("tr").on("click", function (e) {
                if ($selectedRow) {
                    $selectedRow.removeClass("selected");
                }

                $(this).addClass("selected");
                $selectedRow = $(this);
                var lineTd = $(this).find("td.line");
                var line = lineTd.text();
                var col = lineTd.data("col");

                var editor = EditorManager.getCurrentFullEditor();
                editor.setCursorPos(line - 1, col - 1);
                EditorManager.focusEditor();

            });

        } else {
            $("#csslint .resizable-content")
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
        
        var s;

        ExtensionUtils.loadStyleSheet(module, "csslint.css");

        s = Mustache.render(panelHtml);
        $(s).insertBefore("#status-bar");

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(VIEW_HIDE_CSSLINT, "", Menus.AFTER);

        $('#csslint .csslint-close').click(function () {
            CommandManager.execute(VIEW_HIDE_CSSLINT);
        });


        // AppInit.htmlReady() has already executed before extensions are loaded
        // so, for now, we need to call this ourself
        Resizer.makeResizable($('#csslint').get(0), "vert", "top", 200);

    }
    
    init();
    
});