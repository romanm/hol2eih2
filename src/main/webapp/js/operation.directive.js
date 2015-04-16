operationDirective = function($scope, $http, $sce, $filter){
	console.log("operationDirective");
	var checkSeekInterval;
	var lastSeekOp = "";
	var editedOperation ;
	$scope.operationTreePath = [0];
	$scope.openFolder = false;
	$scope.openFolderId = -1;
	
	$scope.isFolderOpen = function(deep, opObject){
		var id = -1;
		if(deep == 2){
			id = opObject.operationSubgroupId;
		}else if(deep == 1){
			if(opObject)
				id = opObject.operationGroupId;
		}else{
			id = 0;
		}
		return $scope.openFolderId == id && $scope.openFolder;
	}

	$scope.openOpGroup = function(deep, opObject){
		if(deep == 0){
			console.log();
			if(0 != $scope.openFolderId){
				$scope.openFolder = true;
			}else
				if(0 == $scope.operationTreePath[0]){
					$scope.openFolder = !$scope.openFolder;
				}
			$scope.openFolderId = 0;
		}else{
			if($scope.operationTreePath.length == 1){
				$scope.operationTreePath.push(opObject.operationGroupId);
			}else{
				$scope.operationTreePath[1] = opObject.operationGroupId;
			}
			if(opObject.operationSubgroupId){
				if($scope.operationTreePath.length == 2){
					$scope.operationTreePath.push(opObject.operationSubgroupId);
				}else
					if($scope.operationTreePath.length == 3){
						$scope.operationTreePath[2] = opObject.operationSubgroupId;
					}
				if(opObject.operationSubgroupId != $scope.openFolderId){
					$scope.openFolder = true;
				}else
					if(opObject.operationSubgroupId == $scope.operationTreePath[2]){
						$scope.openFolder = !$scope.openFolder;
					}
				$scope.openFolderId = opObject.operationSubgroupId;
				console.log(opObject.operationSubgroupId + "=="+ $scope.operationTreePath[2]+"/"+(opObject.operationSubgroupId == $scope.operationTreePath[2])+"/"+deep);
			}else if(opObject.operationGroupId){
				if(opObject.operationGroupId != $scope.openFolderId){
					$scope.openFolder = true;
				}else
					if(opObject.operationGroupId == $scope.operationTreePath[1]){
						$scope.openFolder = !$scope.openFolder;
					}
				$scope.openOperationGroup = opObject;
				console.log($scope.openOperationGroup);
				$scope.openFolderId = opObject.operationGroupId;
				console.log(opObject.operationGroupId + "=="+ $scope.operationTreePath[1]+"/"+(opObject.operationGroupId == $scope.operationTreePath[1])+"/"+deep);
			}
		}
		console.log($scope.operationTreePath);
	}

	makeFilteredOperationTree = function(){
		lastSeekOp = editedOperation.operation_name;
		console.log(lastSeekOp+' - '+(new Date().toLocaleTimeString()));
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
		if(lastSeekOp.length != editedOperation.operation_name.length)
			makeFilteredOperationTree();
	}

	manageOpeSeekInterval = function(index){
		if($scope.collapseOpDialog){
			clearInterval(checkSeekInterval);
		}else{
			checkSeekInterval = setInterval(controlOpeSeek, 1000);
			editedOperation = $scope.patientHistory.operationHistorys[index];
			lastSeekOp = editedOperation.operation_name;
		}
	}

	$scope.openOpDialog = function($index){
		$scope.collapseOpDialog = !$scope.collapseOpDialog;
		manageOpeSeekInterval($index);
	}

}
