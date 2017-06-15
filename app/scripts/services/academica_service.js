'use strict';

/**
 * @ngdoc service
 * @name clienteApp.academicaService
 * @description
 * # academicaService
 * Factory in the clienteApp.
 */
angular.module('academica_service',[])
  .factory('academica_request', function ($http) {
    // Service logic
    // ...
    var path = "http://localhost:8082/v1/";

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
