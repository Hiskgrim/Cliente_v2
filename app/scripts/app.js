'use strict';

/**
 * @ngdoc overview
 * @name clienteApp
 * @description
 * # clienteApp
 *
 * Main module of the application.
 */
angular
  .module('clienteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'afOAuth2',
    'treeControl',
    'ngMaterial',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks',
    'pascalprecht.translate',
    'hojas_de_vida_service',
    'contratacion_service',
    'academica_service',
    'contratacion_mid_service',
    'sicapital_service'
  ])
    .run(function(amMoment) {
      amMoment.changeLocale('es');
    })
    .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("");
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/notificaciones', {
        templateUrl: 'views/notificaciones.html',
        controller: 'NotificacionesCtrl',
        controllerAs: 'notificaciones'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/resolucion_generacion', {
        templateUrl: 'views/resolucion_generacion.html',
        controller: 'ResolucionGeneracionCtrl',
        controllerAs: 'resolucionGeneracion'
      })
      .when('/hojas_de_vida_seleccion/:idResolucion', {
        templateUrl: 'views/hojas_de_vida_seleccion.html',
        controller: 'HojasDeVidaSeleccionCtrl',
        controllerAs: 'hojasDeVidaSeleccion'
      })
      .when('/contrato_registro', {
        templateUrl: 'views/contrato_registro.html',
        controller: 'ContratoRegistroCtrl',
        controllerAs: 'contratoRegistro'
      })
      .when('/contrato_detalle', {
        templateUrl: 'views/contrato_detalle.html',
        controller: 'ContratoDetalleCtrl',
        controllerAs: 'contratoDetalle'
      })
      .when('/resolucion_lista', {
        templateUrl: 'views/resolucion_lista.html',
        controller: 'ResolucionListaCtrl',
        controllerAs: 'resolucionLista'
      })
      .when('/resolucion_detalle/:idResolucion', {
        templateUrl: 'views/resolucion_detalle.html',
        controller: 'ResolucionDetalleCtrl',
        controllerAs: 'resolucionDetalle'
      })
      .when('/resolucion_vista', {
        templateUrl: 'views/resolucion_vista.html',
        controller: 'ResolucionVistaCtrl',
        controllerAs: 'resolucionVista'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
