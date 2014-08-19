var faqApp = angular.module('faq', ['ngResource']);

// Map a Faq $resource to its API.
faqApp.factory('Faq', function ($resource) {
  return $resource('/api/faq/:id', { id: '@_id' });
});

faqApp.controller('faqController', function ($scope, Faq, $sce) {

  // Set the items to an empty array.
  $scope.items = [];

  $scope.$watch('items', function (items) {
    items.forEach(function (item) {
      if (item.faq.answer)
        item.parsedAnswer = $sce.trustAsHtml(marked(item.faq.answer));
      else
        item.parsedAnswer = null;
    });
  }, true);

  // Query for the FAQs and loop through them, adding a "meta-item"
  // for each faq. We'll use the meta object to track angular-specific
  // properties.
  Faq.query(function (faqs) {
    faqs.forEach(function (faq) {
      $scope.items.push({
        edit: false,
        showControls: false,
        faq: faq
      });
    });
  });

  // Add a new meta-item to the array with a new Faq.
  $scope.newQuestion = function () {
    $scope.items.push({
      edit: true,
      showControles: false,
      faq: new Faq()
    });
  };

  // Compare the updated faq to the original to determine if it has
  // been modified.
  $scope.isUnchanged = function (item) {
    return angular.equals(item.faq, item.original);
  };

  // Set the edit property on the meta-item to true and store a copy
  // of the faq before modification.
  $scope.edit = function (item) {
    item.edit = true;
    item.original = angular.copy(item.faq);
  };

  // A helper method to remove items from the array by value.
  $scope.items.removeItem = function (item) {
    $scope.items.forEach(function (item2, index) {
      if (item === item2) {
        $scope.items.splice(index, 1);
      }
    });
  };

  // Execute the remove action and remove the item from the array if
  // the operation is successful.
  $scope.remove = function (item) {
    if (confirm('This action is irreversible.')) {
      item.faq.$remove(function () {
        $scope.items.removeItem(item);
      });
    }
  };

  // Check if the faq has an _id property. If so, this was an edit
  // operation and the edit should simply be canceled. If there is
  // no _id then this was an add operation and the item should be
  // removed from the array entirely.
  $scope.cancel = function (item) {
    if (!item.faq.hasOwnProperty('_id')) {
      $scope.items.removeItem(item);
    } else {
      item.edit = false;
    }
  };

  // Execute a save operation on the faq and set edit to false.
  $scope.save = function (item) {
    item.faq.$save(function () {
      item.edit = false;
    });
  };

});
