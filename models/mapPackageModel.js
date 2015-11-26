/**
 * Created by darhamid on 18/11/15.
 */

exports.getMappingDataByPageId = function( dbConnection, pageId, storeId, callback ) {
    dbConnection.query('SELECT * FROM icn_pub_page_portlet AS portlet '+
                                'JOIN icn_pub_page AS pub ON ( pub.pp_id = portlet.ppp_pp_id ) '+
                                'WHERE portlet.ppp_pp_id = ? AND pub.pp_sp_st_id = ? ' +
                                'AND portlet.ppp_is_active = 1 AND ISNULL( portlet.ppp_crud_isactive ) ' +
                                'AND ISNULL( pub.pp_crud_isactive ) AND portlet.ppp_pkg_allow > 0',
                [ pageId, storeId ],
        function( err, mappingData ) {
            callback( err,mappingData );
        }
    );
}

exports.getMappingPackageDataByPageId = function( dbConnection, pageId, storeId, callback ) {
    dbConnection.query('SELECT pub_map.pmpp_sp_pkg_id, pub_map.pmpp_ppp_id, pub_map.pmpp_id FROM icn_pub_map_portlet_pkg  AS pub_map '+
        'JOIN icn_pub_page_portlet AS portlet ON ( pub_map.pmpp_ppp_id = portlet.ppp_id ) '+
        'JOIN icn_pub_page AS pub ON ( pub.pp_id = portlet.ppp_pp_id ) '+
        'WHERE portlet.ppp_pp_id = ? AND pub.pp_sp_st_id = ? ' +
        'AND portlet.ppp_is_active = 1 AND ISNULL( portlet.ppp_crud_isactive ) ' +
        'AND ISNULL( pub.pp_crud_isactive ) AND ISNULL( pub_map.pmpp_crud_isactive ) AND portlet.ppp_pkg_allow > 0 ORDER BY pub_map.pmpp_id ',
        [ pageId, storeId ],
        function( err, mappingData ) {
            callback( err,mappingData );
        }
    );
}

exports.getLastInsertedMapPortletId = function( dbConnection, callback ) {
    dbConnection.query('SELECT MAX( pmpp_id ) as pmpp_id FROM icn_pub_map_portlet_pkg',
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

exports.checkPortletDetailsExist = function( dbConnection, portletId, portletMapId, callback ) {
   console.log('SELECT * ' +
       'FROM icn_pub_map_portlet_pkg WHERE pmpp_ppp_id = '+portletId + ' '+
       'AND pmpp_id = '+ portletMapId +' AND ISNULL( pmpp_crud_isactive )')
    dbConnection.query('SELECT * ' +
        'FROM icn_pub_map_portlet_pkg WHERE pmpp_ppp_id = ? ' +
        'AND pmpp_id = ? AND ISNULL( pmpp_crud_isactive )',[ portletId, portletMapId ],
        function( err, response ) {
            callback( err, response );
        }
    );
}

exports.updateMappingPackage = function( dbConnection, mappingData, callback ) {
    //console.log( 'UPDATE icn_pub_map_portlet_pkg SET ' +
                //'pmpp_crud_isactive = '+mappingData.pmpp_id+' WHERE pmpp_ppp_id = '+mappingData.pmpp_ppp_id );

    dbConnection.query('UPDATE icn_pub_map_portlet_pkg SET ' +
        'pmpp_crud_isactive = ? WHERE pmpp_ppp_id = ? AND pmpp_id = ?', [ mappingData.pmpp_id, mappingData.pmpp_ppp_id, mappingData.pmpp_id ],
        function( err, response ) {
            callback( err, response );
        }
    );
}