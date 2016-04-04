angular.module('EcomApp').controller('loginCtrl', function ($scope, $state, DataFactory, $rootScope, $cookies) {
    $scope.user = {
        UserId: "",
        Password: ""
    };

    $scope.login = function () {
        var dataPromise = DataFactory.custLogin($scope.user);
        dataPromise.then(function (res) {
            if (res != "User not found!") {
                $cookies.put('user', res);
                $state.transitionTo('home.products');
                $rootScope.$broadcast('loginSuccess');
            } else {
                alert(res);
            }
        }, function (err) {
            $scope.error = err;
        });
    };

});