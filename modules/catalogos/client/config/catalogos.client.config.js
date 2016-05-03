(function () {
  'use strict';

  angular
    .module('catalogos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Catalogos',
      state: 'catalogos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'catalogos', {
      title: 'List Catalogos',
      state: 'catalogos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'catalogos', {
      title: 'Create Catalogo',
      state: 'catalogos.create',
      roles: ['user']
    });
  }
})();
