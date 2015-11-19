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

exports.getPageTypes = function(dbConnection, callback) {
    var query = dbConnection.query(' select cd.cd_id,cd.cd_name  FROM catalogue_detail as cd ' +
    ' LEFT JOIN catalogue_master as cm ON cm.cm_id = cd.cd_cm_id ' +
    ' WHERE cm.cm_name in ("Page type") ',
        function (err, pageType) {
            callback(err,pageType);
        }
    );
}

exports.getPageByFileName = function(dbConnection,pageFileName,callback){
		dbConnection.query("SELECT pp_id as id FROM `icn_pub_page` WHERE lower(pp_page_file) = ?",
			[pageFileName],function (err, result) {
	            if(result.length > 0){
	                callback(err,true);
	            }else{
	                callback(err,false);
	            }
        });
}

exports.getPageByFileNameForUpdate = function(dbConnection,pageFileName,pageId,callback){
		dbConnection.query("SELECT pp_id as id FROM `icn_pub_page` WHERE lower(pp_page_file) = ? AND pp_id != ?",
			[pageFileName,pageId],function (err, result) {
	            if(result.length > 0){
	                callback(err,true);
	            }else{
	                callback(err,false);
	            }
        });
}

exports.getPageDetails = function(dbConnection,pageName,callback){
		dbConnection.query("SELECT *  FROM `icn_pub_page` WHERE pp_id = ?  AND pp_crud_isactive IS NULL",
			[pageName],function (err, result) {
	           callback(err,result);
        });
}

exports.getPagePortlets = function(dbConnection,pageName,callback){
		dbConnection.query("SELECT *  FROM `icn_pub_page_portlet` WHERE ppp_pp_id = ? AND ppp_crud_isactive IS NULL",
			[pageName],function (err, result) {
	            callback(err,result);
        });
}

exports.deleteExistingPage = function(dbConnection,pageId,callback){
	dbConnection.query("UPDATE icn_pub_page  SET `pp_crud_isactive` = ? WHERE pp_id = ?",
			[pageId,pageId],function (err, result) {
	            callback(err,result);
        });
}

exports.deleteExistingPortlets = function(dbConnection,pageId,callback){
	dbConnection.query("UPDATE icn_pub_page_portlet  SET `ppp_crud_isactive` = ? WHERE ppp_pp_id = ?",
			[pageId,pageId],function (err, result) {
	            callback(err,result);
        });
}

exports.selectExistingPortlets = function(dbConnection,pageId,callback){
	dbConnection.query("SELECT ppp_id  FROM `icn_pub_page_portlet` WHERE ppp_pp_id = ? AND ppp_crud_isactive IS NULL",
			[pageId],function (err, result) {
	            callback(err,result);
        });
}

exports.getHomePage = function(dbConnection,pageType,distributionChannel,callback){
		//1 to be changed to cd_id : 
		dbConnection.query("SELECT cd.cd_id as cid FROM `catalogue_detail` cd, `catalogue_master` cm WHERE cd.cd_name like 'Home Page' AND cd.cd_cm_id = cm.cm_id AND cm.cm_name in ('Page type')",
			function (err, result) {
				if(err){

				}else{
					if(result.length > 0 && pageType == result[0].cid){
						dbConnection.query("SELECT pp_id as id FROM `icn_pub_page` WHERE pp_page_type_id = ? AND pp_dc_id = ? ",
							[pageType,distributionChannel],function (err, result) {
					            if(result.length > 0){
					                callback(err,true);
					            }else{
					                callback(err,false);
					            }
        				});
					}else{
						callback(err,false);
					}
				}
		});
}

exports.getHomePageForUpdate = function(dbConnection,pageType,distributionChannel,pageId,callback){
		//1 to be changed to cd_id : 
		dbConnection.query("SELECT cd.cd_id as cid FROM `catalogue_detail` cd, `catalogue_master` cm WHERE cd.cd_name like 'Home Page' AND cd.cd_cm_id = cm.cm_id AND cm.cm_name in ('Page type')",
			function (err, result) {
				if(err){

				}else{
					if(result.length > 0 && pageType == result[0].cid){
						dbConnection.query("SELECT pp_id as id FROM `icn_pub_page` WHERE pp_page_type_id = ? AND pp_dc_id = ? AND pp_id != ? ",
							[pageType,distributionChannel,pageId],function (err, result) {
					            if(result.length > 0){
					                callback(err,true);
					            }else{
					                callback(err,false);
					            }
        				});
					}else{
						callback(err,false);
					}
				}
		});
}

exports.getLastInsertedPageId = function( dbConnection, callback) {
	var query = dbConnection.query("SELECT coalesce(MAX(pp_id) + 1,1) as maxId FROM `icn_pub_page`", function ( err, response ) {
		callback( err, response );
	});
}

exports.getLastInsertedPortletId = function( dbConnection, callback) {
	var query = dbConnection.query("SELECT coalesce(MAX(ppp_id) + 1,1) as maxPortletId FROM `icn_pub_page_portlet`", function ( err, response ) {
		callback( err, response );
	});
}

exports.savePage = function(dbConnection,data,callback){
	var query = dbConnection.query("INSERT INTO `icn_pub_page` SET ? ",data, function (err, response) {
		callback(err,response);
	});
}

exports.savePortlet = function(dbConnection,data,callback){

	var query = dbConnection.query("INSERT INTO `icn_pub_page_portlet` SET ? ",data, function (err, response) {
		callback(err,response);
	});
}


