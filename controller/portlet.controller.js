/**
 * Created by sujata.patne on 27-11-2015.
 */
var mysql = require('../config/db').pool;
var portletManager = require('../models/portletModel');
exports.getListPageData = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.series({
                    getPortletDetails : function( callback ){
                        portletManager.getPortletDetails( connection_ikon_cms, updateData, function( err, DeleteMappingPackage ) {
                            callback( err, DeleteMappingPackage );
                        });
                    },
                    getPackageDetails : function( callback ){
                        portletManager.getPackageDetails( connection_ikon_cms, updateData, function( err, DeleteMappingPackage ) {
                            callback( err, DeleteMappingPackage );
                        });
                    }
                }, function( err, result ){
                    if (err) {
                        console.log( err );
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    } else {
                        console.log( result );
                    }
                });
            });
        }else{

        }
    }catch(err){


    }
};