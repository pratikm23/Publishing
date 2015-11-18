var Listpage = require('../controller/Listpage.controller');

module.exports = function (app) {
    app.route('/getListPageData')
        .post(Listpage.getListPageData);
    app.route('/getListPageDetailOnSearch')
        .post(Listpage.getListPageDetailOnSearch);
    app.route('/exportPageList')
        .post(Listpage.exportPageList);
}
