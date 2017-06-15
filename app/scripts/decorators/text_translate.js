"use strict";

/**
 * @ngdoc function
 * @name clienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the clienteApp
 */
var text_es = {
  TITULO: "CONTRATACIÓN DOCENTES VINCULACIÓN ESPECIAL",
  MENSAJE_INICIAL: "Módulo para la contratación de docentes por vinculaión especial",
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ..."
};

angular.module('clienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
