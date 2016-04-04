angular.module('EcomApp').controller('editProductCtrl', function ($state, $scope, DataFactory, $stateParams, azureBlob) {
    $scope.products = DataFactory.data().products;
    console.log($scope.products);
    $scope.product = _.findWhere($scope.products, { "Id": $stateParams.prodId });

    $scope.imageFile = {};

    $scope.editProduct = function () {
        var temp = "https://aawards.blob.core.windows.net/aastorage/" + $scope.imageFile.name;
        var imgFlag = false;
        if($scope.imageFile.name != undefined){
            $scope.product.Img = temp;
            imgFlag = true;
        }
        var editprodPromise = DataFactory.editProduct($scope.product);
        editprodPromise.then(function (data) {
            alert(data);
            if(imgFlag){
                var config = {
                    baseUrl: "https://aawards.blob.core.windows.net/aastorage/" + $scope.imageFile.name,
                    sasToken: "?sv=2014-02-14&sr=c&sig=2eRv7ZjdAk3Of7k7ildEXPzdUWxUd1jptSAs%2FLAfnOQ%3D&se=2016-04-04T19%3A52%3A15Z&sp=wl",
                    file: $scope.imageFile,
                    progress: function(){},
                    complete: function(){
                        $state.go('adminhome.products');
                    },
                    error: function(msg){
                        alert(msg);
                        $state.go('adminhome.products');
                    },
                    blockSize: $scope.imageFile.size
                };
                azureBlob.upload(config)
            }else{
                $state.go('adminhome.products');
            }
       
        }, function (err) {
            alert(err);
            $state.go('adminhome.products');
        });
    };
});


