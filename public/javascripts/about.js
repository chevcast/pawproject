var aboutApp = angular.module('about', ['ngResource']);

aboutApp.factory('AboutContent', function ($resource) {
  return $resource('/api/variable/aboutContent');
});

aboutApp.controller('aboutController', function (AboutContent, $http) {
  var abt = this;
  AboutContent.get(function (aboutContent) {
    abt.aboutContent = aboutContent;
  });
  abt.edit = false;
  abt.save = function () {
    abt.aboutContent.$save(function () {
      abt.edit = false;
    });
  };
});
