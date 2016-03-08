var page = require('../controller/page.controller.js');

module.exports = function (app) {
    app.route('/getPageData')
        .post(page.getPageData);
    app.route('/addPage')
        .post(page.addPage);
    app.route('/editPage')
        .post(page.editPage);
}
