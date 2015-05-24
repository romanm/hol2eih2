operation2Directive = function($scope, $http, $sce, $filter){
	console.log("operation2Directive");
	console.log(configHol);
//	$scope.collapseDialog = true;
	$scope.collapseDialog = 'op';
	$scope.operation = {};
	var checkSeekInterval;

	$scope.setSurgeryOp = function(op2set){
		console.log(op2set);
		$scope.operation.operation_id = op2set.operation_id;
		$scope.operation.operation_name = op2set.operation_name;
	}
	$scope.setOp = function(op2set){
		console.log(op2set);
		console.log("1 "+$scope.operation.operation_id );
		$scope.operation.operation_id = op2set.operationId;
		$scope.operation.operation_name = op2set.operationName;
		$scope.operation.operation_subgroup_id = op2set.operationSubgroupId;
		console.log("2 "+$scope.operation.operation_id );
		console.log($scope.operation);
	}

	makeFilteredOperationTree = function(){
		if(!$scope.operation)
			return;
		lastSeekOp = $scope.operation.operation_name;
		console.log(lastSeekOp+' - '+(new Date().toLocaleTimeString()));
		if(!lastSeekOp)
			return;
		$scope.filteredOperationTree = [];
		$filter('filter')($scope.operationTree, lastSeekOp).forEach(function(f1o) {
			$scope.filteredOperationTree.push(f1o);
			var last1 = $scope.filteredOperationTree[$scope.filteredOperationTree.length - 1];
			$filter('filter')(f1o.operationSubGroupChilds, lastSeekOp).forEach(function(f2o,i2) {
				if(0 == i2)
					last1.filterSubGroups = [];
				last1.filterSubGroups.push(f2o);
				var last2 = last1.filterSubGroups[last1.filterSubGroups.length - 1];
				$filter('filter')(f2o.operationChilds, lastSeekOp).forEach(function(f3o,i3) {
					if(0 == i3)
						last2.filterOperations = [];
					last2.filterOperations.push(f3o);
				})
			})
		})
//		console.log($scope.filteredOperationTree);
	}

	controlOpeSeek = function(){
		if(lastSeekOp.length != $scope.operation.operation_name.length){
			console.log(lastSeekOp);
			makeFilteredOperationTree();
		}
	}


	$scope.setSurgery = function(s){
	console.log(s);
		$scope.operation.personal_id = s.personal_id;
		$scope.operation.surgery_name = s.personal_surname + " " + s.personal_name + " " + s.personal_patronymic;
		$scope.collapseDialog = "false";
	}
	delAnesthetist = function(){
		$scope.operation.anesthetist_id = null;
		$scope.operation.anesthetist_name = null;
	}
	$scope.setAnesthetist = function(a){
		$scope.operation.anesthetist_id = a.personal_id;
		$scope.operation.anesthetist_name = a.personal_surname + " " + a.personal_name + " " + a.personal_patronymic;
		$scope.collapseDialog = "false";
	}
	delAnestesia = function(){
		$scope.operation.anestesia_id = null;
		$scope.operation.anestesia_name = null;
	}
	$scope.setAnestesia = function(a){
		$scope.operation.anestesia_id = a.anestesia_id;
		$scope.operation.anestesia_name = a.anestesia_name;
		$scope.collapseDialog = "false";
	}
	
	$scope.setDepartment = function(d){
		$scope.operation.department_id = d.department_id;
		$scope.operation.department_name = d.department_name;
		$scope.collapseDialog = "false";
	}
	$scope.setDiagnos = function(ds){
		$scope.operation.icd_id = ds.icdId;
		$scope.operation.icd_code = ds.icdCode;
		$scope.operation.icd_name = ds.icdName;
		$scope.collapseDialog = "false";
	}
	$scope.setOperationResult = function(or){
		$scope.operation.operation_result_id = or.operation_result_id;
		$scope.operation.operation_result_name = or.operation_result_name;
		$scope.collapseDialog = "false";
	}
	delComplication = function(){
		$scope.operation.operation_complication_name = null;
		$scope.operation.operation_complication_id = null;
	}
	$scope.setComplication = function(opc){
		$scope.operation.operation_complication_name = opc.operation_complication_name;
		$scope.operation.operation_complication_id = opc.operation_complication_id;
		$scope.collapseDialog = "false";
	}

	$scope.openDialog = function(dialogName){
		console.log(dialogName);
		$scope.collapseDialog = $scope.collapseDialog == dialogName ? 'false': dialogName;
		if(dialogName == "department"){
			$scope.departments = configHol.departments;
		}else if(dialogName == "operation_id"){
			$scope.openOpDialog();
		}else if(dialogName == "op"){
			if($scope.operation.personal_id){
				$http({ method : 'GET', url : "/hol/surgery_"+$scope.operation.personal_id+"_operation"
				}).success(function(data, status, headers, config) {
					$scope.surgeryOperation = data;
				}).error(function(data, status, headers, config) {
				});
			}
		}else if(dialogName == "opresult"){
			$scope.operationResultListe = configHol.operationResultListe;
		}else if(dialogName == "anestesia"){
			$http({ method : 'GET', url : "/hol/anestesia"
			}).success(function(data, status, headers, config) {
				$scope.anestesia = data;
				console.log($scope.anestesia);
			}).error(function(data, status, headers, config) {
			});
		}else if(dialogName == "anesthetist"){
			$http({ method : 'GET', url : "/hol/anesthetists"
			}).success(function(data, status, headers, config) {
				$scope.anesthetists = data;
			}).error(function(data, status, headers, config) {
			});
		}else if(dialogName == "surgery"){
			$http({ method : 'GET', url : "/hol/surgerys"
			}).success(function(data, status, headers, config) {
				$scope.surgerys = data;
			}).error(function(data, status, headers, config) {
			});
		}else if(dialogName == "complication"){
			$http({ method : 'GET', url : "/hol/operation-complication"
			}).success(function(data, status, headers, config) {
				$scope.opComplications = data;
			}).error(function(data, status, headers, config) {
			});
		}else if(dialogName == "durationOp"){
			calcOperationDuration();
		}
	}

	initOperation = function(){
		if($scope.user.authenticated){
//			if($scope.patientHistory.operationHistorys.length == 0){
			$scope.patientHistory.opEditIndex = 0;
			if(!$scope.param.ophid){
				$scope.patientHistory.opEditIndex = $scope.patientHistory.operationHistorys.length;
				$scope.patientHistory.operationHistorys.push({});
				var opStartDate = new Date();
				var mm = opStartDate.getMinutes();
				opStartDate.setMinutes(mm-mm%5);
				$scope.patientHistory.operationHistorys[$scope.patientHistory.opEditIndex].operation_history_start = opStartDate;
				$scope.patientHistory.operationHistorys[$scope.patientHistory.opEditIndex].operation_history_end = new Date();
				$scope.patientHistory.operationHistorys[$scope.patientHistory.opEditIndex].operation_name = "";
				$scope.patientHistory.operationHistorys[$scope.patientHistory.opEditIndex].history_id = $scope.patientHistory.historyId;
			}
			for (var i = 0; i < $scope.patientHistory.operationHistorys.length; i++) {
				if($scope.patientHistory.operationHistorys[i].operation_history_id
						== $scope.param.ophid){
					$scope.patientHistory.opEditIndex = i;
					break;
				}
			}
			console.log($scope.patientHistory.operationHistorys);
			manageOpeSeekInterval();
			calcOperationDuration();
		}
		console.log($scope.operation);
		var opStartDate = new Date($scope.operation.operation_history_start);
		$scope.ophStartHH = opStartDate.getHours();
		var mm = opStartDate.getMinutes();
		$scope.ophStartMM = mm-mm%5;
		if(!$scope.operation.department_id){
			console.log($scope.userDepartmentId);
			var department = $scope.configHol.departments[$scope.configHol.departmentsIdPosition[$scope.userDepartmentId]];
			console.log(department);
			$scope.setDepartment({"department_id":department.department_id,"department_name":department.department_name});
		}
		if(!$scope.operation.personal_id){
			$scope.operation.personal_id = $scope.userPersonalId;
			$scope.operation.surgery_name = $scope.patientHistory.user.name;
		}
		
		if(!$scope.operation.icd_id){
			for (var i = 0; i < $scope.patientHistory.diagnosis.length; i++) {
				var ds = $scope.patientHistory.diagnosis[i];
				$scope.setDiagnos(ds);
				if(ds.diagnoseId == 3)
					break;
			}
		}
	}

	$scope.saveOperation = function(){

		console.log("check field");
		console.log($scope.operation);
		$scope.operation.checkRequiredFiledList = [];
		$scope.requiredFiledList.forEach(function(key) {
			if(!$scope.operation[key])
				$scope.operation.checkRequiredFiledList.push(key);
		});

		var opStartDate = new Date($scope.operation.operation_history_start);
		$scope.operation.operation_history_start_long = opStartDate.getTime();
		var opEndDate = new Date($scope.operation.operation_history_end);
		$scope.operation.operation_history_end_long = opEndDate.getTime();
		$scope.operation.operation_history_duration_sec = $scope.operation_duration_min*60;

		$http({ method : 'POST', data : $scope.patientHistory, url : "/db/saveoperation"
		}).success(function(data, status, headers, config){
			console.log(data);
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
	}

	$scope.clickOphStartHH = function(hh){
		console.log(hh);
		var opStartDate = new Date($scope.operation.operation_history_start);
		console.log(opStartDate);
		opStartDate.setHours(hh);
		console.log(opStartDate);
		$scope.operation.operation_history_start = opStartDate.getTime();
		calcDurationEndDate();
	}
	$scope.clickOphStartMM = function(mm){
		var opStartDate = new Date($scope.operation.operation_history_start);
		opStartDate.setMinutes(mm);
		$scope.operation.operation_history_start = opStartDate.getTime();
		calcDurationEndDate();
	}

	manageOpeSeekInterval = function(){
		$scope.operation = $scope.patientHistory.operationHistorys[$scope.patientHistory.opEditIndex];
		if(!$scope.operation)
			return;
		if($scope.collapseDialog != "op"){
			clearInterval(checkSeekInterval);
		}else{
			checkSeekInterval = setInterval(controlOpeSeek, 1000);
			lastSeekOp = $scope.operation.operation_name;
		}
	}

	calcOperationDurationHHmm = function(){
		var free_min = Math.ceil($scope.operation_duration_min%60);
		var h = Math.ceil(($scope.operation_duration_min-free_min)/60);
		$scope.operation_duration_hhmm = h+" год. "+free_min+" хв.";
	}

	calcOperationDuration = function(){
		var diff = Math.abs($scope.operation.operation_history_end - $scope.operation.operation_history_start);
		console.log(diff);
		$scope.operation_duration_min = diff/(1000*60);
		calcOperationDurationHHmm();
	}

	$scope.setOperationDuration = function(operation_duration_min){
		$scope.operation_duration_min = operation_duration_min;
		calcDurationEndDate();
		calcOperationDurationHHmm();
	}

	calcDurationEndDate = function(){
		var opStartPlusDate = new Date($scope.operation.operation_history_start);
		opStartPlusDate.setMinutes($scope.operation_duration_min/1 + opStartPlusDate.getMinutes());
		$scope.operation.operation_history_end = opStartPlusDate.getTime();
	}
	$scope.openOpDialog = function(){
		$scope.openDialog("op");
		manageOpeSeekInterval();
	}

	$scope.activeTabName = "seek";
	$scope.activateTabName = function(newActiveTabName){
		$scope.activeTabName = newActiveTabName;
	}
	$scope.clickRootFolder = function(){
		$scope.isRootFolderOpen = true;
		$scope.isGroupFolderOpen = false;
	}
	$scope.closeGroupFolder = function(){
		$scope.isGroupFolderOpen = false;
		$scope.isRootFolderOpen = true;
	}
	$scope.openGroupFolder = function(groupFolder){
		$scope.openedGroupFolder = groupFolder;
		$scope.isGroupFolderOpen = true;
		$scope.isRootFolderOpen = false;
	}
	$scope.clickSubgroupFolder = function(subgroupFolder){
		$scope.openedSubgroupFolder = subgroupFolder;
	}
	$scope.clickFolder = function(clickedFolderLevel){
		//clickedFolderLevel=[root,group,subgroup]
	}
	$scope.isRootFolderOpen = false;
	$scope.isGroupFolderOpen = false;
	$scope.isSubgroupFolderOpen = false;

}
