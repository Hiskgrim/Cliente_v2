'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:HistoriaLaboralCtrl
 * @description
 * # HistoriaLaboralCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('HistoriaLaboralCtrl', function ($scope,$mdDialog,hojas_de_vida_request,persona) {
     
    var self = this;
    
    hojas_de_vida_request.getAll("experiencia_docente").then(function(response){
          self.experienciasLaborales=response.data;
          self.experienciasLaborales.forEach(function(experiencia){
          	experiencia.FechaInicio = new Date(experiencia.FechaInicio).toLocaleDateString('es');
          	experiencia.FechaFinalizacion = new Date(experiencia.FechaFinalizacion).toLocaleDateString('es');
            hojas_de_vida_request.getOne("institucion",experiencia.InstitucionId.Id).then(function(response){
              experiencia.institucion=response.data;
            });
            hojas_de_vida_request.getOne("tipo_dedicacion",experiencia.TipoDedicacionId.Id).then(function(response){
              experiencia.tipoDedicacion=response.data;
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
  });
