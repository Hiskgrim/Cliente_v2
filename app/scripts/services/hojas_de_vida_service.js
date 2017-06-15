'use strict';

/**
 * @ngdoc service
 * @name clienteApp.hojasDeVidaService
 * @description
 * # hojasDeVidaService
 * Factory in the clienteApp.
 */
angular.module('hojas_de_vida_service',[])
  .factory('hojas_de_vida_request', function ($http) {

    // Service logic
    // ...
    var path = "http://localhost:8081/v1/";

    // Public API here
    return {
      getAll: function (table,params) {
        return $http.get(path+table+"/?"+params);
      },
      post: function (table,elemento) {
        return $http.post(path+table,elemento);
      },
      delete: function (table,id) {
        return $http.delete(path+table+"/"+id);
      },
      getOne: function (table,id) {
        return $http.get(path+table+"/"+id);
      },
      put: function (table,id,elemento) {
        return $http.put(path+table+"/"+id,elemento);
      }
    };


  });
