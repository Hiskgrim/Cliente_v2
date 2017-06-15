'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:HojasDeVidaSeleccionCtrl
 * @description
 * # HojasDeVidaSeleccionCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('HojasDeVidaSeleccionCtrl', function (contratacion_request,contratacion_mid_request,hojas_de_vida_request,$scope,$mdDialog,$routeParams) {
    
    var self = this;

    self.idResolucion=$routeParams.idResolucion;

    self.dedicaciones=[];

    self.proyectos=[];

    contratacion_request.getOne("resolucion_vinculacion_docente",self.idResolucion).then(function(response){      
      self.datosFiltro=response.data;
      contratacion_request.getAll("proyecto_curricular/"+self.datosFiltro.NivelAcademico.toLowerCase()+"/"+self.datosFiltro.IdFacultad).then(function(response){
        self.proyectos=response.data;
      });
      switch(self.datosFiltro.Dedicacion){      
        case "TCO-MTO":
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3ATCO").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3AMTO").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          break;
        case "HCP":
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3AHCP").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          break;
        case "HCH":
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3AHCH").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          break;
      }
    });

    self.datosPersonas = {
      enableSorting: true,
      enableFiltering : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id', visible : false},
        {field: 'NombreCompleto', width: '70%', displayName: 'NOMBRE'},
        {field: 'Escalafon', displayName: 'CATEGORÍA'}
      ],
      onRegisterApi : function(gridApi){
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          contratacion_request.getOne("informacion_persona_natural",row.entity.Id).then(function(response){
            if(typeof(response.data)=="object"){
              self.persona=row.entity;
              self.persona.FechaExpedicionDocumento = new Date(self.persona.FechaExpedicionDocumento).toLocaleDateString('es');
            }else{
              swal({
                title: "Problema",
                text: "No se han podido encontrar datos de la persona seleccionada",
                type: "danger",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
              }); 
            }
          });
        });
      }
    };

    self.datosPersonas.multiSelect=false;

    self.getNumeroProyecto=function(num){
      if(self.proyectos[num]){
        return self.proyectos[num].Id
      }else{
        return 0
      }
    }

    self.precontratados = {
      enableFiltering : true,
      enableSorting : true,
      showGridFooter: true,
      showColumnFooter: true,
      treeRowHeaderAlwaysVisible : false,
      showTreeExpandNoChildren: false,
      enableRowSelection: true,
      enableSelectAll: true,
      columnDefs : [
        {field: 'Id', visible : false},
        {field: 'NombreCompleto', width: '25%', displayName: 'NOMBRE'},
        {field: 'Documento', displayName: 'CEDULA'},
        {field: 'Expedicion', displayName: 'EXPEDIDA'},
        {field: 'Categoria', displayName: 'CATEGORÍA'},
        {field: 'Dedicacion', displayName: 'DEDICACIÓN'},
        {field: 'HorasSemanales', displayName: 'HORAS SEMANALES'},
        {field: 'Semanas', displayName: 'SEMANAS'},
        {field: 'ValorContrato', displayName: 'VALOR CONTRATO', cellClass:"valorEfectivo"},
        {field: 'ProyectoCurricular', visible: false, filter: {
                        noTerm: true,
                        condition: function(searchTerm, cellValue) {
                            return (cellValue == self.getNumeroProyecto(self.selectedIndex));
                        }
                    }},
        {
          field: 'cancelar',
          enableSorting: false,
            enableFiltering: false,
            width: '3%',
            displayName: '',
            cellTemplate: '<button class="form-control fa fa-times" ng-click="grid.appScope.verCancelarInscripcionDocente(row)"></button>'
        }
      ]
    };

    self.refresh = function(){
      self.precontratados.data=JSON.parse(JSON.stringify(self.precontratados.data))
    }

    contratacion_request.getAll("persona_escalafon").then(function(response){
      self.datosPersonas.data=response.data;
      self.datosPersonas.data.forEach(function(row){
        row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
      });
    });

    contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){      
      self.precontratados.data=response.data;
      if(self.precontratados.data != null){
        self.precontratados.data.forEach(function(row){
          row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
          contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
            row.ValorContrato=FormatoNumero(response.data,0);
          });          
        });
      }
    });

    
  self.verInformacionPersonal = function(){
      $mdDialog.show({
        controller: "InformacionPersonalCtrl",
        controllerAs: 'informacionPersonal',
        templateUrl: 'views/informacion_personal.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {persona: self.persona}
      }) 
    }

    self.verHistoriaLaboral = function(){
      $mdDialog.show({
        controller: "HistoriaLaboralCtrl",
        controllerAs: 'historiaLaboral',
        templateUrl: 'views/experiencia_laboral_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {persona: self.persona}
      }) 
    }

    self.verFormacionAcademica = function(){
      $mdDialog.show({
        controller: "FormacionAcademicaCtrl",
        controllerAs: "formacionAcademica",
        templateUrl: 'views/formacion_academica_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {persona: self.persona}
      })
    };

    self.verTrabajosInvestigacion = function(){
       $mdDialog.show({
        controller: "TrabajosInvestigacionCtrl",
        controllerAs: "trabajosInvestigacion",
        templateUrl: 'views/trabajos_investigacion_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {persona: self.persona}
      })
    };

    self.calcularValorContrato = function(){
          contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+self.persona.Id+"/"+self.datosValor.NumSemanas+"/"+self.datosValor.NumHorasSemanales+"/"+self.persona.Escalafon.toLowerCase()+"/"+self.datosValor.dedicacion.toLowerCase()).then(function(response){
            if(typeof(response.data)=="number"){
              self.valorContrato=response.data;
              self.persona.valorContrato=self.valorContrato;
              swal({
                text: "Valor del contrato: $"+FormatoNumero(response.data)+" ("+NumeroALetras(response.data).toLowerCase()+")",
                type: 'info',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonClass: 'btn btn-success',
                buttonsStyling: false,
                confirmButtonText: 'Aceptar'
              });
              self.agregarContrato();
              self.datosValor={};
            }else{
              swal({
                title: "Alerta",
                text: "El salario no ha podido ser calculado",
                type: "warning",
                confirmButtonText: "Aceptar",
                showLoaderOnConfirm: true,
              });
            }
          });
    }

    self.registrarContrato = function(){
      if(self.datosValor.proyectoCurricular && self.datosValor.NumSemanas && self.datosValor.NumHorasSemanales && self.datosValor.dedicacion){
        contratacion_request.getOne("precontratado/"+self.idResolucion.toString(),self.persona.Id).then(function(response){
          if(response.data){
            swal({
              text: "El docente ya está vinculado a la resolución actual, ¿desea añadirlo?",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Agregar nuevo contrato',
              cancelButtonText: 'Cancelar',
              confirmButtonClass: 'btn btn-success',
              cancelButtonClass: 'btn btn-danger',
              buttonsStyling: false
            }).then(function () {
                contratacion_mid_request.post("validar_contrato/"+self.persona.Id+"/"+self.datosValor.NumHorasSemanales+"/"+self.datosValor.dedicacion.toLowerCase()).then(function(response){
                  if(response.data==1){
                    self.calcularValorContrato();
                  }else{
                    swal({
                      text: "Los valores asignados no son validos para la resolución actual, por favor remitarse a la pestaña tenga en cuenta para poder ver las reglas.",
                      type: "warning",
                      confirmButtonText: "Aceptar",
                      showLoaderOnConfirm: true,
                    });
                  }
                });
            }, function (dismiss) {
              if (dismiss === 'cancel') {
                swal(
                  'Cancelado',
                  'El registro ha sido cancelado',
                  'error'
                )
              }
            }) 
          }else{
                contratacion_mid_request.post("validar_contrato/"+self.persona.Id+"/"+self.datosValor.NumHorasSemanales+"/"+self.datosValor.dedicacion.toLowerCase()).then(function(response){
                  if(response.data==1){
                    self.calcularValorContrato();
                  }else{
                    swal({
                      text: "Los valores asignados no son validos para la resolución actual, por favor remitarse a la pestaña tenga en cuenta para poder ver las reglas.",
                      type: "warning",
                      confirmButtonText: "Aceptar",
                      showLoaderOnConfirm: true,
                    });
                  }
                });
          }
        })
      }
    }

    $scope.verCancelarInscripcionDocente=function(row){
      swal({
        title: '¿Está seguro?',
        text: "Desea confirmar la desvinculación del docente",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Desvincular docente',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then(function () {
        self.desvincularDocente(row);
      }, function (dismiss) {
        if (dismiss === 'cancel') {
          swal(
            'Cancelado',
            'La desvinculación ha sido cancelada',
            'error'
          )
        }
      })
    }

    self.desvincularDocente = function(row){
      var idDedicacion;
      switch(row.entity.Dedicacion){
        case "TCO":
          idDedicacion=4;
          break;
        case "MTO":
          idDedicacion=3;
          break;
        case "HCH":
          idDedicacion=1;
          break;
        case "HCP":
          idDedicacion=2;
          break;
      }

      var vinculacionCancelada = {
        IdPersona: {Id: row.entity.Documento},
        NumeroHorasSemanales: row.entity.HorasSemanales,
        NumeroSemanas: row.entity.Semanas,
        IdResolucion: {Id: parseInt(self.idResolucion)},
        IdDedicacion: {Id: parseInt(idDedicacion)},
        IdProyectoCurricular: parseInt(row.entity.ProyectoCurricular),
        Estado: false
      };

      contratacion_request.put("vinculacion_docente",row.entity.Id,vinculacionCancelada).then(function(response){
        contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){      
          self.precontratados.data=response.data;
          if(self.precontratados.data!=null){
            self.precontratados.data.forEach(function(row){
              row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
              contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
                row.ValorContrato=FormatoNumero(response.data,0);
              });
            });
          }else{
            self.precontratados.data=[]
          }
        });
      })
    }

    self.agregarContrato = function(){
      var idDedicacion;
      switch(self.datosValor.dedicacion){
        case "TCO":
          idDedicacion=4;
          break;
        case "MTO":
          idDedicacion=3;
          break;
        case "HCH":
          idDedicacion=1;
          break;
        case "HCP":
          idDedicacion=2;
          break;
      }
      var vinculacionDocente = {
        IdPersona: {Id: self.persona.Id},
        NumeroHorasSemanales: self.datosValor.NumHorasSemanales,
        NumeroSemanas: self.datosValor.NumSemanas,
        IdResolucion: {Id: parseInt(self.idResolucion)},
        IdDedicacion: {Id: idDedicacion},
        IdProyectoCurricular: parseInt(self.datosValor.proyectoCurricular)
      };

      contratacion_request.post("vinculacion_docente",vinculacionDocente).then(function(response){
        if(typeof(response.data)=="object"){
          contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){      
            self.precontratados.data=response.data;
            if(self.precontratados.data!=null){
              self.precontratados.data.forEach(function(row){
                row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
                contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
                  row.ValorContrato=FormatoNumero(response.data,0);
                });
              });
            }else{
              self.precontratados.data=[]
            }
          });
        }
      })
    }

    self.inscribirContratos = function(){
      self.contratosInscritos = self.contratados.data;
      self.verCalcularSalario();
    }

    self.asignarContrato = function(){
      self.verCalcularSalario();
    }

    self.verCalcularSalario = function(){
       $mdDialog.show({
        controller: "ContratoRegistroCtrl",
        controllerAs: "contratoRegistro",
        templateUrl: 'views/contrato_registro.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {persona: self.persona, nivelAcademico: self.nivelAcademico, idFacultad: self.idFacultad, idProyectoCurricular: self.idProyectoCurricular,contratados: self.contratosInscritos}
      })
    };

    self.mostrarReglas = function(){
      var textoReglas="";
      switch(self.datosFiltro.Dedicacion){ 
        case "HCH":
          textoReglas=textoReglas+'<p><b>Hora cátedra honorarios</b> Entre 4 y 8 horas semanales.</p>'
          break;
        case "HCP":
          textoReglas=textoReglas+'<p><b>Hora cátedra prestaciones</b> Entre 8 y 16 horas semanales</p>'
          break;     
        case "TCO-MTO":
          textoReglas=textoReglas+'<p><b>Medio tiempo ocasional</b> Entre 16 y 20 horas semanales</p>'+
                                  '<p><b>Tiempo completo ocasional</b> Entre 24 y 40 horas semanales</p>'
          break;
      }
      swal({
        title: 'Reglas',
        type: 'info',
        html: textoReglas
      })
    }

  });
