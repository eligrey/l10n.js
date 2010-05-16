/*
 * l10n.js
 * Version 0.1.1
 *
 * 2010-05-16
 * 
 * By Elijah Grey, http://eligrey.com
 *
 * License: GNU GPL v3 and the X11/MIT license
 *   See COPYING.md
 */

/*global XMLHttpRequest, setTimeout, document, navigator, ActiveXObject*/

/*jslint white: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true,
newcap: true, immed: true, maxlen: 90, indent: 4 */

"use strict";

(function (String) {
	var undefType = "undefined",
	stringType    = "string",
	hasOwnProp    = Object.prototype.hasOwnProperty,
	loadQueues    = {},
	localeCache   = {},
	localizations = {},
	False         = !1,
	XHR,
	
	getLocale = function (locale) {
		// remove x- for cases like en-US-x-hixie and en-US-hixie which are equivalent
		// also memoize the results for each locale
		return localeCache[locale] ||
		       (localeCache[locale] = locale.toLowerCase().replace(/x-/g, ""));
	},
	requestJSON = function (uri) {
		var req = new XHR();
		
		// sadly, this has to be blocking to allow for a graceful degrading API
		req.open("GET", uri, False);
		req.send(null);
		
		if (req.status !== 200) {
			// warn about error without stopping execution
			setTimeout(function () {
				// Error messages are not localized as not to cause an infinite loop
				var l10nErr = new Error("Unable to load localization data: " + uri);
				l10nErr.name = "Localization Error";
				throw l10nErr;
			}, 0);
			
			return {};
		} else {
			return JSON.parse(req.responseText);
		}
	},
	load = String.toLocaleString = function (data) {
		// don't handle function.toLocaleString(indentationAmount:Number), which is
		// a JavaScript feature, though not an ECMAScript feature
		if (arguments.length > 0 && typeof data !== "number") {
			if (typeof data === stringType) {
				load(requestJSON(data));
			} else if (data === False) {
				// reset all localizations
				localizations = {};
			} else {
				// Extend current localizations instead of completely overwriting them
				for (var locale in data) {
					if (hasOwnProp.call(data, locale)) {
						var localization = data[locale];
						locale = getLocale(locale);
						
						if (!(locale in localizations) || localization === False) {
							// reset locale if not existing or reset flag is specified
							localizations[locale] = {};
						}
						
						if (localization === False) {
							continue;
						}
						
						// URL specified
						if (typeof localization === stringType) {
							if (getLocale(String.locale).indexOf(locale) === 0) {
								localization = requestJSON(localization);
							} else {
								// queue loading locale if not needed
								if (!(locale in loadQueues)) {
									loadQueues[locale] = [];
								}
								loadQueues[locale].push(localization);
								continue;
							}
						}
						
						for (var message in localization) {
							if (hasOwnProp.call(localization, message)) {
								localizations[locale][message] = localization[message];
							}
						}
					}
				}
			}
		}
		// Return what function.toLocaleString() normally returns
		return Function.prototype.toLocaleString.apply(String, arguments);
	},
	processLoadQueue = function (locale) {
		var queue = loadQueues[locale],
		i = 0,
		len = queue.length;
		
		for (; i < len; i++) {
			var localization = {};
			localization[locale] = requestJSON(queue[i]);
			load(localization);
		}
		
		delete loadQueues[locale];
	};
	
	if (typeof XMLHttpRequest === undefType && typeof ActiveXObject !== undefType) {
		var AXO = ActiveXObject;
		
		XHR = function () {
			try {
				return new AXO("Msxml2.XMLHTTP.6.0");
			} catch (xhrEx1) {}
			try {
				return new AXO("Msxml2.XMLHTTP.3.0");
			} catch (xhrEx2) {}
			try {
				return new AXO("Msxml2.XMLHTTP");
			} catch (xhrEx3) {}
		
			throw new Error("XMLHttpRequest not supported by this browser.");
		};
	} else {
		XHR = XMLHttpRequest;
	}
	
	if (!String.locale) {
		if (typeof navigator !== undefType) {
			var nav = navigator;
			String.locale = nav.language || nav.userLanguage || "";
		} else {
			String.locale = "";
		}
	}
	
	if (typeof document !== undefType) {
		var linkElems = document.getElementsByTagName("link"),
		i = linkElems.length;
		
		while (i--) {
			var linkElem = linkElems[i],
			relList = (linkElem.getAttribute("rel") || "").toLowerCase().split(/\s+/);
			
			// multiple localizations
			if (relList.indexOf("localizations") !== -1) {
				load(linkElem.getAttribute("href"));
			} else if (relList.indexOf("localization") !== -1) {
				// single localization
				var localization = {};
				localization[getLocale(linkElem.getAttribute("hreflang") || "")] =
					linkElem.getAttribute("href");
				load(localization);
			}
		}
	}
	
	String.prototype.toLocaleString = function () {
		var parts = getLocale(String.locale).split("-"),
		i = parts.length,
		thisValue = this.valueOf();
		
		// Iterate through locales starting at most-specific until localization is found
		while (i) {
			var locale = parts.slice(0, i--).join("-");
			// load locale if not loaded
			if (locale in loadQueues) {
				processLoadQueue(locale);
			}
			if (locale in localizations && thisValue in localizations[locale]) {
				return localizations[locale][thisValue];
			}
		}
		
		return thisValue;
	};
}(String));
