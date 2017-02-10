module.exports = function(nga,chatbot) {

    // LIST VIEW
    chatbot.listView()
    .fields([
        nga.field('id'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('name'),
        nga.field('owner')
    ])
    .listActions(['show','edit','delete'])
    .title('Bot Dialog Nodes');

    // SHOW VIEW
    chatbot.showView()
    .fields([
        nga.field('user_owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('dt_update')
            .label('Last Updated'),
        nga.field('name')
    ])

    // CREATION VIEW
    chatbot.creationView()
    .fields([
        nga.field('name'),
        nga.field('owner'),
        nga.field('user_owner')
    ])

    // EDITION VIEW
    chatbot.editionView()
    .fields(chatbot.creationView().fields())

    return chatbot;

};