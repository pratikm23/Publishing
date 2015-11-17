var page = require('../controller/page.controller');

module.exports = function (app) {
    app.route('/getPageData')
        .get(page.getPageData);
}
