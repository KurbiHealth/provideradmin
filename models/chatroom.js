module.exports = function(nga,chatroom) {

    // LIST VIEW
    chatroom.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    chatroom.showView()
    .fields([
        nga.field('owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('dt_update')
            .label('Last Updated'),
        nga.field('chat_avatar'),
        nga.field('chat_color'),
        nga.field('chat_headline'),
        nga.field('chat_snippet'),
        nga.field('chat_url')
        // relate concept
    ])

    // CREATION VIEW
    chatroom.creationView()
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
    chatroom.editionView()
    .fields(chatroom.creationView().fields())

    return chatroom;

};