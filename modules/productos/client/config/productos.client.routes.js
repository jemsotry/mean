(function () {
  'use strict';

  angular
    .module('productos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('productos-find', {
        url: '/productos-find',
        templateUrl: 'modules/productos/client/views/productos-find.client.view.html',
        controller: 'ProductosFindController',
        controllerAs: 'vm'
      })
      .state('productos', {
        abstract: true,
        url: '/productos',
        template: '<ui-view/>'
      })
      .state('productos.list', {
        url: '',
        templateUrl: 'modules/productos/client/views/list-productos.client.view.html',
        controller: 'ProductosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Productos List'
        }
      })
      .state('productos.create', {
        url: '/create',
        templateUrl: 'modules/productos/client/views/form-producto.client.view.html',
        controller: 'ProductosController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: newProducto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Productos Create'
        }
      })
      .state('productos.edit', {
        url: '/:productoId/edit',
        templateUrl: 'modules/productos/client/views/form-producto.client.view.html',
        controller: 'ProductosController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Producto {{ productoResolve.name }}'
        }
      })
      .state('productos.view', {
        url: '/:productoId',
        templateUrl: 'modules/productos/client/views/view-producto.client.view.html',
        controller: 'ProductosController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data:{
          pageTitle: 'Producto {{ articleResolve.name }}'
        }
      });
  }

  getProducto.$inject = ['$stateParams', 'ProductosService'];

  function getProducto($stateParams, ProductosService) {
    return ProductosService.get({
      productoId: $stateParams.productoId
    }).$promise;
  }

  newProducto.$inject = ['ProductosService'];

  function newProducto(ProductosService) {
    return new ProductosService();
  }
})();
