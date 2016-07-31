var chatboxConfigControllerTemplate =

'<style>input{margin-bottom:10px;}.dont-break-out{overflow-wrap: break-word;word-wrap: break-word;-ms-word-break: break-all;word-break: break-all;word-break: break-word;}' + 
'.color-picker-action-close{overflow:auto;width:60px !important;}' +
'.color-picker-swatch{width:100px !important;}' +  
'</style>' +
'<div class="row"><div class="col-lg-12">' +
    '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
    '<div class="page-header">' +
        '<h1>Configure your Chat Box</h1>' +
    '</div>' +
'</div></div>' +
'<div class="row">' +
    '<div class="col-lg-6">' +
    '<h4>Modify This</h4>' +
        '<label for="avatar">Avatar</label>' +
        '<input type="file" size="10" ng-model="controller.avatar" class="form-control" placeholder="avatar" name="avatar" />' + 
        '<label for="color">Accent Color</label>' +
        '<color-picker ng-model="controller.color" options="options"></color-picker>' + 
        '<span style="display:block;width:1px;height:10px;"></span>' + 
        '<label for="headline">Headline</label>' +
        '<input type="text" size="10" ng-model="controller.headline" class="form-control" placeholder="headline" name="headline" />' + 
        '<a class="btn btn-default" ng-click="controller.submitForm()">Save</a>' + 
    '</div>' +
    '<div class="col-lg-6">' +
        '<h4>Snippet Display</h4>' +
        '<p><i>When the snippet appears, copy it and then paste it into your website\'s html or content management system.</i></p>' +
        '<div id="chatSnippet" class="dont-break-out" style="width:100%;display:block;border:1px solid grey;border-radius:3px;min-height:33px;padding:20px;margin-bottom:20px;"></div>' +
    '</div>' +
'</div>';

export default chatboxConfigControllerTemplate;