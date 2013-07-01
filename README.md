brackets-csslint
=================

A Brackets extension to enable CSSLint support. To install, place in your ```brackets/src/extensions/user``` folder.
When installed, you can enable CSSLint by clicking 'Enable CSSLint' in your View menu.

Issues/Updates
=====
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