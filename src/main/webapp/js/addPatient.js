cuwyApp.controller('addPatientCtrl', [ '$scope', '$http', '$filter', '$sce', function ($scope, $http, $filter, $sce) {
	console.log("addPatientCtrl");

	$scope.myVar=setInterval(function(){myTimer()},5000);
	$scope.docLength = 1;
	$scope.myTimer = function () {
		conslole.log("---------");
	}

	$scope.configHol = configHol;
	console.log($scope.configHol);
	$scope.benefits = ["Чорнобилець І категорії"
	                   ,"Чорнобилець ІІ категорії"
	                   ,"Чорнобилець ІІІ категорії"
	                   ,"Чорнобилець ІV категорії"
	                   ,"Інвалід І групи"
	                   ,"Інвалід ІІ групи"
	                   ,"Інвалід ІІІ групи"
	                   ,"Інвалід ІV групи"
	                   ];
	$scope.newHistoryTemplate = {
		"groups":["pip","adress","diagnos","medinfo"],
		"pip":{"name":"Паспортна частина"},
		"adress":{"name":"Адреса, робота"},
		"diagnos":{"name":"Діагноз/Направлення"},
		"medinfo":{"name":"Медична інформація"}
	};
//	$scope.newHistoryTemplate["adress"].open = true;
//	$scope.newHistoryTemplate["diagnos"].open = true;

	$scope.patientHistory = {};
	$scope.patientEditing = {};
	$scope.requiredFields = {
		"patientSurname":{"group":"pip","name":"Прізвище"}
		,"patientPersonalName":{"group":"pip","name":"Ім’я"}
		,"patientPatronymic":{"group":"pip","name":"По батькові"}
		,"patientDob":{"group":"pip","name":"д.н."}
		,"countryId":{"group":"adress","name":"Країна"}
		,"districtId":{"group":"adress","name":"Область"}
		,"regionId":{"group":"adress","name":"Район"}
		,"localityId":{"group":"adress","name":"місто/село"}
		,"patientJob":{"group":"adress","name":"Місце роботи"}
		,"directId":{"group":"diagnos","name":"Направлення"}
		,"departmentId":{"group":"diagnos","name":"Відділення"}
		,"icdId":{"group":"diagnos","name":"Діагноз МКБ"}
	};
	
//	var historyFile = "/hol/history_id_"+parameters.hno;
	$scope.hno = parameters.hno;
	var historyFile = "/db/history_id_"+parameters.hno;
	console.log(historyFile);

	
	seekIcd10Tree = function(){
		console.log("seekIcd10Tree");
		console.log($scope.patientHistory.diagnosisOnAdmission.icdName);
		var seerIcd10TreeUrl = "/seekIcd10Tree/"+$scope.patientHistory.diagnosisOnAdmission.icdName;
		$http({
			method : 'GET',
			url : seerIcd10TreeUrl
		}).success(function(data, status, headers, config) {
			$scope.icd10Root = data;
			console.log($scope.icd10Root);
		}).error(function(data, status, headers, config) {
		});
	};
	$scope.gotoField = function(rf){
		var g = $scope.requiredFields[rf].group;
		$scope.newHistoryTemplate[g].open = true;
		$('#'+rf).focus();
//		document.getElementById(rf).focus();
	}
	

	//----------------adress---------------------------------------------------
	$scope.changeIcd10Name = function(){
		console.log("changeIcd10Name");
		if($scope.patientHistory.diagnosisOnAdmission.icdName){
			$scope.collapseIcd10Liste = !($scope.patientHistory.diagnosisOnAdmission.icdName.length > 0);
		}
		if(!$scope.collapseIcd10Liste){
			seekIcd10Tree();
		}
	}
	$scope.changePatientJob = function(){
		console.log("changePatientJob");
		checkRequiredFieldPIP();
	}
	$scope.changeLocalityName = function(){
		if($scope.patientEditing.localityName){
			$scope.collapseLocalityListe = !($scope.patientEditing.localityName.length > 0);
		}
		checkRequiredFieldAdress();
	}
	$scope.changeDepartmentName = function(){
		if($scope.patientEditing.departmentName){
			$scope.collapseDepartmentListe = !($scope.patientEditing.departmentName.length > 0);
		}
	}
	$scope.changePatientName = function(name){
		var pf = $scope.patientHistory.patientHolDb[name];
		if(pf){
			$scope.patientHistory.patientHolDb[name]
				= pf.substring(0,1).toUpperCase() + pf.substring(1);
		}
		checkRequiredFieldPIP();
	}
	$scope.changeDirectName = function(){
		if($scope.patientEditing.directName){
			$scope.collapseDirectListe = !($scope.patientEditing.directName.length > 0);
		}
	}
	$scope.changeRegionName = function(){
		if($scope.patientEditing.districtName){
			$scope.collapseRegionListe = !($scope.patientEditing.districtName.length > 0);
		}
	}
	$scope.changeDistrictName = function(){
		if($scope.patientEditing.districtName){
			$scope.collapseDistrictListe = !($scope.patientEditing.districtName.length > 0);
		}
	}
	$scope.setDistrict= function(district){
		$scope.patientEditing.districtName = district.districtName;
		$scope.patientHistory.patientHolDb.districtId = district.districtId;
		$scope.collapseDistrictListe = true;
		$scope.regions = district.regionsHol;
	}
	$scope.setDirect = function(region){
		$scope.patientEditing.directName = region.direct_name;
		$scope.patientHistory.directId = region.direct_id;
		$scope.collapseDirectListe = true;
		checkRequiredFieldDiagnos();
	}
	$scope.setDepartment = function(region){
		console.log(region);
		$scope.patientHistory.patientDepartmentMovements[0].departmentName = region.department_name;
		$scope.patientHistory.patientDepartmentMovements[0].departmentId = region.department_id;
		$scope.patientHistory.historyDepartmentIn = region.department_id;
		$scope.collapseDepartmentListe = true;
		checkRequiredFieldDiagnos();
	}
	$scope.setIcd10= function(icd10){
		console.log($scope.patientHistory.diagnosisOnAdmission);
		console.log($scope.patientHistory.diagnosisOnAdmission.icdName);
		console.log(icd10);
		$scope.patientHistory.diagnosisOnAdmission.icdCode = icd10.icdCode;
		$scope.patientHistory.diagnosisOnAdmission.icdEnd = icd10.icdEnd;
		$scope.patientHistory.diagnosisOnAdmission.icdId = icd10.icdId;
		$scope.patientHistory.diagnosisOnAdmission.icdName = icd10.icdName;
		$scope.patientHistory.diagnosisOnAdmission.icdStart = icd10.icdStart;
		checkRequiredFieldDiagnos();
	}
	$scope.setRegion = function(region){
		$scope.patientEditing.regionName = region.regionName;
		$scope.patientHistory.patientHolDb.regionId = region.regionId;
		$scope.collapseRegionListe = true;
		$scope.localitys = region.localitysHol;
	}
	$scope.setCountry = function(country){
		$scope.patientEditing.countryName = country.countryName;
		$scope.patientHistory.patientHolDb.countryId = country.countryId;
		$scope.collapseDistrictListe = true;
		$scope.districts = country.districtsHol;
	}
	$scope.getLocalityName = function(locality){
		return (locality.localityType == 1 ? "м.":"с.") + " " + locality.localityName;
	}
	$scope.setLocality = function(locality){
		$scope.patientEditing.localityName = locality.localityName;
		$scope.patientEditing.localityType = locality.localityType;
		$scope.patientHistory.patientHolDb.localityId = locality.localityId;
		$scope.collapseLocalityListe = true;
		checkRequiredFieldAdress();
	}
	//----------------adress-------------------------------------------------END
	//----------------ds-------------------------------------------------
	$scope.openIcd10TreeDialog = function(){
		$scope.collapseIcd10Liste = !$scope.collapseIcd10Liste;
		console.log($scope.collapseIcd10Liste);
	}
	//----------------ds-------------------------------------------------END
	
	requiredFullProcent = function(){
		console.log("requiredFullProcent");
		var r = true;
		var requiredNotOk = 0;
		Object.keys($scope.requiredFields).forEach(function(key) {
			if(!$scope.requiredFields[key].isFull){
				r = false;
				requiredNotOk++;
			}
		});
		var cntReq = Object.keys($scope.requiredFields).length;
		$scope.patientHistory.requiredFieldFullProcent = Math.round((cntReq-requiredNotOk)/cntReq*100);
		return r;
	}
	checkRequiredFieldDiagnos = function(){
		["directId"].forEach(function(key) {
			$scope.requiredFields[key].isFull 
			= !(typeof $scope.patientHistory[key] === 'undefined')
			&& $scope.patientHistory[key] > 0;
		});
		["departmentId"].forEach(function(key) {
			$scope.requiredFields[key].isFull 
			= !(typeof $scope.patientHistory.patientDepartmentMovements[0][key] === 'undefined')
			&& $scope.patientHistory.patientDepartmentMovements[0][key] > 0;
		});
		["icdId"].forEach(function(key) {
			$scope.requiredFields[key].isFull 
			= !(typeof $scope.patientHistory.diagnosisOnAdmission[key] === 'undefined')
			&& $scope.patientHistory.diagnosisOnAdmission[key] > 0;
		});
		requiredFullProcent();
	}
	checkRequiredFieldAdress = function(){
		["countryId","districtId","regionId","localityId"].forEach(function(key) {
			$scope.requiredFields[key].isFull
			= !(typeof $scope.patientHistory.patientHolDb[key] === 'undefined')
			&& $scope.patientHistory.patientHolDb[key] > 0;
		});
		requiredFullProcent();
	}
	checkRequiredFieldPIP = function(){
		["patientSurname","patientPersonalName","patientPatronymic","patientJob"].forEach(function(key) {
			$scope.requiredFields[key].isFull 
			= !(typeof $scope.patientHistory.patientHolDb[key] === 'undefined'
				|| $scope.patientHistory.patientHolDb[key] == null
			)
			&& $scope.patientHistory.patientHolDb[key].length > 1;
		});
		["patientDob"].forEach(function(key) {
			console.log($scope.patientHistory.patientHolDb[key]);
			console.log(new Date($scope.patientHistory.patientHolDb[key]));
			console.log(new Date($scope.patientHistory.patientHolDb[key]).getFullYear());
			$scope.requiredFields[key].isFull 
			= !(typeof $scope.patientHistory.patientHolDb[key] === 'undefined')
			&& new Date($scope.patientHistory.patientHolDb[key]).getFullYear() > 1;
//			&& $scope.patientHistory.patientHolDb[key].getFullYear() > 1;
		});
		requiredFullProcent();
	}
	//----------------on start--------------------------------------------------
	initDeclareController($scope, $http, $sce, $filter);
	initPatientEdit = function(){
		if($scope.patientHistory.directId){
			var f1 = $filter('filter')($scope.configHol.directs, {direct_id:$scope.patientHistory.directId}, true);
			$scope.setDirect(f1[0])
		}
		$scope.collapseDepartmentListe = true;
		$scope.collapseIcd10Liste = true;
		$($scope.configHol.countries).each(function (k1,country) {
			if(country.countryId == $scope.patientHistory.patientHolDb.countryId){
				$scope.setCountry(country);
				$($scope.districts).each(function (k2,district) {
					if(district.districtId == $scope.patientHistory.patientHolDb.districtId){
						$scope.setDistrict(district);
						$($scope.regions).each(function (k3,region) {
							if(region.regionId == $scope.patientHistory.patientHolDb.regionId){
								$scope.setRegion(region);
								$($scope.localitys).each(function (k3,locality) {
									if(locality.localityId == $scope.patientHistory.patientHolDb.localityId){
										$scope.setLocality(locality);
									}
								});
							}
						});
					}
				});
			}
		});

		checkRequiredFieldPIP();
		checkRequiredFieldAdress();
		checkRequiredFieldDiagnos();
	
		requiredFullProcent();
	};

	if(parameters.hno){
		$http({
			method : 'GET',
			url : historyFile
		}).success(function(data, status, headers, config) {
			$scope.patientHistory = data;
			console.log($scope.patientHistory);
			if($scope.patientHistory != ''){
				initPatientEdit();
			}else{
				
			}
			
			console.log("--------------");
		}).error(function(data, status, headers, config) {
		});
	}else{
		$scope.patientHistory.patientHolDb = {};
		$scope.patientHistory.diagnosisOnAdmission = {};
		$scope.patientHistory.patientDepartmentMovements = [{}];
		console.log($scope.patientHistory.patientHolDb.countryId);
		$scope.setCountry($scope.configHol.countries[0]);
		$scope.patientHistory.patientHolDb.districtId = 1;
		$scope.patientHistory.patientHolDb.regionId = 1;
		initPatientEdit();
	}
	
	//----------------on start-----------------------------------------------END

	$scope.isRegion2of4 = function($index, regions){
		return $index > regions.length/4 && $index < regions.length/4*2;
	}

	$scope.isRegion3of4 = function($index, regions){
		return $index > regions.length/4*2 && $index < regions.length/4*3;
	}

	$scope.savePatientHistory = function(){
//		if(!checkRequiredFields())
//			return true;
		$http({
			method : 'POST',
			data : $scope.patientHistory,
			url : '/savePatientHistory'
		}).success(function(data, status, headers, config){
			$scope.patientHistory = data;
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
		return true;
	}

	checkRequiredFields = function(){
		if(typeof $scope.patientHistory.patientHolDb.patientDob === 'undefined')
		{
			$scope.patientHistory.patientHolDb.patientDob = new Date();
//			$scope.patientHistory.patientHolDb.patientDob
//			.setMonth($scope.patientHistory.patientHolDb.patientDob.getMonth()-1)
			$scope.patientHistory.patientHolDb.patientDob.setDate($scope.patientHistory.patientHolDb.patientDob.getDate()-5);
		}
		var pDob = $scope.patientHistory.patientHolDb.patientDob;
		var todayDate = new Date();
		var age = $scope.calculateAge(pDob, todayDate);
		var pDob2 = pDob;
		pDob2.setFullYear(pDob.getFullYear()+age);
		var month = $scope.calculateMonth(pDob2, todayDate);
		pDob2.setMonth(pDob2.getMonth()+month);
		var day = $scope.calculateDay(pDob2, todayDate);
		console.log("year "+age + ", month "+month+", day "+day);

		checkRequiredFieldPIP();
		checkRequiredFieldAdress();
		checkRequiredFieldDiagnos();
	
		return requiredFullProcent();
	}
	$scope.requiredFieldsNoFull = function(gr){
		var rfNames = [];
		Object.keys($scope.requiredFields).forEach(function(key) {
			if($scope.requiredFields[key].group === gr){
				if($scope.requiredFields[key].isFull === false){
					rfNames.push(key);
				}
			}
		});
		return rfNames;
	}

	$scope.editOpenClose = function(gr){
		var open = !gr.open;
		$scope.newHistoryTemplate.groups.forEach(function(g) {
			$scope.newHistoryTemplate[g].open = false;
		})
		gr.open = open;
		console.log(gr);
		console.log($scope.patientHistory);
		console.log("Autosave - "+JSON.stringify($scope.patientHistory).length);
	};
	
	$scope.open = function($event) {
		/*
		$event.preventDefault();
		$event.stopPropagation();
		 * */
		$scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear: 'yyyy',
		startingDay: 1
	};
	
}]);
