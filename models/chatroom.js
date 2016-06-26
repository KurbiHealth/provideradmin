module.exports = function(nga,chatroom) {

    // LIST VIEW
    chatroom.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created'),
        nga.field('messages','obj_key_value_field')
            .label('')
            .keyValueChoices('{"qCode":"back pain details"}')
    ])
    .listActions(['show']);

    // SHOW VIEW
    chatroom.showView()
    .fields([
        nga.field('owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('dt_update')
            .label('Last Updated'),
        nga.field('key'),
        nga.field('room'),
        nga.field('sessionID'),
        nga.field('messages','stamplay_array_str')
            .targetFields([
                nga.field('source'),
                nga.field('message.body.text')
            ])
            .jsonParse(true)
            .fieldValueStyles('[{"fieldName":"source", "value":"patient", "cssClass":"chat-message-source-patient"}]')
        //,nga.field('messages','json')
        ,nga.field('custom_action')
            .label('')
            .template('<reply-to-chat-conversation post="entry"></reply-to-chat-conversation>')
        ,nga.field('replies','referenced_list')
            .targetEntity(nga.entity('chatroomreplies'))
            .targetReferenceField('chatRoomId')
            .targetFields([
              nga.field('id'),
              nga.field('dt_created').label('Posted'),
              nga.field('replyText').label('Reply')
            ])
            .sortField('dt_created')
            .sortDir('DESC')
            .listActions(['edit']),
    ])

    // CREATION VIEW
    chatroom.creationView()
    .fields([
        nga.field('key')
            //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })
            ,
        nga.field('messages'),
        nga.field('room'),
        nga.field('sessionID'),
        nga.field('url')
    ])

    // EDITION VIEW
    chatroom.editionView()
    .fields(chatroom.creationView().fields())

    return chatroom;

};