
//var historyFile = "/hol/history_id_" + parameters.hid;
var historyUrl = "/db/history_id_" + parameters.hid;
var epicriseUrl = "/db/epicrise_hid_" + parameters.hid;

cuwyApp.controller('EpicriseCtrl', [ '$scope', '$http', '$filter', '$sce', function ($scope, $http, $filter, $sce) {
	console.log("EpicriseCtrl");
//	$scope.diagnosesHol = configHol.diagnosesHol;
	$scope.configHol = configHol;
	$scope.epicriseTemplate = epicriseTemplate;
	initDeclareController($scope, $http, $sce, $filter);

	//-----------save epicrise -------------------------------------------------
	$scope.saveWorkDocClick = function(){
		$scope.autoSaveCount = 0;
		console.log("----");
		$http({ method : 'POST', data : $scope.patientHistory, url : "/db/savehistory"
		}).success(function(data, status, headers, config){
			console.log(data);
			saveWorkDocEpicrise();
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
	}
	saveWorkDocEpicrise = function(){
		console.log("-----------------");
		$scope.epicrise.hid = parameters.hid;
		$scope.epicrise.patientHistory = $scope.patientHistory;
//		saveWorkDoc("/save/epicrise", $scope, $http);
		//saveWorkDoc("/db/saveepicrise", $scope, $http);
		var docToSave = $scope.epicrise;
		docToSave.patientHistory = null;
		console.log(docToSave);
		postObject("/db/saveepicrise", docToSave, $scope, $http);
		console.log("-----------------");
	}
	//-----------save epicrise ----------------------------------------------END
	initEpicrise = function(){
		if(!$scope.epicrise.epicriseGroups){
			$scope.epicrise.epicriseGroups = [];
			//create first epicriese groups list.
			$scope.epicriseTemplate.head1s.forEach(function(headElement) {
				var epicriseGroup = {name:headElement.name};
				$scope.epicrise.epicriseGroups.push(epicriseGroup);
			})
		}
		//set epicriese group attributes
		$scope.epicrise.epicriseGroups.forEach(function(epicriseGroup) {
			var epicriseBlockConfig = $scope.epicriseTemplate.epicriseBlockConfig[epicriseGroup.name];
			//add epicriseBlockConfig object attributes to epicriseGroup
			for(var key in epicriseBlockConfig)
				epicriseGroup[key] = epicriseBlockConfig[key];
			if(epicriseGroup.isTextHtml){
				if(!epicriseGroup.value)
					epicriseGroup.value = {};
				if(!epicriseGroup.value.textHtml)
					epicriseGroup.value.textHtml = "";
			}
			if(epicriseGroup.name == "Операції"){
				if($scope.patientHistory.operationHistorys){
					epicriseGroup.operationHistorys = $scope.patientHistory.operationHistorys;
				}
			}
		});
	}

	$scope.editOpenClose = function(h1Index){
		var groupElement = $scope.epicrise.epicriseGroups[h1Index];
		if(groupElement){
//			setGroupElementType(groupElement);
		}
		console.log("Autosave - "+JSON.stringify($scope.epicrise).length)
		var oldOpen = groupElement.open;
		initValueFromHol1(groupElement);
		$scope.dt = $scope.epicrise.epicriseGroups[h1Index].value.historyTreatmentAnalysisDatetime;
		closeAllGroupEditors();
		$scope.epicrise.epicriseGroups[h1Index].open = !oldOpen;
		if(!$scope.epicrise.epicriseGroups[h1Index].open ){
			for(k in $scope.epicrise.epicriseGroups[h1Index].value.laborValues)
				if($scope.epicrise.epicriseGroups[h1Index].value.laborValues[k].value == "")
					delete $scope.epicrise.epicriseGroups[h1Index].value.laborValues[k];
		}
	}

	initValueFromHol1 = function(groupElement){
		if(groupElement.isTextHtml){
			if(!groupElement.value.textHtml){
				groupElement.value.textHtml = "";
			}
			if(groupElement.value.textHtml.trim().length == 0){
				for (var i = 0; i < $scope.patientHistory.historyTreatmentAnalysises.length; i++) {
					if(groupElement.name == $scope.patientHistory.historyTreatmentAnalysises[i].historyTreatmentAnalysisName){
						groupElement.value.textHtml = $scope.patientHistory.historyTreatmentAnalysises[i].historyTreatmentAnalysisText;
					}
				}
			}
		}

	}

	closeAllGroupEditors = function(){
		$scope.epicrise.epicriseGroups.forEach(function(o) {
			o.open = false;
		});
	};

	//-------------------------read history ------------------------------------
	readHol1 = function(){
		$http({ method : 'GET', url : historyUrl
		}).success(function(data, status, headers, config) {
			$scope.patientHistory = data;
			initEpicrise();
			initAppConfig($scope, $http, $sce, $filter);
		}).error(function(data, status, headers, config) {
		});
	}
	//-------------------------read epirise ------------------------------------
	$http({ method : 'GET', url : epicriseUrl
	}).success(function(data, status, headers, config) {
		$scope.epicrise = data;
		readHol1();
	}).error(function(data, status, headers, config) {
		readHol1();
	});
	//-------------------------read end -------------------------------------END

	//-------------------------autoSaveTimer------------------------------------
	$scope.docLength = 0;
	$scope.autoSaveCount = 0;
	autoSaveTimer = function () {
		if($scope.docLength == 0){
			setDocLength();
			return;
		}
		var newDocLength = getDocLength();
		var diffDocLength = Math.abs($scope.docLength-newDocLength);
		console.log("---------"+$scope.docLength+"-"+newDocLength+"="+diffDocLength);
		if(diffDocLength > 100){
			saveWorkDocEpicrise();
			$scope.autoSaveCount++;
			setDocLength();
		}
	}

	setDocLength = function(){
		$scope.docLength = getDocLength();
		console.log($scope.docLength);
	}
	//-------------------------autoSaveTimer---------------------------------END

	//--------------sort array-----------------------------------------------END

	//-----------------context menu---------------------------------------------
	$scope.menuLabor = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			deleteElement($itemScope);
		}]
	];
	$scope.menuEpicriseGroup = [
		['<span class="glyphicon glyphicon-arrow-up"></span> Догори ', function ($itemScope) {
			moveEpicriseGroupUp($itemScope);
		}],
		['<span class="glyphicon glyphicon-arrow-down"></span> Донизу ', function ($itemScope) {
			moveEpicriseGroupDown($itemScope);
		}]
	];
	//-----------------context menu------------------------------------------END
} ]);
