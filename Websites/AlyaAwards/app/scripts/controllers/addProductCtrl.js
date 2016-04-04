angular.module('EcomApp').controller('addProductCtrl', function ($state, $scope, DataFactory, azureBlob) {
    $scope.product = {
        Name: '',
        Category: '',
        Price: '',
        Img: '',
        Description: '',
        Stock : ''
    };
    $scope.imageFile = {};

    $scope.addProduct = function () {
        $scope.product.Img = "https://aawards.blob.core.windows.net/aastorage/" + $scope.imageFile.name;
        var newprodPromise = DataFactory.addNewProduct($scope.product);
        newprodPromise.then(function (data) {
            alert(data);
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
        }, function (err) {
            alert(err);
            $state.go('adminhome.products');
        });
    };
});


