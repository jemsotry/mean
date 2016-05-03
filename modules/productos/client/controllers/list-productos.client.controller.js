(function () {
  'use strict';

  angular
    .module('productos')
    .controller('ProductosListController', ProductosListController);

  ProductosListController.$inject = ['ProductosService', '$scope', '$state'];

  function ProductosListController(ProductosService, $scope, $state) {

    var vm = this;

    vm.remove = remove;
    vm.isLoading = true;

    //------- Pagination configuration
    $scope.displayedCollection = [],
    $scope.rowCollection = [],
    $scope.currentPage = 1,
    $scope.numPerPage = 10,
    $scope.total = 0,
    $scope.maxSize = 5,
    //-------
    $scope.predicates = ['name', 'descripcion', 'precio'],
    $scope.selectedPredicate = $scope.predicates[0];

    // Remove existing Producto
    function remove(producto, index) {
      if (confirm('Are you sure you want to delete?')) {
        if (producto) {
          ProductosService.delete({ productoId: producto._id },function(response) {
          //$scope.rowCollection.splice(index, 1);
          //$scope.total = scope.displayedCollection.length;
          //$scope.displayCollection = [].concat($scope.rowCollection);
          //$scope.displayCollection.splice(index, 1);
          $state.reload();
          });
        }
      }
    }

    $scope.getTotal = function() {
      var start = 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = 10; // Number of entries showed per page.

      var params = {
        page: start,
        count: number
      };
      ProductosService.get(params,function(response) {  
        //$scope.todos = [];
        $scope.total = response.total;
        vm.isLoading = false;
      });
      //for (var i=1;i<=1000;i++) {
        //$scope.todos.push({ text:'todo '+i, done:false});
      //}
    };

    $scope.getTotal(); 
  

    $scope.$watch('currentPage + numPerPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
      
      var start = begin;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = $scope.numPerPage; // Number of entries showed per page.

      var params = {
        page: start,
        count: number
      };
      ProductosService.get(params,function(response) {  
        $scope.rowCollection = response.results;
        $scope.displayCollection = [].concat($scope.rowCollection);
        vm.isLoading = false;
      });
    });

  }
})();
