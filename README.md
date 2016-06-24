TO DO
---
* ADD TO CONFIGURATION PAGE:
 * icon - top left
* icon - avatar
* welcome message (top left) 
* color of line under chat box

INSTALLATION
---

After cloning repository locally, run 
`npm install` 
to make sure all node modules are available locally. Then run 
`bower install videogular-youtube`,
`bower install videogular-controls`
.


CLI
---

The code used for custom fields needs to be processed by browserify and babelify, so in root folder of repo run this command: 

`watchify main.js -t babelify -o build/bundle.js`

OR

`watchify main.js -o build/bundle.js -t [ babelify --presets [ es2015 ] ]`

OR

`watchify main.js -o build/bundle.js -t [ babelify --presets [ es2015-native-modules ] ]`

?Add to package.json?
//  ,"browserify": {
  //    "transform": [
  //      [
  //        "babelify"
  //      ]
  //    ]
  //  },
  //

NOTES:
---

**Custom Fields**
To use custom fields, the admin-config must be explicitly added to the node modules, as it isn't added through package.json out of the box (when "ng-admin" is compiled, it pulls in the admin-config files it needs). So do the following:

* Check that admin-config, browserify, and babelify have been installed and are in the package.json. If not...
** `npm install admin-config --save-dev`
** install browserify & babelify if you haven't already: `npm install browserify`, `npm install babelify`
** add this code to the end of "/node-modules/admin-config/package.json"
`browserify": {
    "transform": [["babelify", {"presets": ["es2015"]}]]
 }`

**Bug**
There is a bug in the "admin-config" app from marmelabs that affects relationships in "show" view. In the file `/admin-config/lib/Utils/ReferenceExtractor.js`, in the function `indexByName(references)`, the line `referencesByName[reference.name()] = reference;` did not have `.name()` and that created an issue that wasn't caught by any error trapping. In the /build/ng-admin.min.js` file, search for 'indexByName' and make sure that the 3rd occurrence looks like `!0)},indexByName:function(e){return e.reduce(function(e,t){return e[t.name()]`.
* Issue on Github: https://github.com/marmelab/ng-admin/issues/553