export default function(){

return `<style>
dashboard-summary .panel-heading{height:110px;}
dashboard-summary .dashboard-number{height:62px}
</style>
<div class="row">
    <div class="col-lg-12">
        <uib-alert type="info" close="dismissAlert()" ng-show="!has_seen_alert">
            Welcome to the Kurbi Provider App!
        </uib-alert>
    </div>
</div>
<div class="row">

    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-comments fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge dashboard-number">{{ stats.conversations | number:0 }}</div>
                        <div>Total Bot Conversations</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'chatroom'})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>

        </div>
    </div>

    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <div class="panel panel-yellow">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-question-circle-o fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge dashboard-number">{{ stats.total_questions }}</div>
                        <div>Total Questions</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'chatroom'})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>

    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <div class="panel panel-green">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-reply-all fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge dashboard-number">{{ stats.replies }}</div>
                        <div>Replies Sent</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'chatroomreplies'})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>
    
    <!--<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <div class="panel panel-yellow">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-question-circle-o fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge dashboard-number">{{ stats.pending_questions }}</div>
                        <div>Pending Questions</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'chatroom', search:{status:'pending'}})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>-->
</div>`;

}