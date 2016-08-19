module.exports = function(nga,chatroom,chatReplies) {

    // DELETION VIEW
    chatroom.deletionView()
    .disable()

    // LIST VIEW
    chatroom.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created')
            .format('MM/dd/yyyy'),
        nga.field('messages','obj_key_value_field')
            .label('Question')
            .keyValueChoices('{"qCode":"ask for email"}')
            .cssClasses(['obj_key_value_field'])
    ])
    .title('Conversations')
    .listActions(['show'])
    .batchActions([])
    .filters([
        nga.field('dt_create')
            .label('Created'),
        nga.field('messages')
    ]);

    // SHOW VIEW
    chatroom.showView()
    .fields([
        nga.field('owner')
        ,nga.field('dt_create','datetime')
            .label('Created')
            .format('MM/dd/yyyy, HH:mm:ss')
        ,nga.field('dt_update','datetime')
            .label('Last Updated')
            .format('MM/dd/yyyy, HH:mm:ss')
        // ,nga.field('key')
        // ,nga.field('room')
        // ,nga.field('sessionID')
        ,nga.field('messages','stamplay_array_str')
            .label('Conversation Details')
            .targetFields([
                nga.field('source'),
                nga.field('message.body.text')
            ])
            .jsonParse(true)
            .fieldValueStyles('[{"fieldName":"source", "value":"patient", "cssClass":"chat-message-source-patient"}]')
            .cssClasses(['short-scroll'])
        ,nga.field('custom_action')
            .label('')
            .template('<reply-to-chat-conversation post="entry"></reply-to-chat-conversation>')
        ,nga.field('replies','referenced_list')
            .label('Replies')
            .targetEntity(chatReplies)
            .targetReferenceField(nga.field('chatRoomId'))
            .targetFields([
              nga.field('dt_create','datetime')
                .label('Posted'),
              nga.field('replyText','wysiwyg')
                .label('Detail')
                .isDetailLink('true')
                // .map(function truncate(value, entry) {
                //     return value + '(' + entry.values.subValue + ')';
                // })
            ])
    ])
    .title('Conversation Detail')
    .actions(['list'])

    return chatroom;

};