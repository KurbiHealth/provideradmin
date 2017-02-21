module.exports = function(nga,botdialog) {

    // LIST VIEW
    botdialog.listView()
    .fields([
        nga.field('id'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('name'),
        nga.field('qcode')
    ])
    .listActions(['show','edit','delete'])
    .title('Bot Dialog Nodes');

    // SHOW VIEW
    botdialog.showView()
    .fields([
        nga.field('owner'),
        nga.field('user_owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('dt_update')
            .label('Last Updated'),
        nga.field('name'),
        nga.field('qcode'),
        nga.field('stuff','json')
    ])

    // CREATION VIEW
    botdialog.creationView()
    .fields([
        nga.field('name'),
        nga.field('qcode'),
        nga.field('stuff','json')
    ])

    // EDITION VIEW
    botdialog.editionView()
    .fields(botdialog.creationView().fields())

    return botdialog;

};