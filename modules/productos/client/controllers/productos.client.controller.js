(function () {
  'use strict';

  // Productos controller
  angular
    .module('productos')
    .controller('ProductosController', ProductosController);

  ProductosController.$inject = ['$scope', 'Upload','$timeout', '$location', '$state', 'Authentication', 'productoResolve'];


  function ProductosController ($scope, Upload, $timeout, $location, $state, Authentication, producto) {
    var vm = this;

    vm.authentication = Authentication;
    vm.producto = producto;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.images = [];
    $scope.paths = [];
    $scope.checkIMG = false;
    $scope.basePath = 'modules/productos/client/img/';
    //vm.formData = new FormData();

    // Remove existing Producto
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.producto.$remove($state.go('productos.list'));
      }
    }


    $scope.uploadFiles = function (files, errFiles) {
      $scope.errFiles = errFiles;
      $scope.checkIMG =
      vm.images = [];
      $scope.paths = [];
      var aux = vm.producto.images;
      if (files && files.length) {
        //console.log("size:" + files.length);

        //var dvPreview = document.getElementById("dvPreview");
        //dvPreview.innerHTML = "";
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;


        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var filename = file.name;
          var path = $scope.basePath.concat(filename);
          $scope.paths.push(path);
          vm.images.push(file);

          vm.producto.images = $scope.paths;
          //vm.producto.images = $scope.paths;

          //if (regex.test(file.name.toLowerCase())) {

          //if (vm.producto._id == null) {
          var reader = new FileReader();
          var dvPreview = document.getElementById('dvPreview');

          reader = $scope.setImage(reader, dvPreview);
            /*reader.onload = function (e) {
              var img = document.createElement("IMG");
              img.height = "200";
              img.width = "200";
              img.src = e.target.result;
              dvPreview.appendChild(img);
            };*/
          reader.readAsDataURL(file);
          //
        //}
          /*} else {
            alert(file.name + " is not a valid image file.");
              dvPreview.innerHTML = "";
              return false;
          }*/
        }
      }
    };

    $scope.setImage = function (reader, dvPreview) {
      dvPreview.innerHTML = '';
      reader.onload = function (e) {
        var img = document.createElement('IMG');
        img.height = '200';
        img.width = '200';
        img.src = e.target.result;
        dvPreview.appendChild(img);
        return reader;
      };
      return reader;
    };

    // Save Producto
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productoForm');
        return false;
      }

      // TODO: move create/update logic to service
      //var method = vm.producto._id ? 'PUT' : 'POST';
      //var url = vm.producto._id ? 'api/productos/' + vm.producto._id : 'api/productos/';
      //vm.producto.images = $scope.paths;
      //console.log(method);
      //console.log(url);
      Upload.upload({
        url: '/uploads/img',
        //url: url,
        method: 'POST',
        //method: method,
        headers: { 'Content-Type': 'image/jpeg' }, // only for html5
          //data: vm.producto, // Any data needed to be submitted along with the files
        file: vm.images
      }).then(function (response) {
        $timeout(function () {
          $scope.result = response.data;
          /*$state.go('productos.view', {
            productoId: $scope.result._id
          });*/
        });
      }, function (response) {
        if (response.status > 0) {
          $scope.errorMsg = response.status + ': ' + response.data;
        }
      }, function (evt) {
        $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      //original save method
      if (vm.producto._id) {
        vm.producto.$update(successCallback, errorCallback);
      } else {
        vm.producto.$save(successCallback, errorCallback);  
      }

      function successCallback(res) {
        $state.go('productos.view', {
          productoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    

  }
})();
