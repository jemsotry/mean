(function () {
  'use strict';

  angular
    .module('catalogos')
    .controller('CatalogosListController', CatalogosListController);

  CatalogosListController.$inject = ['CatalogosService'];

  function CatalogosListController(CatalogosService) {
    var vm = this;

    vm.catalogos = CatalogosService.query();
  }
})();
