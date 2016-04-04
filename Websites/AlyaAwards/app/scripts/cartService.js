'use strict';

angular
    .module('EcomApp')
    .service('cartService', ['$window', function ($window) {
		return {
		  get: function (key) {
		    if ($window.localStorage [key]) {
		      var cart = angular.fromJson($window.localStorage [key]);
		      return cart;
		    }
		    return false;
		  },
		  set: function (key, val) {
		    if (val === undefined) {
		      $window.localStorage .removeItem(key);
		    } else {
		       $window.localStorage [key] = angular.toJson(val);
		    }
		    return $window.localStorage [key];
		    }
		  }
	}]);