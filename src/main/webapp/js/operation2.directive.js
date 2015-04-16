operation2Directive = function($scope, $http, $sce, $filter){
	console.log("operation2Directive");

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
		console.log($scope.openedGroupFolder);
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
