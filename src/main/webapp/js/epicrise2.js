
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

	//-------autoSave-----------------------------------------------------------
	$scope.docLength = 0;
	$scope.autoSaveCount = 0;
//	var noSaveLimit = 100;
	var noSaveLimit = 50
	autoSaveTimer = function () {
		if($scope.docLength == 0){
			setDocLength();
			return;
		}
		var newDocLength = getDocLength();
		var diffDocLength = Math.abs($scope.docLength-newDocLength);
		if(diffDocLength > noSaveLimit){
			saveWorkDocEpicrise();
			$scope.autoSaveCount++;
			setDocLength();
		}
	}
	setInterval(function(){autoSaveTimer()},5000);
	getDiffDocLength = function(){
		var newDocLength = getDocLength();
		return  Math.abs($scope.docLength-newDocLength);
	}
	getDocLength = function(){
		return JSON.stringify($scope.epicrise).length;
	}
	setDocLength = function(){
		$scope.docLength = getDocLength();
	}
	//-------autoSave--------------------------------------------------------END
	$scope.addTextTo = function(field,text){
		field.value = text;
	}
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
		location.href = link;
	}

	//-----------save epicrise -------------------------------------------------
	$scope.saveControlAndGo = function(url, siteName){
		var diffDocLength = getDiffDocLength();
		if(diffDocLength > 9){
			var r = confirm("В документі  "+diffDocLength+" не збережених змін. Зберегти і перейти за адресом: " +
					"\n \"" +siteName+ "\"? \n"+url);
			if (r == true) {
				saveWorkDocEpicrise();
				window.location.href = url;
			}
		}else{
			window.location.href = url;
		}

	}
	$scope.addNewHol1_hta = function(hta, htaIndex){
		console.log("addNewHol1_hta");
		var addPosition = htaIndex + 2;
		var groupElement = createGroupElement(hta.historyTreatmentAnalysisName);
		groupElement.htaId = hta.historyTreatmentAnalysisId;
		if(groupElement.isTextHtml){
			groupElement.value.textHtml = hta.historyTreatmentAnalysisText;
		}
		if(hta.historyTreatmentAnalysisDate){
			groupElement.value.historyTreatmentAnalysisDatetime = hta.historyTreatmentAnalysisDate; 
			groupElement.value.withDate = true; 
		}
		if(addPosition < $scope.epicrise.epicriseGroups.length){
			$scope.epicrise.epicriseGroups.splice(addPosition,0,groupElement);
		}else{
			$scope.epicrise.epicriseGroups.push(groupElement);
		}
		return groupElement;
	}
	$scope.removeNewHol1_hta = function(hta){
		console.log("removeNewHol1_hta");
		hta.removeFromHol1DB = true;
	}

	$scope.printWorkDocClick = function(){
		window.print();
	}
	$scope.saveWorkDocClick = function(){
		$scope.autoSaveCount = 0;
		saveWorkDocEpicrise();
		return;
		$http({ method : 'POST', data : $scope.patientHistory, url : "/db/savehistory"
		}).success(function(data, status, headers, config){
			console.log(data);
//			saveWorkDocEpicrise();
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
	}
	saveWorkDocEpicrise = function(){
		$scope.epicrise.hid = parameters.hid;
		$scope.epicrise.patientHistory = $scope.patientHistory;
		console.log($scope.userPersonalId);
		$scope.epicrise.userPersonalId = $scope.userPersonalId;
//		saveWorkDoc("/save/epicrise", $scope, $http);
		//saveWorkDoc("/db/saveepicrise", $scope, $http);
		var docToSave = $scope.epicrise;
		docToSave.patientHistory = null;
		$http({ method : 'POST', data : docToSave, url : "/db/saveepicrise"
		}).success(function(data, status, headers, config){
			$scope.epicrise = data;
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});

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
		if(!epicriseGroup.diagnosis)
			epicriseGroup.diagnosis = [];
		epicriseGroup.diagnosis.push(diagnose);
	}
	$scope.addOperation = function(epicriseGroup, operation){
		epicriseGroup.operationHistorys.push(operation);
	}
	
	var initEpicriseDiagnose = function(){
		$scope.patientHistory.diagnosis.forEach(function(diagnose, idx){
			if(diagnose.diagnosId == 3){//клінічний
				$scope.diagnosisIndex = idx;
			}
		})
		console.log($scope.diagnosisIndex);
	}
	var initEpicriseHol1Id = function(){
		var htaCopy = $scope.patientHistory.historyTreatmentAnalysises;

		var uniqueId = {};
		$scope.epicrise.epicriseGroups.forEach(function(epicriseGroup) {
			if($scope.necessary[epicriseGroup.name] >= 0)
				$scope.necessary[epicriseGroup.name]++;
			if(!epicriseGroup.treatmentAnalysId)
				for (var i = 0; i < configHol.treatmentAnalysis.length; i++)
					if(configHol.treatmentAnalysis[i].treatment_analysis_name == epicriseGroup.name){
						epicriseGroup.treatmentAnalysId = configHol.treatmentAnalysis[i].treatment_analysis_id;
						break;
					}
			if(epicriseGroup.htaId){//clean error
				if(!uniqueId[epicriseGroup.htaId]){
					uniqueId[epicriseGroup.htaId] = epicriseGroup.htaId;
				}else if(uniqueId[epicriseGroup.htaId] > 0) {
					delete epicriseGroup.htaId;
				}
			}
//			if(!epicriseGroup.htaId)
			if(true){
				//new from hol1
				for (var i = 0; i < htaCopy.length; i++) {
					if(htaCopy[i].treatmentAnalysisId == epicriseGroup.treatmentAnalysisId) {
						if(uniqueId[htaCopy[i].historyTreatmentAnalysisId] > 0) {
							//break if id is used
							break;
						}
					}
					if(!htaCopy[i].isIdCopied){
						if(htaCopy[i].historyTreatmentAnalysisName == epicriseGroup.name){
							epicriseGroup.htaId = htaCopy[i].historyTreatmentAnalysisId;
							uniqueId[epicriseGroup.htaId] = epicriseGroup.htaId;
							htaCopy[i].isIdCopied = true;
							$scope.isNewFromHol1 = true;
							break;
						}
					}
				}
			}
		});
		//manage new from hol1
		htaCopy.forEach(function(hta) {
			if(!hta.isIdCopied){
			//selected of new not in hol2
				var valueObj = hol1LaborTableToJsonValue(hta.historyTreatmentAnalysisText);
				if(valueObj){
					if(Object.keys(valueObj.laborValues).length == 0){//leer labor
						if($scope.necessary[hta.historyTreatmentAnalysisName] > 0 ){
							//necessary labor 
							hta.removeFromHol1DB = true;
							hta.htaId = hta.historyTreatmentAnalysisId;
							if(!$scope.epicrise.delPart){
								$scope.epicrise.delPart = [];
							}
							$scope.epicrise.delPart.push(hta);
						}
					}
					//all no exist labor added to hol2 epicrise
					if($scope.necessary[hta.historyTreatmentAnalysisName] == 0 ){
						var groupElement = $scope.addNewHol1_hta(hta, hta.historyTreatmentAnalysisSort);
						groupElement.value = valueObj;
						hta.removeFromHol1DB = true;
					}
				}
			}
		});
	}
	
	hol1LaborTableToJsonValue = function(textHol1, valueObj){
		if(!valueObj)
			valueObj = {};
		var element = angular.element("<div>"+textHol1+"</div>");
		var trs = element.find("td.name");
		if(trs.length > 0){
			var laborValues = {};
			for(i = 0; i < trs.length; i++){
				var nameTd = angular.element(trs[i]);
				var valueTd = nameTd.next();
				var unitTd = valueTd.next();
				if(valueTd.text().trim().length > 0){
					laborValues[nameTd.text()] = {value:valueTd.text(), unit:unitTd.text()};
				}
			}
			valueObj.laborValues = laborValues;
		}else{
			return;
			if(!valueObj.textHtml || valueObj.textHtml.trim().length == 0){
				valueObj.textHtml = textHol1;
				if(textHol1 == "") {
					valueObj.textHtml = " &nbsp; ";
				}
			}
			valueObj.textHtml1 = textHol1;
		}
		return valueObj;
	}

	initEpicrise = function(){
		$scope.epicrise.departmentHistoryOut = new Date();
		$scope.necessary = {};
		$scope.epicriseTemplate.head1s.forEach(function(headElement) {
			$scope.necessary[headElement.name]=0;
		});
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
	}
	$scope.setSeekTag = function(tag){
		$scope.seekTag = tag;
		if("все" === tag) {
			$scope.seekTag = "";
		}
	}
	$scope.addGroup = function(addGroup, h1Index){
		if(h1Index){
			var domElementId = "#g-"+h1Index;
			var domElement  = document.querySelector(domElementId);
			if(domElement)
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
	$scope.goPrintSite = function(){
		window.location.href = "epicrise.html?hid="+parameters.hid;
	};
	$scope.editOpenCloseAdd = function(){
		var h1Index = 0;
		for (var i = 0; i < $scope.epicrise.epicriseGroups.length; i++) {
			var groupElement = $scope.epicrise.epicriseGroups[i];
			if(groupElement.isOnDemand){
				h1Index = i;
//				break;
			}
		}
		$scope.editOpenClose(h1Index);
	}
	$scope.editOpenClose2 = function(h1Index){
		var groupElement = $scope.epicrise.epicriseGroups[h1Index];
		closeAllGroupEditors();
		$scope.epicrise.epicriseGroups[h1Index].open = true;
	}
	$scope.editOpenClose = function(h1Index){
		var groupElement = $scope.epicrise.epicriseGroups[h1Index];

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
		console.log("-----------------");
		$http({ method : 'GET', url : historyUrl
		}).success(function(data, status, headers, config) {
			$scope.patientHistory = data;
			console.log($scope.patientHistory);
			initHistory();
			initEpicrise();
			initEpicriseHol1Id();
			initEpicriseDiagnose();
			initAppConfig($scope, $http, $sce, $filter);
			seekDepartmentFromConfig($scope, 5);
		}).error(function(data, status, headers, config) {
		});
	}
	//-------------------------read epirise ------------------------------------
	$http({ method : 'GET', url : epicriseUrl
	}).success(function(data, status, headers, config) {
		$scope.epicrise = data;
		console.log($scope.epicrise);
		readHol1();
	}).error(function(data, status, headers, config) {
		readHol1();
	});
	//-------------------------read end -------------------------------------END

	//--------------ICD---------------------------------------------------------
	$scope.useCodeOnly = function(){
		console.log("-----------");
		findEpicriseDiagnosGroup();
		$scope.epicrise.epicriseGroups[$scope.epicriseDiagnosGroupIdx].diagnosis[0].useCodeOnly = 
			!$scope.epicrise.epicriseGroups[$scope.epicriseDiagnosGroupIdx].diagnosis[0].useCodeOnly;
	}
	$scope.setIcd10 = function(icd10){
		setHistoryDiagnos(icd10);
	}
	findEpicriseDiagnosGroup = function(){
		for (var i = 0; i < $scope.epicrise.epicriseGroups.length; i++) {
			if($scope.epicrise.epicriseGroups[i].name == "Діагнози"){
				$scope.epicriseDiagnosGroupIdx = i;
				break;
			}
		}
	}
	setEpicriseDiagnos = function(){
		findEpicriseDiagnosGroup();
		if(!$scope.epicrise.epicriseGroups[$scope.epicriseDiagnosGroupIdx].diagnosis)
			$scope.epicrise.epicriseGroups[$scope.epicriseDiagnosGroupIdx].diagnosis = [];
		$scope.epicrise.epicriseGroups[$scope.epicriseDiagnosGroupIdx].diagnosis[0] = 
			$scope.patientHistory.diagnosis[$scope.diagnosisIndex];
	}
	setHistoryDiagnos = function(icd10){
		console.log($scope.patientHistory.diagnosis.length);
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdCode = icd10.icdCode;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdEnd = icd10.icdEnd;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdId = icd10.icdId;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdName = icd10.icdName;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdStart = icd10.icdStart;
		console.log($scope.patientHistory.diagnosis[$scope.diagnosisIndex]);
		setEpicriseDiagnos();
	}
	$scope.changeIcd10Name = function(){
		console.log("changeIcd10Name");
		seekIcd10Tree();
	}
	seekIcd10Tree = function(){
		console.log("seekIcd10Tree");
		console.log($scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdName);
		var seerIcd10TreeUrl = "/seekIcd10Tree/"+$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdName;
		$http({ method : 'GET', url : seerIcd10TreeUrl
		}).success(function(data, status, headers, config) {
			$scope.icd10Root = data;
			console.log($scope.icd10Root);
		}).error(function(data, status, headers, config) {
		});
	};
	//--------------ICD------------------------------------------------------END

	//-----------------context menu---------------------------------------------
	$scope.menuDiagnos = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			$scope.epicrise.epicriseGroups[$itemScope.h1Index].diagnosis.splice($itemScope.$index,1);
		}]
	];
	$scope.menuOperation = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			$scope.epicrise.epicriseGroups[$itemScope.h1Index].operationHistorys.splice($itemScope.$index,1);
		}]
	];
	$scope.menuLabor = [
		['<span class="glyphicon glyphicon-remove"></span> Видалити ', function ($itemScope) {
			delete $itemScope.h1.value.laborValues[$itemScope.laborTemplate.name];
		}]
	];
	$scope.menuEpicriseGroup = [
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
			var delEpicriseGroup = $scope.epicrise.epicriseGroups.splice($itemScope.h1Index,1);
			if(!$scope.epicrise.delPart){
				$scope.epicrise.delPart = [];
			}
			delEpicriseGroup.forEach(function(epicriseGroup) {
				$scope.epicrise.delPart.push(epicriseGroup);
			});
		}]
	];
	moveTo = function(arrayToSort, indexFrom, indexTo){
		var el = arrayToSort.splice(indexFrom, 1);
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
