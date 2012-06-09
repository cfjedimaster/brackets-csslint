/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window */

define(function (require, exports, module) {
    'use strict';

    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        Menus                   = brackets.getModule("command/Menus");

    require("csslint/csslint");
    
    //commands
    var VIEW_HIDE_CSSLINT = "csslint.run";

    function _handleShowCSSLint() {
        console.log("Running _handleShowCSSlint");    
        var $csslint = $("#csslint");
        
        if ($csslint.css("display") === "none") {
            $csslint.show();
            CommandManager.get(VIEW_HIDE_CSSLINT).setName("Disable CSSLint");
            _handleLint();
        } else {
            $csslint.hide();
            CommandManager.get(VIEW_HIDE_CSSLINT).setName("Enable CSSLint");
        }
        EditorManager.resizeEditor();

    }
    
    function _handleLint() {
        var messages, results;
        
        console.log("Running _handleLint()");
        var editor = EditorManager.getCurrentFullEditor();
        var text = editor.document.getText();
console.dir(editor);
        results = CSSLint.verify(text);
        messages = results.messages;
        if(results.messages.length) {

            var $csslintTable = $("<table class='zebra-striped condensed-table'>").append("<tbody>");
            $("<tr><th>Line</th><th>Declaration</th><th>Type</th><th>Message</th></tr>").appendTo($csslintTable);

            results.messages.forEach(function (item) {
                var makeCell = function (content) {
                    return $("<td/>").html(content);
                };

                //sometimes line is blank, as is evidence
                if(!item.line) item.line = "";
                if(!item.evidence) item.evidence="";
                
                var $row = $("<tr/>")
                            .append(makeCell(item.line))
                            .append(makeCell(item.evidence))
                            .append(makeCell(item.type))
                            .append(makeCell(item.message))
                            .appendTo($csslintTable);

            });

            $("#csslint .table-container")
            .empty()
            .append($csslintTable);
                
        } else {
         console.log("no csslint issues");   
        }
        console.dir(results);
    }
    
    CommandManager.register("Enable CSSLint", VIEW_HIDE_CSSLINT, _handleShowCSSLint);

    function init() {
        
        //add the HTML UI
        $('.content').append('  <div id="csslint" class="bottom-panel">'
                             + '  <div class="toolbar simple-toolbar-layout">'
                             + '    <div class="title">CSSLint</div><a href="#" class="close">&times;</a>'
                             + '  </div>'
                             + '  <div class="table-container"/>'
                             + '</div>');
        $('#csslint').hide();
        
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem("menu-csslint-view", VIEW_HIDE_CSSLINT, "", Menus.AFTER, "menu-view-sidebar");

        $('#csslint .close').click(function () {
            CommandManager.execute(VIEW_HIDE_CSSLINT);
        });

    }
    
    init();
    
});