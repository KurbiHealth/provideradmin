export default function (nga, admin, replies) {

    return nga.dashboard()
        // THIS IS A SAMPLE COLLECTION
        // taken from https://github.com/marmelab/ng-admin-demo/blob/gh-pages/js/dashboard/config.js
        .addCollection(nga.collection(admin.getEntity('chatroom'))
            .name('pending_conversations')
            .title('20 Most Recent Bot Conversations')
            .fields([
                nga.field('dt_create','datetime')
                    .format('short')
                    .isDetailLink(true),
                nga.field('messages','obj_key_value_field')
                    .label('Question')
                    .keyValueChoices('{"qCode":"back pain details"}')
                    .cssClasses(['obj_key_value_field']),
            ])
            //.permanentFilters({ rep: true })
            .sortField('dt_create')
            .sortDir('DESC')
            .perPage(20)
        )
        .template(`
<div class="row">
    <div class="col-lg-12">
        <div class="page-header">
            <h1>Dashboard</h1>
        </div>
    </div>
</div>
<div class="row dashboard-starter"></div>
<dashboard-summary></dashboard-summary>
<div class="row dashboard-content">
    <div class="col-lg-12">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.pending_conversations" entries="dashboardController.entries.pending_conversations" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
</div>
`);
}