cuwyApp.controller('icd10Ctrl', [ '$scope', '$http',function ($scope, $http) {

	//$scope.iconsTreeClose = "chevron-right";
	//$scope.iconsTreeOpen = "chevron-down";
	//$scope.iconsTreeClose = "plus";
	//$scope.iconsTreeOpen = "minus";
	$scope.iconsTreeClose = "folder-close";
	$scope.iconsTreeOpen = "folder-open";
	$scope.focusDeepIndex = 0;
	$scope.icd10Pfad2Parents = [];

	$scope.icd10Root = icd10uaGroups;
	$scope.icd10Pfad2Parents[0] = $scope.icd10Root;
	$scope.icd10Selected = $scope.icd10Root.icd10Childs[0];

	$scope.isIcd10ChildsOpen = function(icd10Class){
		return icd10Class.icd10Childs && icd10Class.collapse;
	}

	$scope.setChangeTreeFilterView = function(){
		$scope.changeTreeFilterView = !$scope.changeTreeFilterView;
	}

	highlightSelect = function(icd10Class, fDeepIndex) {
		if(icd10Class.icdId == $scope.icd10Selected.icdId){
			$scope.focusDeepIndex = fDeepIndex - 1;
			if(!icd10Class.icd10Childs && $scope.icd10Selected.icd10Childs){
				var indexOfIcd10Selected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs.indexOf(icd10Class);
				$scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs[indexOfIcd10Selected] = $scope.icd10Selected;
			}
		}else
		if(icd10Class.icdStart <= $scope.icd10Selected.icdStart && icd10Class.icdEnd >= $scope.icd10Selected.icdEnd){
			$scope.icd10Pfad2Parents[fDeepIndex] = icd10Class;
		}
	}

	setDiagnosisOnAdmission = function() {
		$scope.patientHistory.diagnosisOnAdmission.icdId = $scope.icd10Selected.icdId;
		$scope.patientHistory.diagnosisOnAdmission.icdCode = $scope.icd10Selected.icdCode;
		$scope.patientHistory.diagnosisOnAdmission.icdName = $scope.icd10Selected.icdName;
		$scope.patientHistory.diagnosisOnAdmission.icdStart = $scope.icd10Selected.icdStart;
		$scope.patientHistory.diagnosisOnAdmission.icdEnd = $scope.icd10Selected.icdEnd;
	}

	$scope.clickItem = function(icd10Class) {
		console.log("======clickItem=======");
		var icd10SelectedOld = $scope.icd10Selected;
		$scope.icd10Selected = icd10Class;
		icd10Class.collapse = !icd10Class.collapse;
		$($scope.icd10Root.icd10Childs).each(function () {
			highlightSelect(this, 1);
			$(this.icd10Childs).each(function () {
				highlightSelect(this, 2);
				$(this.icd10Childs).each(function () {
					highlightSelect(this, 3);
					$(this.icd10Childs).each(function () {
						highlightSelect(this, 4);
						$(this.icd10Childs).each(function () {
							highlightSelect(this, 5);
						});
					});
				});
			});
		});
		$scope.setIcd10(icd10Class);
	}

	console.log("cuwyAppCtrl");

	var KeyCodes = {
			UPARROW : 38,
			DOWNARROW : 40,
			LEFTARROW : 37,
			RIGHTARROW : 39,
			RETURNKEY : 13,
		BACKSPACE : 8,
		TABKEY : 9,
		ESCAPE : 27,
		SPACEBAR : 32,
	};

	$scope.keys = [];
	$scope.keys.push({
		code : KeyCodes.RETURNKEY,
		action : function() {
			console.log("code: RETURNKEY");
			$scope.patientEditing.historyDiagnos = $scope.icd10Selected.icdName;
			setDiagnosisOnAdmission();
		}
	});

	$scope.keys.push({
		code : KeyCodes.LEFTARROW,
		action : function() {
			if($scope.focusDeepIndex != 0){
				$scope.icd10Selected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex];
				$scope.icd10Pfad2Parents[$scope.focusDeepIndex] = null;
				$scope.focusDeepIndex--;
				$scope.icd10Selected.collapse = false;
			}
			console.log("LEFTARROW " + $scope.focusDeepIndex);
		}
	});

	$scope.keys.push({
		code : KeyCodes.RIGHTARROW,
		action : function() {
			console.log("RIGHTARROW " + $scope.focusDeepIndex);
			if(!$scope.icd10Selected.icd10Childs){
				$http({ 
					method : "POST"
					, data : $scope.icd10Selected
					, url : "/readIcd10Childs"
				}).success(function(data, status, headers, config) {
					$scope.icd10Selected = data;
					openChild();
				}).error(function(data, status, headers, config) {
				});
			}else{
				openChild();
			}
		}
	});

	openChild = function(){
		console.log("======openChild=======");
		if($scope.icd10Selected.icd10Childs){
			console.log("go deep " + $scope.focusDeepIndex);
			if($scope.focusDeepIndex <= 5){
				$scope.clickItem($scope.icd10Selected);
				console.log("=============");
				$scope.icd10Selected.collapse = true;
				$scope.focusDeepIndex++;
				$scope.icd10Pfad2Parents[$scope.focusDeepIndex] = $scope.icd10Selected;
				$scope.icd10Selected = $scope.icd10Selected.icd10Childs[0];
			}
		}
	}

	$scope.keys.push({
		code : KeyCodes.UPARROW,
		action : function() {
			console.log(" UPARROW ");
			var indexSelected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs.indexOf($scope.icd10Selected);
			if(indexSelected > 0)
				$scope.icd10Selected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs[indexSelected - 1];
			else
				$scope.icd10Selected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs[$scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs.length - 1];
		}
	});
	$scope.keys.push({
		code : KeyCodes.DOWNARROW,
		action : function() {
			console.log(" DOWNARROW ");
			var indexSelected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs.indexOf($scope.icd10Selected);
			if($scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs.length - indexSelected == 1)
				$scope.icd10Selected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs[0];
			else
				$scope.icd10Selected = $scope.icd10Pfad2Parents[$scope.focusDeepIndex].icd10Childs[indexSelected + 1];
		}
	});

	$scope.$on('keydown', function(msg, obj) {
		var code = obj.code;
		$scope.keys.forEach(function(o) {
			if (o.code !== code) {
				return;
			}
			o.action();
			$scope.$apply();
		});
	});

}]);

