//var historyFile = "/hol/history_id_"+parameters.hid;
var historyFile = "/hol/history_id_"+parameters.hno;

console.log("historyFile = "+historyFile);

cuwyApp.controller('AdmissionPatientCtrl', [ '$scope', '$http', function ($scope, $http) {

	$scope.title = "Приймальне :: Створити історію хвороби";
	$scope.addresses = configHol.countries;
	$scope.directs = configHol.directs;
	$scope.departmentsHol = configHol.departments;
	$scope.parameters = parameters;
	$scope.patient = {
		name: 'Patient name',
		history_no: parameters.hno,
		patientHistory: null
	};
	$scope.patientHistory = {};

//	if(parameters.hid){
	if(parameters.hno){
		$http({
			method : 'GET',
			url : historyFile
		}).success(function(data, status, headers, config) {
			$scope.patientHistory = data;
			$scope.patientEditing.departmentId = $scope.patientHistory.patientDepartmentMovements[0].departmentId;
			$scope.patientEditing.departmentName = $scope.patientHistory.patientDepartmentMovements[0].departmentName;
		}).error(function(data, status, headers, config) {
		});
	}else{
		$http({
			method : 'GET',
			url : "/hol/history_id_undefined"
		}).success(function(data, status, headers, config) {
			$scope.patientHistory = data;
			$scope.patientEditing.departmentId = $scope.patientHistory.patientDepartmentMovements[0].departmentId;
			$scope.patientEditing.departmentName = $scope.patientHistory.patientDepartmentMovements[0].departmentName;
			$scope.patientHistory.patientHolDb.countryId = 1;
			$scope.patientHistory.patientHolDb.districtId = 1;
		}).error(function(data, status, headers, config) {
		});
	}
	
	$scope.collapseDiagnoseTreeFilter = true;
	$scope.changeTreeFilterView = true;
	$scope.openIcd10FilterDialog = function(){
		$scope.collapseDiagnoseTreeFilter = false;
		$scope.changeTreeFilterView = true;
	}
	$scope.openIcd10TreeDialog = function(){
		$scope.collapseDiagnoseTreeFilter = !$scope.collapseDiagnoseTreeFilter;
		$scope.changeTreeFilterView = false;
	}

	$scope.isRegion2of4 = function($index, regions){
		return $index > regions.length/4 && $index < regions.length/4*2;
	}

	$scope.isRegion3of4 = function($index, regions){
		return $index > regions.length/4*2 && $index < regions.length/4*3;
	}

	$scope.isDistrict2of3 = function($index, districts){
		return $index < districts.length/3*2 && $index > districts.length/3
	}

	$scope.validateForm = {
		formHasError:false,
		patientSurname:{
			fieldHasError:false
		},
		patientPersonalName:{
			fieldHasError:false
		},
		patientPatronymic:{
			fieldHasError:false
		},
		patientHouse:{
			fieldHasError:false
		},
		region:{
			fieldHasError:false
		},
		district:{
			fieldHasError:false
		},
		localityName:{
			fieldHasError:false
		},
		patientDob:{
			fieldHasError:false
		},
		patientJob:{
			fieldHasError:false
		},
		department:{
			fieldHasError:false
		},
		historyDiagnos:{
			fieldHasError:false
		}

	}

	$scope.validatePersonalName = function(){
		var field = $scope.newPatientForm.patientPersonalName;
		$scope.validField2(field);
	}

	validField3 = function(field, isEdited){
		if($scope.validateForm[field.$name]){
			$scope.validateForm[field.$name].fieldHasError = isEdited && (!field.$viewValue || field.$viewValue.length == 0);
			$scope.validateForm.formHasError = $scope.validateForm[field.$name].fieldHasError;
			changeFormValidClass(field);
		}
	}

	$scope.validField2 = function(field){
		validField3(field, field.$dirty);
	}

	validForm2 = function(){
		angular.forEach($scope.newPatientForm.$error.required, function(field, index) {
			validField3(field, true);
		})
	}

	changeFormValidClass = function(field){
		var fieldEl = $("#"+field.$name);
		var formGroupEl = $(fieldEl[0].parentElement);
		var fieldIconEl = $(fieldEl[0].nextElementSibling);
		if(!fieldIconEl.hasClass("form-control-feedback")){
			fieldIconEl = $(fieldIconEl.nextElementSibling);
		}
		formGroupEl.removeClass("has-success has-warning has-error");
		fieldIconEl.removeClass("glyphicon-remove glyphicon-ok glyphicon-warning-sign");
		if($scope.validateForm[field.$name].fieldHasError){
			formGroupEl.addClass("has-error");
			fieldIconEl.addClass("glyphicon-remove");
		}else if(field.$error.maxlength || field.$error.minlength){
			formGroupEl.addClass("has-warning");
			fieldIconEl.addClass("glyphicon-warning-sign");
		}else{
			formGroupEl.addClass("has-success");
			fieldIconEl.addClass("glyphicon-ok");
		}
	}

	$scope.savePatientHistory = function(){
		validForm2();
		if($scope.validateForm.formHasError)
			return;
		//var postNewPatien = 
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

	$scope.patientEditing = {
		name: '', last: '', patientPatronymic: '', patientGender: false,
		country: $scope.addresses[0].countryName,
		countryCollapsed: true,
		district: $scope.addresses[0].districtsHol[0].districtName,
		region: '',
		localityType: '',
		localityName: '',
		pilgy: '',
		urgentPlan: '',
		x: null
	};

	$scope.changeDiagnose = function(){
		console.log("changeDiagnose");
	}

	$scope.getCountryDistricts = function(){
		$($scope.addresses).each(function () {
			if(this.countryName == $scope.patientEditing.country){
				$scope.districts = this.districtsHol;
			}
		});
	}

	$scope.getCountryDistricts();

	$scope.getDistrictRegions = function(){
		$($scope.districts).each(function () {
			if(this.districtName == $scope.patientEditing.district){
				$scope.regions = this.regionsHol;
			}
		});
	}

	$scope.getDistrictRegions();

	$scope.collapseLocalityField = true;
	$scope.supportLocalityField = function(){
		$scope.collapseLocalityField = true;
		if($scope.patientEditing.localityName){
			$scope.collapseLocalityField = !($scope.patientEditing.localityName.length > 0);
			if(!$scope.localityRegion){
				//seek all regions
			}else{
				for(var i = 0 ; i < $scope.localityRegion.length ; i++ ){
					if($scope.localityRegion[i].locality_name == $scope.patientEditing.localityName){
						$scope.collapseLocalityField = true;
						return ;
					}
				}
			}
		}
	}
	$scope.setLocality = function(locality){
		$scope.patientEditing.localityName = locality.locality_name;
		$scope.patientEditing.localityType = locality.locality_type;
		$scope.patientHistory.patientHolDb.localityId =  locality.locality_id;
		$scope.validateForm.localityName.fieldHasError = false;
		$scope.collapseLocalityField = false;
	}
	$scope.setLocalityRegion = function(){
		var regionId = $scope.patientHistory.patientHolDb.regionId;
		$http({
			method : 'GET',
			url : "/locality_"+regionId
		}).success(function(data, status, headers, config) {
			$scope.localityRegion = data;
		}).error(function(data, status, headers, config) {
		});
	}
	$scope.setCountry = function(country){
		$scope.patientEditing.country = country.countryName;
		$scope.patientHistory.patientHolDb.countryId = country.countryId;
	}

	$scope.setRegion = function(region){
		$scope.patientEditing.region = region.regionName;
		$scope.patientHistory.patientHolDb.regionId = region.regionId;
		$scope.validateForm.region.fieldHasError = false;
		$scope.collapseRegionListe = true;
		$scope.validField2($scope.newPatientForm.region)
		$scope.setLocalityRegion();
	}

	$scope.setDistrict = function(district){
		$scope.patientEditing.district = district.districtName;
		$scope.patientHistory.patientHolDb.districtId = district.districtId;
	}

	$scope.writeToModel = function(fieldName, value){
		$scope.patientEditing[fieldName] = value;
		if("country" == fieldName){
			$scope.patientEditing.countryCollapsed = true;
		}
	}

	$scope.writeDirect = function(direct){
		$scope.patientEditing.direct = direct.direct_name;
		$scope.patientHistory.directId = direct.direct_id;
		$scope.supportDirectField();
	}

	$scope.collapseDirectListe = true;
	$scope.supportDirectField = function(){
		if($scope.patientEditing.direct){
			$scope.collapseDirectListe = !($scope.patientEditing.direct.length > 0);
			for(var i = 0 ; i < $scope.directs.length ; i++ ){
				if($scope.directs[i].direct_name == $scope.patientEditing.direct){
					$scope.collapseDirectListe = true;
					return ;
				}
			}
		}
	}
	$scope.supportDistrictField = function(){
		var collapseDistrictListe = true;
		if($scope.patientEditing.district){
			collapseDistrictListe = !($scope.patientEditing.district.length > 0);
			if(!$scope.districts){
				//seek all districts
			}else{
				$($scope.districts).each(function(){
					if(this.districtName == $scope.patientEditing.district){
						collapseDistrictListe = true;
					}
				});
			}
		}
		return collapseDistrictListe;
	}
	$scope.collapseRegionListe = true;
	$scope.supportRegionField = function(){
		$scope.collapseRegionListe = true;
		if($scope.patientEditing.region ){
			$scope.collapseRegionListe = !($scope.patientEditing.region.length > 0);
			if(!$scope.regions){
				//seek all regions
			}else{
				$($scope.regions).each(function(){
					if(this.regionName == $scope.patientEditing.region){
						$scope.collapseRegionListe = true;
					}
				});
			}
		}
	}

	$scope.openCountryFormGroup = function(){
		$scope.patientEditing.countryCollapsed = !$scope.patientEditing.countryCollapsed;
		if(false && !$scope.patientEditing.countryCollapsed){
			$http({
				method : 'POST',
				data : patient,
				url : '/openShortPatienHistory'
			}).success(function(data, status, headers, config){
				patient.patientHistory = data;
			}).error(function(data, status, headers, config) {
			});
		}
	}

	$scope.isWarning = function(field, art){
		var isShowWarning = field.$error.maxlength || field.$error.minlength;
		checkShowEditField(field, isShowWarning, "warning", "warning-sign");
		return field.$error[art] && field.$dirty;
	}

	$scope.isNoCountryInDb = function(){
		var isNoCountryInDb = true;
		$($scope.addresses).each(function () {
			if(this.countryName == $scope.patientEditing.country)
				isNoCountryInDb = false;
		}
		);
		checkShowEditField($scope.newPatientForm.country, isNoCountryInDb, "warning", "warning-sign");
		return isNoCountryInDb;
	}

	$scope.isWarning = function(field, art){
		console.log(" field.$error["+art+"] = " + field.$error[art]);
	}

	$scope.isLastNameValid = function(field, art){
		var isRequired = field.$error.required && field.$dirty;
		if(isRequired){
			checkShowEditField(field, isRequired, "error", "remove");
			if(!art)
				return isRequired;
		}
		var isShowWarning = field.$error.maxlength || field.$error.minlength;
		checkShowEditField(field, isShowWarning, "warning", "warning-sign");
		return field.$error[art] && field.$dirty;
	}

	$scope.isRequired = function(field){
		var isRequired = field.$error.required && field.$dirty;
		checkShowEditField(field, isRequired, "error", "remove");
		return isRequired;
	}

	checkShowEditField = function(field, isOk, groupValidClass, iconValidClass){
		var fieldEl = $("#"+field.$name);
		var fieldIconEl = $(fieldEl[0].nextElementSibling);
		if(fieldIconEl.hasClass("glyphicon")){
			var formGroupEl = fieldIconEl.parent();
			formGroupEl.removeClass("has-success has-warning has-error");
			fieldIconEl.removeClass("glyphicon-remove glyphicon-ok glyphicon-warning-sign");
			if(isOk){
				formGroupEl.addClass("has-"+groupValidClass);
				fieldIconEl.addClass("glyphicon-"+iconValidClass);
			}else{
				formGroupEl.addClass("has-success");
				if(field.$dirty){
					fieldIconEl.addClass("glyphicon-ok");
				}
			}
		}
	}

	checkShowEditField2 = function(field, isInvalid, groupValidClass, iconValidClass){
		var fieldEl = $("#"+field.$name);
		var fieldIconEl = $(fieldEl[0].nextElementSibling);
			var formGroupEl = fieldIconEl.parent();
			formGroupEl.removeClass("has-success has-warning has-error");
			fieldIconEl.removeClass("glyphicon-remove glyphicon-ok glyphicon-warning-sign");
			if(isInvalid){
				formGroupEl.addClass("has-"+groupValidClass);
				fieldIconEl.addClass("glyphicon-"+iconValidClass);
			}else{
				formGroupEl.addClass("has-success");
				if(field.$dirty){
					fieldIconEl.addClass("glyphicon-ok");
				}
			}
		if(fieldIconEl.hasClass("glyphicon")){
		}
	}

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear: 'yyyy',
		startingDay: 1
	};

	$scope.tooltipHtml = function(){
		var msgs = $scope.error.message.split(";");
		var errorHtml = "<ul>";
		angular.forEach(msgs, function(msg, index) {
			if(msg.indexOf("SQL")<0){
				errorHtml += "<li>"+msg+"</li>";
			}
		})
		errorHtml += "</ul>";
		return errorHtml;
	}

} ] );

