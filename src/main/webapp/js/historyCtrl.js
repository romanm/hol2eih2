//var historyFile = window.location.pathname.replace(/history_/,"history_id_");

cuwyApp.controller('HistoryCtrl', [ '$scope', '$http', '$filter', '$sce', function ($scope, $http, $filter, $sce) {
	console.log('HistoryCtrl');

	$scope.operationTree = operationTree;
	$scope.configHol = configHol;
	$scope.departmentsHol = configHol.departments;
	$scope.diagnosesHol = configHol.diagnosesHol;

	$scope.patientEditing = {}
	$scope.patient = {
		name: 'Patient name',
		history_no: parameters.hno,
		patientHistory: null
	};

	//----------move patient----------------------------------------------------
	$scope.seekMoveDepartment = function(){
		console.debug('seekMoveDepartment');
		console.debug($scope.patientHistory.departmentHistoryIn);
	}
	//----------move patient-------------------------------------------------END

	initDeclareController($scope, $http, $sce, $filter);
	$scope.hno = parameters.hno;

	readInitHistory($scope, $http, $sce, $filter);
	initExtract = function(){
		$scope.today = function() {
			$scope.patientHistory.historyOut = new Date();
		};
		$scope.minDate = new Date($scope.patientHistory.historyIn);
		if(window.location.toString().indexOf("extract.html")){
			if(!$scope.patientHistory.historyOtherTreatment){
				$scope.patientHistory.historyOtherTreatment = "&nbsp;";
			}
			if(!$scope.patientHistory.historyExpertiseConslusion){
				$scope.patientHistory.historyExpertiseConslusion = "&nbsp;";
			}
			if(!$scope.patientHistory.historySpecial){
				$scope.patientHistory.historySpecial = "&nbsp;";
			}
		}
	}

	$http({ method : 'GET', url : $scope.historyFile
	}).success(function(data, status, headers, config) {
		$scope.patientHistory = data;
		console.log($scope.patientHistory);
		$scope.patientHistory.movePatientDepartment = {};
		initHistory();
		initExtract();
		initAppConfig($scope, $http, $sce, $filter);
		initDepartmentMoveCtrl($scope);
	}).error(function(data, status, headers, config) {
	});

	$scope.diagnosEditIndex = 0;
	initseekIcd10Tree($scope, $http, $sce, $filter);

	//-------------extract------------------------------------------------------
	$scope.removeExtract = function(){
		$http({ method : 'POST', data : $scope.patientHistory, url : "/db/removehistoryextract"
		}).success(function(data, status, headers, config){
			console.log("success remove exit");
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
		
	}
	$scope.saveExtract = function(){
		console.log("----");
		console.log($scope.patientHistory);
		var urlStr =  "/db/savehistoryextract"; 
		console.log(urlStr);
		console.log($scope.patientHistory.historyOut);
		var ho = new Date($scope.patientHistory.historyOut).getTime();
		console.log(ho);
		$scope.patientHistory.historyOut = ho;
		console.log($scope.patientHistory.historyOut);
		$http({ method : 'POST', data : $scope.patientHistory, url : urlStr
		}).success(function(data, status, headers, config){
			console.log(data);
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
		console.log("----");
	}
	$scope.tmpVariables = {};
	$scope.openDialog = function(dialogName){
		console.log(dialogName+" "+$scope.collapseDialog);
		$scope.collapseDialog = $scope.collapseDialog == dialogName ? 'false': dialogName;
		console.log(dialogName+" "+$scope.collapseDialog);
		if(dialogName == "historyOut"){
			console.log($scope.patientHistory.historyOut);
			var historyOut = new Date($scope.patientHistory.historyOut);
			console.log(historyOut);
			$scope.tmpVariables.historyOut_HH = historyOut.getHours();
			$scope.tmpVariables.historyOut_mm = historyOut.getMinutes();
			console.log($scope.tmpVariables);
		}
	}
	$scope.setHH2datetime = function(dt, hh){
		var dtTmp = new Date(dt);
		dtTmp.setHours(hh);
		console.log($scope.departmentHistoryIn);
		return dtTmp.getTime();
	}
	$scope.setMm2datetime = function(dt, mm){
		var dtTmp = new Date(dt);
		dtTmp.setMinutes(mm);
		console.log($scope.departmentHistoryIn);
		return dtTmp.getTime();
	}
	//-------------extract---------------------------------------------------END
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

	$scope.menuDeletOperation = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити', function ($itemScope) {
			console.log("menuDeletOperation");
			var deletedOperation = $scope.patientHistory.operationHistorys.splice($itemScope.$index,1);
			if(!$scope.patientHistory.deleteOperationHistorys)
				$scope.patientHistory.deleteOperationHistorys = deletedOperation;
			else
				deletedOperation.forEach(function(dOp) {
					$scope.patientHistory.deleteOperationHistorys.push(dOp);
				});
			console.log($scope.patientHistory.deleteOperationHistorys);
			console.log($scope.patientHistory);
		}]
	];

} ] );
