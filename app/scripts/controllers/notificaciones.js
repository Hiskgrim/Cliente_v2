'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:NotificacionesCtrl
 * @description
 * # NotificacionesCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('NotificacionesCtrl', function($scope, notificacion) {
    $scope.imagePath = 'images/yeoman.png';
    $scope.notificacion = notificacion;
  });
