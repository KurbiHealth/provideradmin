module.exports = function(nga,chatbox,customizations) {

    // LIST VIEW
    var listViewActionsTemplate = '<ma-export-to-csv-button entity="::entity" datastore="::datastore"></ma-export-to-csv-button>' +
      '<edit-chat-box entry="entry" type="create"></edit-chat-box>';
    var listViewListActionsTemplate = '<ma-show-button size="xs" entry="entry" entity="entity"></ma-show-button>' +
      '<edit-chat-box size="xs" entry="entry" type="edit"></edit-chat-box>' +
      '<ma-delete-button size="xs" entry="entry" entity="entity"></ma-delete-button>';
    chatbox.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created')
        ,nga.field('actions', 'template').template(listViewListActionsTemplate)
    ])
    //.listActions(['show','edit','delete'])
    .actions(listViewActionsTemplate)
    ;

    // SHOW VIEW
    var showViewActionsTemplate = '<ma-list-button entry="entry" entity="entity"></ma-list-button>' +
      '<edit-chat-box entry="entry" type="edit"></edit-chat-box>' +
      '<ma-delete-button entry="entry" entity="entity"></ma-delete-button>';
    chatbox.showView()
    .fields([
        nga.field('owner'),
        nga.field('id'),
        nga.field('dt_create','datetime')
            .label('Created'),
        nga.field('dt_update','datetime')
            .label('Last Updated'),
        nga.field('snippet')
            .label('Web Snippet')
        ,nga.field('customizations','reference_many')
            .label('History of changes')
            .targetEntity(customizations)
            .targetField(nga.field('chat_color'))
        ,nga.field('')
            .label('Conversations') // referenced_list of ChatRoom(s)
    ])
    .title('Chatbox Detail')
    .actions(showViewActionsTemplate);

    // CREATION VIEW
    chatbox.creationView()
    .fields([
        nga.field('chat_avatar','file')
            //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })
            ,
        nga.field('chat_color'),
        nga.field('chat_headline'),
        nga.field('chat_snippet'),
        nga.field('chat_url')
    ])

    // EDITION VIEW
    chatbox.editionView()
    .fields(chatbox.creationView().fields())

    return chatbox;

};