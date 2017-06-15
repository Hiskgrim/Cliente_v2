'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:TrabajosInvestigacionCtrl
 * @description
 * # TrabajosInvestigacionCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('TrabajosInvestigacionCtrl', function ($scope,$mdDialog,hojas_de_vida_request,persona) {
  	
  	var self = this;

    hojas_de_vida_request.getAll("investigacion").then(function(response){
        self.investigaciones=response.data;
        self.investigaciones.forEach(function(investigacion){
        	investigacion.FechaInicio = new Date(investigacion.FechaInicio).toLocaleDateString('es');
          	investigacion.FechaFinalizacion = new Date(investigacion.FechaFinalizacion).toLocaleDateString('es');
          hojas_de_vida_request.getOne("institucion",investigacion.InstitucionId.Id).then(function(response){
            investigacion.institucion=response.data;
          });
          hojas_de_vida_request.getOne("tipo_investigacion",investigacion.TipoInvestigacionId.Id).then(function(response){
            investigacion.tipoInvestigacion=response.data;
          });
        });
      });

     $scope.getNumeros = function(objeto) {
        var numeros=[];
        if(objeto){
          for(var i = 0; i<objeto.length; i++){
            numeros.push(i);
          }
        }
        return numeros;
      }
      
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
  });
