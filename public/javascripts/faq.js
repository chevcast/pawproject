angular.module('faq', ['ngResource'])
    .factory('FAQ', function ($resource) {
        return $resource(
            '/api/faq/:id',
            { id: '@id' },
            {
                'update': {method: 'PUT'},
            }
        );
    })
    .controller('faqController', function ($scope, FAQ) {
        $scope.items = FAQ.query();
    });
