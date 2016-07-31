TO DO
---
* ADD TO CONFIGURATION PAGE:
 * icon - top left
 * icon - avatar
 * welcome message (top left) 
 * color of line under chat box
* need to add a user record for chat user at some point
 * CREATE A USER RECORD FROM THE CHAT ROOM DATA??????
 * OR HAVE A CRON JOB THAT DID IT ALREADY????
 * OR HAVE A STAMPLAY TASK THAT DOES THAT WHEN THE CHATROOM IS SAVED????
 * OR ADD A FUNCTION TO THE CHATBOT TO CREATE A USER RECORD WHEN IT SAVES THE CHATBOT????
* add a 2nd chat box for Kurbi's customer support use??
* add ability to add tags (hashtags) to (qCodes?) in script
* refactor directories so we can remember where to find code
* in demo script, choosing back pain and longer then a week, the script hangs, check .js file
* improve the reply experience in provider app by showing replies in teh chatroom showView. Fix how conversationId is saved in replies (currently shows as array), and fix 'referenced_list' in showView model.
* get articles tied to a user, and only show articles for currently logged in user

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
There is a bug in the "admin-config" app from marmelabs that affects relationships in "show" view. In the file `/admin-config/lib/Utils/ReferenceExtractor.js`, in the function `indexByName(references)`, the line `referencesByName[reference.name()] = reference;` did not have `.name()` and that created an issue that wasn't caught by any error trapping. 

In the /build/ng-admin.min.js` file, search for 'indexByName' and make sure that the 3rd occurrence looks like `!0)},indexByName:function(e){return e.reduce(function(e,t){return e[t.name()]`.
* Issue on Github: https://github.com/marmelab/ng-admin/issues/553