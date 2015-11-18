myApp.service('ListPage', ['$http', function ($http) {

    this.baseRestUrl = "";

    this.getListPageData = function(success){
        $http.post(this.baseRestUrl + '/getListPageData').success(function (items) {
            success(items);
        });
    }
    this.getListPageDetailOnSearch = function ( data ,success, error ) {
        $http.post(this.baseRestUrl + '/getListPageDetailOnSearch',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    this.exportPageList = function (data, success) {
        $http({ method: "POST", url: this.baseRestUrl + '/exportPageList', data: data, headers: { 'Content-type': 'application/json' }, responseType: 'arraybuffer' }).success(function (items) {
            success(items);
        });
    }
}]);