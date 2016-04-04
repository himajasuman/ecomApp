angular.module('EcomApp').controller('checkoutCtrl', function ($state, $scope, $rootScope,DataFactory, $cookies, cartService) {
    
    $scope.bc = {
        shipping: false,
        summary: true,
        payment: true,
        confirmation: true
    };
    $scope.shippingOption ={ value :  7.97};
    $scope.order = {
        orderTotal: "",
        date: "",
        no_of_items: "",
        user: JSON.parse($cookies.get('user')).UserId,
        shipCharges: "",
        cardNumber: "",
        taxes: "",
        address:{
            FullName: "",
            Address_Line_1: "",
            Address_Line_2: "",
            City: "",
            State: "",
            Country: "",
            Zip: "",
            PhoneNumber: ""
        },
        addressId: "",
        items: []
    };

    //payment
    $scope.paymentInfo = {
        Name: "",
        cardNumber: "",
        ExpDate: "",
        cvv: ""
    };

    $rootScope.bc = $scope.bc;

    $scope.cart = cartService.get('cart');
    //Add values to order config
    $scope.order.items = angular.copy($scope.cart.products);
    $scope.order.no_of_items = angular.copy($scope.cart.totalNoOfItem);
    $scope.order.taxes = $scope.cart.tax;
    var cDate = new Date();
    $scope.order.date = cDate.getFullYear() + '-' + (cDate.getMonth() + 1) + '-' + (cDate.getDate());
   

    //delivery dat
    var deliverDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);
    var day = deliverDate.getDate();
    var month = deliverDate.getMonth() + 1;
    var year = deliverDate.getFullYear();
    $scope.order.deliveryDate = day + "/" + month + "/" + year; 

    $scope.conitnue = function(state) {
        $scope.bc[state] = false;
        if (state == "summary") {
            $scope.order.shipCharges = parseFloat($scope.shippingOption.value);
            $scope.order.orderTotal = parseFloat($scope.cart.total) + parseFloat($scope.order.shipCharges) + parseFloat($scope.cart.tax);
        }
    	$state.go("customer.checkout."+state);
    };

    $scope.toHome = function(){
        $state.transitionTo("home.products");
    };

    $scope.pay = function () {
        //validate the card
        //payment
        //order config to send the data via api
        $scope.cardLastNumbers = "XXXX XXXX XXXX " + $scope.paymentInfo.cardNumber.slice($scope.paymentInfo.cardNumber.length - 4, $scope.paymentInfo.cardNumber.length);
        $scope.order.shipCharges = parseFloat($scope.shippingOption.value);
        $scope.order.orderTotal = parseFloat($scope.cart.total) + parseFloat($scope.order.shipCharges) + parseFloat($scope.cart.tax);
        $scope.order.cardNumber = $scope.paymentInfo.cardNumber;
        console.log($scope.order);
        var dataPromise = DataFactory.placeOrder($scope.order);
        dataPromise.then(function (res) {
            cartService.set('cart', undefined);
            $scope.orderNo = res;
            $scope.bc.confirmation = false;
            $state.go("customer.checkout.confirmation");
            $rootScope.$broadcast('loginSuccess');
        }, function (err) {
            alert(err);
        });
    };
});