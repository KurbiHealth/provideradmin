(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require("admin-config/lib/Field/Field");

var _Field3 = _interopRequireDefault(_Field2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjKeyValueFieldConf = function (_Field) {
    _inherits(ObjKeyValueFieldConf, _Field);

    function ObjKeyValueFieldConf(name) {
        _classCallCheck(this, ObjKeyValueFieldConf);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjKeyValueFieldConf).call(this, name));

        _this._type = "obj_key_value_field";
        _this._keyValueChoices = null;
        return _this;
    }

    _createClass(ObjKeyValueFieldConf, [{
        key: "keyValueChoices",
        value: function keyValueChoices(keyValueString) {
            if (!arguments.length) return this._keyValueChoices;
            this._keyValueChoices = keyValueString;
            return this;
        }
    }]);

    return ObjKeyValueFieldConf;
}(_Field3.default);

exports.default = ObjKeyValueFieldConf;
module.exports = exports["default"];

},{"admin-config/lib/Field/Field":21}],2:[function(require,module,exports){
exports.__esModule = true;
exports.default = ObjKeyValueFieldDirective;
function ObjKeyValueFieldDirective(FieldViewConfiguration, $compile) {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            //value: '=',
            entity: '&'
        },
        link: function link(scope, element) {
            var field = scope.field();
            var type = field.type();
            scope.field = field;
            scope.type = type;
            scope.entity = scope.entity();
            scope.entry = scope.entry();

            // '{"qCode":"back pain details"}'
            var choices = JSON.parse(field._keyValueChoices);
            var messages = scope.entry.values.messages;
            var displayValue = '--User did not leave a question--';
            if (messages) {

                messages.map(function (currMessage) {
                    // TO DO: to make this more universally useful, take out hard coded references to 'patient' and 'qCode'
                    currMessage = JSON.parse(currMessage);
                    if (currMessage.source == 'patient') {
                        if (currMessage.message.qCode) {
                            if (currMessage.message.qCode == choices.qCode) {
                                if (currMessage.message.body.text != '') {
                                    displayValue = currMessage.message.body.text;
                                }
                            }
                        }
                    }
                });
            }
            scope.displayValue = displayValue;

            scope.getCssClasses = function (entry) {
                return 'ng-admin-field-' + field.name().replace('.', '_') + ' ng-admin-type-' + type + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');
            };

            var template = '<div id="row-{{ field.name() }}" class="form-field form-group has-feedback" ng-class="" style="margin:0;">\n    <label for="{{ field.name() }}" class="col-sm-2 control-label">\n        {{ field.label() }}\n    </label>\n    <div ng-class="field.getCssClasses(entry)||\'col-sm-10\'">\n        {{displayValue}}\n    </div>\n</div>';

            element.append(template);
            $compile(element.contents())(scope);
        }
    };
}

ObjKeyValueFieldDirective.$inject = ['FieldViewConfiguration', '$compile'];
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
exports.__esModule = true;
/*
getReadWidget:   DISPLAYED IN listView AND showView
getLinkWidget: 	 DISPLAYED IN listView AND showView WHEN isDetailLink IS TRUE 
getFilterWidget: DISPLAYED IN THE FILTER FORM IN THE listView
getWriteWidget:  DISPLAYED IN editionView AND creationView
*/

exports.default = {
    getReadWidget: function getReadWidget() {
        return '<obj-key-value-field entry="::entry" field="::field" entity="::entity"></obj-key-value-field>';
    },
    getLinkWidget: function getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    },
    getFilterWidget: function getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    }
};
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
exports.__esModule = true;

var _entry = require('admin-config/lib/entry');

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sorter(sortField, sortDir) {
    return function (entry1, entry2) {
        // use < and > instead of substraction to sort strings properly
        var sortFactor = sortDir === 'DESC' ? -1 : 1;
        if (entry1.values[sortField] > entry2.values[sortField]) {
            return sortFactor;
        }
        if (entry1.values[sortField] < entry2.values[sortField]) {
            return -1 * sortFactor;
        }
        return 0;
    };
}

function stamplayArrayOfStrings(NgAdminConfiguration) {
    var application = NgAdminConfiguration(); // jshint ignore:line
    return {
        scope: {
            'field': '&',
            'value': '&',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function pre(scope) {

                var field = scope.field(); // configuration values from the ES6 class
                var targetEntity = field.targetEntity();
                var targetEntityName = targetEntity.name();
                var targetFields = field.targetFields();
                var sortField = field.sortField();
                var sortDir = field.sortDir();

                // ADD PERMANENT FILTERS
                var filterFunc;

                if (field.permanentFilters()) {
                    (function () {
                        var filters = field.permanentFilters();
                        var filterKeys = Object.keys(filters);
                        filterFunc = function filterFunc(entry) {
                            return filterKeys.reduce(function (isFiltered, key) {
                                return isFiltered && entry.values[key] === filters[key];
                            }, true);
                        };
                    })();
                } else {
                    filterFunc = function filterFunc() {
                        return true;
                    };
                }

                // PARSE STRING INTO OBJ IF NEEDED
                var value = scope.value();

                if (field._jsonParse == true) {
                    value = value.map(function (e) {
                        return JSON.parse(e);
                    });
                }

                var entries = _entry2.default.createArrayFromRest(value || [], targetFields, targetEntityName, targetEntity.identifier().name()).sort(sorter(sortField, sortDir)).filter(filterFunc);
                if (!targetEntityName) {
                    (function () {
                        var index = 0;
                        entries = entries.map(function (e) {
                            e._identifierValue = index++;
                            return e;
                        });
                    })();
                }

                // field._fieldValueStyles == [{fieldName:FIELDNAME, value:VALUE, cssClass:CSS-CLASS-NAME}]
                // Ex. [{fieldName:source, value:patient, cssClass:chat-message-source-patient}]')
                var styles = JSON.parse(field._fieldValueStyles);
                entries = entries.map(function (e) {
                    for (var i in styles) {
                        if (styles[i].fieldName in e.values) {
                            if (styles[i].value == e.values[styles[i].fieldName]) {
                                // FIX THIS SO IT GOES THROUGH TO maDatagrid DIRECTIVE (see ????????? below)
                                e._entryCssClasses = e._entryCssClasses ? e._entryCssClasses + ' ' + styles[i].cssClass : styles[i].cssClass;
                                e.values._entryCssClasses = styles[i].cssClass;
                                scope.entryCssClasses = scope.entryCssClasses ? scope.entryCssClasses + ' ' + styles[i].cssClass : styles[i].cssClass;
                            }
                        }
                    }
                    return e;
                });

                scope.field = field;
                scope.targetFields = targetFields;
                scope.entries = entries;
                scope.entity = targetEntityName ? application.getEntity(targetEntityName) : targetEntity;

                scope.sortField = sortField;
                scope.sortDir = sortDir;
                scope.sort = function (field) {
                    var sortDir = 'ASC';
                    var sortField = field.name();
                    if (scope.sortField === sortField) {
                        // inverse sort dir
                        sortDir = scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
                    }
                    scope.entries = scope.entries.sort(sorter(sortField, sortDir));
                    scope.sortField = sortField;
                    scope.sortDir = sortDir;
                };
            }
        },
        template: '\n<ma-datagrid ng-if="::entries.length > 0"\n    entryCssClasses="{{ entryCssClasses }}" // ????????????????????\n    entries="entries"\n    fields="::targetFields"\n    list-actions="::field.listActions()"\n    entity="::entity"\n    datastore="::datastore()"\n    sort-field="{{ sortField }}"\n    sort-dir="{{ sortDir }}"\n    sort="::sort">\n</ma-datagrid>'
    };
}

exports.default = stamplayArrayOfStrings;


stamplayArrayOfStrings.$inject = ['NgAdminConfiguration'];
module.exports = exports['default'];

},{"admin-config/lib/entry":36}],5:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EmbeddedListField2 = require("admin-config/lib/Field/EmbeddedListField");

var _EmbeddedListField3 = _interopRequireDefault(_EmbeddedListField2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StamplayArrayStrField = function (_EmbeddedListField) {
    _inherits(StamplayArrayStrField, _EmbeddedListField);

    function StamplayArrayStrField(name) {
        _classCallCheck(this, StamplayArrayStrField);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StamplayArrayStrField).call(this, name));

        _this._jsonParse = false;
        _this._type = "stamplay_array_str";
        _this._fieldValueStyles = null;
        return _this;
    }

    // attempt to convert all strings to objects, true or false


    _createClass(StamplayArrayStrField, [{
        key: "jsonParse",
        value: function jsonParse(trueFalse) {
            if (!arguments.length) return this._jsonParse;
            this._jsonParse = trueFalse;
            return this;
        }

        // add css attribs based on an object key/value
        // .fieldValueStyles('[{fieldName:FIELDNAME, value:VALUE, cssClass:CSS-CLASS-NAME}]')

    }, {
        key: "fieldValueStyles",
        value: function fieldValueStyles(objStringified) {
            if (!arguments.length) return this._fieldValueStyles;
            this._fieldValueStyles = objStringified;
            return this;
        }
    }]);

    return StamplayArrayStrField;
}(_EmbeddedListField3.default);

exports.default = StamplayArrayStrField;
module.exports = exports["default"];

},{"admin-config/lib/Field/EmbeddedListField":20}],6:[function(require,module,exports){
exports.__esModule = true;
/*
getReadWidget:   DISPLAYED IN listView AND showView
getLinkWidget:   DISPLAYED IN listView AND showView WHEN isDetailLink IS TRUE 
getFilterWidget: DISPLAYED IN THE FILTER FORM IN THE listView
getWriteWidget:  DISPLAYED IN editionView AND creationView
*/

exports.default = {
    getReadWidget: function getReadWidget() {
        return '<stamplay-arr-strings field="::field" value="::value" datastore="::datastore"></stamplay-arr-strings>';
    },
    getLinkWidget: function getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    },
    getFilterWidget: function getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    },
    getWriteWidget: function getWriteWidget() {
        return '<stamplay-arr-strings field="::field" value="value" datastore="::datastore"></stamplay-arr-strings>';
    }
};
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
exports.__esModule = true;
function chatboxConfigController($stateParams, notification, Restangular, $http, chatServerURL, $scope) {

	// URL is the location of the chat endpoints
	var URL = chatServerURL;

	// notification is the service used to display notifications on the top of the screen
	this.notification = notification;

	// AVATAR (FILE PICKER)
	this.avatar = '';

	// COLOR PICKER FIELD
	// taken from https://github.com/ruhley/angular-color-picker
	$scope.options = {
		round: true,
		format: 'hex',
		swatchOnly: true,
		close: {
			show: true,
			label: 'Close',
			class: 'btn'
		}
	};
	this.color = '';

	// HEADLINE
	this.headline = '';

	// Check to see if there is a recent customization record available; if there is, load it and put values into form fields
	if ($stateParams.chatBoxId) {
		var currView = 'edit';
		var chatBoxId = $stateParams.chatBoxId;
		Restangular.one('chatbox', chatBoxId).get().then(function (result) {
			var chatBoxData = result.data.plain();
		});
	} else {
		console.log('new chatBox');
		var currView = 'new';
	}

	// the function is called from the template (file 'chatboxconfigtemplate.js')
	this.submitForm = function () {

		var apiKey = 'public';

		var customizationFormData = {
			avatar: this.avatar,
			color: this.color,
			headline: this.headline
		};

		if (currView == 'new') {
			$http.post(URL, customizationFormData).then(function (response) {
				// Add snippet to UI
				console.log(response);
				var targetDiv = angular.element(document.getElementById('chatSnippet'));
				targetDiv.text("<script>" + response.data.snippet + "</script>");
				apiKey = response.apiKey;
				return response.data;
			}, function (err) {
				console.log("There was an error saving.", err);
			}).then(function (response) {
				var chatBoxId = response.chatBoxId;
				var snippet = response.snippet;

				// Save form elements and snippet to Stamplay
				var data = {
					'chat_avatar': customizationFormData.avatar,
					'chat_color': customizationFormData.color,
					'chat_headline': customizationFormData.headline,
					'chatbox': chatBoxId
				};
				Restangular.all('customization').post(data).then(function (response) {
					console.log('customization response', response);
					// save the snippet & link to Customization rcd
					// to the ChatBox record
					console.log('chatBoxId', chatBoxId, 'snippet', snippet);
					var customizationId = response.data.id;
					console.log('customizationId', customizationId);

					var chatBoxData = {
						'snippet': snippet,
						'customizations': ''
					};
					Restangular.one('chatbox', chatBoxId).get().then(function (result) {
						var temp = result.data.plain();
						console.log('result from chatbox get', temp);
						if (!temp.customizations) {
							customArr = [];
						} else {
							var customArr = temp.customizations;
						}
						// TO DO save chatbox.id in customization.chatbox
						customArr.push(customizationId);
						chatBoxData.customizations = customArr;
						console.log('chatbox data', chatBoxData);
						Restangular.one('chatbox', chatBoxId).customPUT(chatBoxData).then(function (result) {
							console.log('updated chatbox with snippet and new customizations array', result.data.plain());
						});
					});
				}, function (err) {
					console.log("There was an error saving.", err);
				});
			});
		}

		if (currView == 'edit') {}
		// send chatBoxId to bot API, it will update the js,html,css
		/*			var data = {
  
  			};
  			$http
  			.put(URL,data,function(result){
  
  			})
  
  			// create a new customization record
  			.then(function(result){
  				Restangular.one('customization').post(
  
  				)
  			// insert the new customization id into the chatbox record
  				.then(function(result){
  					var data = {
  
  					};
  					Restangular.one('chatbox',chatBoxId).put(data)
  					.then(function(result){
  
  					});
  				})
  			}); */

		// END if(currView == 'edit')
	}; // END this.submitForm()
} // END function chatboxConfigController()

exports.default = chatboxConfigController;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
exports.__esModule = true;
var chatboxConfigControllerTemplate = '<style>input{margin-bottom:10px;}' + '.color-picker-action-close{overflow:auto;width:60px !important;}' + '.color-picker-swatch{width:100px !important;}' + '</style>' + '<div class="row"><div class="col-lg-12">' + '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' + '<div class="page-header">' + '<h1>Configure your Chat Box</h1>' + '</div>' + '</div></div>' + '<div class="row">' + '<div class="col-lg-6">' + '<h4>Modify This</h4>' + '<label for="avatar">Avatar</label>' + '<input type="file" size="10" ng-model="controller.avatar" class="form-control" placeholder="avatar" name="avatar" />' + '<label for="color">Accent Color</label>' + '<color-picker ng-model="controller.color" options="options"></color-picker>' + '<span style="display:block;width:1px;height:10px;"></span>' + '<label for="headline">Headline</label>' + '<input type="text" size="10" ng-model="controller.headline" class="form-control" placeholder="headline" name="headline" />' + '<a class="btn btn-default" ng-click="controller.submitForm()">Save</a>' + '</div>' + '<div class="col-lg-6">' + '<h4>Snippet Display</h4>' + '<p><i>When the snippet appears, copy it and then paste it into your website\'s html or content management system.</i></p>' + '<div id="chatSnippet" class="dont-break-out" style="width:100%;display:block;border:1px solid grey;border-radius:3px;min-height:33px;padding:20px;margin-bottom:20px;"></div>' + '</div>' + '</div>';

exports.default = chatboxConfigControllerTemplate;
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function processChatroomRecord(data) {

	/*  CREATE A USER RECORD FROM THE CHAT ROOM DATA??????
 	OR HAVE A CRON JOB THAT DID IT ALREADY????
 	OR HAVE A STAMPLAY TASK THAT DOES THAT WHEN THE CHATROOM IS SAVED????
 	OR ADD A FUNCTION TO THE CHATBOT TO CREATE A USER RECORD WHEN IT SAVES THE CHATBOT???? */

	var messages = data[0].messages;

	var question, avatar, created;
	var tags = [];
	messages.map(function (m) {
		m = JSON.parse(m);
		if (m.source == 'patient') {
			var q = m.message.qCode;
			var b = m.message.body;
			if (q) {
				if (q == 'avatar chosen') {
					avatar = b.image;
				}
				if (q == 'back pain details') {
					question = b.text;
				} else {
					if (q.includes('pain')) {
						tags.push(b.text);
					}
					if (q.includes('one week') || q.includes('one day')) {
						tags.push(b.text);
					}
					if (q.includes('asked pros') || q.includes('self care') || q.includes('no treatment')) {
						if (tags.indexOf(b.text) == -1) tags.push(b.text);
					}
				}
			}
		}
	});

	created = new Date(data[0].dt_create);
	created = created.toLocaleTimeString("en-us", {
		weekday: "long", year: "numeric", month: "short",
		day: "numeric", hour: "2-digit", minute: "2-digit"
	});

	var returnObj = {
		created: created,
		question: question,
		avatar: avatar,
		tags: tags.join(', '),
		title: question
	};

	return returnObj;
}

function formSubmit() {

	// ask if provider wishes to save a copy as a seed article in Articles
	var Restangular = this.Restangular;
	var $q = this.$q;
	var notification = this.notification;
	var createArticle = false;
	var promises = [];
	var that = this;
	that.returns = [];

	if (confirm('Would you like to copy this reply to Articles?')) {
		var user = window.localStorage.getItem("user");
		if ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) == 'object' && user == null) {
			notification.log('problem saving article');
			return false;
		} else {
			user = JSON.stringify(user);
		}
		var articleData = {
			author: user._id,
			body: this.reply,
			conversation_id: this.chatroomId,
			title: this.question,
			published: false
		};
		var articles = Restangular.all('articles');
		promises.push(articles.post(articleData).then(function (response, err) {
			if (err) {
				that.returns.push('There was a problem: ' + JSON.stringify(err));
			}
			if (response.status == '200') {
				that.returns.push('Article saved');
			}
		}));
	}

	// save to Chatroomreplies (replyText,chatRoomId)
	var replyData = {
		chatRoomId: this.chatroomId,
		replyText: this.reply
		//,recipient: THIS NEEDS TO HAVE A USER ID, WHICH MEANS WE NEED TO HAVE A USER RECORD ALREADY CREATED FROM THE CONVERSATION
	};
	var replies = Restangular.all('chatroomreplies');
	promises.push(replies.post(replyData).then(function (response, err) {
		if (err) {
			that.returns.push('There was a problem saving the reply: ' + JSON.stringify(err));
		}
		if (response.status == '200') {
			that.returns.push('Reply saved');
			// add a line to the replies arr in chatroom
			that.replies.push(response.data.id);
			Restangular.all('chatroom').doPUT({ id: that.chatroomId, replies: that.replies }).then(function (response) {});
		}
	}));

	$q.all(promises).then(function () {
		notification.log(that.returns.join('\n'));
		var url = '/#/chatroom/show/' + that.chatroomId;
		window.location = url;
	});
}

function conversationReplyController($stateParams, notification, Restangular, $q) {

	// set up nofications
	this.notification = notification;
	this.chatroomId = $stateParams.chatRoomId;
	var chatroomId = this.chatroomId;
	this.chatRoomData = null;
	this.Restangular = Restangular;
	this.$q = $q;

	// form variables
	this.question = '';
	this.tags = '';
	this.title = '';
	this.reply = '';
	this.avatar = '';
	this.replies = [];
	var that = this;

	// load ChatRoom record from Stamplay
	var chatroomData = {
		"_id": chatroomId
	};

	Restangular.all('chatroom').getList(chatroomData).then(function (response, err) {
		if (err) {
			return this.notification.log('There was a problem: ' + JSON.stringify(err));
		}

		this.chatRoomData = response.data.plain();

		// process the record
		var data = processChatroomRecord(response.data.plain());

		// display processed data in template form
		that.question = data.question;
		that.tags = data.tags;
		that.title = data.title;
		that.avatar = data.avatar;
		if (data.replies) that.replies = data.replies;else that.replies = [];
		return that;
	});

	// form submission to ChatRoomReplies data model (owner,created,replyText,chatRoomId)
	this.formSubmit = formSubmit;
}

exports.default = conversationReplyController;


conversationReplyController.$inject = ['$stateParams', 'notification', 'Restangular', '$q'];
module.exports = exports['default'];

},{}],10:[function(require,module,exports){
exports.__esModule = true;
var conversationReplyTemplate = '<style>input{margin-bottom:10px;}.dont-break-out{overflow-wrap: break-word;word-wrap: break-word;' + '-ms-word-break: break-all;word-break: break-all;word-break: break-word;}.ta-editor{border: 1px solid gray;border-radius:5px;}</style>' + '<div class="row"><div class="col-lg-12">' + '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' + '<div class="page-header">' + '<h1>Reply To A Question</h1>' + '</div>' + '</div></div>' + '<div class="row">' + '<div class="col-lg-12">' + '<h4>From a potential patient...</h4>' + '<p><b>Question:</b></p>' + '<p size="10" class="form-control"><img ng-src="{{controller.avatar}}" width="14" height="14" /> {{controller.question}}</p>' + '<p><b>Information about patient:</b></p>' + '<p size="10" class="form-control">{{controller.tags}}</p>' + '<p><b>Your reply:</b></p>' + '<div text-angular ta-unsafe-sanitizer="false" ng-model="controller.reply" id="wysiwyg" name="wysiwyg" ta-text-editor-class="border-around" ta-html-editor-class="border-around">' + '</div>' + '<a class="btn btn-default" ng-click="controller.formSubmit()" style="margin-top:20px;">Send</a>' + '</div>' + '</div>';

exports.default = conversationReplyTemplate;
module.exports = exports['default'];

},{}],11:[function(require,module,exports){
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _chatboxconfig = require('./custom_pages/chatboxconfig/chatboxconfig');

var _chatboxconfig2 = _interopRequireDefault(_chatboxconfig);

var _chatboxconfigtemplate = require('./custom_pages/chatboxconfig/chatboxconfigtemplate');

var _chatboxconfigtemplate2 = _interopRequireDefault(_chatboxconfigtemplate);

var _replyconfig = require('./custom_pages/conversation_reply/replyconfig');

var _replyconfig2 = _interopRequireDefault(_replyconfig);

var _replytemplate = require('./custom_pages/conversation_reply/replytemplate');

var _replytemplate2 = _interopRequireDefault(_replytemplate);

var _stamplay_array_str_field_config = require('./custom_fields/stamplay_array_str_field/stamplay_array_str_field_config');

var _stamplay_array_str_field_config2 = _interopRequireDefault(_stamplay_array_str_field_config);

var _stamplay_array_str_view = require('./custom_fields/stamplay_array_str_field/stamplay_array_str_view');

var _stamplay_array_str_view2 = _interopRequireDefault(_stamplay_array_str_view);

var _stamplay_array_str_directive = require('./custom_fields/stamplay_array_str_field/stamplay_array_str_directive');

var _stamplay_array_str_directive2 = _interopRequireDefault(_stamplay_array_str_directive);

var _obj_key_value_field_conf = require('./custom_fields/obj_key_value/obj_key_value_field_conf');

var _obj_key_value_field_conf2 = _interopRequireDefault(_obj_key_value_field_conf);

var _obj_key_value_field_view = require('./custom_fields/obj_key_value/obj_key_value_field_view');

var _obj_key_value_field_view2 = _interopRequireDefault(_obj_key_value_field_view);

var _obj_key_value_field_directive = require('./custom_fields/obj_key_value/obj_key_value_field_directive');

var _obj_key_value_field_directive2 = _interopRequireDefault(_obj_key_value_field_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***************************************
 * INITIALIZE THE APPLICATION
 ***************************************/

var myApp = angular.module('myApp', ['ng-admin', 'ngSanitize', "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "info.vietnamcode.nampnq.videogular.plugins.youtube", "color.picker"]);

// custom controllers
myApp.controller('username', ['$scope', '$window', function ($scope, $window) {
    // used in header.html
    $scope.username = $window.localStorage.getItem('username');
}]);

/***************************************
 * RESTANGULAR ERROR HANDLER (API CALLS)
 ***************************************/

/*myApp.config(function(RestangularProvider) {

    var refreshAccesstoken = function() {
        var deferred = $q.defer();

        // Refresh access-token logic

        return deferred.promise;
    };

    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if(response.status === 403) {
            refreshAccesstoken().then(function() {
                // Repeat the request and then call the handlers the usual way.
                $http(response.config).then(responseHandler, deferred.reject);
                // Be aware that no request interceptors are called this way.
            });

            return false; // error handled
        }

        return true; // error not handled
    });
});*/

/***************************************
 * RESTANGULAR INTERCEPTOR FUNCTIONS
 ***************************************/

myApp.config(function (RestangularProvider) {

    var token = window.localStorage.getItem("http://kpadmin-jwt");
    if ((typeof token === 'undefined' ? 'undefined' : _typeof(token)) == 'object' && token == null) {
        token = '';
    } else {
        token = token.replace(/"/g, '');
        token = token.toString();
    }

    RestangularProvider.setDefaultHeaders({
        "Content-Type": 'application/json; charset=utf-8',
        "x-stamplay-jwt": token
    });

    RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
        //console.log('url',angular.copy(url));
        // STAMPLAY CANONICAL URL IS:
        // https://bkschool.stamplayapp.com/api/cobject/v1/audio
        // ?n=10&sort=audio_url&page=1&per_page=10
        //console.log('element: ',element);
        //console.log('operation: ',operation);
        //console.log('what: ',what);
        //console.log('headers: ',headers);
        //console.log('params: ',params);
        //console.log('httpConfig',httpConfig);

        // FIX PAGINATION
        // STAMPLAY'S FORMAT == n=21&page=2&per_page=10

        console.log('request operation,', operation);
        //console.log('request what,',what);

        if (operation == 'getList') {
            params.page = params._page;
            params.per_page = params._perPage;
            if (params._sortField) {
                params.sort = '';
                if (params._sortDir == 'DESC') params.sort = '-';
                params.sort += params._sortField;
            }
            delete params._page;
            delete params._perPage;
            delete params._sortField;
            delete params._sortDir;
        }

        return { element: element, params: params };
    });

    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {

        var newResponse;
        console.log('Response', response);
        //console.log(typeof response.data.data);
        console.log('Data', data);

        // ADJUST STAMPLAY'S STRUCTURE TO MATCH WHAT NG-ADMIN EXPECTS
        if ('data' in response.data) {
            var newData = response.data.data;
            if (newData.length > 0) {
                newResponse = response.data.data;
            } else {
                newResponse = [];
            }
        } else {
            newResponse = response.data;
        }

        // FIX PAGINATION
        if (operation == "getList") {
            var contentRange = data.pagination.total_elements;
            //console.log('num of entries retrieved by Restangular',contentRange);
            response.totalCount = contentRange;
        }

        return newResponse;
    });
});

/***************************************
 * POST-RESTANGULAR INTERCEPTOR FUNCTIONS
 ***************************************/

myApp.config(function ($httpProvider) {

    // USING 'unshift' TO RUN THESE FUNCTIONS FIRST!!!!
    $httpProvider.interceptors.unshift(addContentTypeToHeader);

    // Angular removes the header 'Content-Type' if request is GET.
    // This function is a hack to add the header back in, because some API's require the header.
    function addContentTypeToHeader() {
        return {
            request: requestInterceptor
        };

        function requestInterceptor(config) {
            if (angular.isDefined(config.headers['Content-Type']) && !angular.isDefined(config.data)) config.data = '';

            return config;
        }
    }

    // these functions run in regular order (after Restangular interceptors)
    $httpProvider.interceptors.push(fixStamplayIssues);

    // When NG-Admin does a list GET, it receives all fields for that data model, and those fields
    // persist in the dataStore, even if the editionView only defines a couple of fields. Which means
    // that the un-editable fields in Stamplay must be removed before doing a PUT
    function fixStamplayIssues($q) {
        return {
            request: function request(config) {
                config = angular.copy(config);
                if (config.method === 'PUT') {
                    delete config.data.__v;
                    delete config.data._id;
                    delete config.data.appId;
                    delete config.data.cobjectId;
                    delete config.data.dt_create;
                    delete config.data.dt_update;
                    delete config.data.id;
                    delete config.data.actions;
                }

                if (config.method == 'GET' && config.params) {
                    if (config.params._filters && '[object Object]' in config.params._filters) {
                        var temp = config.params._filters['[object Object]'];
                        delete config.params._filters;
                        config.params.chatRoomId = temp;
                    }
                    //config.url += '/' + config.params.id;
                    //delete config.params.id;
                }

                return config || $q.when(config);
            }
        };
    }
});

/***************************************
 * CUSTOM PAGES
 * ----
 * http://ng-admin-book.marmelab.com/doc/Custom-pages.html
 ***************************************/

//myApp.constant('chatServerURL', 'http://chat.gokurbi.com/chatbox');
myApp.constant('chatServerURL', 'http://kchat:8080/chatbox');

// CHATBOX CUSTOMIZATION PAGE

myApp.config(function ($stateProvider) {
    $stateProvider.state('chatbox-config', {
        parent: 'main',
        url: '/chatbox_config/:chatBoxId?',
        params: {
            chatBoxId: { squash: true, value: null }
        },
        controller: _chatboxconfig2.default,
        controllerAs: 'controller',
        template: _chatboxconfigtemplate2.default
    });
});

// REPLY TO USER QUESTION PAGE

myApp.config(function ($stateProvider) {
    $stateProvider.state('chat-conversation-reply', {
        parent: 'main',
        url: '/reply_to_chat_conversation/:chatRoomId',
        controller: _replyconfig2.default,
        controllerAs: 'controller',
        template: _replytemplate2.default
    });
});

/***************************************
 * CUSTOM FIELDS
 * ---- 
 * http://ng-admin-book.marmelab.com/doc/Custom-types.html
 * Use of 'import': // http://stackoverflow.com/questions/36451969/custom-type-the-field-class-is-injected-as-an-object-not-a-function
 ***************************************/

// field for displaying the array of strings field from Stamplay


// field that pulls a value from a object saved in an array of strings on Stamplay


// REGISTER THE CUSTOM FIELDS
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    nga.registerFieldType('stamplay_array_str', _stamplay_array_str_field_config2.default);
    nga.registerFieldType('obj_key_value_field', _obj_key_value_field_conf2.default);
}]);
myApp.config(['FieldViewConfigurationProvider', function (fvp) {
    fvp.registerFieldView('stamplay_array_str', _stamplay_array_str_view2.default);
    fvp.registerFieldView('obj_key_value_field', _obj_key_value_field_view2.default);
}]);
myApp.directive('stamplayArrStrings', _stamplay_array_str_directive2.default);
myApp.directive('objKeyValueField', _obj_key_value_field_directive2.default);

myApp.directive('replyToChatConversation', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: { post: '&' },
        link: function link(scope) {
            scope.redirect = function () {
                $location.path('/reply_to_chat_conversation/' + scope.post().values.id);
            };
        },
        template: '<a class="btn btn-default reply-to-conversation-btn" ng-click="redirect()">Reply To This Conversation</a>'
    };
}]);

myApp.directive('editChatBox', ['$location', function ($location) {
    return {
        restrict: 'E',
        link: function link(scope, ele, attrs) {
            console.log('scope', scope);
            console.log('attrs', attrs);
            scope.editChatBoxUrl = scope.entry ? scope.entry._identifierValue : '';
            scope.size = attrs.size;
            scope.type = attrs.type ? attrs.type : '';
        },
        template: '<a class="btn btn-default" style="margin-left:4px;" \n                    ng-class="size ? \'btn-\' + size : \'\'"  \n                    href="#/chatbox_config/{{editChatBoxUrl}}">\n                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"\n                            ng-if="type==\'edit\'"></span>\n                        <span class="glyphicon glyphicon-plus" aria-hidden="true"\n                            ng-if="type==\'create\'"></span>\n                        &nbsp;\n                        <span ng-if="type==\'edit\'" class="hidden-xs ng-scope" translate="EDIT">Edit</span>\n                        <span ng-if="type==\'create\'" class="hidden-xs ng-scope" translate="CREATE">Create</span>\n                    </a>'
    };
}]);

/***************************************
 * DEFINE DATA ENTITIES
 ***************************************/
//import Field from 'admin-config/lib/Field/Field';
myApp.config(['NgAdminConfigurationProvider', function (nga) {

    // create the default admin application
    // ==================================================

    var admin = nga.application('Kurbi Provider Admin').baseApiUrl('https://kurbi.stamplayapp.com/api/cobject/v1/');

    // add entities
    // ==================================================

    // users (https://bkschool.stamplayapp.com/api/user/v1/)
    var create = require('./models/users');
    var userEntity = nga.entity('users').baseApiUrl('https://kurbi.stamplayapp.com/api/user/v1/');
    admin.addEntity(create(nga, userEntity));

    // customization (of chatbox)
    var create = require('./models/customization');
    var customizations = nga.entity('customization');
    admin.addEntity(create(nga, customizations));

    // chatroom replies
    var create = require('./models/chatroomreplies');
    var chatReplies = nga.entity('chatroomreplies');
    admin.addEntity(create(nga, chatReplies, nga.entity('chatroom')));

    // chatroom
    var create = require('./models/chatroom');
    var chatroom = nga.entity('chatroom');
    admin.addEntity(create(nga, chatroom, chatReplies));

    // chatbox
    var create = require('./models/chatbox');
    admin.addEntity(create(nga, nga.entity('chatbox'), customizations, chatroom));

    // articles
    var create = require('./models/articles');
    admin.addEntity(create(nga, nga.entity('articles')));

    /***************************************
     * CUSTOM MENU
     ***************************************/

    admin.menu(nga.menu().addChild(nga.menu().title('Dashboard').icon('<span class="glyphicon glyphicon-calendar"></span>&nbsp;').link('/dashboard')).addChild(nga.menu(nga.entity('users')).title('Users').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;')).addChild(nga.menu().title('Chat').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;').addChild(nga.menu(nga.entity('chatroom')).title('Conversations').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;')).addChild(nga.menu(nga.entity('chatroomreplies')).title('Replies').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;')).addChild(nga.menu(nga.entity('chatbox')).title('ChatBox').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))).addChild(nga.menu(nga.entity('articles')).title('Articles').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;')));

    /***************************************
     * CUSTOM HEADER
     ***************************************/
    var customHeaderTemplate = '<div class="navbar-header">' + '<button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">' + '<span class="icon-bar"></span>' + '<span class="icon-bar"></span>' + '<span class="icon-bar"></span>' + '</button>' + '<a class="navbar-brand" href="#" ng-click="appController.displayHome()"><img src="images/logo.png" align="left" style="margin:-8px 5px 0 0;" />Kurbi Provider Admin</a>' + '</div>' + '<ul class="nav navbar-top-links navbar-right hidden-xs">' + '<li uib-dropdown>' + '<a uib-dropdown-toggle href="#" aria-expanded="true" ng-controller="username" style="color: #ffffff;" class="username">' + '<i class="glyphicon glyphicon-user"></i>&nbsp;{{username}}&nbsp;<i class="fa fa-caret-down"></i>' + '</a>' + '<ul class="dropdown-menu dropdown-user" role="menu">' + '<li><a href="#" onclick="logout()"><i class="glyphicon glyphicon-log-out"></i> Logout</a></li>' + '</ul>' + '</li>' + '</ul>';
    admin.header(customHeaderTemplate);

    /***************************************
     * CUSTOM DASHBOARD
     * http://ng-admin-book.marmelab.com/doc/Dashboard.html
     ***************************************/

    /***************************************
     * CUSTOM ERROR MESSAGES
     ***************************************/

    // Experimental Error Handler
    /*function appErrorHandler(response) {
    console.log('in appErrorHandler');
        return 'Global error: ' + response.status + '(' + response.data + ')';
    }
    admin.errorMessage(appErrorHandler);*/

    /***************************************
     * ATTACH ADMIN APP TO DOM & RUN
     ***************************************/

    nga.configure(admin);
}]);

// ERROR HANDLER

/*function errorHandler($rootScope, $state, $translate, notification) {
    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
        if (error.status == 404) {
            $state.go('ma-404');
            event.preventDefault();
        } else {
console.log('in first error handler');
            $translate('STATE_CHANGE_ERROR', { message: error.message }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
            throw error;
        }
    });
}
*/
/*myApp.run(errorHandler);

myApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
      'STATE_CHANGE_ERROR': 'Error: {{ message }}'
    });
    //$translateProvider.preferredLanguage('en');
}]);
*/

},{"./custom_fields/obj_key_value/obj_key_value_field_conf":1,"./custom_fields/obj_key_value/obj_key_value_field_directive":2,"./custom_fields/obj_key_value/obj_key_value_field_view":3,"./custom_fields/stamplay_array_str_field/stamplay_array_str_directive":4,"./custom_fields/stamplay_array_str_field/stamplay_array_str_field_config":5,"./custom_fields/stamplay_array_str_field/stamplay_array_str_view":6,"./custom_pages/chatboxconfig/chatboxconfig":7,"./custom_pages/chatboxconfig/chatboxconfigtemplate":8,"./custom_pages/conversation_reply/replyconfig":9,"./custom_pages/conversation_reply/replytemplate":10,"./models/articles":12,"./models/chatbox":13,"./models/chatroom":14,"./models/chatroomreplies":15,"./models/customization":16,"./models/users":17}],12:[function(require,module,exports){
module.exports = function (nga, articles) {

    // LIST VIEW
    articles.listView().fields([nga.field('dt_create', 'datetime').label('Created'), nga.field('author'), nga.field('title'), nga.field('published', 'boolean').choices([{ value: null, label: 'null' }, { value: true, label: 'yes' }, { value: false, label: 'no' }])]).listActions(['show', 'edit', 'delete']);

    // SHOW VIEW
    articles.showView().fields([nga.field('owner'), nga.field('dt_create').label('Created'), nga.field('dt_update').label('Last Updated'), nga.field('author'), nga.field('title'), nga.field('body', 'wysiwyg'), nga.field('conversation_id'), nga.field('published', 'boolean').choices([{ value: null, label: 'null' }, { value: true, label: 'yes' }, { value: false, label: 'no' }])]);

    // CREATION VIEW
    articles.creationView().fields([nga.field('title'), nga.field('body', 'wysiwyg'), nga.field('published', 'boolean').choices([{ value: null, label: 'null' }, { value: true, label: 'yes' }, { value: false, label: 'no' }])]);

    // EDITION VIEW
    articles.editionView().fields(articles.creationView().fields());

    return articles;
};

},{}],13:[function(require,module,exports){
module.exports = function (nga, chatbox, customizations, chatroom) {

    // LIST VIEW
    var listViewActionsTemplate = '<ma-export-to-csv-button entity="::entity" datastore="::datastore"></ma-export-to-csv-button>' + '<edit-chat-box entry="entry" type="create"></edit-chat-box>';
    var listViewListActionsTemplate = '<ma-show-button size="xs" entry="entry" entity="entity"></ma-show-button>' + '<edit-chat-box size="xs" entry="entry" type="edit"></edit-chat-box>' + '<ma-delete-button size="xs" entry="entry" entity="entity"></ma-delete-button>';
    chatbox.listView().fields([nga.field('dt_create', 'datetime').label('Created'), nga.field('actions', 'template').template(listViewListActionsTemplate)])
    //.listActions(['show','edit','delete'])
    .actions(listViewActionsTemplate).batchActions([]);

    // SHOW VIEW
    var showViewActionsTemplate = '<ma-list-button entry="entry" entity="entity"></ma-list-button>' + '<edit-chat-box entry="entry" type="edit"></edit-chat-box>' + '<ma-delete-button entry="entry" entity="entity"></ma-delete-button>';
    chatbox.showView().fields([nga.field('owner'), nga.field('id'), nga.field('dt_create', 'datetime').label('Created'), nga.field('dt_update', 'datetime').label('Last Updated'), nga.field('snippet').label('Web Snippet').cssClasses(['dont-break-out show-value col-sm-10 col-md-8 col-lg-7']), nga.field('customizations', 'referenced_list').label('History of changes').targetEntity(customizations).targetReferenceField('chatbox').targetFields([nga.field('chat_color'), nga.field('chat_headline'), nga.field('chat_avatar')]), nga.field('chatrooms', 'referenced_list').label('Conversations') // referenced_list of ChatRoom(s)
    .targetEntity(chatroom).targetReferenceField('key').targetFields([nga.field('dt_create', 'datetime'), nga.field('url')])]).title('Chatbox Detail').actions(showViewActionsTemplate);

    // CREATION VIEW
    chatbox.creationView().fields([nga.field('chat_avatar', 'file')
    //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })

    , nga.field('chat_color'), nga.field('chat_headline'), nga.field('chat_snippet'), nga.field('chat_url')]);

    // EDITION VIEW
    chatbox.editionView().fields(chatbox.creationView().fields());

    // DELETION VIEW
    chatbox.deletionView().title('Delete this chatbox');

    return chatbox;
};

},{}],14:[function(require,module,exports){
module.exports = function (nga, chatroom, chatReplies) {

    // DELETION VIEW
    chatroom.deletionView().disable();

    // LIST VIEW
    chatroom.listView().fields([nga.field('dt_create', 'datetime').label('Created').format('MM/dd/yyyy'), nga.field('messages', 'obj_key_value_field').label('Question').keyValueChoices('{"qCode":"back pain details"}').cssClasses(['obj_key_value_field'])]).title('Conversations').listActions(['show']).batchActions([]);

    // SHOW VIEW
    chatroom.showView().fields([nga.field('owner'), nga.field('dt_create', 'datetime').label('Created').format('MM/dd/yyyy, HH:mm:ss'), nga.field('dt_update', 'datetime').label('Last Updated').format('MM/dd/yyyy, HH:mm:ss')
    // ,nga.field('key')
    // ,nga.field('room')
    // ,nga.field('sessionID')
    , nga.field('messages', 'stamplay_array_str').label('Conversation Details').targetFields([nga.field('source'), nga.field('message.body.text')]).jsonParse(true).fieldValueStyles('[{"fieldName":"source", "value":"patient", "cssClass":"chat-message-source-patient"}]').cssClasses(['short-scroll']), nga.field('custom_action').label('').template('<reply-to-chat-conversation post="entry"></reply-to-chat-conversation>'), nga.field('replies', 'referenced_list').label('Replies').targetEntity(chatReplies).targetReferenceField(nga.field('chatRoomId')).targetFields([nga.field('dt_create', 'datetime').label('Posted'), nga.field('replyText', 'wysiwyg').label('Detail').isDetailLink('true')
    // .map(function truncate(value, entry) {
    //     return value + '(' + entry.values.subValue + ')';
    // })
    ])]).title('Conversation Detail').actions(['list']);

    return chatroom;
};

},{}],15:[function(require,module,exports){
module.exports = function (nga, chatroomreplies, chatRoom) {

    // LIST VIEW
    chatroomreplies.listView().fields([nga.field('chatRoomId', 'reference').label('Parent Conversation').isDetailLink('true').detailLinkRoute('show').targetEntity(chatRoom).targetField(nga.field('dt_create', 'datetime').format('MM/dd/yyyy')), nga.field('dt_create', 'datetime').label('Reply Posted').format('MM/dd/yyyy'), nga.field('replyText', 'wysiwyg').label('Detail')
    // .map(function truncate(value, entry) {
    //     return value + '(' + entry.values.subValue + ')';
    // })
    ]).title('Replies').listActions(['show', 'edit', 'delete']).filters([
    //nga.field('q').label('Search').pinned(true)
    //,
    nga.field('qa').label('').template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>')]);

    // SHOW VIEW
    chatroomreplies.showView().fields([nga.field('owner'), nga.field('dt_create').label('Created'), nga.field('dt_update').label('Last Updated'), nga.field('chatRoomId').label('Reply Id'), nga.field('recipient'), nga.field('replyText', 'wysiwyg')]).title('Reply Detail');

    // CREATION VIEW
    chatroomreplies.creationView().fields([nga.field('recipient'), nga.field('replyText', 'wysiwyg')]).title('Create New Reply');

    // EDITION VIEW
    chatroomreplies.editionView().fields(chatroomreplies.creationView().fields()).title('Edit Reply');

    chatroomreplies.deletionView().title('Delete This Reply?');

    return chatroomreplies;
};

},{}],16:[function(require,module,exports){
module.exports = function (nga, customization) {

    // LIST VIEW
    customization.listView().fields([nga.field('id'), nga.field('dt_create').label('Created'), nga.field('chat_avatar'), nga.field('chat_url')]).listActions(['show', 'edit', 'delete']).title('Chatboxes');

    // SHOW VIEW
    customization.showView().fields([nga.field('owner'), nga.field('dt_create').label('Created'), nga.field('dt_update').label('Last Updated'), nga.field('chat_avatar'), nga.field('chat_color'), nga.field('chat_headline'), nga.field('chat_snippet'), nga.field('chat_url')
    // relate concept
    ]);

    // CREATION VIEW
    customization.creationView().fields([nga.field('chat_avatar', 'file')
    //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })

    , nga.field('chat_color'), nga.field('chat_headline'), nga.field('chat_snippet'), nga.field('chat_url')]);

    // EDITION VIEW
    customization.editionView().fields(customization.creationView().fields());

    return customization;
};

},{}],17:[function(require,module,exports){
module.exports = function (nga, users) {

    // LIST VIEW
    users.listView().fields([nga.field('id'), nga.field('displayName'), nga.field('email')]).listActions(['show', 'edit', 'delete']);

    // SHOW VIEW
    users.showView().fields([nga.field('id'), nga.field('dt_create'), nga.field('dt_update'), nga.field('firstName'), nga.field('lastName'), nga.field('displayName'), nga.field('email'), nga.field('givenRole'), nga.field('pictures', 'embedded_list').targetFields([nga.field('google'), nga.field('facebook')]), nga.field('identities', 'embedded_list').targetFields([nga.field('google'), nga.field('facebook')])]);

    // CREATION VIEW
    users.creationView().fields([nga.field('firstName'), nga.field('lastName'), nga.field('displayName'), nga.field('email')]);

    // EDITION VIEW
    users.editionView().fields(users.creationView().fields());

    return users;
};

},{}],18:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stringUtils = require("../Utils/stringUtils");

var _stringUtils2 = _interopRequireDefault(_stringUtils);

var _Field = require("../Field/Field");

var _Field2 = _interopRequireDefault(_Field);

var _DashboardView = require("../View/DashboardView");

var _DashboardView2 = _interopRequireDefault(_DashboardView);

var _MenuView = require("../View/MenuView");

var _MenuView2 = _interopRequireDefault(_MenuView);

var _ListView = require("../View/ListView");

var _ListView2 = _interopRequireDefault(_ListView);

var _CreateView = require("../View/CreateView");

var _CreateView2 = _interopRequireDefault(_CreateView);

var _EditView = require("../View/EditView");

var _EditView2 = _interopRequireDefault(_EditView);

var _DeleteView = require("../View/DeleteView");

var _DeleteView2 = _interopRequireDefault(_DeleteView);

var _ShowView = require("../View/ShowView");

var _ShowView2 = _interopRequireDefault(_ShowView);

var _BatchDeleteView = require("../View/BatchDeleteView");

var _BatchDeleteView2 = _interopRequireDefault(_BatchDeleteView);

var _ExportView = require("../View/ExportView");

var _ExportView2 = _interopRequireDefault(_ExportView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var index = 0;

var Entity = function () {
    function Entity(name) {
        _classCallCheck(this, Entity);

        this._name = name;
        this._uniqueId = this._name + '_' + index++;
        this._baseApiUrl = null;
        this._label = null;
        this._identifierField = new _Field2.default("id");
        this._isReadOnly = false;
        this._errorMessage = null;
        this._order = 0;
        this._url = null;
        this._createMethod = null; // manually set the HTTP-method for create operation, defaults to post
        this._updateMethod = null; // manually set the HTTP-method for update operation, defaults to put
        this._retrieveMethod = null; // manually set the HTTP-method for the get operation, defaults to get
        this._deleteMethod = null; // manually set the HTTP-method for the delete operation, defaults to delete

        this._initViews();
    }

    _createClass(Entity, [{
        key: "label",
        value: function label() {
            if (arguments.length) {
                this._label = arguments[0];
                return this;
            }

            if (this._label === null) {
                return _stringUtils2.default.camelCase(this._name);
            }

            return this._label;
        }
    }, {
        key: "name",
        value: function name() {
            if (arguments.length) {
                this._name = arguments[0];
                return this;
            }

            return this._name;
        }
    }, {
        key: "menuView",
        value: function menuView() {
            return this._views["MenuView"];
        }
    }, {
        key: "dashboardView",
        value: function dashboardView() {
            return this._views["DashboardView"];
        }
    }, {
        key: "listView",
        value: function listView() {
            return this._views["ListView"];
        }
    }, {
        key: "creationView",
        value: function creationView() {
            return this._views["CreateView"];
        }
    }, {
        key: "editionView",
        value: function editionView() {
            return this._views["EditView"];
        }
    }, {
        key: "deletionView",
        value: function deletionView() {
            return this._views["DeleteView"];
        }
    }, {
        key: "batchDeleteView",
        value: function batchDeleteView() {
            return this._views["BatchDeleteView"];
        }
    }, {
        key: "exportView",
        value: function exportView() {
            return this._views["ExportView"];
        }
    }, {
        key: "showView",
        value: function showView() {
            return this._views["ShowView"];
        }
    }, {
        key: "baseApiUrl",
        value: function baseApiUrl(_baseApiUrl) {
            if (!arguments.length) return this._baseApiUrl;
            this._baseApiUrl = _baseApiUrl;
            return this;
        }
    }, {
        key: "_initViews",
        value: function _initViews() {
            this._views = {
                "DashboardView": new _DashboardView2.default().setEntity(this),
                "MenuView": new _MenuView2.default().setEntity(this),
                "ListView": new _ListView2.default().setEntity(this),
                "CreateView": new _CreateView2.default().setEntity(this),
                "EditView": new _EditView2.default().setEntity(this),
                "DeleteView": new _DeleteView2.default().setEntity(this),
                "BatchDeleteView": new _BatchDeleteView2.default().setEntity(this),
                "ExportView": new _ExportView2.default().setEntity(this),
                "ShowView": new _ShowView2.default().setEntity(this)
            };
        }
    }, {
        key: "identifier",
        value: function identifier(value) {
            if (!arguments.length) return this._identifierField;
            if (!(value instanceof _Field2.default)) {
                throw new Error('Entity ' + this.name() + ': identifier must be an instance of Field.');
            }
            this._identifierField = value;
            return this;
        }
    }, {
        key: "readOnly",
        value: function readOnly() {
            this._isReadOnly = true;

            this._views["CreateView"].disable();
            this._views["EditView"].disable();
            this._views["DeleteView"].disable();
            this._views["BatchDeleteView"].disable();

            return this;
        }
    }, {
        key: "getErrorMessage",
        value: function getErrorMessage(response) {
            if (typeof this._errorMessage === 'function') {
                return this._errorMessage(response);
            }

            return this._errorMessage;
        }
    }, {
        key: "errorMessage",
        value: function errorMessage(_errorMessage) {
            if (!arguments.length) return this._errorMessage;
            this._errorMessage = _errorMessage;
            return this;
        }
    }, {
        key: "order",
        value: function order(_order) {
            if (!arguments.length) return this._order;
            this._order = _order;
            return this;
        }
    }, {
        key: "url",
        value: function url(_url) {
            if (!arguments.length) return this._url;
            this._url = _url;
            return this;
        }
    }, {
        key: "getUrl",
        value: function getUrl(viewType, identifierValue, identifierName) {
            if (typeof this._url === 'function') {
                return this._url(this.name(), viewType, identifierValue, identifierName);
            }

            return this._url;
        }
    }, {
        key: "createMethod",
        value: function createMethod(_createMethod) {
            if (!arguments.length) return this._createMethod;
            this._createMethod = _createMethod;
            return this;
        }
    }, {
        key: "updateMethod",
        value: function updateMethod(_updateMethod) {
            if (!arguments.length) return this._updateMethod;
            this._updateMethod = _updateMethod;
            return this;
        }
    }, {
        key: "retrieveMethod",
        value: function retrieveMethod(_retrieveMethod) {
            if (!arguments.length) return this._retrieveMethod;
            this._retrieveMethod = _retrieveMethod;
            return this;
        }
    }, {
        key: "deleteMethod",
        value: function deleteMethod(_deleteMethod) {
            if (!arguments.length) return this._deleteMethod;
            this._deleteMethod = _deleteMethod;
            return this;
        }
    }, {
        key: "uniqueId",
        get: function get() {
            return this._uniqueId;
        }
    }, {
        key: "views",
        get: function get() {
            return this._views;
        }
    }, {
        key: "isReadOnly",
        get: function get() {
            return this._isReadOnly;
        }
    }]);

    return Entity;
}();

exports.default = Entity;
module.exports = exports["default"];

},{"../Field/Field":21,"../Utils/stringUtils":25,"../View/BatchDeleteView":26,"../View/CreateView":27,"../View/DashboardView":28,"../View/DeleteView":29,"../View/EditView":30,"../View/ExportView":31,"../View/ListView":32,"../View/MenuView":33,"../View/ShowView":34}],19:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectProperties = require('./Utils/objectProperties');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function () {
    function Entry(entityName, values, identifierValue) {
        _classCallCheck(this, Entry);

        this._entityName = entityName;
        this.values = values || {};
        this._identifierValue = identifierValue;
        this.listValues = {};
    }

    _createClass(Entry, [{
        key: 'transformToRest',


        /**
         * Transform an Entry to a JS object for the REST API Request
         *
         * @return {Object}
         */
        value: function transformToRest(fields) {

            var restEntry = (0, _objectProperties.clone)(this.values);
            fields.forEach(function (field) {
                var fieldName = field.name();
                if (fieldName in restEntry) {
                    restEntry[fieldName] = field.getTransformedValue(restEntry[fieldName], restEntry);
                }
            });

            return (0, _objectProperties.cloneAndNest)(restEntry);
        }
    }, {
        key: 'entityName',
        get: function get() {
            return this._entityName;
        }
    }, {
        key: 'identifierValue',
        get: function get() {
            return this._identifierValue;
        }
    }], [{
        key: 'createForFields',
        value: function createForFields(fields, entityName) {
            var entry = new Entry(entityName);
            fields.forEach(function (field) {
                entry.values[field.name()] = field.defaultValue();
            });
            return entry;
        }

        /**
         * Map a JS object from the REST API Response to an Entry
         *
         * @return {Entry}
         */

    }, {
        key: 'createFromRest',
        value: function createFromRest(restEntry) {
            var fields = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
            var entityName = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
            var identifierName = arguments.length <= 3 || arguments[3] === undefined ? 'id' : arguments[3];

            if (!restEntry || Object.keys(restEntry).length == 0) {
                return Entry.createForFields(fields, entityName);
            }
            var excludedFields = fields.filter(function (f) {
                return !f.flattenable();
            }).map(function (f) {
                return f.name();
            });

            var values = (0, _objectProperties.cloneAndFlatten)(restEntry, excludedFields);

            fields.forEach(function (field) {
                var fieldName = field.name();
                values[fieldName] = field.getMappedValue(values[fieldName], values);
            });

            return new Entry(entityName, values, values[identifierName]);
        }

        /**
         * Map an array of JS objects from the REST API Response to an array of Entries
         *
         * @return {Array[Entry]}
         */

    }, {
        key: 'createArrayFromRest',
        value: function createArrayFromRest(restEntries, fields, entityName, identifierName) {
            return restEntries.map(function (e) {
                return Entry.createFromRest(e, fields, entityName, identifierName);
            });
        }
    }]);

    return Entry;
}();

exports.default = Entry;
module.exports = exports['default'];

},{"./Utils/objectProperties":23}],20:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require("./Field");

var _Field3 = _interopRequireDefault(_Field2);

var _Entity = require("../Entity/Entity");

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Map an embedded list in the entry
 *
 * @example
 *
 *     {
 *        id: 123,
 *        title: "hello, world",
 *        comments: [
 *          { date: "2015-09-30", author: "John Doe", body: "Lorem Ipsum" },
 *          { date: "2015-10-02", author: "Jane Doe", body: "Sic dolor amet" }
 *        ]
 *     }
 *
 *     let commentsField = new EmbeddedListField('comments')
 *        .targetFields([
 *          new DateField('date'),
 *          new StringField('author'),
 *          new StringField('body')
 *        ])
 */

var EmbeddedListField = function (_Field) {
    _inherits(EmbeddedListField, _Field);

    function EmbeddedListField(name) {
        _classCallCheck(this, EmbeddedListField);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EmbeddedListField).call(this, name));

        _this._type = 'embedded_list';
        _this._flattenable = false;
        _this._targetEntity = new _Entity2.default(); // link to an empty entity by default
        _this._targetFields = [];
        _this._sortField = null;
        _this._sortDir = null;
        _this._permanentFilters = null;
        _this._listActions = [];
        return _this;
    }

    /**
     * Optionally set the target Entity
     *
     * Useful if the embedded entries can be edited in standalone
     */


    _createClass(EmbeddedListField, [{
        key: "targetEntity",
        value: function targetEntity(entity) {
            if (!arguments.length) {
                return this._targetEntity;
            }
            this._targetEntity = entity;

            return this;
        }

        /**
         * List the fields to map in the embedded entries
         *
         * @example
         *
         *     embeddedListField.targetFields([
         *       new DateField('date'),
         *       new StringField('author'),
         *       new StringField('body')
         *     ])
         */

    }, {
        key: "targetFields",
        value: function targetFields(value) {
            if (!arguments.length) return this._targetFields;
            this._targetFields = value;

            return this;
        }

        /**
         * Name of the field used for sorting.
         *
         * @param string
         */

    }, {
        key: "sortField",
        value: function sortField() {
            if (arguments.length) {
                this._sortField = arguments[0];
                return this;
            }

            return this._sortField ? this._sortField : this.targetEntity().identifier().name();
        }

        /**
         * Direction used for sorting.
         *
         * @param String either 'ASC' or 'DESC'
         */

    }, {
        key: "sortDir",
        value: function sortDir() {
            if (arguments.length) {
                this._sortDir = arguments[0];
                return this;
            }

            return this._sortDir;
        }
    }, {
        key: "listActions",
        value: function listActions(actions) {
            if (!arguments.length) {
                return this._listActions;
            }

            this._listActions = actions;

            return this;
        }

        /**
         * Define permanent filters to be added to the REST API calls
         *
         *     nga.field('post_id', 'reference').permanentFilters({
         *        published: true
         *     });
         *     // related API call will be /posts/:id?published=true
         *
         * @param {Object} filters list of filters to apply to the call
         */

    }, {
        key: "permanentFilters",
        value: function permanentFilters(filters) {
            if (!arguments.length) {
                return this._permanentFilters;
            }

            this._permanentFilters = filters;

            return this;
        }
    }]);

    return EmbeddedListField;
}(_Field3.default);

exports.default = EmbeddedListField;
module.exports = exports["default"];

},{"../Entity/Entity":18,"./Field":21}],21:[function(require,module,exports){
exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stringUtils = require("../Utils/stringUtils");

var _stringUtils2 = _interopRequireDefault(_stringUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = function () {
    function Field(name) {
        _classCallCheck(this, Field);

        this._name = name || Math.random().toString(36).substring(7);
        this._detailLink = name === 'id';
        this._type = "string";
        this._order = null;
        this._label = null;
        this._maps = [];
        this._transforms = [];
        this._attributes = {};
        this._cssClasses = null;
        this._validation = { required: false, minlength: 0, maxlength: 99999 };
        this._defaultValue = null;
        this._editable = true;
        this._sortable = true;
        this._detailLinkRoute = 'edit';
        this._pinned = false;
        this._flattenable = true;
        this.dashboard = true;
        this.list = true;
        this._template = function () {
            return '';
        };
        this._templateIncludesLabel = false;
    }

    _createClass(Field, [{
        key: "label",
        value: function label() {
            if (arguments.length) {
                this._label = arguments[0];
                return this;
            }

            if (this._label === null) {
                return _stringUtils2.default.camelCase(this._name);
            }

            return this._label;
        }
    }, {
        key: "type",
        value: function type() {
            return this._type;
        }
    }, {
        key: "name",
        value: function name() {
            if (arguments.length) {
                this._name = arguments[0];
                return this;
            }

            return this._name;
        }
    }, {
        key: "order",
        value: function order() {
            if (arguments.length) {
                if (arguments[1] !== true) {
                    console.warn('Setting order with Field.order is deprecated, order directly in fields array');
                }
                this._order = arguments[0];
                return this;
            }

            return this._order;
        }
    }, {
        key: "isDetailLink",
        value: function isDetailLink(detailLink) {
            if (arguments.length) {
                this._detailLink = arguments[0];
                return this;
            }

            if (this._detailLink === null) {
                return this._name === 'id';
            }

            return this._detailLink;
        }
    }, {
        key: "map",


        /**
         * Add a function to be applied to the response object to turn it into an entry
         */
        value: function map(fn) {
            if (!fn) return this._maps;
            if (typeof fn !== "function") {
                var type = typeof fn === "undefined" ? "undefined" : _typeof(fn);
                throw new Error("Map argument should be a function, " + type + " given.");
            }

            this._maps.push(fn);

            return this;
        }
    }, {
        key: "hasMaps",
        value: function hasMaps() {
            return !!this._maps.length;
        }
    }, {
        key: "getMappedValue",
        value: function getMappedValue(value, entry) {
            for (var i in this._maps) {
                value = this._maps[i](value, entry);
            }

            return value;
        }

        /**
         * Add a function to be applied to the entry to turn it into a response object
         */

    }, {
        key: "transform",
        value: function transform(fn) {
            if (!fn) return this._transforms;
            if (typeof fn !== "function") {
                var type = typeof fn === "undefined" ? "undefined" : _typeof(fn);
                throw new Error("transform argument should be a function, " + type + " given.");
            }

            this._transforms.push(fn);

            return this;
        }
    }, {
        key: "hasTranforms",
        value: function hasTranforms() {
            return !!this._transforms.length;
        }
    }, {
        key: "getTransformedValue",
        value: function getTransformedValue(value, entry) {
            for (var i in this._transforms) {
                value = this._transforms[i](value, entry);
            }

            return value;
        }
    }, {
        key: "attributes",
        value: function attributes(_attributes) {
            if (!arguments.length) {
                return this._attributes;
            }

            this._attributes = _attributes;

            return this;
        }
    }, {
        key: "cssClasses",
        value: function cssClasses(classes) {
            if (!arguments.length) return this._cssClasses;
            this._cssClasses = classes;
            return this;
        }
    }, {
        key: "getCssClasses",
        value: function getCssClasses(entry) {
            if (!this._cssClasses) {
                return '';
            }

            if (this._cssClasses.constructor === Array) {
                return this._cssClasses.join(' ');
            }

            if (typeof this._cssClasses === 'function') {
                return this._cssClasses(entry);
            }

            return this._cssClasses;
        }
    }, {
        key: "validation",
        value: function validation(_validation) {
            if (!arguments.length) {
                return this._validation;
            }

            for (var property in _validation) {
                if (!_validation.hasOwnProperty(property)) continue;
                if (_validation[property] === null) {
                    delete this._validation[property];
                } else {
                    this._validation[property] = _validation[property];
                }
            }

            return this;
        }
    }, {
        key: "defaultValue",
        value: function defaultValue(_defaultValue) {
            if (!arguments.length) return this._defaultValue;
            this._defaultValue = _defaultValue;
            return this;
        }
    }, {
        key: "editable",
        value: function editable(_editable) {
            if (!arguments.length) return this._editable;
            this._editable = _editable;
            return this;
        }
    }, {
        key: "sortable",
        value: function sortable(_sortable) {
            if (!arguments.length) return this._sortable;
            this._sortable = _sortable;
            return this;
        }
    }, {
        key: "detailLinkRoute",
        value: function detailLinkRoute(route) {
            if (!arguments.length) return this._detailLinkRoute;
            this._detailLinkRoute = route;
            return this;
        }
    }, {
        key: "pinned",
        value: function pinned(_pinned) {
            if (!arguments.length) return this._pinned;
            this._pinned = _pinned;
            return this;
        }
    }, {
        key: "flattenable",
        value: function flattenable() {
            return this._flattenable;
        }
    }, {
        key: "getTemplateValue",
        value: function getTemplateValue(data) {
            if (typeof this._template === 'function') {
                return this._template(data);
            }

            return this._template;
        }
    }, {
        key: "getTemplateValueWithLabel",
        value: function getTemplateValueWithLabel(data) {
            return this._templateIncludesLabel ? this.getTemplateValue(data) : false;
        }
    }, {
        key: "templateIncludesLabel",
        value: function templateIncludesLabel(_templateIncludesLabel) {
            if (!arguments.length) return this._templateIncludesLabel;
            this._templateIncludesLabel = _templateIncludesLabel;
            return this;
        }
    }, {
        key: "template",
        value: function template(_template) {
            var templateIncludesLabel = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (!arguments.length) return this._template;
            this._template = _template;
            this._templateIncludesLabel = templateIncludesLabel;
            return this;
        }
    }, {
        key: "detailLink",
        set: function set(isDetailLink) {
            return this._detailLink = isDetailLink;
        }
    }]);

    return Field;
}();

exports.default = Field;
module.exports = exports["default"];

},{"../Utils/stringUtils":25}],22:[function(require,module,exports){
exports.__esModule = true;
exports.default = {
    getReferencedLists: function getReferencedLists(fields) {
        return this.indexByName(fields.filter(function (f) {
            return f.type() === 'referenced_list';
        }));
    },
    getReferences: function getReferences(fields, withRemoteComplete) {
        var optimized = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        var references = fields.filter(function (f) {
            return f.type() === 'reference' || f.type() === 'reference_many';
        });
        if (withRemoteComplete === true) {
            references = references.filter(function (r) {
                return r.remoteComplete();
            });
        } else if (withRemoteComplete === false) {
            references = references.filter(function (r) {
                return !r.remoteComplete();
            });
        }
        if (optimized !== null) {
            references = references.filter(function (r) {
                return r.hasSingleApiCall() === optimized;
            });
        }
        return this.indexByName(references);
    },
    getNonOptimizedReferences: function getNonOptimizedReferences(fields, withRemoteComplete) {
        return this.getReferences(fields, withRemoteComplete, false);
    },
    getOptimizedReferences: function getOptimizedReferences(fields, withRemoteComplete) {
        return this.getReferences(fields, withRemoteComplete, true);
    },
    indexByName: function indexByName(references) {
        return references.reduce(function (referencesByName, reference) {
            referencesByName[reference.name()] = reference;
            return referencesByName;
        }, {});
    }
};
module.exports = exports['default'];

},{}],23:[function(require,module,exports){
exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.clone = clone;
exports.cloneAndFlatten = cloneAndFlatten;
exports.cloneAndNest = cloneAndNest;
function isObject(value) {
    if (value === null) return false;
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return false;
    if (Array.isArray(value)) return false;
    if (Object.prototype.toString.call(value) === '[object Date]') return false;
    return true;
}

function clone(object) {
    return Object.keys(object).reduce(function (values, name) {
        if (object.hasOwnProperty(name)) {
            values[name] = object[name];
        }
        return values;
    }, {});
}

/*
 * Flatten nested object into a single level object with 'foo.bar' property names
 *
 * The parameter object is left unchanged. All values in the returned object are scalar.
 *
 *     cloneAndFlatten({ a: 1, b: { c: 2 }, d: { e: 3, f: { g: 4, h: 5 } }, i: { j: 6 } }, ['i'])
 *     // { a: 1, 'b.c': 2, 'd.e': 3, 'd.f.g': 4, 'd.f.h': 5, i: { j: 6 } } }
 *
 * @param {Object} object
 * @param {String[]} excludedProperties
 * @return {Object}
 */
function cloneAndFlatten(object) {
    var excludedProperties = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
        throw new Error('Expecting an object parameter');
    }
    return Object.keys(object).reduce(function (values, name) {
        if (!object.hasOwnProperty(name)) return values;
        if (isObject(object[name])) {
            if (excludedProperties.indexOf(name) === -1) {
                (function () {
                    var flatObject = cloneAndFlatten(object[name]);
                    Object.keys(flatObject).forEach(function (flatObjectKey) {
                        if (!flatObject.hasOwnProperty(flatObjectKey)) return;
                        values[name + '.' + flatObjectKey] = flatObject[flatObjectKey];
                    });
                })();
            } else {
                values[name] = clone(object[name]);
            }
        } else {
            values[name] = object[name];
        }
        return values;
    }, {});
};

/*
 * Clone flattened object into a nested object
 *
 * The parameter object is left unchanged.
 *
 *     cloneAndNest({ a: 1, 'b.c': 2, 'd.e': 3, 'd.f.g': 4, 'd.f.h': 5 } )
 *     // { a: 1, b: { c: 2 }, d: { e: 3, f: { g: 4, h: 5 } } }
 *
 * @param {Object} object
 * @return {Object}
 */
function cloneAndNest(object) {
    if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
        throw new Error('Expecting an object parameter');
    }
    return Object.keys(object).reduce(function (values, name) {
        if (!object.hasOwnProperty(name)) return values;
        name.split('.').reduce(function (previous, current, index, list) {
            if (previous != null) {
                if (typeof previous[current] === 'undefined') previous[current] = {};
                if (index < list.length - 1) {
                    return previous[current];
                };
                previous[current] = object[name];
            }
        }, values);
        return values;
    }, {});
}

},{}],24:[function(require,module,exports){
exports.__esModule = true;
exports.default = {
    order: function order(input) {
        var results = [],
            objectKey;

        for (objectKey in input) {
            results.push(input[objectKey]);
        }

        return results.sort(function (e1, e2) {
            return e1.order() - e2.order();
        });
    }
};
module.exports = exports["default"];

},{}],25:[function(require,module,exports){
exports.__esModule = true;
exports.default = {
    /**
     * @see http://stackoverflow.com/questions/10425287/convert-string-to-camelcase-with-regular-expression
     * @see http://phpjs.org/functions/ucfirst/
     */
    camelCase: function camelCase(text) {
        if (!text) {
            return text;
        }

        var f = text.charAt(0).toUpperCase();
        text = f + text.substr(1);

        return text.replace(/[-_.\s](.)/g, function (match, group1) {
            return ' ' + group1.toUpperCase();
        });
    }
};
module.exports = exports['default'];

},{}],26:[function(require,module,exports){
exports.__esModule = true;

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BatchDeleteView = function (_View) {
    _inherits(BatchDeleteView, _View);

    function BatchDeleteView(name) {
        _classCallCheck(this, BatchDeleteView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BatchDeleteView).call(this, name));

        _this._type = 'BatchDeleteView';
        _this._enabled = true;
        return _this;
    }

    return BatchDeleteView;
}(_View3.default);

exports.default = BatchDeleteView;
module.exports = exports['default'];

},{"./View":35}],27:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateView = function (_View) {
    _inherits(CreateView, _View);

    function CreateView(name) {
        _classCallCheck(this, CreateView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CreateView).call(this, name));

        _this._type = 'CreateView';
        _this._submitCreationSuccess = null;
        _this._submitCreationError = null;
        return _this;
    }

    /**
     * Add a function to be executed after the creation succeeds.
     *
     * This is the ideal place to use the response to update the entry, or
     * redirect to another view.
     *
     * If the function returns false, the default execution workflow is stopped.
     * This means that the function must provide a custom workflow.
     *
     * If the function throws an exception, the onSubmitError callback will
     * execute.
     *
     * The syntax depends on the framework calling the function.
     *
     * With ng-admin, the function can be an angular injectable, listing
     * required dependencies in an array. Among other, the function can receive
     * the following services:
     *  - $event: the form submission event
     *  - entry: the current Entry instance
     *  - entity: the current entity
     *  - form: the form object (for form validation and errors)
     *  - progression: the controller for the loading indicator
     *  - notification: the controller for top notifications
     *
     * The function can be asynchronous, in which case it should return
     * a Promise.
     *
     * @example
     *
     *     post.creationView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
     *         // stop the progress bar
     *         progression.done();
     *         // add a notification
     *         notification.log(`Element #${entry._identifierValue} successfully created.`, { addnCls: 'humane-flatty-success' });
     *         // redirect to the list view
     *         $state.go($state.get('list'), { entity: entity.name() });
     *         // cancel the default action (redirect to the edition view)
     *         return false;
     *      }])
     *
     */


    _createClass(CreateView, [{
        key: 'onSubmitSuccess',
        value: function onSubmitSuccess(_onSubmitSuccess) {
            if (!arguments.length) return this._onSubmitSuccess;
            this._onSubmitSuccess = _onSubmitSuccess;
            return this;
        }

        /**
         * Add a function to be executed after the creation request receives a
         * failed http response from the server.
         *
         * This is the ideal place to use the response to update the entry, display
         * server-side validation error, or redirect to another view.
         *
         * If the function returns false, the default execution workflow is stopped.
         * This means that the function must provide a custom workflow.
         *
         * The syntax depends on the framework calling the function.
         *
         * With ng-admin, the function can be an angular injectable, listing
         * required dependencies in an array. Among other, the function can receive
         * the following services:
         *  - $event: the form submission event
         *  - error: the response from the server
         *  - errorMessage: the error message based on the response
         *  - entry: the current Entry instance
         *  - entity: the current entity
         *  - form: the form object (for form validation and errors)
         *  - progression: the controller for the loading indicator
         *  - notification: the controller for top notifications
         *
         * The function can be asynchronous, in which case it should return
         * a Promise.
         *
         * @example
         *
         *     post.creationView().onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
         *         // mark fields based on errors from the response
         *         error.violations.forEach(violation => {
         *             if (form[violation.propertyPath]) {
         *                 form[violation.propertyPath].$valid = false;
         *             }
         *         });
         *         // stop the progress bar
         *         progression.done();
         *         // add a notification
         *         notification.log(`Some values are invalid, see details in the form`, { addnCls: 'humane-flatty-error' });
         *         // cancel the default action (default error messages)
         *         return false;
         *     }]);
         */

    }, {
        key: 'onSubmitError',
        value: function onSubmitError(_onSubmitError) {
            if (!arguments.length) return this._onSubmitError;
            this._onSubmitError = _onSubmitError;
            return this;
        }
    }]);

    return CreateView;
}(_View3.default);

exports.default = CreateView;
module.exports = exports['default'];

},{"./View":35}],28:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ListView2 = require('./ListView');

var _ListView3 = _interopRequireDefault(_ListView2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DashboardView = function (_ListView) {
    _inherits(DashboardView, _ListView);

    function DashboardView() {
        _classCallCheck(this, DashboardView);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(DashboardView).apply(this, arguments));
    }

    _createClass(DashboardView, [{
        key: 'setEntity',
        value: function setEntity(entity) {
            this.entity = entity;
            if (!this._name) {
                this._name = entity.name();
            }
            return this;
        }
    }]);

    return DashboardView;
}(_ListView3.default);

exports.default = DashboardView;
module.exports = exports['default'];

},{"./ListView":32}],29:[function(require,module,exports){
exports.__esModule = true;

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteView = function (_View) {
    _inherits(DeleteView, _View);

    function DeleteView(name) {
        _classCallCheck(this, DeleteView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeleteView).call(this, name));

        _this._type = 'DeleteView';
        _this._enabled = true;
        return _this;
    }

    return DeleteView;
}(_View3.default);

exports.default = DeleteView;
module.exports = exports['default'];

},{"./View":35}],30:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditView = function (_View) {
    _inherits(EditView, _View);

    function EditView(name) {
        _classCallCheck(this, EditView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EditView).call(this, name));

        _this._type = 'EditView';
        _this._submitCreationSuccess = null;
        _this._submitCreationError = null;
        return _this;
    }

    /**
     * Add a function to be executed after the update succeeds.
     *
     * This is the ideal place to use the response to update the entry, or
     * redirect to another view.
     *
     * If the function returns false, the default execution workflow is stopped.
     * This means that the function must provide a custom workflow.
     *
     * If the function throws an exception, the onSubmitError callback will
     * execute.
     *
     * The syntax depends on the framework calling the function.
     *
     * With ng-admin, the function can be an angular injectable, listing
     * required dependencies in an array. Among other, the function can receive
     * the following services:
     *  - $event: the form submission event
     *  - entry: the current Entry instance
     *  - entity: the current entity
     *  - form: the form object (for form validation and errors)
     *  - progression: the controller for the loading indicator
     *  - notification: the controller for top notifications
     *
     * The function can be asynchronous, in which case it should return
     * a Promise.
     *
     * @example
     *
     *     post.editionView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
     *         // stop the progress bar
     *         progression.done();
     *         // add a notification
     *         notification.log(`Element #${entry._identifierValue} successfully edited.`, { addnCls: 'humane-flatty-success' });
     *         // redirect to the list view
     *         $state.go($state.get('list'), { entity: entity.name() });
     *         // cancel the default action (redirect to the edition view)
     *         return false;
     *      }])
     */


    _createClass(EditView, [{
        key: 'onSubmitSuccess',
        value: function onSubmitSuccess(_onSubmitSuccess) {
            if (!arguments.length) return this._onSubmitSuccess;
            this._onSubmitSuccess = _onSubmitSuccess;
            return this;
        }

        /**
         * Add a function to be executed after the update request receives a failed
         * http response from the server.
         *
         * This is the ideal place to use the response to update the entry, display
         * server-side validation error, or redirect to another view.
         *
         * If the function returns false, the default execution workflow is stopped.
         * This means that the function must provide a custom workflow.
         *
         * The syntax depends on the framework calling the function.
         *
         * With ng-admin, the function can be an angular injectable, listing
         * required dependencies in an array. Among other, the function can receive
         * the following services:
         *  - $event: the form submission event
         *  - error: the response from the server
         *  - errorMessage: the error message based on the response
         *  - entry: the current Entry instance
         *  - entity: the current entity
         *  - form: the form object (for form validation and errors)
         *  - progression: the controller for the loading indicator
         *  - notification: the controller for top notifications
         *
         * The function can be asynchronous, in which case it should return
         * a Promise.
         *
         * @example
         *
         *     post.editionView().onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
         *         // mark fields based on errors from the response
         *         error.violations.forEach(violation => {
         *             if (form[violation.propertyPath]) {
         *                 form[violation.propertyPath].$valid = false;
         *             }
         *         });
         *         // stop the progress bar
         *         progression.done();
         *         // add a notification
         *         notification.log(`Some values are invalid, see details in the form`, { addnCls: 'humane-flatty-error' });
         *         // cancel the default action (default error messages)
         *         return false;
         *     }]);
         */

    }, {
        key: 'onSubmitError',
        value: function onSubmitError(_onSubmitError) {
            if (!arguments.length) return this._onSubmitError;
            this._onSubmitError = _onSubmitError;
            return this;
        }
    }]);

    return EditView;
}(_View3.default);

exports.default = EditView;
module.exports = exports['default'];

},{"./View":35}],31:[function(require,module,exports){
exports.__esModule = true;

var _ListView2 = require('./ListView');

var _ListView3 = _interopRequireDefault(_ListView2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExportView = function (_ListView) {
    _inherits(ExportView, _ListView);

    function ExportView(name) {
        _classCallCheck(this, ExportView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExportView).call(this, name));

        _this._fields = [];
        _this._type = 'ExportView';
        return _this;
    }

    return ExportView;
}(_ListView3.default);

exports.default = ExportView;
module.exports = exports['default'];

},{"./ListView":32}],32:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

var _orderElement = require('../Utils/orderElement');

var _orderElement2 = _interopRequireDefault(_orderElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = function (_View) {
    _inherits(ListView, _View);

    function ListView(name) {
        _classCallCheck(this, ListView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ListView).call(this, name));

        _this._type = 'ListView';
        _this._perPage = 30;
        _this._infinitePagination = false;
        _this._listActions = [];
        _this._batchActions = ['delete'];
        _this._filters = [];
        _this._permanentFilters = {};
        _this._exportFields = null;
        _this._exportOptions = {};
        _this._entryCssClasses = null;

        _this._sortField = 'id';
        _this._sortDir = 'DESC';
        return _this;
    }

    _createClass(ListView, [{
        key: 'perPage',
        value: function perPage() {
            if (!arguments.length) {
                return this._perPage;
            }
            this._perPage = arguments[0];
            return this;
        }

        /** @deprecated Use perPage instead */

    }, {
        key: 'limit',
        value: function limit() {
            if (!arguments.length) {
                return this.perPage();
            }
            return this.perPage(arguments[0]);
        }
    }, {
        key: 'sortField',
        value: function sortField() {
            if (arguments.length) {
                this._sortField = arguments[0];
                return this;
            }

            return this._sortField;
        }
    }, {
        key: 'sortDir',
        value: function sortDir() {
            if (arguments.length) {
                this._sortDir = arguments[0];
                return this;
            }

            return this._sortDir;
        }
    }, {
        key: 'getSortFieldName',
        value: function getSortFieldName() {
            return this.name() + '.' + this._sortField;
        }
    }, {
        key: 'infinitePagination',
        value: function infinitePagination() {
            if (arguments.length) {
                this._infinitePagination = arguments[0];
                return this;
            }

            return this._infinitePagination;
        }
    }, {
        key: 'actions',
        value: function actions(_actions) {
            if (!arguments.length) {
                return this._actions;
            }

            this._actions = _actions;

            return this;
        }
    }, {
        key: 'exportFields',
        value: function exportFields(_exportFields) {
            if (!arguments.length) {
                return this._exportFields;
            }

            this._exportFields = _exportFields;

            return this;
        }
    }, {
        key: 'exportOptions',
        value: function exportOptions(_exportOptions) {
            if (!arguments.length) {
                return this._exportOptions;
            }

            this._exportOptions = _exportOptions;

            return this;
        }
    }, {
        key: 'batchActions',
        value: function batchActions(actions) {
            if (!arguments.length) {
                return this._batchActions;
            }

            this._batchActions = actions;

            return this;
        }

        /**
         * Define permanent filters to be added to the REST API calls
         *
         *     posts.listView().permanentFilters({
         *        published: true
         *     });
         *     // related API call will be /posts?published=true
         *
         * @param {Object} filters list of filters to apply to the call
         */

    }, {
        key: 'permanentFilters',
        value: function permanentFilters(filters) {
            if (!arguments.length) {
                return this._permanentFilters;
            }

            this._permanentFilters = filters;

            return this;
        }

        /**
         * Define filters the user can add to the datagrid
         *
         *     posts.listView().filters([
         *       nga.field('title'),
         *       nga.field('age', 'number')
         *     ]);
         *
         * @param {Field[]} filters list of filters to add to the GUI
         */

    }, {
        key: 'filters',
        value: function filters(_filters) {
            if (!arguments.length) {
                return this._filters;
            }

            this._filters = _orderElement2.default.order(_filters);

            return this;
        }
    }, {
        key: 'getFilterReferences',
        value: function getFilterReferences(withRemoteComplete) {
            var result = {};
            var lists = this._filters.filter(function (f) {
                return f.type() === 'reference';
            });

            var filterFunction = null;
            if (withRemoteComplete === true) {
                filterFunction = function filterFunction(f) {
                    return f.remoteComplete();
                };
            } else if (withRemoteComplete === false) {
                filterFunction = function filterFunction(f) {
                    return !f.remoteComplete();
                };
            }

            if (filterFunction !== null) {
                lists = lists.filter(filterFunction);
            }

            for (var i = 0, c = lists.length; i < c; i++) {
                var list = lists[i];
                result[list.name()] = list;
            }

            return result;
        }
    }, {
        key: 'listActions',
        value: function listActions(actions) {
            if (!arguments.length) {
                return this._listActions;
            }

            this._listActions = actions;

            return this;
        }
    }, {
        key: 'entryCssClasses',
        value: function entryCssClasses(classes) {
            if (!arguments.length) {
                return this._entryCssClasses;
            }

            this._entryCssClasses = classes;

            return this;
        }
    }, {
        key: 'getEntryCssClasses',
        value: function getEntryCssClasses(entry) {
            if (!this._entryCssClasses) {
                return '';
            }

            if (this._entryCssClasses.constructor === Array) {
                return this._entryCssClasses.join(' ');
            }

            if (typeof this._entryCssClasses === 'function') {
                return this._entryCssClasses(entry);
            }

            return this._entryCssClasses;
        }
    }]);

    return ListView;
}(_View3.default);

exports.default = ListView;
module.exports = exports['default'];

},{"../Utils/orderElement":24,"./View":35}],33:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuView = function (_View) {
    _inherits(MenuView, _View);

    function MenuView(name) {
        _classCallCheck(this, MenuView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MenuView).call(this, name));

        _this._type = 'MenuView';
        _this._icon = null;
        return _this;
    }

    _createClass(MenuView, [{
        key: 'icon',
        value: function icon() {
            if (arguments.length) {
                console.warn('entity.menuView() is deprecated. Please use the Menu class instead');
                this._icon = arguments[0];
                return this;
            }

            if (this._icon === null) {
                return '<span class="glyphicon glyphicon-list"></span>';
            }

            return this._icon;
        }
    }, {
        key: 'enabled',
        get: function get() {
            return this._enabled || this.entity.views['ListView'].enabled;
        }
    }]);

    return MenuView;
}(_View3.default);

exports.default = MenuView;
module.exports = exports['default'];

},{"./View":35}],34:[function(require,module,exports){
exports.__esModule = true;

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShowView = function (_View) {
    _inherits(ShowView, _View);

    function ShowView(name) {
        _classCallCheck(this, ShowView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ShowView).call(this, name));

        _this._type = 'ShowView';
        return _this;
    }

    return ShowView;
}(_View3.default);

exports.default = ShowView;
module.exports = exports['default'];

},{"./View":35}],35:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entry = require('../Entry');

var _Entry2 = _interopRequireDefault(_Entry);

var _ReferenceExtractor = require('../Utils/ReferenceExtractor');

var _ReferenceExtractor2 = _interopRequireDefault(_ReferenceExtractor);

var _objectProperties = require('../Utils/objectProperties');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
    function View(name) {
        _classCallCheck(this, View);

        this.entity = null;
        this._actions = null;
        this._title = false;
        this._description = '';
        this._template = null;

        this._enabled = false;
        this._fields = [];
        this._type = null;
        this._name = name;
        this._order = 0;
        this._errorMessage = null;
        this._url = null;
        this._prepare = null;
    }

    _createClass(View, [{
        key: 'title',
        value: function title(_title) {
            if (!arguments.length) return this._title;
            this._title = _title;
            return this;
        }
    }, {
        key: 'description',
        value: function description() {
            if (arguments.length) {
                this._description = arguments[0];
                return this;
            }

            return this._description;
        }
    }, {
        key: 'name',
        value: function name(_name) {
            if (!arguments.length) {
                return this._name || this.entity.name() + '_' + this._type;
            }

            this._name = _name;
            return this;
        }
    }, {
        key: 'disable',
        value: function disable() {
            this._enabled = false;

            return this;
        }
    }, {
        key: 'enable',
        value: function enable() {
            this._enabled = true;

            return this;
        }

        /**
         * @deprecated Use getter "enabled" instead
         */

    }, {
        key: 'isEnabled',
        value: function isEnabled() {
            return this.enabled;
        }

        /**
         * @deprecated Use getter "entity" instead
         */

    }, {
        key: 'getEntity',
        value: function getEntity() {
            return this.entity;
        }

        /**
         * @deprecated Specify entity at view creation or use "entity" setter instead
         */

    }, {
        key: 'setEntity',
        value: function setEntity(entity) {
            this.entity = entity;
            if (!this._name) {
                this._name = entity.name() + '_' + this._type;
            }

            return this;
        }

        /*
         * Supports various syntax
         * fields([ Field1, Field2 ])
         * fields(Field1, Field2)
         * fields([Field1, {Field2, Field3}])
         * fields(Field1, {Field2, Field3})
         * fields({Field2, Field3})
         */

    }, {
        key: 'fields',
        value: function fields() {
            if (!arguments.length) return this._fields;

            [].slice.call(arguments).map(function (argument) {
                var _this = this;

                View.flatten(argument).map(function (arg) {
                    return _this.addField(arg);
                });
            }, this);

            return this;
        }
    }, {
        key: 'hasFields',
        value: function hasFields() {
            return this.fields.length > 0;
        }
    }, {
        key: 'removeFields',
        value: function removeFields() {
            this._fields = [];
            return this;
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            return this._fields;
        }
    }, {
        key: 'getField',
        value: function getField(fieldName) {
            return this._fields.filter(function (f) {
                return f.name() === fieldName;
            })[0];
        }
    }, {
        key: 'getFieldsOfType',
        value: function getFieldsOfType(type) {
            return this._fields.filter(function (f) {
                return f.type() === type;
            });
        }
    }, {
        key: 'addField',
        value: function addField(field) {
            if (field.order() === null) {
                field.order(this._fields.length, true);
            }
            this._fields.push(field);
            this._fields = this._fields.sort(function (a, b) {
                return a.order() - b.order();
            });

            return this;
        }
    }, {
        key: 'order',
        value: function order(_order) {
            if (!arguments.length) return this._order;
            this._order = _order;
            return this;
        }
    }, {
        key: 'getReferences',
        value: function getReferences(withRemoteComplete) {
            return _ReferenceExtractor2.default.getReferences(this._fields, withRemoteComplete);
        }
    }, {
        key: 'getNonOptimizedReferences',
        value: function getNonOptimizedReferences(withRemoteComplete) {
            return _ReferenceExtractor2.default.getNonOptimizedReferences(this._fields, withRemoteComplete);
        }
    }, {
        key: 'getOptimizedReferences',
        value: function getOptimizedReferences(withRemoteComplete) {
            return _ReferenceExtractor2.default.getOptimizedReferences(this._fields, withRemoteComplete);
        }
    }, {
        key: 'getReferencedLists',
        value: function getReferencedLists() {
            return _ReferenceExtractor2.default.getReferencedLists(this._fields);
        }
    }, {
        key: 'template',
        value: function template(_template) {
            if (!arguments.length) {
                return this._template;
            }

            this._template = _template;

            return this;
        }
    }, {
        key: 'identifier',
        value: function identifier() {
            return this.entity.identifier();
        }
    }, {
        key: 'actions',
        value: function actions(_actions) {
            if (!arguments.length) return this._actions;
            this._actions = _actions;
            return this;
        }
    }, {
        key: 'getErrorMessage',
        value: function getErrorMessage(response) {
            if (typeof this._errorMessage === 'function') {
                return this._errorMessage(response);
            }

            return this._errorMessage;
        }
    }, {
        key: 'errorMessage',
        value: function errorMessage(_errorMessage) {
            if (!arguments.length) return this._errorMessage;
            this._errorMessage = _errorMessage;
            return this;
        }
    }, {
        key: 'url',
        value: function url(_url) {
            if (!arguments.length) return this._url;
            this._url = _url;
            return this;
        }
    }, {
        key: 'getUrl',
        value: function getUrl(identifierValue) {
            if (typeof this._url === 'function') {
                return this._url(identifierValue);
            }

            return this._url;
        }
    }, {
        key: 'validate',
        value: function validate(entry) {
            this._fields.map(function (field) {
                var validation = field.validation();

                if (typeof validation.validator === 'function') {
                    validation.validator(entry.values[field.name()], entry.values);
                }
            });
        }

        /**
         * Map a JS object from the REST API Response to an Entry
         */

    }, {
        key: 'mapEntry',
        value: function mapEntry(restEntry) {
            return _Entry2.default.createFromRest(restEntry, this._fields, this.entity.name(), this.entity.identifier().name());
        }
    }, {
        key: 'mapEntries',
        value: function mapEntries(restEntries) {
            return _Entry2.default.createArrayFromRest(restEntries, this._fields, this.entity.name(), this.entity.identifier().name());
        }

        /**
         * Transform an Entry to a JS object for the REST API Request
         */

    }, {
        key: 'transformEntry',
        value: function transformEntry(entry) {
            return entry.transformToRest(this._fields);
        }

        /**
         * Add a function to be executed before the view renders
         *
         * This is the ideal place to prefetch related entities and manipulate
         * the dataStore.
         *
         * The syntax depends on the framework calling the function.
         *
         * With ng-admin, the function can be an angular injectable, listing
         * required dependencies in an array. Among other, the function can receive
         * the following services:
         *  - query: the query object (an object representation of the main request
         *    query string)
         *  - datastore: where the Entries are stored. The dataStore is accessible
         *    during rendering
         *  - view: the current View object
         *  - entry: the current Entry instance (except in listView)
         *  - Entry: the Entry constructor (required to transform an object from
         *    the REST response to an Entry)
         *  - window: the window object. If you need to fetch anything other than an
         *    entry and pass it to the view layer, it's the only way.
         *
         * The function can be asynchronous, in which case it should return
         * a Promise.
         *
         * @example
         *
         *     post.listView().prepare(['datastore', 'view', 'Entry', function(datastore, view, Entry) {
         *       const posts = datastore.getEntries(view.getEntity().uniqueId);
         *       const authorIds = posts.map(post => post.values.authorId).join(',');
         *       return fetch('http://myapi.com/authors?id[]=' + authorIds)
         *          .then(response => response.json())
         *          .then(authors => Entry.createArrayFromRest(
         *              authors,
         *              [new Field('first_name'), new Field('last_name')],
         *              'author'
         *          ))
         *          .then(authorEntries => datastore.setEntries('authors', authorEntries));
         *     }]);
         */

    }, {
        key: 'prepare',
        value: function prepare(_prepare) {
            if (!arguments.length) return this._prepare;
            this._prepare = _prepare;
            return this;
        }
    }, {
        key: 'doPrepare',
        value: function doPrepare() {
            return this._prepare.apply(this, arguments);
        }
    }, {
        key: 'enabled',
        get: function get() {
            return this._enabled || !!this._fields.length;
        }
    }, {
        key: 'type',
        get: function get() {
            return this._type;
        }
    }], [{
        key: 'flatten',
        value: function flatten(arg) {
            if (arg.constructor.name === 'Object') {
                console.warn('Passing literal of Field to fields method is deprecated use array instead');
                var result = [];
                for (var fieldName in arg) {
                    result = result.concat(View.flatten(arg[fieldName]));
                }
                return result;
            }
            if (Array.isArray(arg)) {
                return arg.reduce(function (previous, current) {
                    return previous.concat(View.flatten(current));
                }, []);
            }
            // arg is a scalar
            return [arg];
        }
    }]);

    return View;
}();

exports.default = View;
module.exports = exports['default'];

},{"../Entry":19,"../Utils/ReferenceExtractor":22,"../Utils/objectProperties":23}],36:[function(require,module,exports){
exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectProperties = require('./Utils/objectProperties');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function () {
    function Entry(entityName, values, identifierValue) {
        _classCallCheck(this, Entry);

        this._entityName = entityName;
        this.values = values || {};
        this._identifierValue = identifierValue;
        this.listValues = {};
    }

    _createClass(Entry, [{
        key: 'transformToRest',


        /**
         * Transform an Entry to a JS object for the REST API Request
         *
         * @return {Object}
         */
        value: function transformToRest(fields) {

            var restEntry = (0, _objectProperties.clone)(this.values);
            fields.forEach(function (field) {
                var fieldName = field.name();
                if (fieldName in restEntry) {
                    restEntry[fieldName] = field.getTransformedValue(restEntry[fieldName], restEntry);
                }
            });

            return (0, _objectProperties.cloneAndNest)(restEntry);
        }
    }, {
        key: 'entityName',
        get: function get() {
            return this._entityName;
        }
    }, {
        key: 'identifierValue',
        get: function get() {
            return this._identifierValue;
        }
    }], [{
        key: 'createForFields',
        value: function createForFields(fields, entityName) {
            var entry = new Entry(entityName);
            fields.forEach(function (field) {
                entry.values[field.name()] = field.defaultValue();
            });
            return entry;
        }

        /**
         * Map a JS object from the REST API Response to an Entry
         *
         * @return {Entry}
         */

    }, {
        key: 'createFromRest',
        value: function createFromRest(restEntry) {
            var fields = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
            var entityName = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
            var identifierName = arguments.length <= 3 || arguments[3] === undefined ? 'id' : arguments[3];

            if (!restEntry || Object.keys(restEntry).length == 0) {
                return Entry.createForFields(fields, entityName);
            }
            var excludedFields = fields.filter(function (f) {
                return !f.flattenable();
            }).map(function (f) {
                return f.name();
            });

            var values = (0, _objectProperties.cloneAndFlatten)(restEntry, excludedFields);

            fields.forEach(function (field) {
                var fieldName = field.name();
                values[fieldName] = field.getMappedValue(values[fieldName], values);
            });

            return new Entry(entityName, values, values[identifierName]);
        }

        /**
         * Map an array of JS objects from the REST API Response to an array of Entries
         *
         * @return {Array[Entry]}
         */

    }, {
        key: 'createArrayFromRest',
        value: function createArrayFromRest(restEntries, fields, entityName, identifierName) {
            return restEntries.map(function (e) {
                return Entry.createFromRest(e, fields, entityName, identifierName);
            });
        }
    }]);

    return Entry;
}();

exports.default = Entry;
module.exports = exports['default'];

},{"./Utils/objectProperties":23}]},{},[11]);
