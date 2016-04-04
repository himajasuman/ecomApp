angular.module('EcomApp').controller('adminLoginCtrl', function ($scope, $state, DataFactory, $rootScope, $cookies) {
    $scope.adm = {
        UserId: "",
        Password: ""
    };

    $scope.login = function () {
        var dataPromise = DataFactory.empLogin($scope.adm);
        dataPromise.then(function (res) {
            $cookies.put('user', JSON.parse(res));
            $state.go('adminhome.products');
            $rootScope.$broadcast('loginSuccess');
        }, function (err) {
            $scope.error = err;
        });
    };

});