var aboutApp = angular.module('about', ['ngResource']);

aboutApp.factory('AboutContent', function ($resource) {
  return $resource('/api/variable/aboutContent');
});

aboutApp.controller('aboutController', function (AboutContent, $http, $scope, $sce) {
  var abt = this;
  $scope.$watch('abt.aboutContent.value', function (value) {
    if (value)
      abt.parsedContent = $sce.trustAsHtml(marked(value));
    else
      abt.parsedContent = null;
  });
  AboutContent.get(function (aboutContent) {
    abt.aboutContent = aboutContent;
  });
  abt.edit = false;
  abt.save = function () {
    abt.aboutContent.$save(function (aboutContent) {
      abt.edit = false;
    });
  };
});
