module.exports = function(nga,chatroomreplies) {

    // LIST VIEW
    chatroomreplies.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created'),
        nga.field('owner'),
        nga.field('replyText')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    chatroomreplies.showView()
    .fields([
        nga.field('owner')
        ,nga.field('dt_create')
            .label('Created')
        ,nga.field('dt_update')
            .label('Last Updated')
        ,nga.field('chatRoomId')
        ,nga.field('recipient')
        ,nga.field('replyText','wysiwyg')
    ])

    // CREATION VIEW
    chatroomreplies.creationView()
    .fields([
        nga.field('recipient')
        ,nga.field('replyText','wysiwyg')
    ])

    // EDITION VIEW
    chatroomreplies.editionView()
    .fields(chatroomreplies.creationView().fields())

    return chatroomreplies;

};