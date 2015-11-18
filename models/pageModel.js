exports.getAllDistributionChannelsByStoreId = function(dbConnection, storeId, callback) {
    var query = dbConnection.query('select cd.cd_id, cd.cd_name FROM catalogue_detail as cd ' +
        'LEFT JOIN catalogue_master as cm ON cm.cm_id = cd.cd_cm_id ' +
        'LEFT JOIN multiselect_metadata_detail as m ON cd.cd_id = m.cmd_entity_detail ' +
        'LEFT JOIN icn_store as s ON m.cmd_group_id = s.st_front_type ' +
        'WHERE cm.cm_name in ("Channel Distribution") AND s.st_id = ? ',[storeId],
        function (err, distributionChannels) {
            callback(err,distributionChannels);
        }
    );
}