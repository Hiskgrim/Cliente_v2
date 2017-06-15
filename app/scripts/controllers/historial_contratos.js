'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:HistorialContratosCtrl
 * @description
 * # HistorialContratosCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('HistorialContratosCtrl', function (academica_request) {
    var self = this;

    academica_request.getAll("proyecto_curricular/pregrado/33").then(function(response){
      self.proyectos=response.data;
    });

    self.contratados=[];

    switch(self.tipoDedicacion){      
      case "TCO_MTO":
        contratacion_request.getAll("contratado/tco").then(function(response){
          if(response.data){
            self.contratados=self.contratados.concat(response.data);
          }
        });
        contratacion_request.getAll("contratado/mto").then(function(response){
          if(response.data){
            self.contratados=self.contratados.concat(response.data);
          }
        });
        break;
      case "HCP":
        contratacion_request.getAll("contratado/hcp").then(function(response){
          if(response.data){
            self.contratados=self.contratados.concat(response.data);
          }
        });
        break;
      case "HCH":
        contratacion_request.getAll("contratado/hch").then(function(response){
          if(response.data){
            self.contratados=self.contratados.concat(response.data);
          }
        });
        break;
    }

  });
