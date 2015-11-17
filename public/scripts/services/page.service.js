/**
 * Created by sujata.patne on 08-10-2015.
 */
myApp.service('Page', ['$http', function ($http) {

    this.baseRestUrl = "";

    this.getPageData = function(success){
        $http.get(this.baseRestUrl + '/getPageData').success(function (items) {
            
            success(items);
        });
    }
}]);