'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionListaCtrl
 * @description
 * # ResolucionListaCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('ResolucionListaCtrl', function (contratacion_request,$scope,$window,$mdDialog) {
    
  	var self = this;

	self.resolucionesInscritas = {
      enableSorting: true,
      enableFiltering : true,
      enableRowSelect: false,
      enableRowHeaderSelection: false,
      columnDefs : [
        {
        	field: 'Id', 
        	visible : false
        },
        {
            field: 'FechaExpedicion', 
            visible : false
        },
        {
            field: 'Estado', 
            visible : false
        },
        {
        	field: 'Numero',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
        	width: '17%', 
        	displayName: 'NÚMERO'
        },
        {
        	field: 'Vigencia', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
        	width: '17%', 
        	displayName: 'VIGENCIA'
        },
        {
        	field: 'Facultad', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
        	width: '17%', 
        	displayName: 'FACULTAD'
        },
        {
        	field: 'NivelAcademico', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
        	width: '17%', 
        	displayName: 'NIVEL'
        },
        {
        	field: 'Dedicacion', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
        	width: '17%', 
        	displayName: 'DEDICACIÓN'
        },
        {
        	field: 'editar',
        	enableSorting: false,
            enableFiltering: false,
            displayName: '',
            cellTemplate: '<button ng-if="!row.entity.FechaExpedicion" class="form-control fa fa-edit" ng-click="grid.appScope.verEditarResolucion(row)"></button><button ng-if="row.entity.FechaExpedicion" class="form-control fa fa-edit" ng-click="grid.appScope.verEditarResolucion(row)" disabled></button>'
        },
        {
        	field: 'docentes',
        	enableSorting: false,
            enableFiltering: false,
            displayName: '',
            cellTemplate: '<button ng-if="!row.entity.FechaExpedicion" class="form-control fa fa-group" ng-click="grid.appScope.verEditarDocentes(row)"></button><button ng-if="row.entity.FechaExpedicion" class="form-control fa fa-group" ng-click="grid.appScope.verEditarDocentes(row)" disabled></button>'
        },
        {
        	field: 'expedir',
        	enableSorting: false,
            enableFiltering: false,
            displayName: '',
            cellTemplate: '<button ng-if="!row.entity.FechaExpedicion" class="form-control fa fa-file" ng-click="grid.appScope.verRealizarExpedicion(row)"></button><button ng-if="row.entity.FechaExpedicion" class="form-control fa fa-file" ng-click="grid.appScope.verRealizarExpedicion(row)" disabled></button>'
        },
        {
        	field: 'ver',
        	enableSorting: false,
            enableFiltering: false,
            displayName: '',
            cellTemplate: '<button class="form-control fa fa-search" ng-click="grid.appScope.verVisualizarResolucion(row)"></button>'
        },
        {
        	field: 'cancelar',
        	enableSorting: false,
            enableFiltering: false,
            displayName: '',
            cellTemplate: '<button  ng-if="row.entity.FechaExpedicion && row.entity.Estado==true" class="form-control fa fa-times" ng-click="grid.appScope.verCancelarResolucion(row)"></button><button  ng-if="!row.entity.FechaExpedicion || row.entity.Estado==false" class="form-control fa fa-times" ng-click="grid.appScope.verCancelarResolucion(row)" disabled></button>'
        }
      ]
    };

    contratacion_request.getAll("resolucion_vinculacion").then(function(response){
        self.resolucionesInscritas.data=response.data;
        self.resolucionesInscritas.data.forEach(function(resolucion){
            if(resolucion.FechaExpedicion.toString()=="0001-01-01T00:00:00Z"){
                resolucion.FechaExpedicion=null;
            }
        })
    });  

    $scope.verEditarResolucion = function(row){
    	$window.location.href = '#/resolucion_detalle/'+row.entity.Id.toString();
    }

    $scope.verEditarDocentes = function(row){
    	$window.location.href = '#/hojas_de_vida_seleccion/'+row.entity.Id.toString();
    }

    $scope.verRealizarExpedicion = function(row){
        $mdDialog.show({
            controller: "ContratoRegistroCtrl",
            controllerAs: 'contratoRegistro',
            templateUrl: 'views/contrato_registro.html',
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: true,
            locals: {idResolucion: row.entity.Id, lista: self, resolucion: row.entity}
        })
    }

	$scope.verVisualizarResolucion = function(row){
    	$mdDialog.show({
            controller: "ResolucionVistaCtrl",
            controllerAs: 'resolucionVista',
            templateUrl: 'views/resolucion_vista.html',
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: true,
            locals: {idResolucion: row.entity.Id}
        })
    }    

	$scope.verCancelarResolucion = function(row){
    	swal({
		  title: '¿Cancelar la resolución?',
          html:
            '<p><b>Número: </b>'+row.entity.Numero.toString()+'</p>'+
            '<p><b>Facultad: </b>'+row.entity.Facultad+'</p>'+
            '<p><b>Nivel académico: </b>'+row.entity.NivelAcademico+'</p>'+
            '<p><b>Dedicación: </b>'+row.entity.Dedicacion+'</p>',
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Aceptar',
		  cancelButtonText: 'Cancelar',
		  confirmButtonClass: 'btn btn-success',
		  cancelButtonClass: 'btn btn-danger',
		  buttonsStyling: false
		}).then(function () {
            self.cancelarResolucion(row);
            }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal({
                    text: 'No se ha realizado la cancelción de la resolución',
                    type: 'error'
                })
            }
        })
    }   

    self.cancelarResolucion = function(row){
        contratacion_request.getOne("resolucion", row.entity.Id).then(function(response){
            var nuevaResolucion=response.data;
            nuevaResolucion.Estado=false;
            contratacion_request.put("resolucion", nuevaResolucion.Id, nuevaResolucion).then(function(response){
                contratacion_request.getAll("resolucion_vinculacion").then(function(response){
                    self.resolucionesInscritas.data=response.data;
                    self.resolucionesInscritas.data.forEach(function(resolucion){
                        if(resolucion.FechaExpedicion.toString()=="0001-01-01T00:00:00Z"){
                            resolucion.FechaExpedicion=null;
                        }
                    })
                })
            })
        })
    }

    self.generarNuevaResolucion = function(){
        $window.location.href = '#/resolucion_generacion';
    } 

  });

