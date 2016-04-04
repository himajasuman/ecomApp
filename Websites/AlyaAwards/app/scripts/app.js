(function () {
    'use strict';

    var app = angular.module('EcomApp', [
        // Angular modules 
        'ui.router',
        'ngCookies',
        'azureBlobUpload'
    ]);

    app
    .config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
                .otherwise('/login');

            /*admin routes*/
            $stateProvider
                .state('admin', {
                    abstract: true,
                    url: '/admin',
                    views: {
                        'header': {
                            templateUrl: ''
                        },
                        'footer': {
                            templateUrl: ''
                        }
                    }
                })
                .state('admin.login', {
                    url: '/login',
                    views: {
                        '@': {
                            templateUrl: 'app/views/admin/adminlogin.html',
                            controller: 'adminLoginCtrl'
                        }
                    }
                })
                .state('admin.signup', {
                    url: '/signup',
                    views: {
                        '@': {
                            templateUrl: 'app/views/admin/adminsignup.html',
                            controller: 'adminSignupCtrl'
                        }
                    }
                })
                .state('app', {
                    abstract: true,
                    url: '/app',
                    views: {
                        'header': {
                            templateUrl: 'app/views/header.html'
                        },
                        'footer': {
                            templateUrl: 'app/views/footer.html'
                        }
                    }
                })
                .state('adminhome', {
                    abstract: true,
                    url: '/adminhome',
                    views: {
                        'header': {
                            templateUrl: 'app/views/admin/header.html',
                            'controller': 'headerCtrl'
                        },
                        'footer': {
                            templateUrl: 'app/views/admin/footer.html'
                        }
                    }
                })
                .state('adminhome.products', {
                    url: '/products',
                    resolve: {
                        getProducts: function (DataFactory) {
                            return DataFactory.getAllProducts();
                        }
                    },
                    views: {
                        '@':{
                            templateUrl: 'app/views/admin/products.html',
                            controller: 'adminProductsCtrl'
                        }
                    }
                })
                .state('adminhome.newproduct', {
                    url: '/newproduct',
                    views: {
                        '@': {
                            templateUrl: 'app/views/admin/newproduct.html',
                            controller: 'addProductCtrl'
                        }
                    }
                })
                .state('adminhome.editproduct', {
                    url: '/editproduct/{prodId}',
                    views: {
                        '@': {
                            templateUrl: 'app/views/admin/editproduct.html',
                            controller: 'editProductCtrl'
                        }
                    }
                });
            /*customer routes*/
            $stateProvider
                .state('customer', {
                    abstract: true,
                    url: '/user',
                    views: {
                        'header': {
                            templateUrl: 'app/views/customer/header.html',
                            controller: 'headerCtrl'
                        },
                        'footer': {
                            templateUrl: 'app/views/customer/footer.html'
                        }
                    }
                })
                 .state('customer.cart', {
                    url: '/cart',
                    views: {
                        '@': {
                            templateUrl: 'app/views/customer/cart.html',
                            controller: 'cartCtrl'
                        }
                    }
                })
                .state('customer.checkout', {
                    url: '/checkout',
                    abstract: true,
                    views: {
                        '@': {
                            templateUrl: 'app/views/customer/checkout.html',
                            controller: 'checkoutCtrl'
                        }
                    }
                })
                .state('customer.checkout.shipping', {
                    url: '/shipping',
                    views: {
                        'orderContainer@customer.checkout': {
                            templateUrl: 'app/views/customer/shipping.html'
                        }
                    }
                })
                .state('customer.checkout.summary', {
                    url: '/summary',
                    views: {
                        'orderContainer@customer.checkout': {
                            templateUrl: 'app/views/customer/summary.html'
                        }
                    }
                })
                .state('customer.checkout.payment', {
                    url: '/payment',
                    views: {
                        'orderContainer@customer.checkout': {
                            templateUrl: 'app/views/customer/payment.html'
                        }
                    }
                })
                .state('customer.checkout.confirmation', {
                    url: '/confirmartion',
                    views: {
                        'orderContainer@customer.checkout': {
                            templateUrl: 'app/views/customer/confirmation.html'
                        }
                    }
                });
            /*product routes*/
            $stateProvider
                .state('home', {
                    abstract: true,
                    url: '/app',
                    views: {
                        'header': {
                            templateUrl: 'app/views/customer/header.html',
                            controller: 'headerCtrl'
                        },
                        'footer': {
                            templateUrl: 'app/views/customer/footer.html'
                        }
                    }
                })
                .state('home.products', {
                    url: '/products',
                    resolve: {
                        getProducts: function (DataFactory) {
                            return DataFactory.getAllProducts();
                        }
                    },
                    views: {
                        '@':{
                            templateUrl: 'app/views/customer/products.html',
                            controller: 'productsCtrl'
                        }
                    }
                })
                .state('home.productDetail', {
                    url: '/productDetail/{prodId}',
                    resolve: {
                        getProducts: function (DataFactory) {
                            return DataFactory.getAllProducts();
                        }
                    },
                    views: {
                        '@': {
                            templateUrl: 'app/views/customer/productDetail.html',
                            controller: 'productDetailCtrl'
                        }
                    }
                });
            /*common routes*/
            $stateProvider
                .state('login', {
                    url: '/login',
                    views: {
                        'header': {
                            templateUrl: 'app/views/customer/header.html',
                            controller: 'headerCtrl'
                        },
                        'footer': {
                            templateUrl: 'app/views/customer/footer.html'
                        },
                        '@': {
                            templateUrl: 'app/views/customer/login.html',
                            controller: 'loginCtrl'
                        }
                    }
                })
                .state('signup', {
                    url: '/signup',
                    views: {
                        'header': {
                            templateUrl: 'app/views/customer/header.html',
                            controller: 'headerCtrl'
                        },
                        'footer': {
                            templateUrl: 'app/views/customer/footer.html'
                        },
                        '@': {
                            templateUrl: 'app/views/customer/signup.html',
                            controller: 'signupCtrl'
                        }
                    }
                })
        }
    ])
    .run(function($rootScope, DataFactory, $state, $cookies) {
        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
            if( (toState.name.indexOf('customer') > -1 ) && $cookies.get('user') == undefined) {
                event.preventDefault();
                $state.go('login');
            }
            if( (toState.name.indexOf('customer.checkout') > -1 ) && toState.name != 'customer.checkout.shipping') {
                var temp = toState.name.split('.');
                if($rootScope.bc[temp[2]]){
                    event.preventDefault();
                    $state.go(fromState);
                }
            }
        });
    })
    .constant('SERVICE_URL', 'http://localhost:49292/');
})();


