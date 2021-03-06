angular.module('depotCloudApp')

    .controller('navbarCtrl', ['$scope', 'authService', function ($scope, authService) {

        $scope.home = "";
        $scope.logged = false;

        // Watches to control if the user is authenticated
        $scope.$watch(function () {
            return authService.isAuthenticated();
        }, function () {
            $scope.logged = authService.isAuthenticated();
            $scope.home = $scope.logged ? "adminManagement" : "starter";
        });

        $scope.logout = function () {
            authService.logout();
        }
    }]);
