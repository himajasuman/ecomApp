angular.module('EcomApp').controller('headerCtrl', function ($scope, $state, DataFactory, $rootScope, cartService, $cookies) {
    $scope.user = $cookies.get('user');
    var getCartItem = function(){
        if(cartService.get('cart').totalNoOfItem != undefined){
            $scope.no_of_items = cartService.get('cart').totalNoOfItem;
        }
    };

    if($scope.user == undefined){
    	$scope.headerStyle = "logged-out";
    	$scope.no_of_items = "";
    }else{
    	$scope.headerStyle = "logged-in";
        getCartItem();
    }

    $rootScope.$on('cartChanged', function(){
        getCartItem();
    });

    $rootScope.$on('loginSuccess', function(){
    	$scope.user = DataFactory.data().user;
    	$scope.headerStyle = "logged-in";
    });

    $scope.signOut = function(){
        var flag = false;
        if(DataFactory.data().user.admin){
            flag = true;
        }
    	DataFactory.data().user = undefined;
    	$scope.user = undefined;
        $cookies.put('user', undefined);
        cartService.set('order', undefined);
    	$scope.headerStyle = "logged-out";
        if(flag){
            $state.transitionTo("admin.login");
        }else{
            $state.transitionTo("home.products");
        }
    };
});