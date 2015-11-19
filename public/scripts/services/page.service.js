myApp.service('Page', ['$http', function ($http) {

    this.baseRestUrl = "";


    this.getPageData = function(data,success){
        $http.post(this.baseRestUrl + '/getPageData',data).success(function (items) {
            success(items);
        });
    }

    this.addPage = function (data,success, error) {
        $http.post(this.baseRestUrl + '/addPage',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    this.editPage = function (data,success, error) {
        $http.post(this.baseRestUrl + '/editPage',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
}]);