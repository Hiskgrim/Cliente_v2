'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionGeneracionCtrl
 * @description
 * # ResolucionGeneracionCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('ResolucionDetalleCtrl', function (contratacion_request,contratacion_mid_request,$mdDialog,$scope,$routeParams) {

  	var self=this;

    self.idResolucion=$routeParams.idResolucion;

    contratacion_request.getAll("facultad").then(function(response){
      self.facultades=response.data;
    });

    contratacion_request.getOne("resolucion",self.idResolucion).then(function(response){  
      self.numero=parseInt(response.data.NumeroResolucion);
    });

    contratacion_request.getOne("resolucion_vinculacion_docente",self.idResolucion).then(function(response){      
      self.datosFiltro=response.data;
      contratacion_request.getOne("contenido_resolucion",self.idResolucion).then(function(response){
        self.contenidoResolucion=response.data;
        contratacion_request.getOne("ordenador_gasto",self.datosFiltro.IdFacultad).then(function(response){
          self.contenidoResolucion.ordenadorGasto=response.data;
        });
      });
      self.datosFiltro.IdFacultad=self.datosFiltro.IdFacultad.toString();
      contratacion_request.getAll("proyecto_curricular/"+self.datosFiltro.NivelAcademico.toLowerCase()+"/"+self.datosFiltro.IdFacultad).then(function(response){
        self.proyectos=response.data;
      });
      contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){      
        self.contratados=response.data;
        if(self.contratados){
          self.contratados.forEach(function(row){
            contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
              row.ValorContrato=response.data;
            });
            row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
          });
        }
      });
    });

  self.agregarArticulo = function() {
    swal({
      title: 'Escriba el texto del artículo',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      howLoaderOnConfirm: true,
      preConfirm: function (texto) {
        return new Promise(function (resolve, reject) {
          setTimeout(function() {
            if (texto) {
              resolve()
            }else{
              reject('Debe insertar texto.')
            }
          }, 1000)
        })
      },
      allowOutsideClick: false
    }).then(function (texto) {
      self.adicionarArticulo(texto)
    })
  }

  self.adicionarArticulo = function(texto){
    contratacion_request.getOne("resolucion",self.idResolucion).then(function(response){
      if(self.contenidoResolucion.Articulos){
        self.contenidoResolucion.Articulos.push({Texto: texto,
        Paragrafos: null});  
      }else{
        self.contenidoResolucion.Articulos=[{Texto: texto,
        Paragrafos: null}]
      }
    });
  }

  self.eliminarArticulo = function(num) {
    if(self.contenidoResolucion.Articulos.length>1){
      self.contenidoResolucion.Articulos.splice(num,1); 
    }else{
        swal({
          text: "La resolución debe tener al menos un artículo",
          type: "warning"
        })
    }
  }

  self.eliminarParagrafo = function(num1, num2) {
    self.contenidoResolucion.Articulos[num1].Paragrafos.splice(num2,1);  
  }

  self.agregarParagrafo = function(num){
    swal({
      title: 'Escriba el texto del paragrafo',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      howLoaderOnConfirm: true,
      preConfirm: function (texto) {
        return new Promise(function (resolve, reject) {
          setTimeout(function() {
            if (texto) {
              resolve()
            }else{
              reject('Debe insertar texto.')
            }
          }, 1000)
        })
      },
      allowOutsideClick: false
    }).then(function (texto) {
      self.adicionarParagrafo(num,texto)
    })
  }

  self.adicionarParagrafo = function(num,texto){
    contratacion_request.getOne("resolucion",self.idResolucion).then(function(response){
      if(self.contenidoResolucion.Articulos[num].Paragrafos){
        self.contenidoResolucion.Articulos[num].Paragrafos.push({Texto: texto})
      }else{
        self.contenidoResolucion.Articulos[num].Paragrafos=[{Texto: texto}]
      }
    });
  }

  self.guardarCambios = function(){
    if(self.resolucionValida()){
      contratacion_request.put("contenido_resolucion",self.idResolucion,self.contenidoResolucion).then(function(response){
          if(response.data=="OK"){
                swal({
                  title: 'Guardado',
                  text: "Los cambios se han guardado exitosamente",
                  type: "success",
                  confirmButtonText: 'Aceptar',
                  showLoaderOnConfirm: true
                });
          }else{
                swal({
                  title: "Alerta",
                  text: "Ha habido un problema en el almacenamiento de los cambios",
                  type: "warning",
                  confirmButtonText: "Aceptar",
                  showLoaderOnConfirm: true
                });
          }
      })
    }else{
      swal({
        text:"Revise los datos de la resolución",
        type:"error"
      })
    }
  }

  self.verDocentesContratados = function() {
  	$scope.ventanaDocentesContratados();
  }

  $scope.ventanaDocentesContratados = function() {
	    $mdDialog.show({
	      controller: DocentesContratadosController,
	      templateUrl: 'views/contrato_resumen.html',
	      parent: angular.element(document.body),
	      clickOutsideToClose:true,
	      fullscreen: $scope.customFullscreen
	    })	  };

	 function DocentesContratadosController($scope, $mdDialog) {
      $scope.proyectos=self.proyectos;

      $scope.contratados=self.contratados;
      if($scope.contratados){
        $scope.contratados.forEach(function(contratado){
          contratado.ValorContrato=FormatoNumero(contratado.ValorContrato,0);
        })
      }
	    
      $scope.selectedIndex = 0;

	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };
	  }

  self.resolucionValida = function(){
    var resolucionValida=true;
    if(!self.contenidoResolucion.Numero){
      resolucionValida=false;
    }
    if(!self.contenidoResolucion.Preambulo){
      resolucionValida=false;
    }
    if(!self.contenidoResolucion.Consideracion){
      resolucionValida=false;
    }
    if(self.contenidoResolucion.Articulos){
      self.contenidoResolucion.Articulos.forEach(function(articulo){
        if(!articulo.Texto){
          resolucionValida=false;
        }
        if(articulo.Paragrafos){
          articulo.Paragrafos.forEach(function(paragrafo){
            if(!paragrafo.Texto){
              resolucionValida=false;
            }
          })
        }
      })
    }
    return resolucionValida
  }

  self.generarResolucion = function(){
    if(self.resolucionValida()){
      self.contenidoResolucion
      var documento=getDocumento(self.contenidoResolucion,self.contratados,self.proyectos);
      pdfMake.createPdf(documento).getDataUrl(function(outDoc){
        document.getElementById('vistaPDF').src = outDoc;
      });
      $("#resolucion").show();
    }else{
      swal({
        text:"Revise los datos de la resolución",
        type:"error"
      })
    }
  }

  self.getNumeros = function(objeto) {
  	var numeros=[];
    if(objeto){
    	for(var i = 0; i<objeto.length; i++){
    		numeros.push(i);
    	}
    }
    return numeros;
  }

  });
