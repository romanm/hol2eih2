//var historyFile = window.location.pathname.replace(/history_/,"history_id_");

cuwyApp.controller('HistoryCtrl', [ '$scope', '$http', '$filter', '$sce', function ($scope, $http, $filter, $sce) {

	$scope.operationTree = operationTree;
	$scope.departmentsHol = configHol.departments;

	$scope.patientEditing = {}
	$scope.patient = {
		name: 'Patient name',
		history_no: parameters.hno,
		patientHistory: null
	};

	initDeclareController($scope, $http, $sce, $filter);

	console.log(window.location.pathname);
	$scope.hno = parameters.hno;
	var historyFile = "/db/history_id_"+parameters.hno;
	console.log(historyFile);
	
	$http({
		method : 'GET',
		url : historyFile
	}).success(function(data, status, headers, config) {
		$scope.patientHistory = data;
	}).error(function(data, status, headers, config) {
	});

	$scope.menuMovePatient = [
		['<span class="glyphicon glyphicon-transfer"></span> Переведеня', function ($itemScope) {
			console.debug('Move');
			console.debug($itemScope);
			$scope.patientHistory.collapseMovePatient = !$scope.patientHistory.collapseMovePatient
		}]
	];

} ] );
