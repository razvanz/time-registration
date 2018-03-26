function modelJsonTransform () {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 0,
    link: function (scope, elem, attrs, ctrl) {
      ctrl.$formatters.push(JSON.stringify)
      ctrl.$parsers.push(JSON.parse)
    }
  }
}

export default modelJsonTransform
