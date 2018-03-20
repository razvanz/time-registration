import angular from 'angular'
import serializerInterceptor from './serializer.interceptor'

export default angular
  .module('tr.config', [])
  .factory('serializerInterceptor', serializerInterceptor)
  .config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push('serializerInterceptor')
  }])
