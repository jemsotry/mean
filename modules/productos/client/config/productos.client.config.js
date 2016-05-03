(function () {
  'use strict';

  angular
    .module('productos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Productos',
      state: 'productos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'productos', {
      title: 'List Productos',
      state: 'productos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'productos', {
      title: 'Create Producto',
      state: 'productos.create',
      roles: ['user']
    });
  }
})();
