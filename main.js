/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, CSSLint, Mustache */

define(function (require, exports, module) {
	'use strict';

	var AppInit                 = brackets.getModule("utils/AppInit"),
		CodeInspection			= brackets.getModule("language/CodeInspection");

	require("csslint/csslint");

	function cssLinter(text, fullPath) {
		var results;

		results = CSSLint.verify(text);

		if (results.messages.length) {
			var result = { errors: [] };
console.log(results.messages);
			for(var i=0, len=results.messages.length; i<len; i++) {

				/*
				Currently the Brackets Lint API doesn't work with warnings that are 'document' level.
				See bug: https://github.com/adobe/brackets/issues/5452
				*/
				var messageOb = results.messages[i];

				if(!messageOb.line) continue;
				//default
				var type = CodeInspection.Type.WARNING;

				if(messageOb.type === "error") {
					type = CodeInspection.Type.ERROR;
				} else if(messageOb.type === "warning") {
					type = CodeInspection.Type.WARNING;
				}

				var message = messageOb.rule.name + " - " + messageOb.message;
				message += " (" + messageOb.rule.id + ")";
				
				result.errors.push({
					pos: {line:messageOb.line-1, ch:messageOb.col},
					message:message,
					
					type:type
				});
			}

			return result;
		} else {
			//no errors
			return null;
		}

	}

	CodeInspection.register("css", {
		name: "CSSLint",
		scanFile: cssLinter
	});
	CodeInspection.register("scss", {
		name: "CSSLint",
		scanFile: cssLinter
	});

	//This is a workaround due to some loading issues in Sprint 31. 
	//See bug for details: https://github.com/adobe/brackets/issues/5442
	CodeInspection.toggleEnabled();
	CodeInspection.toggleEnabled();

});
