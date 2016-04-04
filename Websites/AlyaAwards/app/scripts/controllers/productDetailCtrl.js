angular.module('EcomApp').controller('productDetailCtrl', function ($state, $scope, $stateParams, getProducts, cartService) {
    $scope.products = getProducts;
    console.log($scope.products);
    $scope.item = _.findWhere($scope.products, { "Id": $stateParams.prodId });
    $scope.prodToCart = {
        quantity : ""
    };
    $scope.addToCart = function () {
		var cart = cartService.get('cart');
    	if(cart.products){
            var itemExists = false;
            _.each(cart.products, function(p){
                if(p.Id == $scope.item.Id){
                    itemExists = true;
                    p.quantity = parseInt(p.quantity) + parseInt($scope.prodToCart.quantity);
                    // p.quantity = 0;
                }
            });
            if(!itemExists){
                cart.products.push(angular.extend($scope.prodToCart, angular.copy($scope.item)));
            }
    		//calculate shipping and total
    		cart.total += ($scope.item.Price * $scope.prodToCart.quantity);
            if(cart.totalNoOfItem != null || cart.totalNoOfItem != undefined){
                cart.totalNoOfItem = parseInt(cart.totalNoOfItem) + parseInt($scope.prodToCart.quantity);
            }else{
                cart.totalNoOfItem = parseInt($scope.prodToCart.quantity);
            }
            
    	}else{
    		cart = {
    			products : [angular.extend($scope.prodToCart, angular.copy($scope.item))],
    			total : $scope.item.Price * $scope.prodToCart.quantity,
                totalNoOfItem : $scope.prodToCart.quantity
    		};
    	}
        cart.tax = cart.total * 9/100;
    	cartService.set('cart', cart);
    	$state.go("customer.cart");
    }
});