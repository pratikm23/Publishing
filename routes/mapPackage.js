/**
 * Created by darhamid on 17/11/15.
 */

var mapPackage = require('../controller/mapPackage.controller');

module.exports = function (app) {
    app.route('/getMappingData')
        .post( mapPackage.getMappingData );
    app.route('/addOrUpdateMapPortletData')
        .post( mapPackage.addOrUpdateMapPortletData );
    app.route('/getPackageInfo')
        .post( mapPackage.getPackageInfo );
}
