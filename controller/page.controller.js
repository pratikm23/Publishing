var mysql = require('../config/db').pool;
var async = require("async");
var pageManager = require('../models/pageModel');


// service without multiselect ..
exports.getPortletContentByPageName = function(req,res,next ){
    try {
        // if (req.session && req.session.publish_UserName) {
        mysql.getConnection('CMS', function (err, connection_ikon_cms) {
            async.waterfall([
                function(callback){
                    pageManager.getPackageIdsByPageName(connection_ikon_cms, req.body.pageName,req.body.storeId, function(err,portletData){
                        if(err){
                            connection_ikon_cms.release();
                        }else{
                            var packageIds = [];
                            console.log( portletData );
                            console.log( "===============================");
                            async.each(portletData, function(portlet,callback){
                                if(portlet.packageId!= null)
                                packageIds.push(portlet.packageId);
                                callback();
                            },function(err){
                                if(err){

                                }

                            });
                            callback(null,portletData,packageIds);

                        }
                    });
                    // callback()
                },
                function(portletData,packageIds,callback){
                    console.log('inside another function');
                    pageManager.getPortletContentByPackageId(connection_ikon_cms,packageIds,function(err,response){
                        callback(err,{'publishData':portletData,'portletData':response});
                    })
                }
            ],function(err,results){
                // console.log('results');
                // console.log(results);

                connection_ikon_cms.release();
                res.send(results);
            })

        });
        // }
    }catch(err){
        res.send(err);
    }
}

exports.getPageData = function (req, res, next) {
    //console.log('in function...');
    try {
            if (req.session && req.session.publish_UserName) {
                mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                    async.parallel({
	                        DistributionChannel: function (callback) {
                               pageManager.getAllDistributionChannelsByStoreId(connection_ikon_cms, req.session.publish_StoreId, function(err,DistributionChannel){
                                    callback(err,DistributionChannel);
                               });
                            },
                            PageTypes: function (callback) {
                               pageManager.getPageTypes(connection_ikon_cms, function(err,PageTypes){
                                    callback(err,PageTypes);
                               });
                            },
                            PageDetails: function (callback) {
                                if(req.body.state == 'edit-page' && req.body.pageId != undefined){
                                    pageManager.getPageDetails(connection_ikon_cms,req.body.pageId, function(err,PageDetails){
                                        callback(err,PageDetails);
                                   });   
                                }else{
                                    callback(null);
                                }
                            },
                            PortletDetails: function (callback) {
                                if(req.body.state == 'edit-page' && req.body.pageId != undefined){
    	                           pageManager.getPagePortlets(connection_ikon_cms,req.body.pageId, function(err,PortletDetails){
    	                           		callback(err,PortletDetails);
    	                           });
                                }else{
                                    callback(null);
                                }
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

exports.addPage = function (req, res, next) {
    //console.log('add page');
    try {
        //console.log('in add page');
        if (req.session && req.session.publish_UserName) {
          mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    //Check Whether Offer Exists :
                    PageExists : function(callback){
                        pageManager.getPageByFileName(connection_ikon_cms,req.body.page_filename.toLowerCase(),function(err,response){
                            callback(err,response);
                        });    
                    },
                    HomePageExists : function(callback){
                        pageManager.getHomePage(connection_ikon_cms,req.body.page_type,req.body.distribution_channel,function(err,response){
                            callback(err,response);
                        });    
                    },
                    MaxPageId: function (callback) {
                            pageManager.getLastInsertedPageId(connection_ikon_cms,function(err,MaxPageId){
                                callback(err,MaxPageId);
                            }); 
                        }
                    },function (err, results) {
                        if (results.PageExists) {
                            connection_ikon_cms.release();
                            res.send({"success" : false,"status":101,"message" : "Page File Name must be unique"});
                        }else if(results.HomePageExists){
                            connection_ikon_cms.release();
                            res.send({"success" : false,"status":101,"message" : "Home page already created for selected distribution channel"});
                        } else {
                            var data = {
                                pp_id : results.MaxPageId[0].maxId,
                                pp_sp_st_id : req.session.publish_StoreId,
                                pp_dc_id : req.body.distribution_channel,
                                pp_page_title : req.body.page_title,
                                pp_page_file : req.body.page_filename,
                                pp_page_type_id : req.body.page_type,
                                pp_is_active : 1,
                                pp_created_on: new Date(),
                                pp_created_by: req.session.publish_UserName,
                                pp_modified_on: new Date(),
                                pp_modified_by: req.session.publish_UserName
                            }
                            //console.log(data);
                            //console.log('portlets array');
                            //console.log(req.body.portlets);
                            var result = saveIconPage(connection_ikon_cms,data);
                            if( result == true ){
                                //Fetching object length as .length of just object gives undefined, hence using Object.keys
                                var count = Object.keys(req.body.portlets).length;
                                //console.log(count)
                                if(count == 0){
                                    connection_ikon_cms.release();
                                    res.send({"success" : true,"status":200, "message": req.body.page_filename+" page added successfully"});
                                }else{
                                    var cnt = 0;
                                    loop(0);
                                    function loop( cnt ) {
                                        var i = cnt;
                                        //console.log(i)
                                        pageManager.getLastInsertedPortletId( connection_ikon_cms, function(err, response ) {
                                                if(err){
                                                    connection_ikon_cms.release();   
                                                }else{
                                                   // console.log("=======================");
                                                    //console.log(req.body.portlets[i]);
                                                    if(req.body.portlets[i] != undefined){
                                                        var portletData = {
                                                            ppp_id : response[0].maxPortletId,
                                                            ppp_pp_id : results.MaxPageId[0].maxId,
                                                            ppp_type : req.body.portlets[i].portletType,
                                                            ppp_pkg_allow : req.body.portlets[i].packageCount == undefined || req.body.portlets[i].packageCount == undefined ? 0 : req.body.portlets[i].packageCount,
                                                            ppp_comments : req.body.portlets[i].comment,
                                                            ppp_is_active : 1,
                                                            ppp_created_on: new Date(),
                                                            ppp_created_by: req.session.publish_UserName,
                                                            ppp_modified_on: new Date(),
                                                            ppp_modified_by: req.session.publish_UserName
                                                        }
                                                        portletResponse = savePortlet( connection_ikon_cms,portletData );
                                                        if(portletResponse == true){

                                                            if(cnt == count){
                                                                connection_ikon_cms.release();
                                                                res.send({"success" : true,"status":200, "message": req.body.page_filename + " page added successfully"});
                                                            }else{
                                                                cnt = cnt + 1;
                                                                loop(cnt);
                                                            }
                                                        }
                                                    }else{

                                                        if(cnt == count){
                                                            connection_ikon_cms.release();
                                                            res.send({"success" : true,"status":200, "message":req.body.page_filename+" page added successfully"});
                                                        }else{
                                                            cnt = cnt + 1;
                                                            loop(cnt);
                                                        }
                                                        //connection_ikon_cms.release();
                                                        //res.send({"success" : true,"status":200, "message":"Page successfully added."});
                                                    }
                                                   //if
                                                } //if
                                            }); //getLastInsertedPortletId
                                    }//loop
                              }
                          }//if result
                        }
                    } 
                );               
            });//conn.
        }else{
            res.redirect('/accountlogin');
        }
  } catch(err){
         res.status(500).json(err.message);
  }
}; //addPage


exports.editPage = function (req, res, next) {
    //console.log('edit page');
    try {
        if (req.session && req.session.publish_UserName) {
          mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    PageExists : function(callback){
                        pageManager.getPageByFileNameForUpdate(connection_ikon_cms,req.body.page_filename.toLowerCase(),req.body.page_id,function(err,response){
                            callback(err,response);
                        });    
                    },
                    HomePageExists : function(callback){
                        pageManager.getHomePageForUpdate(connection_ikon_cms,req.body.page_type,req.body.distribution_channel,req.body.page_id,function(err,response){
                            callback(err,response);
                        });    
                    },
                    DeleteExistingPage : function(callback){
                        pageManager.deleteExistingPage(connection_ikon_cms,req.body.page_id,function(err,response){
                            callback(err,response);
                        });    
                    },
                    SelectExistingPortlets : function(callback){
                        pageManager.selectExistingPortlets(connection_ikon_cms,req.body.page_id,function(err,response){
                            callback(err,response);
                        });    
                    },
                    DeleteExistingPortlets : function(callback){
                        pageManager.deleteExistingPortlets(connection_ikon_cms,req.body.page_id,function(err,response){
                            callback(err,response);
                        });    
                    }
                    },function (err, results) {
                        if (results.PageExists) {
                            connection_ikon_cms.release();
                            res.send({"success" : false,"status":101,"message" : "Page File Name must be unique"});
                        }
                        else if(results.HomePageExists){
                            connection_ikon_cms.release();
                            res.send({"success" : false,"status":101,"message" : "Home page already created for selected distribution channel"});
                        }
                         else {

                            var data = {
                                pp_id : req.body.page_id,
                                pp_sp_st_id : req.session.publish_StoreId,
                                pp_dc_id : req.body.distribution_channel,
                                pp_page_title : req.body.page_title,
                                pp_page_file : req.body.page_filename,
                                pp_page_type_id : req.body.page_type,
                                pp_is_active : 1,
                                pp_created_on: new Date(),
                                pp_created_by: req.session.publish_UserName,
                                pp_modified_on: new Date(),
                                pp_modified_by: req.session.publish_UserName
                            }
                            //console.log(data);
                            //console.log('portlets array');
                            //console.log(req.body.portlets);
                            var result = saveIconPage(connection_ikon_cms,data);
                            if( result == true ){
                                //Fetching object length as .length of just object gives undefined, hence using Object.keys
                                var count = Object.keys(req.body.portlets).length;
                                //console.log('existingPortlets');
                                //console.log(req.body.portletIds);
                                //console.log('new portlets');
                                //console.log(req.body.portlets);

                                if(count == 0){
                                    connection_ikon_cms.release();
                                    res.send({"success" : true,"status":200, "message":"Page updated successfully"});
                                }else{
                                    var cnt = 0;
                                    loop(0);
                                    function loop( cnt ) {
                                        var i = cnt;
                                        //console.log('i:::'+i);
                                        //console.log('jijijijiijijijijij');
                                        //console.log(req.body.portlets);
                                        //console.log(req.body.portlets[i] != undefined && req.body.portlets[i].portletId != undefined);
                                       //If portlet id is found : 
                                       if(req.body.portlets[i] != undefined && req.body.portlets[i].portletId != undefined && req.body.portlets[i].isUpdate != 1){
                                       // console.log('portlet id is not undefined');
                                            var portletData = {
                                                            ppp_id : req.body.portlets[i].portletId,
                                                            ppp_pp_id : req.body.page_id,
                                                            ppp_type : req.body.portlets[i].portletType,
                                                            ppp_pkg_allow : req.body.portlets[i].packageCount == undefined || req.body.portlets[i].packageCount == undefined ? 0 : req.body.portlets[i].packageCount,
                                                            ppp_comments : req.body.portlets[i].comment,
                                                            ppp_is_active : 1,
                                                            ppp_created_on: new Date(),
                                                            ppp_created_by: req.session.publish_UserName,
                                                            ppp_modified_on: new Date(),
                                                            ppp_modified_by: req.session.publish_UserName
                                                        }
                                                        //console.log('portletData');
                                                        //console.log(portletData);
                                                        portletResponse = savePortlet( connection_ikon_cms,portletData );
                                                        if(portletResponse == true){
                                                            cnt = cnt + 1;
                                                            if(cnt == count){
                                                                connection_ikon_cms.release();
                                                                res.send({"success" : true,"status":200, "message":"Page updated successfully"});
                                                            }else{
                                                                loop(cnt);
                                                            }
                                                        }//if
                                        }else if(req.body.portlets[i] != undefined && req.body.portlets[i].portletId == undefined && req.body.portlets[i].isUpdate != 1){
                                            //If portlet id is undefined 
                                            //console.log('portlet id is undefined');
                                            pageManager.getLastInsertedPortletId( connection_ikon_cms, function(err, response ) {
                                                if(err){
                                                    connection_ikon_cms.release();   
                                                }else{
                                                        var portletData = {
                                                                        ppp_id : response[0].maxPortletId,
                                                                        ppp_pp_id : req.body.page_id,
                                                                        ppp_type : req.body.portlets[i].portletType,
                                                                        ppp_pkg_allow : req.body.portlets[i].packageCount == undefined || req.body.portlets[i].packageCount == undefined ? 0 : req.body.portlets[i].packageCount,
                                                                        ppp_comments : req.body.portlets[i].comment,
                                                                        ppp_is_active : 1,
                                                                        ppp_created_on: new Date(),
                                                                        ppp_created_by: req.session.publish_UserName,
                                                                        ppp_modified_on: new Date(),
                                                                        ppp_modified_by: req.session.publish_UserName
                                                                    }
                                                                    //console.log('portletData');
                                                                    //console.log(portletData);
                                                                    portletResponse = savePortlet( connection_ikon_cms,portletData );
                                                                    if(portletResponse == true){
                                                                        cnt = cnt + 1;
                                                                        if(cnt == count){
                                                                            connection_ikon_cms.release();
                                                                            res.send({"success" : true,"status":200, "message":"Page updated successfully"});
                                                                        }else{
                                                                            loop(cnt);
                                                                        }
                                                                    }
                                                    }
                                                });
                                        }else{
                                            //just increment :
                                            //console.log('just increment..');
                                            //console.log(req.body.portlets[i]);
                                            // console.log(req.body.portlets[i].portletId != undefined);
                                            
                                            cnt = cnt + 1;
                                            if(cnt == count){
                                                //console.log('count is  EQUALLL count');
                                                connection_ikon_cms.release();
                                                res.send({"success" : true,"status":200, "message":"Page updated successfully"});
                                            }else{

                                                loop(cnt);
                                            }
                                        }
                                    }//loop
                              }
                          }//if result
                        }
                    } 
                );               
            });//conn.
        }else{
            res.redirect('/accountlogin');
        }
  } catch(err){
         res.status(500).json(err.message);
  }
}; //editPage

function saveIconPage( connection_ikon_cms, data ){
    pageManager.savePage( connection_ikon_cms, data, function(err,response ){
        if(err){
             connection_ikon_cms.release();
             res.status(500).json(err.message);
             return false;
         }
    });
    return true;
}

function savePortlet( connection_ikon_cms, data ){
    pageManager.savePortlet( connection_ikon_cms, data, function(err,response ){
        if(err){
             connection_ikon_cms.release();
             res.status(500).json(err.message);
             return false;
         }
    });
    return true;
}
