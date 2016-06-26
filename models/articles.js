module.exports = function(nga,articles) {

    // LIST VIEW
    articles.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created'),
        nga.field('author'),
        nga.field('title')
        ,nga.field('published','boolean')
            .choices([
              { value: null, label: 'null' },
              { value: true, label: 'yes' },
              { value: false, label: 'no' }
          ])
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    articles.showView()
    .fields([
        nga.field('owner')
        ,nga.field('dt_create')
            .label('Created')
        ,nga.field('dt_update')
            .label('Last Updated')
        ,nga.field('author')
        ,nga.field('title')
        ,nga.field('body','wysiwyg')
        ,nga.field('conversation_id')
        ,nga.field('published','boolean')
            .choices([
              { value: null, label: 'null' },
              { value: true, label: 'yes' },
              { value: false, label: 'no' }
          ])
    ])

    // CREATION VIEW
    articles.creationView()
    .fields([
        nga.field('title')
        ,nga.field('body','wysiwyg')
        ,nga.field('published','boolean')
            .choices([
              { value: null, label: 'null' },
              { value: true, label: 'yes' },
              { value: false, label: 'no' }
          ])
    ])

    // EDITION VIEW
    articles.editionView()
    .fields(articles.creationView().fields())

    return articles;

};