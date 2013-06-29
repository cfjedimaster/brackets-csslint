/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, CSSLint, Mustache */

define(function (require, exports, module) {
	'use strict';

	var AppInit                 = brackets.getModule("utils/AppInit"),
        Commands                = brackets.getModule("command/Commands"),
		CommandManager          = brackets.getModule("command/CommandManager"),
		DocumentManager         = brackets.getModule("document/DocumentManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
		ExtensionUtils          = brackets.getModule("utils/ExtensionUtils"),
        LanguageManager         = brackets.getModule("language/LanguageManager"),
		Menus                   = brackets.getModule("command/Menus"),
		PanelManager			= brackets.getModule("view/PanelManager");

	var panelHtml               = require("text!templates/bottom-panel.html"),
		tableHtml               = require("text!templates/csslint-table.html");

	require("csslint/csslint");

	// Commands
	var VIEW_HIDE_CSSLINT = "csslint.run";

	//Determines if we are enabled or not. Previously we based this on if we could
	//see the panel, but now the panel will be hidden on non-CSS files
	var cssLintEnabled = false;

	var $csslint;

	function isCSSDoc(fileEntry) {
		var language = LanguageManager.getLanguageForPath(fileEntry);
		// Maybe in the future LESS
		return (language === "css" || language === "sass");
	}

	function _handleLint() {
		var messages,
            results;

		var editor = EditorManager.getCurrentFullEditor();
		if (!editor) {
			$csslint.hide();
			EditorManager.resizeEditor();
			return;
		}

		if (!isCSSDoc(editor.document)) {
			$csslint.hide();
			EditorManager.resizeEditor();
			return;
		} else {
			$csslint.show();
			EditorManager.resizeEditor();
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
		if (cssLintEnabled) {
			cssLintEnabled = false;
			CommandManager.get(VIEW_HIDE_CSSLINT).setChecked(false);
			$(DocumentManager).off("currentDocumentChange documentSaved", null,  _handleLint);
			// if visible, hide
			$csslint.hide();
			EditorManager.resizeEditor();

		} else {
			cssLintEnabled = true;
			CommandManager.get(VIEW_HIDE_CSSLINT).setChecked(true);
			$(DocumentManager).on("currentDocumentChange documentSaved", _handleLint);
			_handleLint();
		}

	}

	CommandManager.register("Enable CSSLint", VIEW_HIDE_CSSLINT, _handleShowCSSLint);

    AppInit.htmlReady(function () {
		var s;

		ExtensionUtils.loadStyleSheet(module, "csslint.css");

		s = Mustache.render(panelHtml);

		$csslint = PanelManager.createBottomPanel("csslint.display.csslint", $(s), 200);

		var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
		menu.addMenuItem(VIEW_HIDE_CSSLINT, "", Menus.AFTER);


		$('#csslint .csslint-close').click(function () {
			CommandManager.execute(VIEW_HIDE_CSSLINT);
		});

    });

});
