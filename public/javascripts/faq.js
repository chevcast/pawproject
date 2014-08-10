var faqApp = angular.module('faq', ['ngResource']);

faqApp.factory('Faq', function ($resource) {
  return $resource('/api/faq/:id', { id: '@_id' });
});

faqApp.controller('faqController', function ($scope, Faq) {

  $scope.items = [];

  Faq.query(function (faqs) {
    faqs.forEach(function (faq) {
      $scope.items.push({
        edit: false,
        showControls: false,
        faq: faq
      });
    });
  });

  $scope.newQuestion = function () {
    $scope.items.push({
      edit: true,
      showControles: false,
      faq: new Faq()
    });
  };

  $scope.isUnchanged = function (item) {
    return angular.equals(item.faq, item.original);
  };

  $scope.edit = function (item) {
    item.edit = true;
    item.original = angular.copy(item.faq);
  };

  $scope.items.removeItem = function (item) {
    $scope.items.forEach(function (item2, index) {
      if (item === item2) {
        $scope.items.splice(index, 1);
      }
    });
  };

  $scope.remove = function (item) {
    if (confirm('This action is irreversible.')) {
      item.faq.$remove(function () {
        $scope.items.removeItem(item);
      });
    }
  };

  $scope.cancel = function (item) {
    if (!item.faq.hasOwnProperty('_id')) {
      $scope.items.removeItem(item);
    } else {
      item.edit = false;
    }
  };

  $scope.save = function (item) {
    if (item.faq.question && item.faq.answer) {
      item.faq.$save(function () {
        item.edit = false;
      });
    }
  };

});
