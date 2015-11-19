/**
 * Created by sujata.patne on 7/6/2015.
 */
var myApp = angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngProgress']);

myApp.config(function ($stateProvider) {
    $stateProvider
        .state("add-page", {
            templateUrl: "partials/add-page.html",
            controller: "addPageCtrl",
            url: "/add-page"
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
        .state("map-package", {
            templateUrl: "partials/map-package.html",
            controller: "mapPackageCtrl",
            url: "/map-package/:pageId"
        })
})
.run(function ($state) {
    $state.go("add-page");
})