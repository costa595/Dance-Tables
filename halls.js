//Easy-table.ru
//costa rassco

Halls = (function() {

  addHall: function() {

    $('.deleteButton').hide();
    userObject.addingElementType = 'hall';
    userObject.mode = 'read';
    userObject.changePopupContent();
    $('.ourPopup, #overlay').show();
  },

  // Changing halls ajax
  sendHallEditAjax: function(urlType, newValue) {

    $.ajax({
      type: "POST",
      url: "/api/" + urlType,
      data: {
        name: newValue,
        id: userObject.changingElement
      },
      success: function(msg) {

        if(msg != 'error') {

          userObject.halls[userObject.changingElement] = newValue;
          //changing hall name on a button
          $('.userHallsList_' + userObject.changingElement).text(newValue);
          $('.addhall_0').removeClass('standartHall');
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

          $('#inputInformation').val('');
          $('.ourPopup, #overlay').css({'display':'none'});
        }
      }
    });
  },

  //ajax for halls
  sendGetHallAjax: function(list, urlType, value) {

    $.ajax({
      type: "POST",
      url: "/api/" + urlType,
      data: {
        name: value
      },
      success: function(num) {

        if(num != 'error') {

          userObject.halls[num] = value;

          var addingHtml = '<td style="padding: 20px 0px 0 0;" class="userHallsList_' + num + '_Td" valign="top"><button class="btn btn-block btn-default userHallsList_' + num + '">' + value + '</button></td>';

          //adding halls as buttons
          if($('#myHalls tr td').length == 0) {

            $('.userHalls').append(addingHtml);
            $('.addLesson').removeClass('disabled');

          } else if($('#myHalls tr td').length == 1) {

            $('.userHalls').prepend('<td style="padding: 20px 0px 0 0;" class="userHallListAllTd" valign="top"><button class="btn btn-block btn-default userHallsListAll">Все залы</button></td>');
            $('.userHalls').append(addingHtml);

          } else if($('#myHalls tr td').length > 1){

            $('.userHalls').append(addingHtml);
          }

          $('.hallsForLesson').append('<option value = "' + num + '">' + value + '</option>');

          $('.box-body').removeClass('last');
          userObject.addElementToList(list, urlType, num, value);
        }
      }
    });
  }

}());