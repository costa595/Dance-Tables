//Easy-table.ru
//costa rassco

Trainers = (function() {

	addTeacher: function() {

		$('.deleteButton').hide();
		userObject.addingElementType = 'teacher';
		userObject.mode = 'read';
		userObject.changePopupContent();
		$('.ourPopup, #overlay').show();
	},

	// changing trainers ajax
   	sendTeacherEditAjax: function(newValue) {

		$.ajax({
		  type: "POST",
		  url: "/api/editteacher",
		  data: {
		    name: newValue,
		    id: userObject.changingElement
		  },
		  success: function(msg) {

		    if(msg != 'error') {

		      userObject.teachers[userObject.changingElement] = newValue;
		      userObject.changeElementInList(newValue);
		    }
		  }
		});
	},

	//deleteing elements ajax
  	sendDeleteAjax: function(urlType) {

		$.ajax({
		  type: "POST",
		  url: "/api/" + urlType,
		  data: {
		    id: userObject.changingElement
		  },
		  success: function(msg) {

		    if(msg == 'ok') {

		      $('.add' + userObject.addingElementType + '_' + userObject.changingElement).remove();

		      $('.userHallsList_' + userObject.changingElement + '_Td').remove();
		      if($( "#myHalls tr td" ).length == 0) {
		        $('.addLesson').addClass('disabled');
		      }
		      if($( "#myHalls tr td" ).length == 2) {
		        $('.userHallListAllTd').remove();
		      }
		      $('.agreePopup').hide();

		      $('#inputInformation').val('');
		      $('.ourPopup, #overlay').css({'display':'none'});
		    }
		  }
		});
	},

	//trainers ajax
	sendGetTeacherAjax: function(list, value) {

		$.ajax({
		  type: "POST",
		  url: "/api/addteacher",
		  data: {
		    name: value
		  },
		  success: function(num) {

		    if(num != 'error') {

		      userObject.teachers[num] = value;
		      $('.teachersForLesson').append('<option value = "' + num + '">' + value + '</option>');

		      $('.box-body').removeClass('last');
		      userObject.addElementToList(list, "addteacher", num, value);
		    }
		  }
		});
	}

}());