export default function ObjKeyValueFieldDirective(FieldViewConfiguration, $compile) {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            //value: '=',
            entity: '&'
        },
        link: function(scope, element) {
            const field = scope.field();
            const type = field.type();
            scope.field = field;
            scope.type = type;
            scope.entity = scope.entity();
            scope.entry = scope.entry();

            // '{"qCode":"back pain details"}'
            var choices = JSON.parse(field._keyValueChoices);
            var messages = scope.entry.values.messages;
            var displayValue = '--User did not leave a question--';
            if(messages){

                messages.map(function(currMessage){
                    
                    currMessage = JSON.parse(currMessage);
                    if(currMessage.source == 'patient'){
                        if(currMessage.message.qCode){
                            if(currMessage.message.qCode == choices.qCode){
                                if(currMessage.message.body.text != ''){
                                    displayValue = currMessage.message.body.text;
                                }
                            }
                        }
                    }

                });
            
            }
            scope.displayValue = displayValue;

            scope.getCssClasses = function(entry) {
                return 'ng-admin-field-' + field.name().replace('.', '_') + ' ng-admin-type-' + type + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');
            };

            const template =
`<div id="row-{{ field.name() }}" class="form-field form-group has-feedback" ng-class="" style="margin:0;">
    <label for="{{ field.name() }}" class="col-sm-2 control-label">
        {{ field.label() }}
    </label>
    <div ng-class="field.getCssClasses(entry)||'col-sm-10'">
        {{displayValue}}
    </div>
</div>`;

            element.append(template);
            $compile(element.contents())(scope);
        }
    };
}

ObjKeyValueFieldDirective.$inject = ['FieldViewConfiguration', '$compile'];
