/*
getReadWidget:   DISPLAYED IN listView AND showView
getLinkWidget: 	 DISPLAYED IN listView AND showView WHEN isDetailLink IS TRUE 
getFilterWidget: DISPLAYED IN THE FILTER FORM IN THE listView
getWriteWidget:  DISPLAYED IN editionView AND creationView
*/

export default {
    getReadWidget:   () => '<obj-key-value-field entry="::entry" field="::field" entity="::entity"></obj-key-value-field>',
    getLinkWidget:   () => 'error: cannot display referenced_list field as linkable',
    getFilterWidget: () => 'error: cannot display referenced_list field as filter'
}