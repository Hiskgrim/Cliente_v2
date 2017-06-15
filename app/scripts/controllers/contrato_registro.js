'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ContratoRegistroCtrl
 * @description
 * # ContratoRegistroCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('ContratoRegistroCtrl', function (contratacion_request,contratacion_mid_request,sicapital_request,idResolucion,$mdDialog,lista,resolucion) {
  	
  	var self = this;

    self.idResolucion=idResolucion;

    contratacion_request.getOne("resolucion_vinculacion_docente",self.idResolucion).then(function(response){      
      self.datosFiltro=response.data;
      contratacion_request.getOne("facultad",self.datosFiltro.IdFacultad).then(function(response){
        self.contratoGeneralBase.SedeSolicitante=response.data.Id;
        self.sede_solicitante_defecto=response.data.Nombre;
      });
    });

    contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){      
      self.contratados=response.data;
      if(self.contratados != null){
        self.contratados.forEach(function(row){
          contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
            row.ValorContrato=response.data;
          });
        });
      }
    });

    sicapital_request.getAll("disponibilidad/cdpfiltro/2017/1/VIGENTE","limit=1").then(function(response){
      self.cdp_opciones=response.data;
    });

    self.asignarValoresDefecto = function(){
      self.contratoGeneralBase={}
      self.contratoGeneralBase.Vigencia=new Date().getFullYear();
      self.contratoGeneralBase.FormaPago={Id:240};
      self.contratoGeneralBase.DescripcionFormaPago="Abono a Cuenta Mensual de acuerdo a puntas y hotras laboradas";
      self.contratoGeneralBase.Justificacion="Docente de Vinculacion Especial";
      self.contratoGeneralBase.UnidadEjecucion={Id:205};
      self.contratoGeneralBase.LugarEjecucion={Id:2};
      self.contratoGeneralBase.Observaciones="Contrato de Docente Vinculación Especial";
      self.contratoGeneralBase.TipoControl=181;
      self.contratoGeneralBase.ClaseContratista=33;
      self.contratoGeneralBase.TipoMoneda=137;
      self.contratoGeneralBase.OrigenRecursos=149;
      self.contratoGeneralBase.OrigenPresupuesto=156;
      self.contratoGeneralBase.TemaGastoInversion=166;
      self.contratoGeneralBase.TipoGasto=146;
      self.contratoGeneralBase.RegimenContratacion=136;
      self.contratoGeneralBase.Procedimiento=132;
      self.contratoGeneralBase.ModalidadSeleccion=123;
      self.contratoGeneralBase.TipoCompromiso=35;
      self.contratoGeneralBase.TipologiaContrato=46;
      self.contratoGeneralBase.FechaRegistro=new Date();
      self.contratoGeneralBase.UnidadEjecutora={Id:1};
      self.contratoGeneralBase.Condiciones="Sin condiciones";
    }

    self.asignarValoresDefecto();

    contratacion_request.getAll("supervisor_contrato","limit=-1").then(function(response){
      self.supervisor_contrato_opciones=response.data;
    })
    contratacion_request.getOne("lugar_ejecucion",2).then(function(response){
      self.lugar_ejecucion_defecto=response.data;
    })
    contratacion_request.getOne("parametros",205).then(function(response){
      self.unidad_ejecucion_defecto=response.data;
    })
    contratacion_request.getOne("unidad_ejecutora",1).then(function(response){
      self.unidad_ejecutora_defecto=response.data;
    })
    contratacion_request.getAll("tipo_contrato","limit=-1").then(function(response){
      self.tipo_contrato_opciones=response.data;
    })
    contratacion_request.getOne("parametros",240).then(function(response){
      self.forma_pago_defecto=response.data;
    })
    contratacion_request.getOne("parametros",146).then(function(response){
      self.tipo_gasto_defecto=response.data;
    })
    contratacion_request.getOne("parametros",46).then(function(response){
      self.tipologia_contrato_defecto=response.data;
    })
    contratacion_request.getOne("parametros",35).then(function(response){
      self.tipo_compromiso_defecto=response.data;
    })
    contratacion_request.getOne("parametros",123).then(function(response){
      self.modalidad_seleccion_defecto=response.data;
    })
    contratacion_request.getOne("parametros",132).then(function(response){
      self.procedimiento_defecto=response.data;
    })
    contratacion_request.getOne("parametros",136).then(function(response){
      self.regimen_contratacion_defecto=response.data;
    })
    contratacion_request.getOne("parametros",166).then(function(response){
      self.tema_gasto_defecto=response.data;
    })
    contratacion_request.getOne("parametros",156).then(function(response){
      self.origen_presupuesto_defecto=response.data;
    })
    contratacion_request.getOne("parametros",149).then(function(response){
      self.origen_recursos_defecto=response.data;
    })
    contratacion_request.getOne("parametros",137).then(function(response){
      self.tipo_moneda_defecto=response.data;
    })
    contratacion_request.getOne("parametros",181).then(function(response){
      self.tipo_control_defecto=response.data;
    })
    contratacion_request.getOne("parametros",33).then(function(response){
      self.clase_contratista_defecto=response.data;
    })


    self.cancelar = function(){
      $mdDialog.hide();
    }

    self.calcularSalario = function(){
        contratacion_mid_request.post("calculo_salario/"+self.nivelAcademico+"/"+persona.Id+"/"+self.datosValor.NumSemanas+"/"+self.datosValor.NumHorasSemanales+"/asociado/"+self.datosValor.dedicacion).then(function(response){
          if(typeof(response.data)=="number"){
            self.valorContrato=response.data;
              swal({
                title: "VALOR DEL CONTRATO",
                text: NumeroALetras(response.data),
                type: "info",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
              });
              self.asignarValoresDefecto();
        }else{
          swal({
                title: "Peligro",
                text: "El salario no ha podido ser calculado",
                type: "danger",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
              });
        }
        });
    }

    self.realizarContrato = function(){
      if(self.contratoGeneralBase.NumeroCdp && self.contratoGeneralBase.ObjetoContrato && self.contratoGeneralBase.Observaciones){
        self.contratoGeneralBase.NumeroCdp=self.contratoGeneralBase.NumeroCdp.replace("[","");
        self.contratoGeneralBase.NumeroCdp=self.contratoGeneralBase.NumeroCdp.replace("]","");
        self.contratoGeneralBase.NumeroCdp=self.contratoGeneralBase.NumeroCdp.replace('"',"");
        self.contratoGeneralBase.NumeroCdp=self.contratoGeneralBase.NumeroCdp.replace('"',"");
        self.contratoGeneralBase.NumeroCdp=self.contratoGeneralBase.NumeroCdp.replace('"',"");
        self.contratoGeneralBase.NumeroCdp=self.contratoGeneralBase.NumeroCdp.replace('"',"");
        self.contratoGeneralBase.NumeroCdp=self.contratoGeneralBase.NumeroCdp.split(",");
        self.contratoGeneralBase.NumeroSolicitudNecesidad=parseInt(self.contratoGeneralBase.NumeroCdp[1]);
        self.contratoGeneralBase.NumeroCdp=parseInt(self.contratoGeneralBase.NumeroCdp[0]);
        self.contratoGeneralBase.FechaRegistro = new Date();
        if(self.datosFiltro.Dedicacion=="HCH"){
          self.contratoGeneralBase.TipoContrato={Id: 3};
          self.contratoGeneralBase.ObjetoContrato="Docente de Vinculación Especial - Honorarios";
        }else{
          self.contratoGeneralBase.TipoContrato={Id: 2};
          self.contratoGeneralBase.ObjetoContrato="Docente de Vinculación Especial - Salario";
        }
        swal({
          title: '¿Expedir la resolución?',
          text: "¿Esta seguro que desea expedir la resolución?",
          html:
              '<p><b>Número: </b>'+resolucion.Numero.toString()+'</p>'+
              '<p><b>Facultad: </b>'+resolucion.Facultad+'</p>'+
              '<p><b>Nivel académico: </b>'+resolucion.NivelAcademico+'</p>'+
              '<p><b>Dedicación: </b>'+resolucion.Dedicacion+'</p>',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(function () {
                self.guardarContratos();
                }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal({
                        text: 'No se ha realizado la expedición de la resolución',
                        type: 'error'
                    })
                }
            })
      }
    }

    self.guardarContratos = function(){
      var conjuntoContratos=[];
      var errorInsercion = false;
      if(self.contratados){
        self.contratados.forEach(function(contratado){
          var contratoGeneral=JSON.parse(JSON.stringify(self.contratoGeneralBase));
          contratoGeneral.Contratista=contratado.Documento;
          contratoGeneral.DependeciaSolicitante=contratado.idProyectoCurricular;
          contratoGeneral.PlazoEjecucion=contratado.Semanas*7;
          contratoGeneral.OrdenadorGasto="1";
          contratoGeneral.ValorContrato=contratado.ValorContrato;
          conjuntoContratos.push(contratoGeneral);
        });
          contratacion_request.post("contrato_general/InsertarContratos",conjuntoContratos).then(function(response){
            if(typeof(response.data)!="object"){
              errorInsercion=true;
            }
          })

          if(!errorInsercion){
                contratacion_request.getOne("resolucion",self.idResolucion).then(function(response){
                  var resolucionCambio = response.data;
                  resolucionCambio.FechaExpedicion = new Date();
                  contratacion_request.put("resolucion", self.idResolucion, resolucionCambio).then(function(response){
                    if(response.data=="OK"){
                      swal({
                        title: 'La resolución ha sido expedida con exito',
                        text: "Los datos de las vinculaciones realizadas han sido registradas con exito",
                        type: 'success',
                        confirmButtonText: 'Aceptar'
                      });
                      contratacion_request.getAll("resolucion_vinculacion").then(function(response){
                          lista.resolucionesInscritas.data=response.data;
                          lista.resolucionesInscritas.data.forEach(function(resolucion){
                              if(resolucion.FechaExpedicion.toString()=="0001-01-01T00:00:00Z"){
                                  resolucion.FechaExpedicion=null;
                              }
                          })
                      });  
                      $mdDialog.hide()
                    }else{
                      swal({
                        title: "Alerta",
                        text: "Se ha presentado un problema en la expedición de la resolución",
                        type: "warning",
                        confirmButtonText: "Aceptar",
                        showLoaderOnConfirm: true,
                      });
                    }
                  })
                })
          }else{
                swal({
                  title: "Alerta",
                  text: "Se ha presentado un problema en el registro de los datos de los docentes contratados",
                  type: "warning",
                  confirmButtonText: "Aceptar",
                  showLoaderOnConfirm: true,
                });
          }
      }else{
                swal({
                  text: "No hay docentes inscritos dentro de la resolución",
                  title: "Alerta",
                  type: "warning",
                  confirmButtonText: "Aceptar",
                  showLoaderOnConfirm: true,
                });
      }
    }

  });
