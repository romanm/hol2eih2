var historyFile = "/hol/history_id_"+parameters.hid;

console.log("historyFile = "+historyFile);

cuwyApp.controller('AdmissionPatientCtrl', [ '$scope', '$http', function ($scope, $http) {

	$scope.title = "Створити історію хвороби";
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

	if(parameters.hid){
		$http({
			method : 'GET',
			url : historyFile
		}).success(function(data, status, headers, config) {
			$scope.patientHistory = data;
			$scope.patientEditing.departmentId = $scope.patientHistory.patientDepartmentMovements[0].departmentId;
			$scope.patientEditing.departmentName = $scope.patientHistory.patientDepartmentMovements[0].departmentName;
		}).error(function(data, status, headers, config) {
		});
	}
	
	$scope.collapseDiagnoseTreeFilter = true;
	$scope.changeTreeFilterView = true;
	$scope.openIcd10FilterDialog = function(){
		console.log("----openIcd10FilterDialog--------"+$scope.collapseDiagnoseTreeFilter);
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
		patientSurname:{
			hasError:false
		},
		patientPersonalName:{
			hasError:false
		}
	}

	$scope.validatePersonalName = function(){
		var field = $scope.newPatientForm.patientPersonalName;
		$scope.validField2(field);
	}

	validField3 = function(field, isEdited){
		if($scope.validateForm[field.$name]){
			$scope.validateForm[field.$name].hasError = isEdited && (!field.$viewValue || field.$viewValue.length == 0);
			console.log("$scope.validateForm["+field.$name+"].hasError = "+$scope.validateForm[field.$name].hasError);
			changeFormValidClass(field);
		}
	}
	$scope.validField2 = function(field){
		validField3(field, field.$dirty);
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
		if($scope.validateForm[field.$name].hasError){
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

	$scope.validField = function(field){
		console.log("validField 1 " + field.$dirty);
		$scope.validateForm[field.$name].showRequired = field.$dirty && (!field.$viewValue || field.$viewValue.length == 0);
		console.log("validField 1 " + field.$name);
		console.log("validField 1 " + field.$dirty);
		console.log("validField 1 " + field.$viewValue);
		console.log("validField 1 " + !field.$viewValue);
		console.log("validField 1 " + field.$viewValue.length);
		console.log("validField 1 " + (field.$viewValue.length == 0));
		console.log("validField 1 " + $scope.validateForm[field.$name].showRequired);
		if(!$scope.validateForm[field.$name].showRequired){
			checkShowEditField2(field, false, "error", "remove");
		}else{
		console.log("validField 1 1 ");
			checkShowEditField2(field, true, "error", "remove");
			var fieldValidEl = $("#"+field.$name)[0].nextElementSibling;
			while(null != fieldValidEl){
				if(fieldValidEl.hasAttribute("data-validate")){
					console.log(fieldValidEl);
					console.log(3);
					checkShowEditField2(field, true, "error", "remove");
				}
				fieldValidEl = fieldValidEl.nextElementSibling;
			}
		}
		console.log("validField 2" );
	}

	validForm2 = function(){
		angular.forEach($scope.newPatientForm.$error.required, function(field, index) {
			validField3(field, true);
		})
	}
	validForm = function(){
		console.log("validForm 1" );
		angular.forEach($scope.newPatientForm.$error.required, function(field, index) {
			var htmlFormField = document.forms.newPatientForm[field.$name]
			if(htmlFormField){
				var htmlFormFieldValid = htmlFormField.nextSibling;
				var fieldValidEl = htmlFormField.nextElementSibling;
				while(null != fieldValidEl){
					if(fieldValidEl.hasAttribute("data-validate")){
						$scope.validateForm[field.$name].showRequired = !field.$viewValue || field.$viewValue.length == 0;
						if($scope.validateForm[field.$name].showRequired){
							checkShowEditField2(field, true, "error", "remove");
						}
					}
					fieldValidEl = fieldValidEl.nextElementSibling;
				}
			}
			console.log("-------------");
		});
		$scope.isLastNameValid($scope.newPatientForm.patientPersonalName);
		console.log("validForm 2");
	}

	$scope.savePatientHistory = function(){
		console.log("savePatientHistory");
		validForm2();
		var postNewPatien = $http({
			method : 'POST',
			data : $scope.patientHistory,
			url : '/savePatientHistory'
		}).success(function(data, status, headers, config){
			$scope.patientHistory = data;
		}).error(function(data, status, headers, config) {
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

	$scope.writeToModel = function(fieldName, value){
		$scope.patientEditing[fieldName] = value;
		if("country" == fieldName){
			$scope.patientEditing.countryCollapsed = true;
		}
	}

	$scope.writeDirect = function(direct){
		$scope.patientEditing.direct = direct.direct_name;
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
		console.log($scope.patientEditing.country);
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
		console.log(fieldIconEl);
			var formGroupEl = fieldIconEl.parent();
			console.log(isInvalid);
			console.log(formGroupEl);
			formGroupEl.removeClass("has-success has-warning has-error");
			fieldIconEl.removeClass("glyphicon-remove glyphicon-ok glyphicon-warning-sign");
			if(isInvalid){
				formGroupEl.addClass("has-"+groupValidClass);
				fieldIconEl.addClass("glyphicon-"+iconValidClass);
				console.log(formGroupEl);
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

} ] );

