var mysql = require('../config/db').pool;
var async = require("async");
var pageManager = require('../models/pageModel');

exports.getPageData = function (req, res, next) {
    try {
            if (req.session && req.session.publish_UserName) {
                mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                    async.parallel({
	                        DistributionChannel: function (callback) {
	                           pageManager.getAllDistributionChannelsByStoreId(connection_ikon_cms, req.session.publish_StoreId, function(err,DistributionChannel){
	                           		callback(err,DistributionChannel);
	                           });
	                        }
                       },
                         function (err, results) {
                                if (err) {
                                    connection_ikon_cms.release();
                                    res.status(500).json(err.message);
                                    console.log(err.message)
                                } else {
                                    connection_ikon_cms.release();
                                    res.send(results);
                                }
                          });
                       });
            }else{

            }
        }catch(err){


      }


      
};

// exports.addEditPack = function (req, res, next) {
//     try {
// 	        if (req.session && req.session.publish_UserName) {
// 	        	mysql.getConnection('CMS', function (err, connection_ikon_cms) {

//                     async.parallel({
//                         //Check Whether Offer Exists :
//                     PackExists : function(callback){
//                         connection_ikon_cms.query("SELECT pk_id as id FROM `icn_packs` WHERE lower(pk_name) = ?",[req.body.pack_name.toLowerCase()],function (err, result) {
//                             if(result.length > 0){
//                                 callback(err,true);
//                             }else{
//                                 callback(null);
//                             }
//                         });
//                     },
//                     MaxPackId: function (callback) {
//                             var query = connection_ikon_cms.query("SELECT MAX(pk_id) as id FROM `icn_packs`", function (err, result) {
//                                      v_pk_id = result[0].id != null ? parseInt(result[0].id + 1) : 1;
//                                      callback(err,v_pk_id);
//                                 });
//                         }
//                        },
//                          function (err, results) {
//                             //console.log(results.OperatorDetails)
//                                 if (results.PackExists) {
//                                     connection_ikon_cms.release();
//                                     res.send({"success" : false,"message" : "Pack Name must be unique."});
//                                 } else {
//                                             var data = {
//                                                 pk_id : results.MaxPackId,
//                                                 pk_name : req.body.pack_name,
//                                                 pk_desc : req.body.pack_desc,
//                                                 pk_cnt_display_opt : req.body.pack_type,
//                                                 pk_is_active : 1,
//                                                 pk_created_on: new Date(),
//                                                 pk_created_by: req.session.Plan_UserName,
//                                                 pk_modified_on: new Date(),
//                                                 pk_modified_by: req.session.Plan_UserName
//                                             }

//                                             var query = connection_ikon_cms.query("INSERT INTO `icn_packs` SET ? ",data, function (err, result) {
//                                                     if(err){
//                                                          connection_ikon_cms.release();
//                                                          res.status(500).json(err.message);
//                                                     }else{

//                                                                 var count = req.body.pack_content_type.length;
//                                                                 v_pack_content_types = req.body.pack_content_type;
//                                                                 var cnt = 0;
//                                                                 loop(0);
//                                                                 function loop(cnt) {
//                                                                     var i = cnt;
//                                                                     var query = connection_ikon_cms.query("SELECT MAX(pct_id) as pct_id FROM `icn_pack_content_type`", function (err, result) {
//                                                                         if(err){
//                                                                              connection_ikon_cms.release();
//                                                                              res.status(500).json(err.message);
//                                                                         }else{
//                                                                             //Get MAx pct id for Pack Content Type rows
//                                                                             v_pct_id = result[0].cmd_id != null ? parseInt(result[0].pct_id + 1) : 1;
//                                                                             var data = {
//                                                                                 pct_id : v_pct_id,
//                                                                                 pct_pk_id : results.MaxPackId,
//                                                                                 pct_cnt_type : v_pack_content_types[i],
//                                                                                 pct_is_active : 1
//                                                                             }
//                                                                             //Insert into multiselect
//                                                                             var query = connection_ikon_cms.query('INSERT INTO `icn_pack_content_type` SET ?', data, function (err, result) {
//                                                                                 if(err){
//                                                                                    connection_ikon_cms.release();
//                                                                                    res.status(500).json(err.message);
//                                                                                 }else{
//                                                                                     cnt = cnt + 1;
//                                                                                     if(cnt == count){
//                                                                                         connection_ikon_cms.release();
//                                                                                         res.send({"success" : true, "message":"Pack successfully added."});
//                                                                                     }else{
//                                                                                         loop(cnt);
//                                                                                     } //else
//                                                                                 }//else
//                                                                             }); //query insert into multiselect..
//                                                                         }
//                                                                     });
//                                                                 } //loop;

//                                                     } //here..
//                                                 });
                                          
//                                 }
//                           });
//                 });//conn.
                
// 	        }else{

// 	        }
// 		}catch(err){


// 	  }
// };