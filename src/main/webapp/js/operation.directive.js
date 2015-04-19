operationDirective = function($scope, $http, $sce, $filter){
	console.log("operationDirective");
	var lastSeekOp = "";
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

	}
