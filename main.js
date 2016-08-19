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
        "color.picker"
    ]
);

// custom controllers
myApp.controller('username', ['$scope', '$window', function($scope, $window) { // used in header.html
    $scope.username =  $window.localStorage.getItem('username');
}])


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

myApp.config(function(RestangularProvider) {

    var token = window.localStorage.getItem("http://kpadmin-jwt");
    if(typeof token == 'object' && token == null){
        token = '';
    }else{
        token = token.replace(/"/g,'');
        token = token.toString();
    }

    RestangularProvider.setDefaultHeaders({
        "Content-Type": 'application/json; charset=utf-8',
        "x-stamplay-jwt": token
    });
  
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, 
        headers, params, httpConfig) {
        //console.log('url',angular.copy(url));
        //console.log('element: ',element);
        //console.log('operation: ',operation);
        //console.log('what: ',what);
        //console.log('headers: ',headers);
        //console.log('params: ',params);
        //console.log('httpConfig',httpConfig);

        /*
         * FIX ISSUES FOR STAMPLAY API
         */

        if (operation == 'getList') {
            // FIX PAGINATION
            // STAMPLAY CANONICAL URL IS:
            // https://bkschool.stamplayapp.com/api/cobject/v1/audio
            //                  ? n=10 & sort=audio_url & page=1 & per_page=10

            if(!params.page){
                params.page = params._page;
            }
            if(!params.per_page){
                params.per_page = params._perPage;
            }
            if(params._sortField){
                params.sort = '';
                if(params._sortDir == 'DESC') params.sort = '-';
                 params.sort += params._sortField;
            }
            delete params._page;
            delete params._perPage;
            delete params._sortField;
            delete params._sortDir;
        }

        //console.log('params post Stamplay processing:',params);

        return { element: element, params: params };
    });

});


/***************************************
 * POST-RESTANGULAR INTERCEPTOR FUNCTIONS
 ***************************************/

myApp.config(function ($httpProvider) {
    
    // USING 'unshift' TO RUN THESE FUNCTIONS FIRST!!!!
    $httpProvider.interceptors.unshift(addContentTypeToHeader);

    // these functions run in regular order (after Restangular interceptors)
    $httpProvider.interceptors.push(fixStamplayIssues);

// **************************************************************************

    /*
     * FIX ISSUES FOR STAMPLAY API
     */

    // Angular removes the header 'Content-Type' if request is GET.
    // This function is a hack to add the header back in, because Stamplay 
    // requires the header.
    function addContentTypeToHeader() {
        return {
            request : requestInterceptor
        };

        function requestInterceptor(config) {
            if (angular.isDefined(config.headers['Content-Type']) && !angular.isDefined(config.data))
                config.data = '';

            return config;
        }
    }

    function fixStamplayIssues($q) {
        return {
            request : function(config) {
                config = angular.copy(config);

                // When NG-Admin does a list GET, it receives all fields for 
                // that data model, and those fields persist in the dataStore, 
                // even if the editionView only defines a couple of fields. 
                // Which means that the un-editable fields in Stamplay must be 
                // removed before doing a PUT
                if(config.method === 'PUT'){
                    delete config.data.__v;
                    delete config.data._id;
                    delete config.data.appId;
                    delete config.data.cobjectId;
                    delete config.data.dt_create;
                    delete config.data.dt_update;
                    delete config.data.id;
                    delete config.data.actions;
                }

                // translate NGA filter(s) to Stamplay format
                if(config.method == 'GET' && config.params){
                    config.params.where = {};
                    var where = config.params.where;

                    // hack to fix an NGA problem: when using 'referenced_list', 
                    // [object Object] appears in url
                    if(config.params._filters && '[object Object]' in config.params._filters){
                        var temp = config.params._filters['[object Object]'];
                        delete config.params._filters['[object Object]'];
                        where.chatRoomId = temp; // Stamplay uses a straight key:value pair in GET
                    }
// PROBLEM
/* NGA sends related lists as a field:key value in _filter. Stamplay
accepts ?field=value for search in related object. However, Stamplay queries
are expected to be part of ?where={}. So how do I know which _filter values
are foreign keys and which are for "where"? */

                    // 'referenced_list' sends the foreign key in config.params._filters
                    // but it should be in config.params for Stamplay
                    if(config.params._filters){
//console.log('about to fix _filters');
                        var obj = config.params._filters;
                        for(var key in obj){
                            where[key] = obj[key];
                            //where[key] = {"$regex": '/' + obj[key] + '/'};
                            delete config.params._filters[key];
                        }
                    }

                    // if all the previous fixes have emptied the NGA filter object, 
                    // then delete it
                    if(isEmpty(config.params._filters)){
                        delete config.params._filters;
                    }

                }
//console.log('config post interceptor and Stamplay fixes',config);
                return config || $q.when(config);
            }
        };
    }

    // from http://stackoverflow.com/questions/4994201/is-object-empty
    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function isEmpty(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }

});

/********************************************
 * RESTANGULAR response INTERCEPTOR FUNCTIONS
 ********************************************/

myApp.config(function(RestangularProvider) {

    RestangularProvider.addResponseInterceptor(function(data,operation,what,url,response,deferred){

        var newResponse;
        //console.log('Response',response);
        //console.log(typeof response.data.data);
        //console.log('Data',data);

        // ADJUST STAMPLAY'S STRUCTURE TO MATCH WHAT NG-ADMIN EXPECTS
        if('data' in response.data){
            var newData = response.data.data;
            if(newData.length > 0){
                newResponse = response.data.data;
            }else{
                newResponse = [];
            }
        }else{
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
//import Field from 'admin-config/lib/Field/Field';
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
    
    // customization (of chatbox)
    var createCustomization = require('./models/customization');
    var customizations = nga.entity('customization');

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
    admin.addEntity(createCustomization(nga,customizations));
    admin.addEntity(createReplies(nga,chatReplies,chatroom));
    admin.addEntity(createChatroom(nga,chatroom,chatReplies));
    admin.addEntity(createChatbox(nga,chatbox,customizations,chatroom));
    admin.addEntity(createArticles(nga,articles));


/***************************************
 * CUSTOM MENU
 ***************************************/

    admin.menu(nga.menu()
        .addChild(nga.menu().title('Dashboard').icon('<span class="glyphicon glyphicon-calendar"></span>&nbsp;').link('/dashboard'))
        .addChild(nga.menu(nga.entity('users')).title('Users').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
        .addChild(nga.menu().title('Chat').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;')
            .addChild(nga.menu(nga.entity('chatroom')).title('Conversations').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))
            .addChild(nga.menu(nga.entity('chatroomreplies')).title('Replies').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))
            .addChild(nga.menu(nga.entity('chatbox')).title('ChatBox').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))
            .addChild(nga.menu().title('Bot Builder').icon('<span class="glyphicon glyphicon-tower"></span>&nbsp;').link('/botbuilder'))
        )
        .addChild(nga.menu(nga.entity('articles')).title('Articles').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;'))
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