var staticContentApp = angular.module('staticContent', ['ngResource']);

staticContentApp.controller('staticCtrl', function ($http, $scope, $sce, $resource) {
  var staticCtrl = this;
  $scope.$watch(function () {
    if (staticCtrl.content) {
      return staticCtrl.content.value;
    }
  }, function (value) {
    if (value)
      staticCtrl.parsedContent = $sce.trustAsHtml(marked(value));
    else
      staticCtrl.parsedContent = null;
  });
  staticCtrl.init = function (resourceName) {
    var contentResource = $resource('/api/variable/' + resourceName);
    contentResource.get(function (content) {
      staticCtrl.content = content;
    });
    staticCtrl.edit = false;
    staticCtrl.save = function () {
      staticCtrl.content.$save(function (content) {
        staticCtrl.edit = false;
      });
    };
  };
});
