operation2Directive = function($scope, $http, $sce, $filter){
	console.log("operation2Directive");
	console.log(configHol);
//	$scope.collapseDialog = true;
	$scope.collapseDialog = 'op';
	$scope.operation = {};
	var checkSeekInterval;

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

	manageOpeSeekInterval = function(index){
		$scope.indexOp = index;
		$scope.operation = $scope.patientHistory.operationHistorys[index];
		console.log($scope.operation);
		if($scope.collapseDialog != "op"){
			clearInterval(checkSeekInterval);
		}else{
			checkSeekInterval = setInterval(controlOpeSeek, 1000);
			lastSeekOp = $scope.operation.operation_name;
		}
	}

	$scope.setSurgery = function(s){
		$scope.operation.personal_id = s.personal_id;
		$scope.operation.surgery_name = s.personal_surname + " " + s.personal_name + " " + s.personal_patronymic;
		$scope.collapseDialog = "false";
	}
	$scope.setAnesthetist = function(a){
		$scope.operation.anesthetist_id = a.personal_id;
		$scope.operation.anesthetist_name = a.personal_surname + " " + a.personal_name + " " + a.personal_patronymic;
		$scope.collapseDialog = "false";
	}
	$scope.setDepartment = function(d){
		console.log(d);
		$scope.operation.department_id = d.department_id;
		$scope.operation.department_name = d.department_name;
		$scope.collapseDialog = "false";
	}
	$scope.setOperationResult = function(or){
		$scope.operation.operation_result_id = or.operation_result_id;
		$scope.operation.operation_result_name = or.operation_result_name;
		$scope.collapseDialog = "false";
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
		}else if(dialogName == "opresult"){
			$scope.operationResultListe = configHol.operationResultListe;
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
			var diff = Math.abs($scope.operation.operation_history_end - $scope.operation.operation_history_start);
			var m_ms = 1000*60 
			var h_ms = m_ms*60 
			$scope.operation_duration_min = diff/m_ms;
			var free_min = $scope.operation_duration_min%60;
			var h = ($scope.operation_duration_min-free_min)/60;
		}
	}

	$scope.setOperationDuration = function(operation_duration_min){
		$scope.operation_duration_min = operation_duration_min;
		console.log($scope.operation_duration_min);
		var opDurationDate = new Date($scope.operation.operation_history_end)
		console.log(opDurationDate);
//		opDurationDate.setMinutes($scope.operation_duration_min - opDurationDate.getMinutes() - opDurationDate.getHours()*60);
		opDurationDate.setHours(0);
		opDurationDate.setMinutes(0);
		opDurationDate.setMinutes($scope.operation_duration_min);
		console.log(opDurationDate);
		$scope.operation.operation_history_end = opDurationDate.getTime();
	}

	$scope.openOpDialog = function(){
		$scope.openDialog("op");
		manageOpeSeekInterval($scope.indexOp);
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
