//Easy-table.ru
//costa rassco

//sending and getting data
$('.sendAdding').on('click', function() {

  var sendedValue = $('#inputInformation').val();
  var list = '', 
      urlType = '', 
      num = '';

  if(sendedValue != '') {

    //adding
    if(userObject.mode == 'read') {

      switch(userObject.addingElementType) {

        case 'hall':
          list = $('.hallList');
          urlType = 'addhall';
          Halls.sendGetHallAjax(list, urlType, sendedValue);
          break;

        case 'teacher':
          list = $('.teacherList');
          urlType = 'addteacher';
          Trainers.sendGetTeacherAjax(list, sendedValue);
          break;
      }

    //changing
    } else {

      switch(userObject.addingElementType) {

        case 'hall':
          Halls.sendHallEditAjax('edithall', sendedValue);
          break;

        case 'teacher':
          Trainers.sendTeacherEditAjax(sendedValue);
          break;
      }

    }

    //setting to none
    $('#inputInformation').val('');
    $('.ourPopup, #overlay').css({'display':'none'});
  }

});

//call editing popup
$('body').on('click', '.changeListElement', function() {

    switch($(this).attr('type')) {

      case 'addhall':
        userObject.addingElementType = 'hall';
        userObject.changingElement = $(this).attr('num');
        userObject.changePopupContent($(this).attr('name'), 'change');
        userObject.openPopupInEdit();
        break;

      case 'addteacher':
        userObject.addingElementType = 'teacher';
        userObject.changingElement = $(this).attr('num');
        userObject.changePopupContent($(this).attr('name'), 'change');
        userObject.openPopupInEdit();
        break;
    }      
});

//delete element
$('.deleteButton').on('click', function() {

  switch(userObject.addingElementType) {

    case 'hall':
      $('.ourPopup').hide();
      $('.agreePopup').show();
      break;

    case 'teacher':
      Trainers.sendDeleteAjax('removeteacher');
      break;
  }
});

//delete hall and it's data agreement
$('body').on('click', '.agreedDeleteHall', function() {

  Halls.sendDeleteAjax('removehall');
  $('.ourPopup, #overlay, .agreePopup').css({'display':'none'});
});

//close popup of hall deleting
$('body').on('click', '.notAgreedDeleteHall', function() {

  $('.agreePopup').css({'display':'none'});
  $('.ourPopup').show();
});

//call add hall popup
$('.addHall').click( function() {

    Halls.addHall();
});

//call add trainer popup
$('.addTeacher').click( function() {

    Trainers.addTeacher();
});

$('.closeOurPopup').click(function() {

  $('#inputInformation').val('');
  $('.ourPopup, #overlay').css({'display':'none'});
});

//switching tables
$('body').on('click', '.showTable', function() {

  var hallNum = $(this).attr('hallNum');
  $('.hallTable').hide();
  $('.hallsAllTable').hide();
  $('.hallTable[hall=' + hallNum + ']').show();
});

//all halls
$('body').on('click', '.showTableOfAllHalls', function() {

  $('.hallsAllTable').show();
  $('.hallTable').hide();
});