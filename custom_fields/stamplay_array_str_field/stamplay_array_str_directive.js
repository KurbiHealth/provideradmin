import Entry from 'admin-config/lib/entry';

function sorter(sortField, sortDir) {
    return (entry1, entry2) => {
        // use < and > instead of substraction to sort strings properly
        const sortFactor = sortDir === 'DESC' ? -1 : 1;
        if (entry1.values[sortField] > entry2.values[sortField]) {
            return sortFactor;
        }
        if (entry1.values[sortField] < entry2.values[sortField]) {
            return -1 * sortFactor;
        }
        return 0;
    };
}

function stamplayArrayOfStrings(NgAdminConfiguration) {
    const application = NgAdminConfiguration(); // jshint ignore:line
    return {
        scope: {
            'field': '&',
            'value': '&',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function(scope) {

                const field = scope.field(); // configuration values from the ES6 class
                const targetEntity = field.targetEntity();
                const targetEntityName = targetEntity.name();
                const targetFields = field.targetFields();
                const sortField = field.sortField();
                const sortDir = field.sortDir();
                
                // ADD PERMANENT FILTERS
                var filterFunc;

                if (field.permanentFilters()) {
                    const filters = field.permanentFilters();
                    const filterKeys = Object.keys(filters);
                    filterFunc = (entry) => filterKeys.reduce((isFiltered, key) => isFiltered && entry.values[key] === filters[key], true);
                } else {
                    filterFunc = () => true;
                }
                
                // PARSE STRING INTO OBJ IF NEEDED
                 var value = scope.value();

                if(field._jsonParse == true){
                    value = value.map(function(e){
                        return JSON.parse(e);
                    });
                }
              
                let entries = Entry
                    .createArrayFromRest(value || [], targetFields, targetEntityName, targetEntity.identifier().name())
                    .sort(sorter(sortField, sortDir))
                    .filter(filterFunc);
                if (!targetEntityName) {
                    let index = 0;
                    entries = entries.map(e => {
                        e._identifierValue = index++;
                        return e;
                    });
                }

                // field._fieldValueStyles == [{fieldName:FIELDNAME, value:VALUE, cssClass:CSS-CLASS-NAME}]
                // Ex. [{fieldName:source, value:patient, cssClass:chat-message-source-patient}]')
                var styles = JSON.parse(field._fieldValueStyles);
                entries = entries.map(function(e){
                    for(var i in styles){
                        if(styles[i].fieldName in e.values){
                            if(styles[i].value == e.values[styles[i].fieldName]){
// FIX THIS SO IT GOES THROUGH TO maDatagrid DIRECTIVE (see ????????? below)
                                e._entryCssClasses = e._entryCssClasses ? e._entryCssClasses+' '+styles[i].cssClass : styles[i].cssClass;
                                e.values._entryCssClasses = styles[i].cssClass;
                                scope.entryCssClasses = scope.entryCssClasses ? scope.entryCssClasses+' '+styles[i].cssClass : styles[i].cssClass;
                            }
                        }
                    }
                    return e;
                });

                scope.field = field;
                scope.targetFields = targetFields;
                scope.entries = entries;
                scope.entity = targetEntityName ? application.getEntity(targetEntityName) : targetEntity;
                
                scope.sortField = sortField;
                scope.sortDir = sortDir;
                scope.sort = field => {
                    let sortDir = 'ASC';
                    const sortField = field.name();
                    if (scope.sortField === sortField) {
                        // inverse sort dir
                        sortDir = scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
                    }
                    scope.entries = scope.entries.sort(sorter(sortField, sortDir));
                    scope.sortField = sortField;
                    scope.sortDir = sortDir;
                };
            }
        },
        template: `
<ma-datagrid ng-if="::entries.length > 0"
    entryCssClasses="{{ entryCssClasses }}" // ????????????????????
    entries="entries"
    fields="::targetFields"
    list-actions="::field.listActions()"
    entity="::entity"
    datastore="::datastore()"
    sort-field="{{ sortField }}"
    sort-dir="{{ sortDir }}"
    sort="::sort">
</ma-datagrid>`
    };
}

export default stamplayArrayOfStrings;

stamplayArrayOfStrings.$inject = ['NgAdminConfiguration'];