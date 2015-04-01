function sendAjax() {

//	get inputs
	var article = new Object();
	article.title = $('#title').val();
	article.url = $('#url').val();
	article.categories = $('#categories').val().split(";");
	article.tags = $('#tags').val().split(";");
	article.patients = [];
	for (var int = 0; int < 2; int++) {
		var patient = {};
		patient.name = $('#patientName').val()+"_"+int;
		patient.diagnosis = $('#patientDiagnosis').val();
		article.patients.push(patient);
	}

	console.log(article);

	$.ajax({
		url: "jsonservlet",
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(article),
		contentType: 'application/json',
		mimeType: 'application/json',

		success: function (data) {
			$("tr:has(td)").remove();
			console.log("data = ");
			console.log(data);

			$.each(data, function (index, article) {
				console.log("--------------")
				console.log(index);
				console.log(article);
/*
				var td_categories = $("<td/>");
				$.each(article.categories, function (i, tag) {
					var span = $("<span class='label label-info' style='margin:4px;padding:4px' />");
					span.text(tag);
					td_categories.append(span);
				});

				var td_tags = $("<td/>");
				$.each(article.tags, function (i, tag) {
					var span = $("<span class='label' style='margin:4px;padding:4px' />");
					span.text(tag);
					td_tags.append(span);
				});

				$("#added-articles").append($('<tr/>')
						.append($('<td/>').html("<a href='"+article.url+"'>"+article.title+"</a>"))
						.append(td_categories)
						.append(td_tags)
				);
 * */


			});
		},
		error:function(data,status,er) {
			console.log("error: "+data+" status: "+status+" er:"+er);
			console.log(data);
			console.log(status);
			console.log(er);
		}
	});
}