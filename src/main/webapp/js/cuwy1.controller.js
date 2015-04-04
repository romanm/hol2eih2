cuwyApp.controller('LoginCtrl', [ '$scope', '$http', '$filter', '$sce', 
		function ($scope, $http, $filter, $sce) {
	console.log("LoginCtrl");
	$http({
		method : 'GET',
		url : "/user"
	}).success(function(data, status, headers, config) {
		$scope.user = data;
		console.log($scope.user);
		console.log("--------------");
		console.log(document.querySelector("#username"));
		document.querySelector("#username").focus();
	}).error(function(data, status, headers, config) {
	});
} ]);

cuwyApp.controller('LogoutCtrl', [ '$scope', '$http', '$filter', '$sce', 
		function ($scope, $http, $filter, $sce) {
	console.log("LogoutCtrl");
	$http({
		method : 'GET',
		url : "/user"
	}).success(function(data, status, headers, config) {
		$scope.user = data;
		console.log($scope.user);
		console.log("--------------");
		initAppConfig($scope, $http, $sce, $filter);
	}).error(function(data, status, headers, config) {
	});
} ]);

cuwyApp.controller('HomeHolCtrl', [ '$scope', '$http', '$filter', '$sce', 
	function ($scope, $http, $filter, $sce) {
	console.log("HomeHolCtrl");
	$scope.departmentsHol = configHol.departments;
	$http({ method : 'GET', url : "/user"
	}).success(function(data, status, headers, config) {
		$scope.user = data;
		console.log($scope.user.name);
		console.log($scope.user);
		initAppConfig($scope, $http, $sce, $filter);
	}).error(function(data, status, headers, config) {
	});
} ] );

cuwyApp.controller('departmentCtrl', [ '$scope', '$http',function ($scope, $http) {
	
	$scope.movePatientDepartment = function(){
		console.log("movePatientDepartment");
		console.log($scope.patientHistory);
		console.log($scope.patientHistory.user);
		
		var departmentHistory = {};
		var personalId = $scope.patientHistory.user.authorities[0].authority.split("_")[2].split("-")[1];
		var departmentHistoryIn = new Date();
		departmentHistory.historyId = $scope.patientHistory.historyId;
		departmentHistory.departmentId = $scope.patientEditing.departmentId;
		departmentHistory.personalId = personalId;
		departmentHistory.departmentHistoryIn = departmentHistoryIn;

		console.log(departmentHistory);
		postObject("/db/movePatientDepartment", departmentHistory, $scope, $http);
	}

	$scope.writeDepartment = function(department){
		$scope.patientEditing.departmentName = department.department_name;
		$scope.patientEditing.departmentId = department.department_id;
		console.log($scope.patientEditing);
		/*
		$scope.patientHistory.patientDepartmentMovements[0].departmentId = department.department_id;
		$scope.patientHistory.patientDepartmentMovements[0].departmentName = department.department_name;
		console.log($scope.patientHistory.patientDepartmentMovements[0]);
		console.log($scope.patientHistory);
		console.log($scope.patientHistory.historyDepartmentIn);
		 */
	}

}]);

departmentFile = "/hol/department_"+parameters.dep;

cuwyApp.controller('DepartmentCtrl', [ '$scope', '$http', function ($scope, $http) {
	$scope.departmentsHol = configHol.departments;
	$scope.patientEditing = {}

	$scope.parameters = parameters;
	$scope.calculateAge = function (birthday) {
		var ageDifMs = Date.now() - new Date(birthday);
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	$scope.addDepartmentNewPatien = function(){
		$scope.department.patientesDiagnoses.push($scope.newPatient)
		var postNewPatien = $http({
			method : 'POST',
			data : $scope.department,
			url : 'addDepartmentNewPatien'
		}).success(function(data, status, headers, config){
			$scope.department = data;
		}).error(function(data, status, headers, config) {
		});
	}

	$scope.movePatient = function(patient){
		patient.collapseMovePatient = !patient.collapseMovePatient;
	}

	$scope.openPatientShortHistory = function(patient){
		console.debug('openPatientShortHistory');
		window.location.href = "/hol/history.html?hno="+patient.history_id;
	}

	$scope.openPatientInfo = function(patient){
		patient.collapsed = !patient.collapsed;
		if(!patient.collapsed){
			$http({
				method : 'POST',
				data : patient,
				url : '/openShortPatienHistory'
			}).success(function(data, status, headers, config){
				patient.patientHistory = data;
			}).error(function(data, status, headers, config) {
			});
		}
	}

	$scope.menuPatientList = [
		['<span class="glyphicon glyphicon-floppy-open"></span> Відкрити іс.хв.', function ($itemScope) {
			console.debug('Edit');
			console.log($itemScope);
			console.log($itemScope.patient);
			$scope.openPatientShortHistory($itemScope.patient);
		}],
		null,
		['<b>∑</b> Зведена інформація', function ($itemScope) {
			console.debug('Add');
			$scope.openPatientInfo($itemScope.patient);
		}],
		['<span class="glyphicon glyphicon-transfer"></span> Переведеня', function ($itemScope) {
			console.debug('Add');
			console.debug($itemScope.patient);
			$scope.movePatient($itemScope.patient);
		}]
	];

	$http({
		method : 'GET',
		url : departmentFile
	}).success(function(data, status, headers, config) {
		$scope.department = data;
	}).error(function(data, status, headers, config) {
	});

} ] );
