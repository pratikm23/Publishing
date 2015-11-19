/**
 * Created by sujata.patne on 7/6/2015.
 */
var myApp = angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngProgress']);

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

myApp.config(function ($stateProvider) {
    $stateProvider
        .state("add-page", {
            templateUrl: "partials/add-page.html",
            controller: "addPageCtrl",
            url: "/add-page"
        })

        .state("page-listing", {
            templateUrl: "partials/PageListing.html",
            controller: "PageListingCtrl",
            url: "/page-listing"
        })
        .state("edit-page", {
            templateUrl: "partials/add-page.html",
            controller: "addPageCtrl",
            url: "/edit-page/:pageId"

        })
        .state('users', {
            templateUrl: 'partials/add-edit-users.html',
            controller: 'usersCtrl',
            url: '/users'
        })
        .state('accountforgot', {
            templateUrl: 'partials/account-changepassword.html',
            controller: '',
            url: '/accountforgot'
        })
        .state("changepassword", {
            templateUrl: 'partials/account-changepassword.html',
            controller: 'usersCtrl',
            url: '/changepassword'
        })
})
    .run(function ($state) {
        $state.go("add-page");
    })