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

        console.log('request operation,',operation);
        //console.log('request what,',what);

        if (operation == 'getList') {
            params.page = params._page;
            params.per_page = params._perPage;
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
        
        return { element: element, params: params };
    });

    RestangularProvider.addResponseInterceptor(function(data,operation,what,url,response,deferred){

        var newResponse;
        console.log('Response',response);
        //console.log(typeof response.data.data);
        console.log('Data',data);

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
 * POST-RESTANGULAR INTERCEPTOR FUNCTIONS
 ***************************************/

myApp.config(function ($httpProvider) {
    
    // USING 'unshift' TO RUN THESE FUNCTIONS FIRST!!!!
    $httpProvider.interceptors.unshift(addContentTypeToHeader);

    // Angular removes the header 'Content-Type' if request is GET.
    // This function is a hack to add the header back in, because some API's require the header.
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

    // these functions run in regular order (after Restangular interceptors)
    $httpProvider.interceptors.push(fixStamplayIssues);

    // When NG-Admin does a list GET, it receives all fields for that data model, and those fields
    // persist in the dataStore, even if the editionView only defines a couple of fields. Which means
    // that the un-editable fields in Stamplay must be removed before doing a PUT
    function fixStamplayIssues($q) {
        return {
            request : function(config) {
                config = angular.copy(config);
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

                if(config.method == 'GET' && config.params){
                    if(config.params._filters && '[object Object]' in config.params._filters){
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
console.log('scope',scope);
console.log('attrs',attrs);
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

    // users (https://bkschool.stamplayapp.com/api/user/v1/)
    var create = require('./models/users');
    var userEntity = nga.entity('users').baseApiUrl('https://kurbi.stamplayapp.com/api/user/v1/');
    admin.addEntity(create(nga,userEntity));

    // customization (of chatbox)
    var create = require('./models/customization');
    var customizations = nga.entity('customization');
    admin.addEntity(create(nga,customizations));

    // chatbox
    var create = require('./models/chatbox');
    admin.addEntity(create(nga,nga.entity('chatbox'),customizations));

    // articles
    var create = require('./models/articles');
    admin.addEntity(create(nga,nga.entity('articles')));

    // chatroom replies
    var create = require('./models/chatroomreplies');
    var chatReplies = nga.entity('chatroomreplies');
    admin.addEntity(create(nga,chatReplies,nga.entity('chatroom')));

    // chatroom
    var create = require('./models/chatroom');
    admin.addEntity(create(nga,nga.entity('chatroom'),chatReplies));


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
            .addChild(nga.menu().title('ChatBox Customize').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;').link('/chatbox_config'))
        )
        .addChild(nga.menu(nga.entity('articles')).title('Articles').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;'))
    );

/***************************************
 * CUSTOM HEADER
 ***************************************/


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