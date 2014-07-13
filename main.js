/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, CSSLint, Mustache */

define(function (require, exports, module) {
	'use strict';

	var AppInit                 = brackets.getModule("utils/AppInit"),
		CodeInspection			= brackets.getModule("language/CodeInspection"),
		DocumentManager         = brackets.getModule("document/DocumentManager"),
		FileSystem              = brackets.getModule("filesystem/FileSystem"),
		ProjectManager          = brackets.getModule("project/ProjectManager");

	require("csslint/csslint");

	var _configFileName = ".csslintrc",
		config = {};

	function cssLinter(text, fullPath) {
		var results;

		// Merge default CSSLint ruleset with the custom .csslintrc config
		var ruleset = $.extend(CSSLint.getRuleset(), config.options);

		// Execute CSSLint
		results = CSSLint.verify(text, ruleset);

		if (results.messages.length) {
			var result = { errors: [] };

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


	/**
     * Loads project-wide CSSLint configuration.
     *
     * CSSLint project file should be located at <Project Root>/.csslintrc. It
     * is loaded each time project is changed or the configuration file is
     * modified.
     *
     * @return Promise to return CSSLint configuration object.
     *
     */
    function _loadProjectConfig() {

        var projectRootEntry = ProjectManager.getProjectRoot(),
            result = new $.Deferred(),
            file,
            config;

        file = FileSystem.getFileForPath(projectRootEntry.fullPath + _configFileName);
        file.read(function (err, content) {
            if (!err) {
                var cfg = {};
		try {
                    config = JSON.parse(content);
                } catch (e) {
                    console.error("CSSLint: Error parsing " + file.fullPath + ". Details: " + e);
                    result.reject(e);
                    return;
                }
                cfg.options = config;
                result.resolve(cfg);
            } else {
                result.reject(err);
            }
        });
        return result.promise();
    }

    /**
     * Attempts to load project configuration file.
     */
    function tryLoadConfig() {
        /**
         * Makes sure JSHint is re-ran when the config is reloaded
         *
         * This is a workaround due to some loading issues in Sprint 31.
         * See bug for details: https://github.com/adobe/brackets/issues/5442
         */
        function _refreshCodeInspection() {
            CodeInspection.toggleEnabled();
            CodeInspection.toggleEnabled();
        }
        _loadProjectConfig()
            .done(function (newConfig) {
                config = newConfig;
            })
            .fail(function () {
                config = {};
            })
            .always(function () {
                _refreshCodeInspection();
            });
    }

    AppInit.appReady(function () {

        CodeInspection.register("css", {
            name: "CSSLint",
            scanFile: cssLinter
        });

        $(DocumentManager)
            .on("documentSaved.csslint documentRefreshed.csslint", function (e, document) {
                // if this project's .csslintrc config has been updated, reload
                if (document.file.fullPath === ProjectManager.getProjectRoot().fullPath + _configFileName) {
                    tryLoadConfig();
                }
            });

        $(ProjectManager)
            .on("projectOpen.csslint", function () {
                tryLoadConfig();
            });

        tryLoadConfig();

    });
});