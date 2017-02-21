function showPatientMessages(){
    return {
        restrict: 'E',
        // scope: false,
        controller: function($scope){

        },
        link: function(scope, element) {
console.log('scope',scope);
            scope.messages = [];

            var messages = scope.entry.values.messages;
            var temp;

            if(messages){
                messages.map(function(currMessage){
                    if(typeof currMessage != 'object')
                        currMessage = JSON.parse(currMessage);
                    if(currMessage.source == 'patient'){
                        temp = {
                            'variable': currMessage.message.variable,
                            'qCode': currMessage.message.qCode,
                            'body': currMessage.message.body
                        };
                        scope.messages.push(temp);
                    }
                });
            }
console.log('scope.messages',scope.messages);

        },
        template: `
        <div id="row-{{ field.name() }}" class="form-field form-group has-feedback" style="margin:0;">
    <div class="row">
        <div class="col-md-4">VARIABLE</div>
        <div class="col-md-4">QCODE</div>
        <div class="col-md-4">BODY OF MESSAGE</div>
    </div>
    <div ng-repeat="m in messages" style="margin:10px 0;background-color:#FAF0E6;border-radius:5px;display:block;width:100%;overflow:auto;">
        <div class="col-md-4">{{m.variable}}</div>
        <div class="col-md-4">{{m.qCode}}</div>
        <div class="col-md-4" style="overflow:hidden;word-wrap: break-word;">{{m.body}}</div>
    </div>
</div>
`
    }
}

showPatientMessages.$inject = [];

export default showPatientMessages;