//var historyFile = window.location.pathname.replace(/history_/,"history_id_");

cuwyApp.controller('HistoryCtrl', [ '$scope', '$http', '$filter', '$sce', function ($scope, $http, $filter, $sce) {
	console.log('HistoryCtrl');

	$scope.operationTree = operationTree;
	$scope.departmentsHol = configHol.departments;
	$scope.diagnosesHol = configHol.diagnosesHol;

	$scope.patientEditing = {}
	$scope.patient = {
		name: 'Patient name',
		history_no: parameters.hno,
		patientHistory: null
	};

	initDeclareController($scope, $http, $sce, $filter);
	$scope.hno = parameters.hno;

	readInitHistory($scope, $http, $sce, $filter);

	$scope.diagnosEditIndex = 0;
	initseekIcd10Tree($scope, $http, $sce, $filter);

	$scope.saveWorkDoc = function(){
		console.log("----");
		console.log($scope.patientHistory);
		$http({ method : 'POST', data : $scope.patientHistory, url : "/db/savehistory"
		}).success(function(data, status, headers, config){
			console.log(data);
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
		console.log("----");
	}

	
	$scope.writeDepartment = function(department){
		console.log(department);
		$scope.patientHistory.movePatientDepartment.departmentName = 
			department.department_name;
	}

	$scope.menuMovePatient = [
		['<span class="glyphicon glyphicon-transfer"></span> Переведеня', function ($itemScope) {
			console.debug('Move');
			console.debug($itemScope);
			$scope.patientHistory.collapseMovePatient = !$scope.patientHistory.collapseMovePatient
		}]
	];

} ] );
