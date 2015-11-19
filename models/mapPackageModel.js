/**
 * Created by darhamid on 18/11/15.
 */

exports.getMappingDataByPageId = function( dbConnection, pageId, storeId, callback ) {
    dbConnection.query('SELECT * FROM icn_pub_page_portlet AS portlet '+
                                'JOIN icn_pub_page AS pub ON ( pub.pp_id = portlet.ppp_pp_id ) '+
                                'WHERE portlet.ppp_pp_id = ? AND pub.pp_sp_st_id = ? ' +
                                    'AND portlet.ppp_is_active = 1 AND ISNULL( ppp_crud_isactive )',
                [ pageId, storeId ],
        function( err, mappingData ) {
            callback( err,mappingData );
        }
    );
}

exports.getLastInsertedMapPortletId = function( dbConnection, callback ) {
    dbConnection.query('SELECT MAX( pmpp_id ) FROM icn_pub_map_portlet_pkg ',
        function( err, response ) {
            callback( err, response[0].pmpp_id );
        }
    );
}

exports.createMapPortletData = function( dbConnection, data, callback ) {
    dbConnection.query('INSERT INTO icn_pub_map_portlet_pkg SET ?', data,
        function( err, response ) {
            callback( err, response );
        }
    );
}

exports.getPackageInfoByPackId = function( dbConnection, packageId, storeId, callback ) {
    dbConnection.query('SELECT * ' +
                        'FROM icn_store_package WHERE sp_pkg_id = ? ' +
                        'AND sp_st_id = ? AND sp_is_active = 1 ' +
                        'AND ISNULL( sp_crud_isactive )',[ packageId, storeId ],
        function( err, response ) {
            callback( err, response );
        }
    );
}