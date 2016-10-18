/***************************************
 * INITIALIZE THE APPLICATION
 ***************************************/

var myApp = angular.module('myApp', 
    [
        'ng-admin',
        'ngSanitize',
        "com.2fdevs.videogular",
            "com.2fdevs.videogular.plugins.controls",
            "info.vietnamcode.nampnq.videogular.plugins.youtube",
        "pascalprecht.translate",
        "color.picker"
    ]
);

// custom controllers
myApp.controller('username', ['$scope', '$window', function($scope, $window) { // used in header.html
    $scope.username =  $window.localStorage.getItem('username');
}])


/***************************************
 * GLOBAL INTERCEPTOR FUNCTIONS
 ***************************************/

var interceptorFunctions = require('./globalNgadminCode/interceptors/stamplay');
interceptorFunctions(myApp);


/***************************************
 * GLOBAL ERROR HANDLERS
 ***************************************/

var errorHandlers = require('./globalNgadminCode/errorHandlers/appLevelErrorHandlers');
errorHandlers(myApp);


/***************************************
 * CUSTOM PAGES
 * ----
 * http://ng-admin-book.marmelab.com/doc/Custom-pages.html
 ***************************************/

myApp.constant('chatServerURL', 'http://chat.gokurbi.com/chatbox');
//myApp.constant('chatServerURL', 'http://kchat:8080/chatbox');

// CHATBOX CUSTOMIZATION PAGE
import chatboxConfigController from './custom_pages/chatboxconfig/chatboxconfig';
import chatboxConfigControllerTemplate from './custom_pages/chatboxconfig/chatboxconfigtemplate';
myApp.config(function($stateProvider) {
    $stateProvider.state('chatbox-config', {
        parent: 'main',
        url: '/chatbox_config/:chatBoxId?',
        params: {
            chatBoxId: {squash: true, value: null}
        },
        controller: chatboxConfigController,
        controllerAs: 'controller',
        template: chatboxConfigControllerTemplate
    });
});

// REPLY TO USER QUESTION PAGE
import conversationReplyController from './custom_pages/conversation_reply/replyconfig';
import conversationReplyTemplate from './custom_pages/conversation_reply/replytemplate';
myApp.config(function($stateProvider) {
    $stateProvider.state('chat-conversation-reply', {
        parent: 'main',
        url: '/reply_to_chat_conversation/:chatRoomId',
        controller: conversationReplyController,
        controllerAs: 'controller',
        template: conversationReplyTemplate
    });
});

// BOTBUILDER PAGE
import botbuilderController from './custom_pages/botbuilder/botbuilderController';
import botbuilderTemplate from './custom_pages/botbuilder/index';
myApp.config(function($stateProvider) {
    $stateProvider.state('botbuilder', {
        parent: 'main',
        url: '/botbuilder?/:botId',
        controller: botbuilderController,
        controllerAs: 'controller',
        template: botbuilderTemplate
    });
});

   
/***************************************
 * CUSTOM FIELDS
 * ---- 
 * http://ng-admin-book.marmelab.com/doc/Custom-types.html
 * Use of 'import': // http://stackoverflow.com/questions/36451969/custom-type-the-field-class-is-injected-as-an-object-not-a-function
 ***************************************/

// field for displaying the array of strings field from Stamplay
import StamplayArrayStrField from './custom_fields/stamplay_array_str_field/stamplay_array_str_field_config';
import StamplayArrayStrFieldView from './custom_fields/stamplay_array_str_field/stamplay_array_str_view';
import stamplayArrayOfStringsDirective from './custom_fields/stamplay_array_str_field/stamplay_array_str_directive';

// field that pulls a value from a object saved in an array of strings on Stamplay
import ObjKeyValueFieldConf      from './custom_fields/obj_key_value/obj_key_value_field_conf';
import ObjKeyValueFieldView      from './custom_fields/obj_key_value/obj_key_value_field_view';
import ObjKeyValueFieldDirective from './custom_fields/obj_key_value/obj_key_value_field_directive';

// REGISTER THE CUSTOM FIELDS
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('stamplay_array_str', StamplayArrayStrField);
    nga.registerFieldType('obj_key_value_field', ObjKeyValueFieldConf);
}]);
myApp.config(['FieldViewConfigurationProvider', function(fvp) {
    fvp.registerFieldView('stamplay_array_str', StamplayArrayStrFieldView);
    fvp.registerFieldView('obj_key_value_field', ObjKeyValueFieldView);
}]);
myApp.directive('stamplayArrStrings', stamplayArrayOfStringsDirective);
myApp.directive('objKeyValueField', ObjKeyValueFieldDirective);

myApp.directive('dashboardSummary', require('./custom_dashboard/dashboardSummary'));

myApp.directive('replyToChatConversation', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: { post: '&' },
        link: function (scope) {
            scope.redirect = function () {
                $location.path('/reply_to_chat_conversation/' + scope.post().values.id);
            };
        },
        template: '<a class="btn btn-default reply-to-conversation-btn" ng-click="redirect()">Reply To This Conversation</a>'
    };
}]);

myApp.directive('editChatBox', ['$location', function($location){
    return {
        restrict: 'E',
        link: function(scope,ele,attrs){
//console.log('scope',scope);
//console.log('attrs',attrs);
            scope.editChatBoxUrl = scope.entry ? scope.entry._identifierValue : '';
            scope.size = attrs.size;
            scope.type = attrs.type ? attrs.type : '';
        },
        template: `<a class="btn btn-default" style="margin-left:4px;" 
                    ng-class="size ? 'btn-' + size : ''"  
                    href="#/chatbox_config/{{editChatBoxUrl}}">
                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"
                            ng-if="type=='edit'"></span>
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"
                            ng-if="type=='create'"></span>
                        &nbsp;
                        <span ng-if="type=='edit'" class="hidden-xs ng-scope" translate="EDIT">Edit</span>
                        <span ng-if="type=='create'" class="hidden-xs ng-scope" translate="CREATE">Create</span>
                    </a>`
    }
}])

 
/***************************************
 * DEFINE DATA ENTITIES
 ***************************************/

myApp.config(['NgAdminConfigurationProvider', function(nga) {

    // create the default admin application
    // ==================================================
    
    var admin = nga
        .application('Kurbi Provider Admin')
        .baseApiUrl('https://kurbi.stamplayapp.com/api/cobject/v1/');


    // add entities
    // ==================================================

    var createUser = require('./models/users');
    var userEntity = nga.entity('users')
                        .baseApiUrl('https://kurbi.stamplayapp.com/api/user/v1/');
    
    // chatbox styles (configurations)
    var createChatstyle = require('./models/chatstyle');
    var chatstyle = nga.entity('chatstyle');

    // chatroom replies
    var createReplies = require('./models/chatroomreplies');
    var chatReplies = nga.entity('chatroomreplies');

    // chatroom
    var createChatroom = require('./models/chatroom');
    var chatroom = nga.entity('chatroom');

    // chatbox
    var createChatbox = require('./models/chatbox');
    var chatbox = nga.entity('chatbox');

    // articles
    var createArticles = require('./models/articles');
    var articles = nga.entity('articles');

    admin.addEntity(createUser(nga,userEntity));
    admin.addEntity(createChatstyle(nga,chatstyle));
    admin.addEntity(createReplies(nga,chatReplies,chatroom));
    admin.addEntity(createChatroom(nga,chatroom,chatReplies));
    admin.addEntity(createChatbox(nga,chatbox,chatstyle,chatroom));
    admin.addEntity(createArticles(nga,articles));


/***************************************
 * CUSTOM MENU
 ***************************************/

    admin.menu(nga.menu()
        .addChild(nga.menu().title('Dashboard').icon('<span class="glyphicon glyphicon-calendar"></span>&nbsp;').link('/dashboard'))
        //.addChild(nga.menu(nga.entity('users')).title('Users').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
        .addChild(nga.menu().title('Chat').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;')
            .addChild(nga.menu(nga.entity('chatroom')).title('Conversations').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))
            .addChild(nga.menu(nga.entity('chatroomreplies')).title('Replies').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))
            .addChild(nga.menu(nga.entity('chatbox')).title('ChatBox').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))
            //.addChild(nga.menu().title('Bot Builder').icon('<span class="glyphicon glyphicon-tower"></span>&nbsp;').link('/botbuilder'))
        )
        .addChild(nga.menu(nga.entity('articles')).title('Blog Posts').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;'))
    );

/***************************************
 * CUSTOM HEADER
 ***************************************/
	var customHeaderTemplate =
	'<div class="navbar-header">' +
	    '<button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">' +
	      '<span class="icon-bar"></span>' +
	      '<span class="icon-bar"></span>' +
	      '<span class="icon-bar"></span>' +
	    '</button>' +
	    '<a class="navbar-brand" href="#" ng-click="appController.displayHome()"><img src="images/logo.png" align="left" style="margin:-8px 5px 0 0;" />Kurbi Provider Admin</a>' +
	'</div>' +
	'<ul class="nav navbar-top-links navbar-right hidden-xs">' +
		'<li uib-dropdown>' +
			'<a uib-dropdown-toggle href="#" aria-expanded="true" ng-controller="username" style="color: #ffffff;" class="username">' +
				'<i class="glyphicon glyphicon-user"></i>&nbsp;{{username}}&nbsp;<i class="fa fa-caret-down"></i>' +
			'</a>' +
			'<ul class="dropdown-menu dropdown-user" role="menu">' +
				'<li><a href="#" onclick="logout()"><i class="glyphicon glyphicon-log-out"></i> Logout</a></li>' +
			'</ul>' +
		'</li>' +
	'</ul>';
	admin.header(customHeaderTemplate);

/***************************************
 * CUSTOM DASHBOARD
 * http://ng-admin-book.marmelab.com/doc/Dashboard.html
 ***************************************/
    
    admin.dashboard(require('./custom_dashboard/main')(nga, admin, chatReplies));

/***************************************
 * CUSTOM ERROR MESSAGES
 ***************************************/

    var adminErrorHandlers = require('./globalNgadminCode/errorHandlers/adminErrorHandler');
    adminErrorHandlers(admin);


/***************************************
 * ATTACH ADMIN APP TO DOM & RUN
 ***************************************/

    nga.configure(admin);

}]);