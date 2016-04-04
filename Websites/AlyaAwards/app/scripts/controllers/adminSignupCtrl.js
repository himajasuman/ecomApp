angular.module('EcomApp').controller('adminSignupCtrl', function ($scope, $state, DataFactory) {
    $scope.adm = {
        UserId: "",
        Password: "",
        FirstName: "",
        LastName: "",
        PhoneNumber: ""
    };

    $scope.admSignUp = function () {
        var dataPromise = DataFactory.empSignup($scope.adm);
        dataPromise.then(function (res) {
            $state.go('admin.login');
        }, function (err) {
            $scope.error = err;
        });
    };
   
});