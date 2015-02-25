var app = angular.module('pawproject', ['ngResource']);

app.controller('layoutController', function ($scope, $http) {
  $scope.showFeedbackForm = false;
  $scope.feedbackData = {
    status: {}
  };
  $scope.report = function () {
    $http.post('/api/reportFeedback', $scope.feedbackData)
      .success(function () {
        $scope.feedbackData.status = {
          msg: "Thanks for your feedback!",
          type: 'success'
        };
      })
      .error(function (err) {
        $scope.feedbackData.status = {
          msg: "Oops. There was an error sending your feedback. Please contact the administrator at alex.ford@codetunnel.com",
          type: 'error'
        };
        console.error(err);
      });
  };
});
