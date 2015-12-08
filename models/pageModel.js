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
	dbConnection.query("UPDATE icn_pub_page_portlet  SET `ppp_crud_isactive` = `ppp_id` WHERE ppp_pp_id = ?",
			[pageId],function (err, result) {
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
	var query = dbConnection.query(" DELETE FROM `icn_pub_page` WHERE pp_id = ? AND pp_sp_st_id = ? AND pp_dc_id = ? AND pp_page_title = ? AND pp_page_file = ? AND pp_page_type_id = ? AND pp_crud_isactive IS NOT NULL",[data.pp_id, data.pp_sp_st_id,data.pp_dc_id,data.pp_page_title,data.pp_page_file,data.pp_page_type_id],function(err,response){
		if(err){

		}else{
				var query = dbConnection.query("INSERT INTO `icn_pub_page` SET ? ",data, function (err, response) {
					callback(err,response);
				});
		}
	});
}

exports.savePortlet = function(dbConnection,data,callback){
	
			var query = dbConnection.query("INSERT INTO `icn_pub_page_portlet` SET ? ",data, function (err, response) {
				callback(err,response);
			});
	
}


exports.getPackageIdsByPageName = function( dbConnection, pageName, storeId,callback ){
	dbConnection.query("SELECT pub_map.pmpp_sp_pkg_id as packageId ,portlet.ppp_id as portletId, pub_map.pmpp_id as portletMapId  FROM icn_pub_map_portlet_pkg  AS pub_map "+
		"Right OUTER JOIN icn_pub_page_portlet AS portlet ON ( pub_map.pmpp_ppp_id = portlet.ppp_id ) "+
		"Right OUTER JOIN icn_pub_page AS pub ON ( pub.pp_id = portlet.ppp_pp_id ) "+
		"WHERE pub.pp_page_file = ? AND pub.pp_sp_st_id = ? "+
		"AND portlet.ppp_is_active = 1 AND ISNULL( portlet.ppp_crud_isactive ) "+
		"AND ISNULL( pub.pp_crud_isactive ) AND ISNULL( pub_map.pmpp_crud_isactive ) AND portlet.ppp_pkg_allow >= 0 ORDER BY portlet.ppp_id,pub_map.pmpp_id",[pageName,storeId], function (err, response) {
		callback(err,response);
	});
}

exports.getPortletContentByPackageId = function( dbConnection, packageIds,callback ){
	 // dbConnection.query("SELECT DATE_FORMAT(NOW(),'%Y%m%d%H%i%s') as timestamp, GROUP_CONCAT(DISTINCT(mmd.cmd_entity_detail)) as allowedContentTypes, SUBSTR(CONCAT('z_',MD5(RAND()),MD5(RAND())),1,32) as promoid, "+
	 // 					" md5(cd.cd_name) as contentTypeMD5, md5(cf.cf_url_base) as contentFileURLMD5 ,pub_map.pmpp_ppp_id as  portletId,cft.cft_thumbnail_img_browse,cft.cft_thumbnail_size,cmd.cm_title,cmd.cm_genre,cd.cd_id,cd.cd_name, cf.cf_url ,cf.cf_cm_id,sp.sp_pkg_id FROM  icn_store_package AS sp "+
	 // 					"JOIN icn_pub_map_portlet_pkg AS pub_map  ON( pub_map.pmpp_sp_pkg_id = sp.sp_pkg_id ) "+
  //                       "JOIN icn_pub_page_portlet AS ippp ON ippp.ppp_id = pub_map.pmpp_ppp_id "+
  //                       "JOIN icn_pack_content_type AS pct ON pct.pct_pk_id = sp.sp_pk_id "+
  //                       "JOIN icn_pack_content AS pc ON pc.pc_pct_id = pct.pct_id "+
  //                       "JOIN content_files AS cf ON cf.cf_cm_id = pc.pc_cm_id "+
  //                       "JOIN content_files_thumbnail AS cft ON cft.cft_cm_id = pc.pc_cm_id "+
  //                       "JOIN content_metadata AS cmd ON cmd.cm_id = pc.pc_cm_id  "+
  //                       "JOIN catalogue_detail AS cd ON cd.cd_id = cmd.cm_content_type "+
  //                       "JOIN multiselect_metadata_detail mmd ON (mmd.cmd_group_id = ippp.ppp_cmd_id AND mmd.cmd_entity_detail = cmd.cm_content_type ) "+
  //                       "WHERE sp.sp_pkg_id IN ("+packageIds+") AND cmd.cm_state = 4  AND cmd.cm_starts_from <= NOW() AND cmd.cm_expires_on >= NOW()  group by cf.cf_cm_id "
 	// 					, function (err, response) {
 	// 						//group by cf.cf_url
		// callback(err,response);
	 // });
//Phase 2 query  : 
// dbConnection.query("SELECT "+
// 						"DATE_FORMAT(NOW(),'%Y%m%d%H%i%s') as timestamp, "+ 
// 					    "SUBSTR(CONCAT('z_',MD5(RAND()),MD5(RAND())),1,32) as promoid, "+
// 					    "md5(cd.cd_name) as contentTypeMD5, "+
// 					    "md5(cf.cf_url_base) as contentFileURLMD5 , "+ 
// 						"ippp.ppp_id as portletId,pub_map.pmpp_sp_pkg_id, "+
// 					   "cmd.cm_id,cmd.cm_title , cmd.cm_genre, cmd.cm_content_type, "+
// 					   "cd.cd_name, "+
// 					    "cf.cf_url, "+ 
// 					    "cft.cft_thumbnail_img_browse, "+ 
// 					    "cft.cft_thumbnail_size "+ 
// 					"FROM "+ 
// 						"multiselect_metadata_detail mmd "+
// 					"JOIN  icn_pub_page_portlet ippp ON (mmd.cmd_group_id = ippp.ppp_cmd_id ) "+ 
// 					"JOIN content_metadata cmd ON (mmd.cmd_entity_detail = cmd.cm_content_type) "+ 
// 					"JOIN content_files cf ON (cf.cf_cm_id = cmd.cm_id)  "+
// 					"JOIN icn_pack_content AS pc ON cf.cf_cm_id = pc.pc_cm_id  "+
// 					"JOIN icn_pack_content_type AS pct ON pc.pc_pct_id = pct.pct_id "+ 
// 					"JOIN icn_store_package as sp ON  pct.pct_pk_id = sp.sp_pk_id "+
// 					"JOIN content_files_thumbnail cft ON (cft.cft_cm_id = cmd.cm_id)  "+
// 					"JOIN catalogue_detail cd ON (mmd.cmd_entity_detail = cd.cd_id)  "+
// 					"JOIN icn_pub_map_portlet_pkg AS pub_map  ON( pub_map.pmpp_ppp_id = ippp.ppp_id ) "+ 
// 					"WHERE sp.sp_pkg_id IN ("+packageIds+")  "+
// 						"AND cmd.cm_state = 4  AND cmd.cm_starts_from <= NOW() AND cmd.cm_expires_on >= NOW() "+ 
// 						"AND ippp.ppp_crud_isactive IS NULL "+
// 					"Group By portletId,cf.cf_cm_id "+
// 					"Order By portletId,cmd.cm_id,ippp.ppp_id,cm_content_type", 
//      function (err, response) {
// 	//INNER JOIN content_files 
// 		callback(err,response);
// 	 });

//Current query : 
	dbConnection.query("SELECT DATE_FORMAT(NOW(),'%Y%m%d%H%i%s') as timestamp, "+
		"  SUBSTR(CONCAT('z_',MD5(RAND()),MD5(RAND())),1,32) as promoid, "+
		" md5(cd.cd_name) as contentTypeMD5, md5(cf.cf_url_base) as contentFileURLMD5 ,pub_map.pmpp_ppp_id as  portletId,cft.cft_thumbnail_img_browse,cft.cft_thumbnail_size,cmd.cm_title,cmd.cm_genre,cd.cd_id,cd.cd_name, cf.cf_url ,cf.cf_cm_id,sp.sp_pkg_id FROM  icn_store_package AS sp "+
		" JOIN icn_pub_map_portlet_pkg AS pub_map  ON( pub_map.pmpp_sp_pkg_id = sp.sp_pkg_id ) "+
		" JOIN icn_pub_page_portlet AS ippp ON ippp.ppp_id = pub_map.pmpp_ppp_id "+
		" JOIN icn_pack_content_type AS pct ON pct.pct_pk_id = sp.sp_pk_id "+
		" JOIN icn_pack_content AS pc ON pc.pc_pct_id = pct.pct_id "+
		" JOIN content_files AS cf ON cf.cf_cm_id = pc.pc_cm_id "+
		" JOIN content_files_thumbnail AS cft ON cft.cft_cm_id = pc.pc_cm_id "+
		" JOIN content_metadata AS cmd ON cmd.cm_id = pc.pc_cm_id "+
		" JOIN catalogue_detail AS cd ON cd.cd_id = cmd.cm_content_type "+
		"  WHERE sp.sp_pkg_id IN ("+packageIds+") AND ippp.ppp_crud_isactive IS NULL  AND cmd.cm_state = 4  AND cmd.cm_starts_from <= NOW() AND cmd.cm_expires_on >= NOW()  group by portletId,cf.cf_cm_id "+
		" Order By portletId,cf.cf_cm_id ",
		function (err, response) {
			//INNER JOIN content_files
			callback(err,response);
		});
}