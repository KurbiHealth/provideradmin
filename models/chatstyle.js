module.exports = function(nga,chatstyle) {

    // LIST VIEW
    chatstyle.listView()
    .fields([
        nga.field('id'),
        nga.field('dt_create')
            .label('Created'),
//        nga.field('chat_avatar'),
//        nga.field('chat_url')
    ])
    .listActions(['show','edit','delete'])
    .title('Chatbox Styles');

    // SHOW VIEW
    chatstyle.showView()
    .fields([
        nga.field('user_owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('dt_update')
            .label('Last Updated'),
        nga.field('js'),
        nga.field('html'),
        nga.field('css'),
        nga.field('configuration','json')
    ])

    // CREATION VIEW
    chatstyle.creationView()
    .fields([
        // nga.field('chat_avatar'),
        // nga.field('chat_color'),
        // nga.field('chat_headline'),
        // nga.field('chat_snippet'),
        // nga.field('chat_url')
        nga.field('configuration')
    ])

    // EDITION VIEW
    chatstyle.editionView()
    .fields(chatstyle.creationView().fields())

    return chatstyle;

};