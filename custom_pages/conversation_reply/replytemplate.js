var conversationReplyTemplate =

'<style>input{margin-bottom:10px;}.dont-break-out{overflow-wrap: break-word;word-wrap: break-word;' +
	'-ms-word-break: break-all;word-break: break-all;word-break: break-word;}.ta-editor{border: 1px solid gray;border-radius:5px;}</style>' +
'<div class="row"><div class="col-lg-12">' +
    '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
    '<div class="page-header">' +
        '<h1>Reply To A Question</h1>' +
    '</div>' +
'</div></div>' +
'<div class="row">' +
    '<div class="col-lg-12">' +
    '<h4>From a potential patient...</h4>' +
    	'<p><b>Question:</b></p>' +
        '<p size="10" class="form-control"><img ng-src="{{controller.avatar}}" width="14" height="14" /> {{controller.question}}</p>' + 
        '<p><b>Information about patient:</b></p>' +
        '<p size="10" class="form-control">{{controller.tags}}</p>' + 
        '<p><b>Your reply:</b></p>' +
        '<div text-angular ta-unsafe-sanitizer="false" ng-model="controller.reply" id="wysiwyg" name="wysiwyg" ta-text-editor-class="border-around" ta-html-editor-class="border-around">' +
		'</div>' +
        '<a class="btn btn-default" ng-click="controller.formSubmit()" style="margin-top:20px;">Send</a>' + 
    '</div>' +
'</div>';

export default conversationReplyTemplate;