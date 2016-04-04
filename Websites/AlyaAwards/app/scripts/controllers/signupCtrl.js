angular.module('EcomApp').controller('signupCtrl', function ($scope, $state, DataFactory) {
    $scope.customer = {
        UserId: "",
        Password: "",
        FirstName: "",
        LastName: "",
        PhoneNumber: ""
    };

    $scope.SignUp = function () {
        var dataPromise = DataFactory.custSignup($scope.customer);
        dataPromise.then(function (res) {
            $state.transitionTo('login');
        }, function (err) {
            $scope.error = err;
        });
    };

});