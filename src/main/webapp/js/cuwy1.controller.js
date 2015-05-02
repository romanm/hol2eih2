cuwyApp.controller('OpCtrl', [ '$scope', '$http', '$filter', '$sce', 
		function ($scope, $http, $filter, $sce) {
	console.log("OpCtrl");
	$scope.operationTree = operationTree;
	readInitHistory($scope, $http, $sce, $filter);
	operationDirective($scope, $http, $sce, $filter);
	operation2Directive($scope, $http, $sce, $filter);

	$http({ method : 'GET', url : $scope.historyFile
	}).success(function(data, status, headers, config) {
		$scope.patientHistory = data;
		$scope.patientHistory.movePatientDepartment = {};
		initHistory();
		initAppConfig($scope, $http, $sce, $filter);
		manageOpeSeekInterval(0);
		makeFilteredOperationTree();
	}).error(function(data, status, headers, config) {
	});

	$scope.saveOperation = function(){
		$http({ method : 'POST', data : $scope.patientHistory, url : "/db/saveoperation"
		}).success(function(data, status, headers, config){
			console.log(data);
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
	}

	} ]);

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
		
		initAppConfig($scope, $http, $sce, $filter);
		var departmentHistoryIn = new Date();
		var departmentHistory = {};
		departmentHistory.historyId = $scope.patientHistory.historyId;
		departmentHistory.departmentId = $scope.patientEditing.departmentId;
		departmentHistory.personalId = $scope.personalId;
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

cuwyApp.controller('quartalReportCtrl', [ '$scope','$interval', '$http', '$filter', '$sce',
		function ($scope, $interval, $http, $filter, $sce) {
	console.log('quartalReportCtrl');
	
	var startLoadTime = new Date();
	
	loadDurationTimer = function () {
		var loadDurationMs = new Date().getTime() - startLoadTime.getTime();
		$scope.loadDurationS_MS = to_mmssMsec(loadDurationMs);
	}
	loadDurationTimer();
	
	var checkLoadTimeInterval = $interval(function(){loadDurationTimer()},1023);

	$http({
		method : 'GET',
		url : "/hol/quartalReport_"+parameters.dep
	}).success(function(data, status, headers, config) {
		$scope.department = data.department;
		$scope.data = data;
		console.log($scope.data);
		calcReport();
		//		clearInterval(checkLoadTimeInterval);
		if(angular.isDefined(checkLoadTimeInterval)){
			$interval.cancel(checkLoadTimeInterval);
			checkLoadTimeInterval=undefined;
		}
		$scope.loadDurationMs = new Date().getTime() - startLoadTime.getTime();
		//initAppConfig($scope, $http, $sce, $filter);
	}).error(function(data, status, headers, config) {
	});

	$scope.getReportTableKey = function(){
		if($scope.data)
			return Object.keys($scope.data.reportTable);
		else 
			return [];
	}
	setCdsCode = function(cds_code){
		if($scope.data.reportTable[cds_code] === undefined){
			$scope.data.reportTable[cds_code] = {};
			$scope.data.reportTable[cds_code].cnt = {};
			$scope.data.reportTable[cds_code].bedday = {};
		}
	}
	calcReport = function(){
		$scope.data.reportTable = {};
		$scope.data.dsReferral.forEach(function(dsReferral) {
			var cds_code = dsReferral.cds_code;
			setCdsCode(cds_code);
			$scope.data.reportTable[cds_code].cDs = dsReferral.cDs;
			if($scope.data.reportTable[cds_code]["dsReferral"] === undefined)
				$scope.data.reportTable[cds_code]["dsReferral"] = [];
			$scope.data.reportTable[cds_code]["dsReferral"].push(dsReferral);
			if(dsReferral.referral == 99999 ){
				$scope.data.reportTable[cds_code].cnt.transferIn = dsReferral.cnt_ref;
				$scope.data.reportTable[cds_code].bedday.transferIn = dsReferral.sum_b_d;
			}else if(dsReferral.referral == 1){
				$scope.data.reportTable[cds_code].cnt.withoutReferralIn = dsReferral.cnt_ref;
				$scope.data.reportTable[cds_code].bedday.withoutReferralIn = dsReferral.sum_b_d;
			}else{
				$scope.data.reportTable[cds_code].cnt.withReferralIn = dsReferral.cnt_ref;
				$scope.data.reportTable[cds_code].bedday.withReferralIn = dsReferral.sum_b_d;
			}
		});
		$scope.data.dsMistoSelo.forEach(function(dsMistoSelo) {
			var cds_code = dsMistoSelo.cds_code;
			setCdsCode(cds_code);
			if($scope.data.reportTable[cds_code]["dsMistoSelo"] === undefined)
				$scope.data.reportTable[cds_code]["dsMistoSelo"] = [];
			$scope.data.reportTable[cds_code]["dsMistoSelo"].push(dsMistoSelo);
			if(dsMistoSelo.locality_type == 1){
				$scope.data.reportTable[cds_code].cnt.misto = dsMistoSelo.cnt_locality_type;
				$scope.data.reportTable[cds_code].bedday.misto = dsMistoSelo.sum_b_d;
			}else{
				$scope.data.reportTable[cds_code].cnt.selo = dsMistoSelo.cnt_locality_type;
				$scope.data.reportTable[cds_code].bedday.selo = dsMistoSelo.sum_b_d;
			}
		});
		$scope.data.dsDeadOrvipisany.forEach(function(dsDeadOrvipisany) {
			var cds_code = dsDeadOrvipisany.cds_code;
			setCdsCode(cds_code);
			if($scope.data.reportTable[cds_code]["dsDeadOrvipisany"] === undefined)
				$scope.data.reportTable[cds_code]["dsDeadOrvipisany"] = [];
			$scope.data.reportTable[cds_code]["dsDeadOrvipisany"].push(dsDeadOrvipisany);
			if(dsDeadOrvipisany.deadVipisan == 0){
				$scope.data.reportTable[cds_code].cnt.dead = dsDeadOrvipisany.cnt_deadVipisan;
				$scope.data.reportTable[cds_code].bedday.dead = dsDeadOrvipisany.sum_b_d;
			}else{
				$scope.data.reportTable[cds_code].cnt.discharged = dsDeadOrvipisany.cnt_deadVipisan;
				$scope.data.reportTable[cds_code].bedday.discharged = dsDeadOrvipisany.sum_b_d;
			}
		});
		$scope.data.dsPerevedeni.forEach(function(dsPerevedeni) {
			var cds_code = dsPerevedeni.cds_code;
			setCdsCode(cds_code);
			if($scope.data.reportTable[cds_code]["dsPerevedeni"] === undefined)
				$scope.data.reportTable[cds_code]["dsPerevedeni"] = [];
			$scope.data.reportTable[cds_code]["dsPerevedeni"].push(dsPerevedeni);
			$scope.data.reportTable[cds_code].cnt.referralOut = dsPerevedeni.cnt_cds_code;
			$scope.data.reportTable[cds_code].bedday.referralOut = dsPerevedeni.sum_b_d;
		});
		console.log($scope.data.reportTable);
	};
}]);
cuwyApp.controller('JornalMovePatientCtrl', [ '$scope', '$http', '$filter', '$sce',
		function ($scope, $http, $filter, $sce) {
	console.log('JornalMovePatientCtrl');
	$http({
		method : 'GET',
		url : "/hol/jornalMovePatient_"+parameters.dep
	}).success(function(data, status, headers, config) {
		$scope.department = data;
		$scope.jornalMovePatient = data.jornalMovePatient;
		console.log($scope.department);
		//initAppConfig($scope, $http, $sce, $filter);
	}).error(function(data, status, headers, config) {
	});
}]);

departmentFile = "/hol/department_"+parameters.dep;

cuwyApp.controller('DepartmentCtrl', [ '$scope', '$http', '$filter', '$sce',
	function ($scope, $http, $filter, $sce) {
	console.log('DepartmentCtrl');
	$scope.departmentsHol = configHol.departments;
	$scope.hol1host = configHol.hol1host;
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
		initAppConfig($scope, $http, $sce, $filter);
	}).error(function(data, status, headers, config) {
	});

} ] );
