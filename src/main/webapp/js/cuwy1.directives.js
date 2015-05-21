
parameters = {};
if(window.location.search){
	$.each(window.location.search.split("?")[1].split("&"), function(index, value){
		var par = value.split("=");
		parameters[par[0]] = par[1];
	});
}

function isMiddleWeek(index, countPatientsProWeeks){
	return index !=0 && !(index == countPatientsProWeeks.length - 1);
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
String.prototype.splice = function(idx, rem, s) {
	return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

String.prototype.to_mmssMsec = function() {
	var mm_int = parseInt(this) / (60*1000);
	var mm = (mm_int < 10 ? "0":"") + mm_int + ":";
	if(this.length > 4){
		return mm + this.slice(0, this.length - 3) + ":"+this.slice(this.length - 3);
	}else if(this.length == 4){
		return mm + "0" + this.slice(0,1) + ":"+this.slice(1);
	}else{
		return mm + "00:"+this;
	}
};

function pad (str, max) {
	str = str.toString();
	return str.length < max ? pad("0" + str, max) : str;
}

to_mmssMsec = function(i) {
	var ms_int = i % 1000;
	var s_int = (i - ms_int) / 1000;
	var ss_int = s_int % 60;
	var m_int = (s_int - ss_int) / 60;
	var mmssms = pad(m_int,2) + ":" + pad(ss_int,2) + ":" + pad(ms_int,3);
	return mmssms;
};

Date.prototype.getMonthUa = function (month){
	var monthsUa = ["Січень", "Лютий"
		, "Березень", "Квітень", "Травень"
		, "Червень", "Липень", "Серпень"
		, "Вересень", "Жовтень", "Листопад"
		, "Грудень"];
	return monthsUa[month];
}
Date.prototype.getDayOfYear = function (){
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan)/86400000 + 1);
}
Date.prototype.getWeekOfYear = function (){
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this.getDayOfYear() + onejan.getDay())/7);
//	return Math.ceil((((this - onejan)/86400000 + 1 + onejan.getDay()))/7);
}
Date.prototype.addMonths = function(months){
	this.setMonth(this.getMonth() + 1);
	return this;
}
Date.prototype.addDays = function(days){
	this.setDate(this.getDate() + days);
	return this;
}
Date.prototype.addDays = function (num) {
    var value = this.valueOf();
    value += 86400000 * num;
    return new Date(value);
}

Date.prototype.addSeconds = function (num) {
    var value = this.valueOf();
    value += 1000 * num;
    return new Date(value);
}

Date.prototype.addMinutes = function (num) {
    var value = this.valueOf();
    value += 60000 * num;
    return new Date(value);
}

Date.prototype.addHours = function (num) {
    var value = this.valueOf();
    value += 3600000 * num;
    return new Date(value);
}

Date.prototype.addMonths2 = function (num) {
    var value = new Date(this.valueOf());

    var mo = this.getMonth();
    var yr = this.getYear();

    mo = (mo + num) % 12;
    if (0 > mo) {
        yr += (this.getMonth() + num - mo - 12) / 12;
        mo += 12;
    }
    else
        yr += ((this.getMonth() + num - mo) / 12);

    value.setMonth(mo);
    value.setYear(yr);
    return value;
}

'use strict';
var cuwyApp = angular.module('cuwyApp', ['ui.bootstrap', 'ui.sortable', 'ngSanitize', 'textAngular']);

initAppConfig = function($scope, $http, $sce, $filter){
	$scope.departmentsHol = configHol.departments;
	if(!$scope.user){
		if($scope.patientHistory){
			$scope.user = $scope.patientHistory.user;
		}else if($scope.department){
			$scope.user = $scope.department.user;
		}
	}
	if(!$scope.user){
		return;
	}
	$scope.userDepartmentId = $scope.user.authorities[0].authority.split("_")[1].split("-")[1];
	$scope.userPersonalId = $scope.user.authorities[0].authority.split("_")[2].split("-")[1];
	if($scope.patientHistory){
		$scope.patientHistory.userPersonalId = $scope.userPersonalId;
	}
}

initseekIcd10Tree = function($scope, $http, $sce, $filter){

	$scope.seekGroupIcd10 = function(icd10Class){
		var icd10GroupCode = icd10Class.icdCode.substring(0,icd10Class.icdCode.indexOf('.'));
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdName = icd10GroupCode;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdCode = icd10GroupCode;
		console.log($scope.patientHistory.diagnosis[$scope.diagnosisIndex]);
		seekIcd10Tree();
	}
	$scope.setIcd10 = function(icd10){
		setHistoryDiagnos(icd10);
		/*
		if($scope.diagnosisIndex == 2){
			setHistoryDiagnos(icd10);
		}
		 * */
	}

	setHistoryDiagnos = function(icd10){
		for (var i = $scope.patientHistory.diagnosis.length; i <= $scope.diagnosisIndex; i++) {
			$scope.patientHistory.diagnosis.push({});
		}
		console.log($scope.patientHistory.diagnosis.length);
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdCode = icd10.icdCode;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdEnd = icd10.icdEnd;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdId = icd10.icdId;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdName = icd10.icdName;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdStart = icd10.icdStart;
		$scope.patientHistory.diagnosis[$scope.diagnosisIndex].diagnosId = $scope.diagnosHolEdit.diagnosId;
		console.log($scope.patientHistory.diagnosis[$scope.diagnosisIndex]);
		initHistory();
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

	$scope.changeIcd10Name = function(){
		console.log("changeIcd10Name");
		console.log($scope.diagnosisIndex);
		if($scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdName){
			$scope.collapseIcd10Liste = !($scope.patientHistory.diagnosis[$scope.diagnosisIndex].icdName.length > 0);
		}
		if(!$scope.collapseIcd10Liste){
			seekIcd10Tree();
		}
	}
}

readInitHistory = function($scope, $http, $sce, $filter){
	$scope.param = parameters;
	$scope.historyFile = "/db/history_id_"+parameters.hno;
	if(parameters.hid){
		$scope.param.hno = parameters.hid;
		$scope.historyFile = "/db/history_id_"+parameters.hid;
	}

	$scope.collapseIcd10Liste = true;

	$scope.setDiagnosIndex = function($index){
		
		if($scope.diagnosisIndex != $index){
			$scope.collapseIcd10Liste = false;
		}else{
			$scope.collapseIcd10Liste = !$scope.collapseIcd10Liste;
		}
		console.log($scope.diagnosTypeIndex);
		$scope.diagnosHolEdit = $scope.diagnosesHol[$index];
		console.log($scope.diagnosHolEdit);
		$scope.diagnosisIndex = $scope.diagnosTypeIndex[$scope.diagnosHolEdit.diagnosId];
		console.log($scope.diagnosisIndex);
		if(!$scope.diagnosisIndex){
			$scope.diagnosisIndex = $scope.diagnosTypeIndex[$scope.diagnosHolEdit.diagnosId] = $scope.patientHistory.diagnosis.length;
			$scope.patientHistory.diagnosis.push({});
		}
	}

	initHistory = function(){
		if(!$scope.patientHistory.patientDepartmentMovements){
			$scope.patientHistory.patientDepartmentMovements = [];
			$scope.patientHistory.patientDepartmentMovements.push({});
//			console.log($scope.departmentsHol);
			for (var i = 0; i < $scope.departmentsHol.length; i++) {
				if($scope.patientHistory.historyDepartmentIn == $scope.departmentsHol[i].department_id){
					$scope.patientHistory.patientDepartmentMovements[0].departmentName = $scope.departmentsHol[i].department_name;
					$scope.patientHistory.patientDepartmentMovements[0].departmentId = $scope.departmentsHol[i].department_id;
				}
			}
		}
		$scope.diagnosTypeIndex = {};
		if(!$scope.patientHistory.diagnosis)
			return;
		var dl = $scope.patientHistory.diagnosis.length;
		for (var i = 0; i < dl; i++) {
			var ds = $scope.patientHistory.diagnosis[i];
			if(ds)
				$scope.diagnosTypeIndex[ds.diagnosId] = i;
		}
	};

}

initDeclareController = function($scope, $http, $sce, $filter){
	/*
	$scope.param = parameters;
	 * */
	$scope.param = {};
	$scope.param.hid = parameters.hid;
	if(parameters.hno)
		$scope.param.hno = parameters.hno;
	else
		$scope.param.hno = parameters.hid;
	console.log("--------initDeclareController--------------------param = ");
	console.log($scope.param);

	postObject = function(url, docToSave, $scope, $http){
		$http({ method : 'POST', data : docToSave, url : url
		}).success(function(data, status, headers, config){
			console.log(data);
		}).error(function(data, status, headers, config) {
			$scope.error = data;
		});
	}
	saveWorkDoc = function(url, $scope, $http){
		var docToSave = $scope.epicrise;
		console.log(url);
		console.log(docToSave);
		postObject(url, docToSave, $scope, $http);
	}

	$scope.calculateDay = function(birthDateStr, todayDate) {
		if(!birthDateStr)
			return 0;
		if(!todayDate)
			todayDate = new Date();
		var birthDate = new Date(birthDateStr),
		birthDay = birthDate.getDate(),
		todayDay = todayDate.getDate();
		var day = todayDay - birthDay;
		return day;
	}
	$scope.calculateMonth = function(birthDateStr, todayDate) {
		if(!birthDateStr)
			return 0;
		if(!todayDate)
			todayDate = new Date();
		var birthDate = new Date(birthDateStr),
			birthMonth = birthDate.getMonth(),
			birthDay = birthDate.getDate();
			todayMonth = todayDate.getMonth(),
			todayDay = todayDate.getDate();
		var month = todayMonth - birthMonth;
//		console.log(todayMonth +"-" + birthMonth +"="+month);
		if (todayDay < birthDay)
		{
			month--;
		}
		if(month < 0)
			month = 12 + month;
		return month;
	}
	$scope.calculateAge = function(birthDateStr, todayDate) {
		if(!birthDateStr)
			return 0;
		if(!todayDate)
			todayDate = new Date();
		var birthDate = new Date(birthDateStr)
			birthYear = birthDate.getFullYear(),
			birthMonth = birthDate.getMonth(),
			birthDay = birthDate.getDate();
			todayYear = todayDate.getFullYear(),
			todayMonth = todayDate.getMonth(),
			todayDay = todayDate.getDate();
		var age = todayYear - birthYear;
//console.log(todayYear+"-" + birthYear+"="+age);
		if (todayMonth < birthMonth)
		{
			age--;
		}else if (birthMonth === todayMonth && todayDay < birthDay)
		{
			age--;
		}
		return age;
	};

};

cuwyApp.directive('autoFocus', function($timeout) {
	return {
		restrict: 'AC',
		link: function(_scope, _element) {
			$timeout(function(){
				_element[0].focus();
			}, 0);
		}
	};
});

cuwyApp.directive('ngContextMenu', function ($parse) {
	var renderContextMenu = function ($scope, event, options) {
		if (!$) { var $ = angular.element; }
		$(event.target).addClass('context');
		var $contextMenu = $('<div>');
		$contextMenu.addClass('dropdown clearfix');
		var $ul = $('<ul>');
		$ul.addClass('dropdown-menu');
		$ul.attr({ 'role': 'menu' });
		$ul.css({
			display: 'block',
			position: 'absolute',
			left: event.pageX + 'px',
			top: event.pageY + 'px'
		});
		angular.forEach(options, function (item, i) {
			var $li = $('<li>');
			if (item === null) {
				$li.addClass('divider');
			} else {
				$a = $('<a>');
				$a.attr({ tabindex: '-1', href: '#' });
				$a.append(item[0]);
//				$a.text(item[0]);
				$li.append($a);
				$li.on('click', function () {
					$scope.$apply(function() {
						item[1].call($scope, $scope);
					});
				});
			}
			$ul.append($li);
		});
		$contextMenu.append($ul);
		$contextMenu.css({
			width: '100%',
			height: '100%',
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 9999
		});
		$(document).find('body').append($contextMenu);
		$contextMenu.on("click", function (e) {
			$(event.target).removeClass('context');
			$contextMenu.remove();
		}).on('contextmenu', function (event) {
			$(event.target).removeClass('context');
			event.preventDefault();
			$contextMenu.remove();
		});
	};
	return function ($scope, element, attrs) {
		element.on('contextmenu', function (event) {
			$scope.$apply(function () {
				event.preventDefault();
				var options = $scope.$eval(attrs.ngContextMenu);
				if (options instanceof Array) {
					renderContextMenu($scope, event, options);
				} else {
					throw '"' + attrs.ngContextMenu + '" not an array';
				}
			});
		});
	};
});

cuwyApp.directive('keyTrap', function() {
	return function(scope, elem) {
		elem.bind('keydown', function(event) {
			scope.$broadcast('keydown', {
				code : event.keyCode
			});
		});
	};
});

cuwyApp.directive('ngBlur', function() {
	  return function( scope, elem, attrs ) {
	    elem.bind('blur', function() {
	      scope.$apply(attrs.ngBlur);
	    });
	  };
	});
