cuwyApp.controller('OpCtrl', [ '$scope', '$http', '$filter', '$sce', 
		function ($scope, $http, $filter, $sce) {
	console.log("OpCtrl");

	$scope.requiredFiledList = ["operation_id","operation_result_id","icd_id"];
	$scope.requiredFileds = {
		"operation_result_id":{
			dialogJsName:"opresult"
			, dialogName:"Результат"
		}
		,"operation_id":{
			dialogJsName:"operation_id"
			, dialogName:"Код операції"
		}
		,"icd_id":{
			dialogJsName:"diagnos"
			, dialogName:"Діагноз при операції"
		}
	};
	$scope.operationTree = operationTree;
	$scope.configHol = configHol;
	readInitHistory($scope, $http, $sce, $filter);
	operationDirective($scope, $http, $sce, $filter);
	operation2Directive($scope, $http, $sce, $filter);

	$http({ method : 'GET', url : $scope.historyFile
	}).success(function(data, status, headers, config) {
		$scope.patientHistory = data;
		$scope.patientHistory.movePatientDepartment = {};
		initAppConfig($scope, $http, $sce, $filter);
		initHistory();
		
		initOperation();
		
		makeFilteredOperationTree();
	}).error(function(data, status, headers, config) {
	});

	$scope.menuDeletComplication = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити', function () {
			delComplication();
		}]
	];

	$scope.menuDeletAnesthetist = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити', function () {
			delAnesthetist();
		}]
	];

	$scope.menuDeletAnestesia = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити', function () {
			delAnestesia();
		}]
	];

	} ]);

cuwyApp.controller('BasicAnalysisCtrl', [ '$scope', '$http', '$filter', '$sce', 
		function ($scope, $http, $filter, $sce) {
	console.log('BasicAnalysisCtrl');
	$http({method : 'GET', url : "/hol/basicAnalysis_2015_1_3"
	}).success(function(data, status, headers, config) {
		$scope.data = data;
		console.log($scope.data);
	}).error(function(data, status, headers, config) {
	});
} ]);
cuwyApp.controller('AdminCtrl', [ '$scope', '$http', '$filter', '$sce', 
	function ($scope, $http, $filter, $sce) {
		console.log('AdminCtrl');
} ]);

cuwyApp.controller('LoginCtrl', [ '$scope', '$http', '$filter', '$sce', 
		function ($scope, $http, $filter, $sce) {
	console.log("LoginCtrl");
	$http({ method : 'GET', url : "/user"
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

cuwyApp.controller('departmentCtrl', ['$scope', '$sce', '$filter', '$http', function ($scope, $sce, $filter, $http) {
	
	$scope.movePatientDepartment = function(){
		console.log("movePatientDepartment");
		console.log($scope.patientHistory);
		console.log($scope.patientHistory.user);
		
		initAppConfig($scope, $http, $sce, $filter);
		var departmentHistoryIn = new Date();
		var departmentHistory = {};
		departmentHistory.historyId = $scope.patientHistory.historyId;
		departmentHistory.departmentId = $scope.patientEditing.departmentId;
		departmentHistory.personalId = $scope.userPersonalId;
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
		calcDsReportTable();
		calcAdressReportTable();
		//		clearInterval(checkLoadTimeInterval);
		if(angular.isDefined(checkLoadTimeInterval)){
			$interval.cancel(checkLoadTimeInterval);
			checkLoadTimeInterval=undefined;
		}
		$scope.loadDurationMs = new Date().getTime() - startLoadTime.getTime();
		//initAppConfig($scope, $http, $sce, $filter);
	}).error(function(data, status, headers, config) {
	});
	$scope.getAdReportTableKey = function(){
		if($scope.data){
			return Object.keys($scope.data.adressReportTable).sort();
		}
		else 
			return [];
	}
	$scope.getDsReportTableKey = function(){
		if($scope.data)
			return Object.keys($scope.data.dsReportTable);
		else 
			return [];
	}
	calcAdressReportTable = function(){
		$scope.data.adressReportTable = {};
		$scope.data.adReferral.forEach(function(adReferral) {
			var adress_code = adReferral.adress_code;
			setAdressRegionCode(adress_code);
			if($scope.data.adressReportTable[adress_code]["adReferral"] === undefined)
				$scope.data.adressReportTable[adress_code]["adReferral"] = [];
			if(adReferral.referral == 99999 ){
				$scope.data.adressReportTable[adress_code].cnt.transferIn = adReferral.cnt_referral;
				$scope.data.adressReportTable[adress_code].bedday.transferIn = adReferral.sum_b_d;
			}else if(adReferral.referral == 1){
				$scope.data.adressReportTable[adress_code].cnt.withoutReferralIn = adReferral.cnt_referral;
				$scope.data.adressReportTable[adress_code].bedday.withoutReferralIn = adReferral.sum_b_d;
			}else{
				$scope.data.adressReportTable[adress_code].cnt.withReferralIn = adReferral.cnt_referral;
				$scope.data.adressReportTable[adress_code].bedday.withReferralIn = adReferral.sum_b_d;
			}
		});
		$scope.data.adDeadOrvipisany.forEach(function(adDeadOrvipisany) {
			var adress_code = adDeadOrvipisany.adress_code;
			setAdressRegionCode(adress_code);
			if($scope.data.adressReportTable[adress_code]["adDeadOrvipisany"] === undefined)
				$scope.data.adressReportTable[adress_code]["adDeadOrvipisany"] = [];
			$scope.data.adressReportTable[adress_code]["adDeadOrvipisany"].push(adDeadOrvipisany);
			if(adDeadOrvipisany.deadVipisan == 0){
				$scope.data.adressReportTable[adress_code].cnt.dead = adDeadOrvipisany.cnt_deadVipisan;
				$scope.data.adressReportTable[adress_code].bedday.dead = adDeadOrvipisany.sum_b_d;
			}else{
				$scope.data.adressReportTable[adress_code].cnt.discharged = adDeadOrvipisany.cnt_deadVipisan;
				$scope.data.adressReportTable[adress_code].bedday.discharged = adDeadOrvipisany.sum_b_d;
			}
		});
		$scope.data.adPerevedeni.forEach(function(adPerevedeni) {
			var adress_code = adPerevedeni.adress_code;
			setAdressRegionCode(adress_code);
			if($scope.data.adressReportTable[adress_code]["adPerevedeni"] === undefined)
				$scope.data.adressReportTable[adress_code]["adPerevedeni"] = [];
			$scope.data.adressReportTable[adress_code]["adPerevedeni"].push(adPerevedeni);
			$scope.data.adressReportTable[adress_code].cnt.referralOut = adPerevedeni.cnt_adress_code;
			$scope.data.adressReportTable[adress_code].bedday.referralOut = adPerevedeni.sum_b_d;
		});
		console.log($scope.data.adressReportTable);
	}
	setAdressRegionCode = function(adress_code){
		if($scope.data.adressReportTable[adress_code] === undefined){
			$scope.data.adressReportTable[adress_code] = {};
			$scope.data.adressReportTable[adress_code].cnt = {};
			$scope.data.adressReportTable[adress_code].bedday = {};
		}
	}
	setCdsCode = function(cds_code){
		if($scope.data.dsReportTable[cds_code] === undefined){
			$scope.data.dsReportTable[cds_code] = {};
			$scope.data.dsReportTable[cds_code].cnt = {};
			$scope.data.dsReportTable[cds_code].bedday = {};
		}
	}
	calcDsReportTable = function(){
		$scope.data.dsReportTable = {};
		$scope.data.dsReferral.forEach(function(dsReferral) {
			var cds_code = dsReferral.cds_code;
			setCdsCode(cds_code);
			$scope.data.dsReportTable[cds_code].cDs = dsReferral.cDs;
			if($scope.data.dsReportTable[cds_code]["dsReferral"] === undefined)
				$scope.data.dsReportTable[cds_code]["dsReferral"] = [];
			$scope.data.dsReportTable[cds_code]["dsReferral"].push(dsReferral);
			if(dsReferral.referral == 99999 ){
				$scope.data.dsReportTable[cds_code].cnt.transferIn = dsReferral.cnt_ref;
				$scope.data.dsReportTable[cds_code].bedday.transferIn = dsReferral.sum_b_d;
			}else if(dsReferral.referral == 1){
				$scope.data.dsReportTable[cds_code].cnt.withoutReferralIn = dsReferral.cnt_ref;
				$scope.data.dsReportTable[cds_code].bedday.withoutReferralIn = dsReferral.sum_b_d;
			}else{
				$scope.data.dsReportTable[cds_code].cnt.withReferralIn = dsReferral.cnt_ref;
				$scope.data.dsReportTable[cds_code].bedday.withReferralIn = dsReferral.sum_b_d;
			}
		});
		$scope.data.dsMistoSelo.forEach(function(dsMistoSelo) {
			var cds_code = dsMistoSelo.cds_code;
			setCdsCode(cds_code);
			if($scope.data.dsReportTable[cds_code]["dsMistoSelo"] === undefined)
				$scope.data.dsReportTable[cds_code]["dsMistoSelo"] = [];
			$scope.data.dsReportTable[cds_code]["dsMistoSelo"].push(dsMistoSelo);
			if(dsMistoSelo.locality_type == 1){
				$scope.data.dsReportTable[cds_code].cnt.misto = dsMistoSelo.cnt_locality_type;
				$scope.data.dsReportTable[cds_code].bedday.misto = dsMistoSelo.sum_b_d;
			}else{
				$scope.data.dsReportTable[cds_code].cnt.selo = dsMistoSelo.cnt_locality_type;
				$scope.data.dsReportTable[cds_code].bedday.selo = dsMistoSelo.sum_b_d;
			}
		});
		$scope.data.dsDeadOrvipisany.forEach(function(dsDeadOrvipisany) {
			var cds_code = dsDeadOrvipisany.cds_code;
			setCdsCode(cds_code);
			if($scope.data.dsReportTable[cds_code]["dsDeadOrvipisany"] === undefined)
				$scope.data.dsReportTable[cds_code]["dsDeadOrvipisany"] = [];
			$scope.data.dsReportTable[cds_code]["dsDeadOrvipisany"].push(dsDeadOrvipisany);
			if(dsDeadOrvipisany.deadVipisan == 0){
				$scope.data.dsReportTable[cds_code].cnt.dead = dsDeadOrvipisany.cnt_deadVipisan;
				$scope.data.dsReportTable[cds_code].bedday.dead = dsDeadOrvipisany.sum_b_d;
			}else{
				$scope.data.dsReportTable[cds_code].cnt.discharged = dsDeadOrvipisany.cnt_deadVipisan;
				$scope.data.dsReportTable[cds_code].bedday.discharged = dsDeadOrvipisany.sum_b_d;
			}
		});
		$scope.data.dsPerevedeni.forEach(function(dsPerevedeni) {
			var cds_code = dsPerevedeni.cds_code;
			setCdsCode(cds_code);
			if($scope.data.dsReportTable[cds_code]["dsPerevedeni"] === undefined)
				$scope.data.dsReportTable[cds_code]["dsPerevedeni"] = [];
			$scope.data.dsReportTable[cds_code]["dsPerevedeni"].push(dsPerevedeni);
			$scope.data.dsReportTable[cds_code].cnt.referralOut = dsPerevedeni.cnt_cds_code;
			$scope.data.dsReportTable[cds_code].bedday.referralOut = dsPerevedeni.sum_b_d;
		});
		console.log($scope.data.dsReportTable);
	};
	//---------------------adress report----------------------------------------
	
	//---------------------adress report-------------------------------------END
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

archivesFile = "/hol/archives_"+parameters.dep;
cuwyApp.controller('ArchivesCtrl', [ '$scope', '$http', '$filter', '$sce',function ($scope, $http, $filter, $sce) {
	initDepartmentArchiveCtrl($scope);
	$scope.parameters = parameters;
	$scope.departmentsHol = configHol.departments;
	$scope.seekInArchives = "";

	$scope.changeSeekInArchives = function(){
		console.log("seekInArchives");
		console.log($scope.seekInArchives);
		seekInArchivesDb();
	}

	var seekInArchivesDb = function(){
		$http({ method : 'GET', url : archivesFile+"_"+$scope.seekInArchives
		}).success(function(data, status, headers, config) {
			$scope.department = data;
			console.log($scope.department)
			seekDepartmentFromConfig($scope, $scope.department.department_id);
			initAppConfig($scope, $http, $sce, $filter);
		}).error(function(data, status, headers, config) {
		});
	};

	seekInArchivesDb();

}]);

var seekDepartmentFromConfig = function($scope, departmentId){
	$scope.departmentsHol.forEach(function(d){
		if(departmentId == d.department_id){
			$scope.departmentFromConfig = d;
		}
	})
};

var initDepartmentArchiveCtrl = function ($scope){
	
	$scope.hoverIn = function() { this.hoverEdit = true; };
	$scope.hoverOut = function() { this.hoverEdit = false; };


	$scope.openPatientShortHistory = function(patient){
		console.debug('openPatientShortHistory');
		window.location.href = "/hol/history.html?hno="+patient.history_id;
	}

	$scope.movePatient = function(patient){
		patient.collapseMovePatient = !patient.collapseMovePatient;
		console.log(patient.collapseMovePatient);
	}

}

departmentFile = "/hol/department_"+parameters.dep;
cuwyApp.controller('DepartmentCtrl', [ '$scope', '$http', '$filter', '$sce', function ($scope, $http, $filter, $sce) {
	initDepartmentArchiveCtrl($scope);
	$scope.parameters = parameters;
	console.log('DepartmentCtrl');
	$scope.departmentsHol = configHol.departments;
	$scope.hol1host = configHol.hol1host;
	$scope.patientEditing = {}

	
	$http({ method : 'GET', url : departmentFile
	}).success(function(data, status, headers, config) {
		$scope.department = data;
		seekDepartmentFromConfig($scope, $scope.department.department_id);
		initAppConfig($scope, $http, $sce, $filter);
	}).error(function(data, status, headers, config) {
	});
	
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

} ] );
