angular.module('EcomApp').controller('productsCtrl', function ($state, getProducts, $scope) {
    $scope.products = getProducts;
    console.log($scope.products);
});