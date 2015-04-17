operation2Directive = function($scope, $http, $sce, $filter){
	console.log("operation2Directive");

	$scope.setOp = function(op2set, editedOperation){
		console.log(op2set);
		console.log(editedOperation);
		editedOperation.operation_code = op2set.operationCode;
		editedOperation.operation_name = op2set.operationName;
		editedOperation.operation_subgroup_id = op2set.operationSubgroupId;
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
