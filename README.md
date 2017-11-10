brackets-csslint
=================

A Brackets extension to enable CSSLint support. To install, place in your ```brackets/src/extensions/user``` folder.

CSSLint makes use of Bracket's built-in linting system. Errors will be signified
with a yellow warning icon in the lower right hand corner of the editor. Clicking
it will open a list of issues for the current file. If there are no issues, a green
icon will be displayed instead.

Global default options are available under "Debug > Open Preferences File" by adding or modifying "csslint.options".

CSSLint also supports .csslintrc files. See this for more information: https://github.com/CSSLint/csslint/issues/359

Issues/Updates
=====

[11/10/2017] Merge PR - https://github.com/cfjedimaster/brackets-csslint/pull/46

[6/30/2015] Merge PR - https://github.com/cfjedimaster/brackets-csslint/pull/43

[5/27/2015] Adding support for global preferences

[1/22/2015] Fix for CSSLint behaving badly.

[1/4/2015] Updated CSSLint - again - this time credit goes to @ArgTang

[1/4/2015] Updated CSSLint

[7/13/2014] Remove SCSS support, as I thought I'd need to.

[1/26/2014] User globexdesigns added support for .csslintrc files.

[11/29/2013] Updated the display to include both the name of the rule, which makes it a bit clearer I think, as well as the code for the rule.

[10/15/2013] So - the main CSSLint lib I used totally screwed up Brackets by messing up the exports module. I did
some guess work and - I think it's kosher now.

[10/8/2013] Two things. One - sometimes CSSLint returned a "document" level warning. Brackets Lint API doesn't
support this, so for now, we skip it.

Two - SCSS support is in, but I'm fairly certain it isn't working right. I'll probably remove it.

Third - updated CSSLint to latest.

[10/8/2013] Small mod to fix a loading issue with linting (temp)

[9/23/2013] New linting API used for Sprint 31.

[6/30/2013] Merged in a fix by Daniel Seymour.

[6/22/2013] Merged in an updated CSSLint by John Lafitte.

[6/7/2013] Updated package.json version for fixes by Daniel Seymour.

[6/5/2013] Fixed a bunch of JSLint errors in csslint.js.

[6/2/2013] Ugh, had the wrong package.json stuff in. Stupid Ray. Also updated code to use
PanelManager.

[6/2/2013] Makes csslint work like my jshint extension and auto hide/show on .css files.

[5/24/2013] Added package.json support

[4/16/2013] Tweak to menu add function.

[12/4/2012] Updated to remove preferences code (not needed) and fix a word wrap issue. Thanks again to Randy Edmunds and Chema Balsas.

[11/29/2012] Updated display code to fix a few issues with resizing. It also remembers the height now and makes use of Mustache. A HUGE
thanks, again, to Randy Edmunds. I stole I mean borrowed a lot of code from his shortcut (https://github.com/redmunds/brackets-display-shortcuts).

Also updated CSSLint to the latest version.

[11/12/2012] Update code to properly insert the content over the status bar. Also made it resizable.

[9/26/2012] Escape HTML in the message. Fix width issue. Thanks to Randy Edmunds for the reports.

Per feedback from Narciso Jaramillo, I use a checkbox to show enabled/disabled status and move to the item when you click a row.

Credit
=====
Built with [CSSLint](http://csslint.net/) and heavily based on the work of [Jonathan Rowny](http://www.jonathanrowny.com/). 
