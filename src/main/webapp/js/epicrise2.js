
//var historyFile = "/hol/history_id_" + parameters.hid;
var historyUrl = "/db/history_id_" + parameters.hid;
var epicriseUrl = "/db/epicrise_hid_" + parameters.hid;

cuwyApp.controller('EpicriseCtrl', [ '$scope', '$http', '$filter', '$sce', function ($scope, $http, $filter, $sce) {
	console.log("EpicriseCtrl");
//	$scope.diagnosesHol = configHol.diagnosesHol;
	$scope.configHol = configHol;
	$scope.epicriseTemplate = epicriseTemplate;
	initDeclareController($scope, $http, $sce, $filter);
	readInitHistory($scope, $http, $sce, $filter);

	$scope.openLaborToEdit = function(h1, laborName){
		h1.laborOpenToEdit=laborName;
		if(!h1.value.laborValues[laborName])
			h1.value.laborValues[laborName] = {value:""};
	}
	$scope.beetDays = function(){
		if($scope.epicrise){
			var outDay = $scope.epicrise.departmentHistoryOut;
			var outDate = new Date(outDay);
			if($scope.patientHistory){
				var inDay = $scope.patientHistory.patientDepartmentMovements[0].departmentHistoryIn;
				var beetDaysRaw = (outDate - inDay)/dayInMs;
//				var beetDaysRaw = (outDay - inDay)/dayInMs;
				return Math.round(beetDaysRaw);
			}
		}
	}
	var dayInMs = 1000*60*60*24;

	$scope.goLink = function(link){
		console.log(link);
		location.href = link;
	}

	//-----------save epicrise -------------------------------------------------
	$scope.saveControlAndGo = function(url, siteName){
		console.log(url);
		var r = confirm("Зберегти і перейти за адресом: " +
				"\n \"" +siteName+
				"\"\n"+url);
		if (r == true) {
			window.location.href = url;
		} else {
		}
	}
	$scope.saveWorkDocClick = function(){
		$scope.autoSaveCount = 0;
		console.log("----");
		saveWorkDocEpicrise();
		console.log("----");
		console.log($scope.patientHistory);
		$http({ method : 'POST', data : $scope.patientHistory, url : "/db/savehistory"
		}).success(function(data, status, headers, config){
			console.log(data);
//			saveWorkDocEpicrise();
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
	initEpicriseGroupElement = function(epicriseGroup){
		//add epicriseBlockConfig object attributes to epicriseGroup
		var epicriseBlockConfig = $scope.epicriseTemplate.epicriseBlockConfig[epicriseGroup.name];
		if(epicriseBlockConfig){
			for(var key in epicriseBlockConfig)
				epicriseGroup[key] = epicriseBlockConfig[key];
		}else{
			epicriseGroup.isTextHtml = true;
		}
		if(epicriseGroup.isTextHtml){
			if(!epicriseGroup.value)
				epicriseGroup.value = {};
			if(!epicriseGroup.value.textHtml)
				epicriseGroup.value.textHtml = "";
		}
		/*
		if(epicriseGroup.name == "Біохімічний аналіз"){
			epicriseGroup.isLabor = true;
		}else 
		 * */
		if(epicriseGroup.name == "Діагнози"){
			epicriseGroup.isTextHtml = false;
		}else
		if(epicriseGroup.name == "Операції"){
			epicriseGroup.isTextHtml = false;
			if(!epicriseGroup.operationHistorys){
				if($scope.patientHistory.operationHistorys){
					epicriseGroup.operationHistorys = $scope.patientHistory.operationHistorys;
				}
			}
		}
	}
	$scope.addDiagnose = function(epicriseGroup, diagnose){
		console.log(epicriseGroup);
		if(!epicriseGroup.diagnosis)
			epicriseGroup.diagnosis = [];
		epicriseGroup.diagnosis.push(diagnose);
		
	}
	$scope.addOperation = function(epicriseGroup, operation){
		epicriseGroup.operationHistorys.push(operation);
	}
	
	initEpicrise = function(){
		if(!$scope.epicrise.epicriseGroups){
			$scope.epicrise.epicriseGroups = [];
			//create first epicriese groups list.
			$scope.epicriseTemplate.head1s.forEach(function(headElement) {
				//var epicriseGroup = {name:headElement.name};
				var epicriseGroup = createGroupElement(headElement.name);
				$scope.epicrise.epicriseGroups.push(epicriseGroup);
			});
		}
		//set epicriese group attributes
		$scope.epicrise.epicriseGroups.forEach(function(epicriseGroup) {
			initEpicriseGroupElement(epicriseGroup);
		});
		$scope.patientHistory.departmentId = $scope.patientHistory.patientDepartmentMovements[$scope.patientHistory.patientDepartmentMovements.length - 1].departmentId;
		console.log($scope.configHol.departments[$scope.configHol.departmentsIdPosition[$scope.patientHistory.departmentId]]);
	}
	$scope.setSeekTag = function(tag){
		$scope.seekTag = tag;
		if("все" === tag) {
			$scope.seekTag = "";
		}
	}
	$scope.addGroup = function(addGroup, h1Index){
		console.log(addGroup);
		console.log(h1Index);
		if(h1Index){
			var domElementId = "#g-"+h1Index;
			console.log(domElementId);
			var domElement  = document.querySelector(domElementId);
			domElement.setAttribute("class",domElement.getAttribute("class").replace(" in", ""));
		}

		var middlePosition = ($scope.epicrise.epicriseGroups.length + $scope.epicrise.epicriseGroups.length%2)/2;
		var groupElement = createGroupElement(addGroup.name);
		addTextHtmlValue(groupElement, "");
		$scope.epicrise.epicriseGroups.splice(middlePosition,0,groupElement);
		closeAllGroupEditors();
		$scope.epicrise.epicriseGroups[middlePosition].open = true;
	}
	createGroupElement = function(h1Name){
		var epicriseGroup = {name:h1Name};
		initEpicriseGroupElement(epicriseGroup);
		//$scope.epicrise.epicriseGroups.push(epicriseGroup);
//		setGroupElementType(epicriseGroup);
		return epicriseGroup;
	}
	addTextHtmlValue = function(groupElement, textHtmlValue){
		var value = {};
		value.historyTreatmentAnalysisDatetime = new Date();
//		initFromHol1(value, textHtmlValue);
		if(!groupElement.value)
			groupElement.value = value;
	}
	closeAllGroupEditors = function(){
		$scope.epicrise.epicriseGroups.forEach(function(o) {
			o.open = false;
		});
	};
	$scope.editOpenCloseAdd = function(){
		var h1Index = 0;
		for (var i = 0; i < $scope.epicrise.epicriseGroups.length; i++) {
			var groupElement = $scope.epicrise.epicriseGroups[i];
			console.log(groupElement);
			if(groupElement.isOnDemand){
				h1Index = i;
//				break;
			}
		}
		console.log(h1Index);
		$scope.editOpenClose(h1Index);
	}
	$scope.editOpenClose2 = function(h1Index){
		console.log(h1Index);
		var groupElement = $scope.epicrise.epicriseGroups[h1Index];
		console.log(groupElement);
		closeAllGroupEditors();
		$scope.epicrise.epicriseGroups[h1Index].open = true;
	}
	$scope.editOpenClose = function(h1Index){
		console.log(h1Index);
		var groupElement = $scope.epicrise.epicriseGroups[h1Index];
		console.log(groupElement);

		if(groupElement){
//			setGroupElementType(groupElement);
		}
		console.log("Autosave - "+JSON.stringify($scope.epicrise).length)
		var oldOpen = groupElement.open;
		initValueFromHol1(groupElement);
		//$scope.dt = $scope.epicrise.epicriseGroups[h1Index].value.historyTreatmentAnalysisDatetime;
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
			initHistory();
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
	$scope.menuDiagnos = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			console.log($itemScope);
			$scope.epicrise.epicriseGroups[$itemScope.h1Index].diagnosis.splice($itemScope.$index,1);
		}]
	];
	$scope.menuOperation = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			console.log($itemScope);
			$scope.epicrise.epicriseGroups[$itemScope.h1Index].operationHistorys.splice($itemScope.$index,1);
		}]
	];
	$scope.menuLabor = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			delete $itemScope.h1.value.laborValues[$itemScope.laborTemplate.name];
		}]
	];
	$scope.menuEpicriseGroup = [
/*
 * */
		['<span class="glyphicon glyphicon-arrow-up"></span> Догори ', function ($itemScope) {
//			moveEpicriseGroupUp($itemScope);
			var arrayToSort = $scope.epicrise.epicriseGroups;
			var index = $itemScope.$index;
			if(index > 0){
				moveUp(arrayToSort, index);
			}else{
				moveTo(arrayToSort, 0, arrayToSort.length-1);
			}
		}],
		['<span class="glyphicon glyphicon-arrow-down"></span> Донизу ', function ($itemScope) {
//			moveEpicriseGroupDown($itemScope);
			var arrayToSort = $scope.epicrise.epicriseGroups;
			var index = $itemScope.$index;
			if(index < arrayToSort.length-1){
				moveUp(arrayToSort, index+1);
			}
		}], null,
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			$scope.epicrise.epicriseGroups.splice($itemScope.h1Index,1);
		}]
	];
	moveTo = function(arrayToSort, indexFrom, indexTo){
		console.log(indexFrom+"/"+indexTo);
		var el = arrayToSort.splice(indexFrom, 1);
		console.log(el);
		arrayToSort.splice(indexTo, 0, el[0]);
	}
	moveUp = function(arrayToSort, index){
		moveTo(arrayToSort, index, index-1);
	}
	moveEpicriseGroupDown = function($itemScope){
		movePlus($scope.epicrise.epicriseGroups, $itemScope.$index);
	}
	moveEpicriseGroupUp = function($itemScope){
		moveMinus($scope.epicrise.epicriseGroups, $itemScope.$index);
	}
	movePlus = function(arrayToSort, index){
		if(index < arrayToSort.length){
			moveUp(arrayToSort, index);
		}else{
			moveTo(arrayToSort, index-1,0);
		}
	}
	moveMinus = function(arrayToSort, index){
		if(index > 0){
			moveUp(arrayToSort, index);
		}else{
			moveTo(arrayToSort, 0, arrayToSort.length-1);
		}
	}
	//-----------------context menu------------------------------------------END
} ]);
