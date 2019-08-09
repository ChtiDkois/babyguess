angular.module('babyguess', ['ngRoute', 'ngResource', 'ngCookies', 'ui.bootstrap'])

.value('backURL', 'https://vlaams-dk.fr/babyguess/v1/')

.config(['$httpProvider', '$interpolateProvider', function($httpProvider, $interpolateProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}])

.controller('ListCtrl', function($scope, $modal, $http, $filter, $window) {
//  $scope.pronos = [{
//      id : "1",
//      player : "Actarus",
//      gender : "M",
//      weight : 3200,
//      height : 53,
//      girlName : "Cilia",
//      boyName : "Pierre"
//    }, {
//      id : "2",
//      player : "Kame",
//      gender : "F",
//      weight : 2900,
//      height : 47,
//      girlName : "Louise",
//      boyName : "Bob"
//    }
//  ];

  $scope.pronos = [];

  var getPronos = $http.get("json/pronos")
  .success(function(data) {
    $scope.pronos = data;
    refreshTendance();
  });

  $scope.newChallenger = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'static/new.html',
      controller: ModalInstanceCtrl,
      size: size,
    });

    modalInstance.result.then(function (prono) {
      if(angular.isDate(prono.estimatedDate)) {
        prono.estimatedDate = $filter('date')(prono.estimatedDate, "yyyy-MM-dd");
      }
      $http.post("/prono", prono)
      .success(function () {
        $scope.pronos.push({fields : prono});
        refreshTendance();
      });
    });
  };

  getClass = function(gender) {
    valuedClass = "prono";
    if (gender == 'M' || gender =='m') {
      valuedClass= "boy";
    } else if (gender == "F" || gender == "f") {
      valuedClass = "girl";
    }
    return valuedClass;
  };

  refreshTendance = function() {
    var sumWeight = 0;
    var sumHeight = 0;
    var sumBoys = 0;
    var sumGirls = 0;
    for (var t = 0; t < $scope.pronos.length; t++) {
      sumWeight += $scope.pronos[t].fields.weight;
      sumHeight += $scope.pronos[t].fields.height;
      if ($scope.pronos[t].fields.gender == "M") {
        sumBoys += 1;
      } else if ($scope.pronos[t].fields.gender == "F") {
        sumGirls += 1;
      }
    }
    $scope.tendance = {
      weight : $window.Math.round(sumWeight / $scope.pronos.length),
      height : $window.Math.round(sumHeight / $scope.pronos.length)
    };
    if (sumBoys > sumGirls) {
      $scope.tendance.gender = "un gars";
    } else if (sumGirls > sumBoys) {
      $scope.tendance.gender = "une nana";
    } else {
      $scope.tendance.gender = "soit une nana, soit un gars";
    }
  }

})

.controller('EditCtrl', function($scope, $location, $routeParams) {
});


var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.newprono = {};

  $scope.ok = function () {
    $modalInstance.close($scope.newprono);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
