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
