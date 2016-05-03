//Productos service used to communicate Productos REST endpoints
(function () {
  'use strict';

  angular
    .module('productos')
    .factory('ProductosService', ProductosService);

  ProductosService.$inject = ['$resource'];

  function ProductosService($resource) {
    return $resource('api/productos/:productoId', {
      productoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }


   

})();
