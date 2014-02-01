l10n.js
=======

l10n.js is a JavaScript library that enables passive localization through native
JavaScript methods, gracefully degrading if the library is not present. You can make
Ajax applications, JavaScript libraries, etc. that can be localized but not require
l10n.js to function. There is already a placeholder method for all API calls
as specified in the ECMAScript specification and is present in all JavaScript
engines, so when l10n.js isn't present, your application works fine.


Demo
----

You can try out the [online demo][1] to see l10n.js in action.

Currently the demo supports the following locales.

* [English](http://purl.eligrey.com/l10n.js/demo/en)
    * [American English](http://purl.eligrey.com/l10n.js/demo/en-US)
    * [British English](http://purl.eligrey.com/l10n.js/demo/en-GB)
    * [Canadian English](http://purl.eligrey.com/l10n.js/demo/en-CA)
    * [Australian English](http://purl.eligrey.com/l10n.js/demo/en-AU)
* [Portuguese](http://purl.eligrey.com/l10n.js/demo/pt)
* [Spanish](http://purl.eligrey.com/l10n.js/demo/es)
* [French](http://purl.eligrey.com/l10n.js/demo/fr)
* [Dutch](http://purl.eligrey.com/l10n.js/demo/nl)
* [German](http://purl.eligrey.com/l10n.js/demo/de)
* [Finnish](http://purl.eligrey.com/l10n.js/demo/fi)
* [Vietnamese](http://purl.eligrey.com/l10n.js/demo/vi)
* [Italian](http://purl.eligrey.com/l10n.js/demo/it)
* [Norwegian](http://purl.eligrey.com/l10n.js/demo/no)
* [Russian](http://purl.eligrey.com/l10n.js/demo/ru)
* [Lojban](http://purl.eligrey.com/l10n.js/demo/jbo)
* [Danish](http://purl.eligrey.com/l10n.js/demo/da)
* [Hebrew](http://purl.eligrey.com/l10n.js/demo/he)
* [Bulgarian](http://purl.eligrey.com/l10n.js/demo/bg)
* [Simplified Chinese](http://purl.eligrey.com/l10n.js/demo/zh)
* [Swedish](http://purl.eligrey.com/l10n.js/demo/se)
* [Turkish](http://purl.eligrey.com/l10n.js/demo/tr)
* [Hungarian](http://purl.eligrey.com/l10n.js/demo/hu)
* [Czech](http://purl.eligrey.com/l10n.js/demo/cs)

If you know a language that isn't currently supported in the demo, I encourage you to
contribute a localization by sending me your own localizations, either [through GitHub][2]
or [directly][3]. The following strings would need to be localized:

* `%title` to `{Locale} - l10n.js demo` in the locale.
* `%info` to `You are viewing a {locale} localization
  of this page.` in the locale.
* Optionally, `%locale.dir` to `rtl` if the locale uses right-to-left directionality.


Supported Browsers
------------------

* Internet Explorer 5+
* Firefox 2+
* Opera 9+
    * Doesn't support region-specific locales. Only gives "en" in the case of "en-US".
* Google Chrome 1+
* Safari 4+


Getting Started
---------------

 1. [Download l10n.js][4].
 2. Localize strings used in your JavaScript application. See the [demo localizations
    file][5] for an example localizations file. You can also specify external
    localizations in your main localizations file by assigning a URL string to a language
    code, such as `"en-us": "localizations/en-us.json"`.
 3. Include the appropriate link elements, as described in the usage section, anywhere in
    your document. I recommend putting it in the document's `<head>`.
 4. Place `<script type="text/javascript" src="path/to/l10n.js"></script>`
    anywhere after the `<link>` tag.
 5. Call `toLocaleString()` on any strings you wish to localize.


Usage
-----

### Localizing strings

Calling `toLocaleString()` on every localizable string can create a lot of extra typing
and bloat for sending your JavaScript down the wire. I recommend using the following
helper function to localize strings. The reason I don't define this in l10n.js is to not
introduce any new globals, which keeps l10n.js a one of the JavaScript libraries
least-prone to conflicts with other libraries.

    var l = function (string) {
        return string.toLocaleString();
    };

With this helper function, you can start writing `l("Your localizable string")` instead
of `"Your localizable string".toLocaleString()`. I chose `l` instead of `_` (an
underscore), because it's easier to spot so you can quickly skim your code to see which
strings are localizable.


### Variable replacement

If you don't mind requiring l10n.js for your JavaScript application or library to
function, I suggest using short variable strings instead of default strings. It saves
bandwidth by decreasing the size of localization files, and it enables you to write
nice, short code as such in the following.

* `document.title = l("%title.search")`
    * Example results: `"Seach - Acme, Inc."`
* `confirm(l("%confirm.deleteAccount"))`
    * Example results: `"Are you sure you want to delete your account?"`
* `link.href = "http://www.google." + l("%locale.tld")`
    * Example results: `"http://www.google.co.uk"` 

Often, string concatenation is used instead of replacement in JavaScript. With l10n.js,
to make localization easier, you may have to use replacements instead. You might want to
use a JavaScript library that implements something similar to C++'s `sprintf()`. A nice
JavaScript implementation I'd recommend is [php.js's `sprintf()`][6].


### When localizations are downloaded

If you are using single localization URLs
(`<link rel="localization" hreflang="..." href="..." type="application/vnd.oftn.l10n+json"/>`),
they will only be downloaded when needed. If you are using multiple localizations in one
(`<link rel="localizations" href="..." type="application/vnd.oftn.l10n+json"/>`), then the file
will be downloaded right away, but externally linked localizations in the localization
file will not be. If you provide an interface for your users to change locales, any
non-loaded localization files will be loaded when necessary.


### Including localizations with link elements

Multiple localizations can be included with one localization JSON file, with all of the
top properties being language codes. Instead of putting all of the localized strings
directly in the file, you may want to assign a specifc localization JSON URL to each
locale, as to save bandwidth by only downloading locales the user needs.

The following is an example localization file for
`<link rel="localizations" href="path/to/localizations.json" type="application/vnd.oftn.l10n+json"/>`.

    {
      "en-US": {
          "What is your favourite colour?": "What is your favorite color?"
      },
      "fr": "path/to/french-localization.json"
    }

Using localization files is the same as calling `String.toLocaleString()` witht the JSON
localizations object as the first parameter.

You can also include single localizations by specifying the standard HTML5 `hreflang` link
element attribute and using a rel of `localization` instead of `localizations` with an
's', as shown in the following.

    <link rel="localization" hreflang="en-US" href="american-english.json" type="application/vnd.oftn.l10n+json"/>

The JSON file for the localization might look like the following.

    {
        "What is your favourite colour?": "What is your favorite color?"
    }


API
---

Strong and emphasized text has titles (which can be viewed by hovering your cursor over
them) containing their type if they are not functions or return type if they are.


### Methods

<dl>
  <dt><code>String.<strong title="String">toLocaleString</strong>([<strong title="Object or String or Boolean">localizations</strong>])</code></dt>
  <dd>
    If <code title="Object">localizations</code> is an object, it is added to the
    localizations.
    <br />
    If <code title="String">localizations</code> is a string, it is requested as JSON and
    then added to the localizations.
    <br />
    If <code title="Boolean">localizations</code> is <code>false</code>, then all
    localizations are reset.
    <br />
    If <code title="Object">localizations</code> is an object, and a locale is
    <code>false</code>, then all localizations for that locale are reset.
    <p>
      The string representation of the <code>String</code> contructor is returned, to
      maintain backwards compatibility with any code using this method to actually get it.
    </p>
    
    <h4>Examples</h4>
    <ul>
      <li>
        Loading a localizations JSON file:
        <pre><code>String.toLocaleString(<strong title="String">"path/to/localizations.json"</strong>)</code></pre>
      </li>
      <li>
        Defining localizations directly:
        <p>
          The nearest locale to the user's locale that has the string being localized is
          used in localization.
        </p>
        <pre><code>String.toLocaleString({
    "es": { // Spanish
        "Hello, world!": "¡Hola, mundo!"
        // more localizations...
    },
    "en-US": { // American English
        "Hello, world!": "Hello, America!" // Locale-specific message
        // more localizations...
    },
    "en-GB": false, // resetting British English localizations
    // Specifying external localization JSON for Japanese:
    // The URL isn't requested unless the user's locale is Japanese
    "jp": "localizations/jp.json"
})</code></pre>
      </li>
      <li>
        Resetting all localizations:
        <pre><code>String.toLocaleString(<strong title="Boolean">false</strong>)</code></pre>
      </li>
    </ul>
  </dd>
  
  <dt><code>aString.<strong title="String">toLocaleString</strong>()</strong></code></dt>
  <dd>
    Returns the localized version of <code>aString</code> in the user's locale,
    if available. Otherwise, it returns the same string.
  </dd>
</dl>


### Fields

<dl>
  <dt><code>String.<strong title="String">locale</strong></code></dt>
  <dd>
    A configurable string which represents the language code of the locale to use for
    localization. It defaults to the user's own locale.
  </dd>
  <dt><code>String.<strong title="String">defaultLocale</strong></code></dt>
  <dd>
    A configurable string which represents the language code of the default locale to
    use for localization if no localizations are available in the user's locale. By
    default this is not configured, and may be ignored if you are using l10n.js for
    passive-only localizations.
  </dd>
</dl>


![Tracking image](https://in.getclicky.com/212712ns.gif)

  [1]: http://purl.eligrey.com/l10n.js/demo
  [2]: https://github.com/eligrey/l10n.js/edit/master/demo/localizations.js
  [3]: http://purl.eligrey.com/contact
  [4]: http://purl.eligrey.com/github/l10n.js/raw/master/l10n.js
  [5]: http://purl.eligrey.com/github/l10n.js/blob/master/demo/localizations.js
  [6]: http://phpjs.org/functions/sprintf
