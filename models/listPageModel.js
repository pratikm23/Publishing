exports.getAllPageType = function(dbConnection, callback) {
    var query = dbConnection.query(' Select cd.cd_id,cd.cd_name  FROM catalogue_detail as cd ' +
    ' LEFT JOIN catalogue_master as cm ON cm.cm_id = cd.cd_cm_id ' +
    ' WHERE cm.cm_name in ("Page type")  ',
    function (err, pageType) {
            callback(err,pageType);
        }
    );
}
exports.getAllPageTypeDetails = function(dbConnection,data ,callback) {
    if(data.pageTitle == undefined ){
        data.pageTitle = "";
    }
    var whereCond = "";
    if(data.pageTitle && data.term != ''){
        whereCond += " AND pp.pp_page_title LIKE '%"+data.pageTitle+"%'";
    }
    if(data.pageType !=0 ){
        whereCond += " AND pp.pp_page_type_id = "+data.pageType+" ";
    }
    var query = dbConnection.query(" SELECT  cd.cd_name , DATE_FORMAT(pp.pp_created_on,'%e-%b-%y') as pp_date , (Select  Count(ppp.ppp_id) From icn_pub_page_portlet as ppp " +
    "  Where ppp.ppp_pp_id  = pp.pp_id  ) as count ,  pp.* FROM `icn_pub_page` as pp " +
    " LEFT JOIN catalogue_detail as cd ON cd.cd_id = pp.pp_page_type_id " +
    " Where pp.pp_sp_st_id = ? AND pp.pp_dc_id = ? AND ISNULL(pp.pp_crud_isactive) " + whereCond + "ORDER BY pp.pp_page_title" , [data.storeId,data.distributionChannelId] ,
        function (err, PageTypeDetails) {
            callback(err,PageTypeDetails);
        }
    );
}