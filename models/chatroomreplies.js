module.exports = function(nga,chatroomreplies,chatRoom) {

    // LIST VIEW
    chatroomreplies.listView()
    .fields([
        nga.field('chatRoomId','reference')
            .label('Parent Conversation')
            .isDetailLink('true')
            .detailLinkRoute('show')
            .targetEntity(chatRoom)
            .targetField(nga.field('dt_create','datetime').format('MM/dd/yyyy'))
        ,nga.field('dt_create','datetime')
            .label('Reply Posted')
            .format('MM/dd/yyyy')
        ,nga.field('replyText','wysiwyg')
            .label('Detail')
            // .map(function truncate(value, entry) {
            //     return value + '(' + entry.values.subValue + ')';
            // })
    ])
    .title('Replies')
    .listActions(['show','edit','delete'])
    .filters([
        //nga.field('q').label('Search').pinned(true)
        //,
        nga.field('qa').label('adrg')
          .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>')
    ]);

    // SHOW VIEW
    chatroomreplies.showView()
    .fields([
        nga.field('owner')
        ,nga.field('dt_create')
            .label('Created')
        ,nga.field('dt_update')
            .label('Last Updated')
        ,nga.field('chatRoomId')
            .label('Reply Id')
        ,nga.field('recipient')
        ,nga.field('replyText','wysiwyg')
    ])
    .title('Reply Detail')

    // CREATION VIEW
    chatroomreplies.creationView()
    .fields([
        nga.field('recipient')
        ,nga.field('replyText','wysiwyg')
    ])
    .title('Create New Reply')

    // EDITION VIEW
    chatroomreplies.editionView()
    .fields(chatroomreplies.creationView().fields())
    .title('Edit Reply')

    chatroomreplies.deletionView()
    .title('Delete This Reply?')

    return chatroomreplies;

};