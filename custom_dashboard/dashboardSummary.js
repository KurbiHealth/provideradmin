import dashboardSummaryTemplate from './dashboardSummaryTemplate.js';

var has_seen_alert = false;

function dashboardSummary(Restangular) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: function($scope) {
            $scope.stats = {};
            $scope.has_seen_alert = has_seen_alert;
            $scope.dismissAlert = () => {
                has_seen_alert = true;
                $scope.has_seen_alert = true;
            };

            Restangular
                .all('chatroom')
                .getList({per_page: 1000})
                .then(conversations => {
                    
                    // Ex. of a count process
                    // -> $scope.stats.conversations = conversations.data.reduce(nb => ++nb, 0)
                    
            // TOTAL BOT CONVERSATIONS TO DATE
                    $scope.stats.conversations = conversations.totalCount;

            // TOTAL QUESTIONS TO DATE
                    $scope.stats.total_questions = conversations.data
                        .reduce((total_questions, chatroom) => {
                            if (chatroom.messages && chatroom.messages.length > 15){ 
                                total_questions++;
                            }
                            return total_questions;
                        },0);
                    
            // TOTAL PENDING QUESTIONS
                    /*$scope.stats.pending_questions = conversations.data
                        .reduce((pending_questions,chatroom) => {
                            Restangular.all('chatroomreplies').getList({chatRoomId: chatroom.id})
                            .then(function(result){ 
                                if(result.data.length > 0){
                                    pending_questions++;
                                    return pending_questions;
                                }
                            })
                        }, 0);*/

                });

            

            // TOTAL REPLIES TO DATE
            Restangular
                .all('chatroomreplies')
                .getList()
                .then(replies => {
                    $scope.stats.replies = replies.data.reduce(nb => ++nb, 0)
                });

        },
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular'];

export default dashboardSummary;