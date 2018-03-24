import angular from 'angular'
import infiniteScroll from './infinite-scroll'

require('angular-debounce')

export default angular
  .module('tr.infinite-scroll', [
    'rt.debounce'
  ])
  .directive('trInfiniteScroll', infiniteScroll)
