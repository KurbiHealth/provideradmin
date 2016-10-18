module.exports = function(nga,chatbox,chatstyle,chatroom) {

    // LIST VIEW
    var listViewActionsTemplate = '<edit-chat-box entry="entry" type="create"></edit-chat-box>' +
    '<ma-export-to-csv-button entity="::entity" datastore="::datastore"></ma-export-to-csv-button>';
    
    var listViewListActionsTemplate = '<ma-show-button size="xs" entry="entry" entity="entity"></ma-show-button>' +
      '<edit-chat-box size="xs" entry="entry" type="edit"></edit-chat-box>' +
      '<ma-delete-button size="xs" entry="entry" entity="entity"></ma-delete-button>';
    
    chatbox.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created')
        ,nga.field('id')
        ,nga.field('actions', 'template').template(listViewListActionsTemplate)
    ])
    //.listActions(['show','edit','delete'])
    //.actions(listViewActionsTemplate)
    //.batchActions([])
    ;

    // SHOW VIEW
    var showViewActionsTemplate = '<ma-list-button entry="entry" entity="entity"></ma-list-button>' +
      '<edit-chat-box entry="entry" type="edit"></edit-chat-box>' +
      '<ma-delete-button entry="entry" entity="entity"></ma-delete-button>';
    chatbox.showView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created')
        ,nga.field('dt_update','datetime')
            .label('Last Updated')
        ,nga.field('user_owner')
            .label('Owner')
// CUSTOMIZATIONS reference ==> chatstyle
        // ,nga.field('customizations','referenced_list')
        //     .label('History of changes')
        //     .targetEntity(customizations)
        //     .targetReferenceField('chatbox')
        //     .targetFields([
        //         nga.field('chat_color')
        //             .label('Color')
        //             .template('<span style="display:block;height:18px;width:35px;background-color:{{value}};border-radius:2px;"></span>'),
        //         nga.field('chat_headline')
        //             .label('Headline'),
        //         nga.field('chat_avatar')
        //             .label('Avatar')
        //     ])
        //     .sortField('dt_create')
        //     .sortDir('DESC')
// CHATROOMS reference
        // ,nga.field('chatroom','referenced_list')
        //     .label('Conversations') // referenced_list of ChatRoom(s)
        //     .targetEntity(chatroom)
        //     .targetReferenceField('parent_chatbox')
        //     .targetFields([
        //         nga.field('dt_create','datetime')
        //             .label('Occurred')
        //             .format('short')
        //             .isDetailLink(true)
        //         ,nga.field('url')
        //             .label('On Web Page')
        //     ])
        ,nga.field('snippet') // OK
            .label('Web Snippet')
            .cssClasses(['dont-break-out show-value short-scroll col-sm-10 col-md-8 col-lg-7'])
    ])
    .title('Chatbox Detail')
    .actions(showViewActionsTemplate);

    // CREATION VIEW
    chatbox.creationView()
    .fields([
        // nga.field('chat_avatar','file')
        //     //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })
        //     ,
        // nga.field('chat_color'),
        // nga.field('chat_headline'),
        // nga.field('chat_snippet'),
        // nga.field('chat_url')
        nga.field('user_owner'),
        nga.field('allowedPages'), // array_string (list of urls)
        nga.field('bots'), // array_string (list of names)
        nga.field('documents'),
        nga.field('rule'),
        nga.field('snippet'),
        nga.field('styles') // object (array of chatstyle id's)
    ])

    // EDITION VIEW
    chatbox.editionView()
    .fields(chatbox.creationView().fields())

    // DELETION VIEW
    chatbox.deletionView()
        .title('Delete this chatbox');

    return chatbox;

};