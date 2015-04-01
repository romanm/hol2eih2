cuwyApp.controller('departmentCtrl', [ '$scope', '$http',function ($scope, $http) {
	
	$scope.writeDepartment = function(department){
		$scope.patientHistory.historyDepartmentIn = department.department_id;
		$scope.patientEditing.departmentName = department.department_name;
		/*
		$scope.patientHistory.patientDepartmentMovements[0].departmentId = department.department_id;
		$scope.patientHistory.patientDepartmentMovements[0].departmentName = department.department_name;
		console.log($scope.patientHistory.patientDepartmentMovements[0]);
		*/
		console.log($scope.patientHistory);
		console.log($scope.patientHistory.historyDepartmentIn);
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
		window.location.href = "/hol/history_"+patient.history_id;
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
