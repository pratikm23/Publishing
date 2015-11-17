myApp.controller('addPageCtrl', function ($scope, $http, $stateParams,$state, ngProgress, Page) {
	$('.removeActiveClass').removeClass('active');
    $('#add-page').addClass('active');

    $scope.PageTitle = 'Register';
	$scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    
    $scope.portlets = [{}];

    $scope.addPortlet = function(){
        var portlet = {};
        $scope.portlets.push(portlet);
  };

    $scope.PortletTypes = [
        {cd_id : 0,cd_name:'Normal'},
        {cd_id : 1, cd_name: 'Banner'}
    ]

    Page.getPageData(function(data){
        $scope.distributionChannels = data.DistributionChannel;
    });

});