'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionVistaCtrl
 * @description
 * # ResolucionVistaCtrl
 * Controller of the clienteApp
 */
angular.module('clienteApp')
  .controller('ResolucionVistaCtrl', function ($timeout,contratacion_request,contratacion_mid_request,$mdDialog,$scope,idResolucion) {
    
  	var self=this;

    self.idResolucion=idResolucion;

    contratacion_request.getOne("resolucion",self.idResolucion).then(function(response){  
      self.numero=response.data.NumeroResolucion;
      contratacion_request.getOne("resolucion_vinculacion_docente",self.idResolucion).then(function(response){      
        self.datosFiltro=response.data;
        self.datosFiltro.IdFacultad=self.datosFiltro.IdFacultad.toString();
        contratacion_request.getAll("proyecto_curricular/"+self.datosFiltro.NivelAcademico.toLowerCase()+"/"+self.datosFiltro.IdFacultad).then(function(response){
          self.proyectos=response.data;
          contratacion_request.getOne("contenido_resolucion",self.idResolucion).then(function(response){
            self.contenidoResolucion=response.data;
            contratacion_request.getOne("ordenador_gasto",parseInt(self.datosFiltro.IdFacultad)).then(function(response){
              self.contenidoResolucion.ordenadorGasto=response.data;
              contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){      
                self.contratados=response.data;
                if(self.contratados){
                  self.contratados.forEach(function(row){
                    contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
                      row.ValorContrato=response.data;                    
                        self.generarResolucion()                    
                    });
                    row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
                  });
                }else{
                  self.generarResolucion() 
                }
              });
            });
          });
        });
      });
    });

  	self.generarResolucion = function() {
	    var documento=getDocumento(self.contenidoResolucion,self.contratados,self.proyectos);
	    pdfMake.createPdf(documento).getDataUrl(function(outDoc){
	      document.getElementById('vistaPDF').src = outDoc;
	    });
	 }

   //$timeout(self.generarResolucion, 1000);

  });
