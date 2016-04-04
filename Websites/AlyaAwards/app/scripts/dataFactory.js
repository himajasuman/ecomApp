'use strict';

angular
    .module('EcomApp')
    .factory('DataFactory', function ($http, $q, SERVICE_URL) {
        var deferred, resolvedData = {};

        var getAllProducts = function () {
            deferred = $q.defer();
            $http({
                method: 'get',
                'Content-Type': 'application/json',
                url: SERVICE_URL + 'products/all'
            }).then(function (response) {
                deferred.resolve(JSON.parse(response.data));
                resolvedData.products = JSON.parse(response.data);
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        var getProductDetail = function (prodId) {
            deferred = $q.defer();
            $http({
                method: 'get',
                'Content-Type': 'application/json',
                data: prodId,
                url: SERVICE_URL + 'products/all'
            }).then(function (response) {
                deferred.resolve(JSON.parse(response.data));
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        //Start: Admin api calls
        var addNewProduct = function (newprod) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: newprod,
                url: SERVICE_URL + 'products/add'
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        var editProduct = function (prod) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: prod,
                url: SERVICE_URL + 'products/update'
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        var deleteProduct = function (prodId) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: {prodId: prodId},
                url: SERVICE_URL + 'products/delete'
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        //End: Admin api calls
        //Start: Login and sign up
        var empLogin = function (admLogin) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: admLogin,
                url: SERVICE_URL + 'Admin/Login'
            }).then(function (response) {
                deferred.resolve(response.data);
                resolvedData.user = JSON.parse(response.data);
                resolvedData.user.admin = true;
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        var custLogin = function (cust) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: cust,
                url: SERVICE_URL + 'Customer/Login'
            }).then(function (response) {
                deferred.resolve(response.data);
                if (response.data != "User not found!") {
                    resolvedData.user = JSON.parse(response.data);
                    resolvedData.user.admin = false;
                }
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        var empSignup = function (adm) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: adm,
                url: SERVICE_URL + 'Admin/Signup'
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        var custSignup = function (cust) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: cust,
                url: SERVICE_URL + 'Customer/Signup'
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        //End: Login and sign up
        //Start: Orders
        var placeOrder = function (order) {
            deferred = $q.defer();
            $http({
                method: 'post',
                'Content-Type': 'application/json',
                data: order,
                url: SERVICE_URL + 'order/add'
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response.status);
            });
            return deferred.promise;
        };
        //End: Orders
        return {
            getAllProducts: getAllProducts,
            empLogin: empLogin,
            addNewProduct: addNewProduct,
            editProduct: editProduct,
            empSignup: empSignup,
            getProductDetail: getProductDetail,
            custLogin: custLogin,
            custSignup: custSignup,
            deleteProduct: deleteProduct,
            placeOrder: placeOrder,
            data: function () {
                return resolvedData;
            }
        }
    });
