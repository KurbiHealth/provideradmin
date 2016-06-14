module.exports = function() {

    var chatboxConfigControllerTemplate =
        '<style>input{margin-bottom:10px;}</style>' +
        '<div class="row"><div class="col-lg-12">' +
            '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
            '<div class="page-header">' +
                '<h1>Configure your Chat Box</h1>' +
            '</div>' +
        '</div></div>' +
        '<div class="row">' +
            '<div class="col-lg-6">' +
            '<h4>Modify This</h4>' +
                '<input type="text" size="10" ng-model="controller.avatar" class="form-control" placeholder="avatar"/>' + 
                '<input type="text" size="10" ng-model="controller.color" class="form-control" placeholder="color"/>' + 
                '<input type="text" size="10" ng-model="controller.headline" class="form-control" placeholder="headline"/>' + 
                '<input type="text" size="10" ng-model="controller.url" class="form-control" placeholder="url"/>' + 
                '<a class="btn btn-default" ng-click="controller.submitForm()">Save</a>' + 
            '</div>' +
            '<div class="col-lg-6">' +
                '<h4>Snippet</h4>' +
                '<div id="chatSnippet" style="width:100%;display:block;"></div>' +
            '</div>' +
        '</div>';

    return chatboxConfigControllerTemplate;

}