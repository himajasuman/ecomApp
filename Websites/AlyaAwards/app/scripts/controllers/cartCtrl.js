angular.module('EcomApp').controller('cartCtrl', function ($state, $scope, $stateParams, DataFactory, cartService, $rootScope) {
    $scope.products = DataFactory.data().products;
    console.log($scope.products);
    $scope.item = _.findWhere($scope.products, { "Id": $stateParams.prodId });

    $scope.cart = cartService.get('cart');

    $scope.checkout = function() {
        	$state.go("customer.checkout");
    };

    $scope.$watchCollection("cart.products",
        function( newValue, oldValue ) {
            if(newValue != oldValue){
                $rootScope.$broadcast('cartChanged');
            }
        });

    $scope.deleteItemCart = function(itmIndex){
        var tempItem = $scope.cart.products[itmIndex];
        $scope.cart.totalNoOfItem = parseInt($scope.cart.totalNoOfItem) - parseInt(tempItem.quantity);
        $scope.cart.total -= (tempItem.Price * tempItem.quantity);
    	$scope.cart.products = $scope.cart.products.splice(itmIndex+1, 1);
    	$scope.cart.tax = $scope.cart.total * 9/100;
        cartService.set('cart', $scope.cart);
        $rootScope.$broadcast('cartChanged');
    }

    $scope.checkout = function () {
    	$state.go('customer.checkout.shipping');    	
    }

    $scope.updateItem = function(itmIndex){
        var tempItem = $scope.cart.products[itmIndex];
        var temTotalItems = 0, total = 0;
        _.each($scope.cart.products, function(p){
            temTotalItems += parseInt(p.quantity);
            total += (parseInt(p.Price) * parseInt(p.quantity));
        });
        $scope.cart.totalNoOfItem = temTotalItems;
        $scope.cart.total = total;
        $scope.cart.tax = $scope.cart.total * 9/100;
        cartService.set('cart', $scope.cart);
        $rootScope.$broadcast('cartChanged');
    }
});

angular.module('EcomApp').directive('ctProd', function() {
  return {
    restrict: 'A',
    scope: {
        prodQuant: '='
    },
    link: function(scope, element, attrs, controllers) {
      console.log(attrs.ctProd);
    }
  };
});