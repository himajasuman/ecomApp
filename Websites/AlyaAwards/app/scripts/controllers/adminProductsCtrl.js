angular.module('EcomApp').controller('adminProductsCtrl', function ($state, getProducts, $scope, DataFactory) {
    $scope.products = getProducts;
    console.log($scope.products);

    $scope.addItem = function () {
        $state.go('adminhome.newproduct');
    };

    $scope.editItem = function (pId) {
        $state.transitionTo('adminhome.editproduct', { "prodId": pId });
    };

    $scope.delItem = function (pId) {
        var newprodPromise = DataFactory.deleteProduct(pId);
        newprodPromise.then(function (data) {
            $scope.products = DataFactory.data().products;
            var prodsPromise = DataFactory.getAllProducts();
            prodsPromise.then(function (prods) {
                $scope.products = prods;
                alert(data);
            }, function (err) {
                alert(err);
            });
        }, function (err) {
            alert(err);
        });
    };
});