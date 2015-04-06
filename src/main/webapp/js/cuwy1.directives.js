
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
var cuwyApp = angular.module('cuwyApp', ['ui.bootstrap', 'ngSanitize', 'textAngular']);

initAppConfig = function($scope, $http, $sce, $filter){
	$scope.departmentId = $scope.user.authorities[0].authority.split("_")[1].split("-")[1];
	console.log($scope.departmentId);
	console.log(configHol.departments.length);
	$scope.departmentsHol = configHol.departments;
}

initseekIcd10Tree = function($scope, $http, $sce, $filter){

	$scope.setIcd10 = function(icd10){
		console.log(icd10);
		console.log($scope.patientHistory.diagnosis[$scope.diagnosEditIndex]);
		console.log($scope.patientHistory.diagnosis[$scope.diagnosEditIndex].icdName);
		setHistoryDiagnos($scope.diagnosEditIndex, icd10);
		console.log($scope.diagnosEditIndex);
		if($scope.diagnosEditIndex == 2){
			setHistoryDiagnos(3, icd10);
		}
	}

	setHistoryDiagnos = function(diagnosEditIndex, icd10){
		$scope.patientHistory.diagnosis[diagnosEditIndex].icdCode = icd10.icdCode;
		$scope.patientHistory.diagnosis[diagnosEditIndex].icdEnd = icd10.icdEnd;
		$scope.patientHistory.diagnosis[diagnosEditIndex].icdId = icd10.icdId;
		$scope.patientHistory.diagnosis[diagnosEditIndex].icdName = icd10.icdName;
		$scope.patientHistory.diagnosis[diagnosEditIndex].icdStart = icd10.icdStart;
	}
	
	seekIcd10Tree = function(){
		console.log("seekIcd10Tree");
		console.log($scope.patientHistory.diagnosis[$scope.diagnosEditIndex].icdName);
		var seerIcd10TreeUrl = "/seekIcd10Tree/"+$scope.patientHistory.diagnosis[$scope.diagnosEditIndex].icdName;
		$http({ method : 'GET', url : seerIcd10TreeUrl
		}).success(function(data, status, headers, config) {
			$scope.icd10Root = data;
			console.log($scope.icd10Root);
		}).error(function(data, status, headers, config) {
		});
	};

	$scope.changeIcd10Name = function(){
		console.log("changeIcd10Name");
		console.log($scope.diagnosEditIndex);
		if($scope.patientHistory.diagnosis[$scope.diagnosEditIndex].icdName){
			$scope.collapseIcd10Liste = !($scope.patientHistory.diagnosis[$scope.diagnosEditIndex].icdName.length > 0);
		}
		if(!$scope.collapseIcd10Liste){
			seekIcd10Tree();
		}
	}

}

readInitHistory = function($scope, $http, $sce, $filter){
	var historyFile = "/db/history_id_"+parameters.hno;
	if(parameters.hid){
		historyFile = "/db/history_id_"+parameters.hid;
	}

	console.log(historyFile);
	$scope.collapseIcd10Liste = true;

	$scope.setDiagnosEditIndex = function($index){
		console.log("setDiagnosEditIndex");
		if( $scope.diagnosEditIndex != $index){
			$scope.collapseIcd10Liste = false;
		}else{
			$scope.collapseIcd10Liste = !$scope.collapseIcd10Liste;
		}
		$scope.diagnosEditIndex = $index;
		console.log($scope.diagnosEditIndex);
		console.log($scope.collapseIcd10Liste);
	}
	initHistory = function(){
		$scope.diagnosTypeIndex = {};
		var dl = $scope.patientHistory.diagnosis.length;
		for (var i = 0; i < dl; i++) {
			var ds = $scope.patientHistory.diagnosis[i];
			$scope.diagnosTypeIndex[ds.diagnosId] = i;
		}
		console.log($scope.diagnosTypeIndex);
		console.log($scope.patientHistory.diagnosis);
		console.log($scope.diagnosesHol);
	};

	$http({ method : 'GET', url : historyFile
	}).success(function(data, status, headers, config) {
		$scope.patientHistory = data;
		$scope.patientHistory.movePatientDepartment = {};
		initHistory();
	}).error(function(data, status, headers, config) {
	});
	
}
initDeclareController = function($scope, $http, $sce, $filter){
	console.log("--------initDeclareController--------------------");
	$scope.param = {};
	$scope.param.hid = parameters.hid;
	$scope.param.hno = parameters.hno;
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
