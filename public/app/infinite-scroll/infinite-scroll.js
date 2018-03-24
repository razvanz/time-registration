function infiniteScroll ($timeout, $debounce) {
  return {
    restrict: 'A',
    priority: 0,
    scope: {
      cb: '&trInfiniteScroll',
      debounce: '@trInfiniteScrollDebounce',
      coeficient: '@trInfiniteScrollCoeficient'
    },
    link: function (scope, elem) {
      const debounce = parseInt(scope.debounce, 10) || 100
      const coeficient = parseFloat(scope.coeficient) || 1
      const el = elem[0] || elem
      const callback = $debounce(debounce, () => { scope.cb() })
      const handler = function () {
        const scrolledCoeficient = el.scrollTop / (el.scrollHeight - el.clientHeight)
        if (scrolledCoeficient >= coeficient) $timeout(callback, 0)
      }

      elem.on('scroll', handler)

      scope.$on('$destroy', () => {
        elem.off('scroll', handler)
      })
    }
  }
}

infiniteScroll.$inject = ['$timeout', 'debounce']

export default infiniteScroll
