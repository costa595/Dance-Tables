
  var addingElementType = '';
  var changingElement = '';

  var userObject = {

    halls: [],
    teachers: [],
    lessons: [],
    mode: 'read',

    addHall: function() {

      $('.deleteButton').hide();
      addingElementType = 'hall';
      userObject.mode = 'read';
      userObject.changePopupContent(addingElementType);
      $('.ourPopup, #overlay').show();
    },

    addTeacher: function() {

      $('.deleteButton').hide();
      addingElementType = 'teacher';
      userObject.mode = 'read';
      userObject.changePopupContent(addingElementType);
      $('.ourPopup, #overlay').show();
    },

    // аякс изменения залов
    sendHallEditAjax: function(urlType, newValue) {

      $.ajax({
        type: "POST",
        url: "/api/" + urlType,
        data: {
          name: newValue,
          id: changingElement
        },
        success: function(msg) {

          if(msg != 'error') {
            userObject.halls[changingElement] = newValue;
            //меняем название зала в кнопках залов
            $('.userHallsList_' + changingElement).text(newValue);
            $('.addhall_0').removeClass('standartHall');
            userObject.changeElementInList(newValue);
          }
        }
      });
    },

    // аякс изменения преподов
    sendTeacherEditAjax: function(newValue) {

      $.ajax({
        type: "POST",
        url: "/api/editteacher",
        data: {
          name: newValue,
          id: changingElement
        },
        success: function(msg) {

          if(msg != 'error') {

            userObject.teachers[changingElement] = newValue;
            userObject.changeElementInList(newValue);
          }
        }
      });
    },

    //удаление элементов
    sendDeleteAjax: function(urlType) {

      $.ajax({
        type: "POST",
        url: "/api/" + urlType,
        data: {
          id: changingElement
        },
        success: function(msg) {

          console.log(msg)

          if(msg == 'ok') {

            $('.add' + addingElementType + '_' + changingElement).remove();

            if(urlType == 'removehall') {
              $('.userHallsList_' + changingElement + '_Td').remove();
              if($( "#myHalls tr td" ).length == 0) {
                $('.addLesson').addClass('disabled');
              }
              if($( "#myHalls tr td" ).length == 2) {
                $('.userHallListAllTd').remove();
              }
              $('.agreePopup').hide();

            }

            $('#inputInformation').val('');
            $('.ourPopup, #overlay').css({'display':'none'});
          }
        }
      });
    },

    //посылка/прием аякса для залов
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

            //добавление залов как кнопок
            if($('#myHalls tr td').length == 0) {

              // $('.standartHall').remove();
              // $('.userHallsListStandart').addClass('userHallsList_' + num);
              // $('.userHallsListStandart').text(value);
              // $('.userHallsList_' + num).removeClass('userHallsListStandart');
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
    },

    // меняем элемент в списке
    changeElementInList: function(sendedValue) {

      var link = $('.add' + addingElementType + '_' + changingElement);
      var str = link.html();
      var newStr = str.substring(str.indexOf('<i'), str.length - 1);
      link.html(sendedValue + newStr);
      link.children().attr('name', sendedValue);
    },

    //добавить элемент к списку
    addElementToList: function(link, addType, index, value) {

      link.append('<div class="box-body ' + addType + '_' + index + '" style="display: block;"><span style="float:left;">' + value + '</span><i class="fa fa-gear changeListElement" num="' + index + '" name="' + value + '" type="' + addType + '"></i></div>');
    },

    // посылка/прием аякса преподов
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
    },

    //настройки попапа
    changePopupContent: function (addingElementType, changingValue, type) {

      var textDeleteButton = '';

      switch(addingElementType) {

        case 'hall':
          userObject.fulfillContent('Добавить зал', 'Название зала', changingValue, 'Введите название зала');
          textDeleteButton = 'Удалить зал';
          break;

        case 'teacher':
          userObject.fulfillContent('Добавить преподавателя', 'ФИО преподавателя', changingValue, 'Введите ФИО преподавателя');
          textDeleteButton = 'Удалить преподавателя';
          break;
      }

      //режим изменения
      if(type == 'change') {
        $('.ourButton').text('Сохранить изменение');
        $('.deleteButton').show();
        $('.deleteButton').text(textDeleteButton);
      } else {
        $('.ourButton').text('Добавить');
      }
    },

    //заполняем попап данными
    fulfillContent: function(text, html, changingValue, placeholder) {

      $('.popupTitle').text(text);
      $('.popupUndername').html(html);
      if(changingValue == null) {
        $('#inputInformation').attr('placeholder', placeholder);
      } else {
        $('#inputInformation').val(changingValue);
      }
    },

    openPopupInEdit: function() {

      userObject.mode = 'change';
      $('.ourPopup, #overlay').show();
    }

  };

  //ПОСЫЛАЕМ И ДОБАВЛЯЕМ
  $('.sendAdding').on('click', function() {

    var sendedValue = $('#inputInformation').val();
    var list = '', urlType = '', num = '';

    if(sendedValue != '') {

      //ДОБАВЛЕНИЕ
      if(userObject.mode == 'read') {

        switch(addingElementType) {

          case 'hall':
            list = $('.hallList');
            urlType = 'addhall';
            userObject.sendGetHallAjax(list, urlType, sendedValue);
            break;

          case 'teacher':
            list = $('.teacherList');
            urlType = 'addteacher';
            userObject.sendGetTeacherAjax(list, sendedValue);
            break;
        }

      //ИЗМЕНЕНИЕ
      } else {

        switch(addingElementType) {

          case 'hall':
            userObject.sendHallEditAjax('edithall', sendedValue);
            break;

          case 'teacher':
            userObject.sendTeacherEditAjax(sendedValue);
            break;
        }

      }

      //обнуляем
      $('#inputInformation').val('');
      $('.ourPopup, #overlay').css({'display':'none'});

    }
  });

  //вызов изменяющего окна
  $('body').on('click', '.changeListElement', function() {

      switch($(this).attr('type')) {

        case 'addhall':
          addingElementType = 'hall';
          changingElement = $(this).attr('num');
          userObject.changePopupContent(addingElementType, $(this).attr('name'), 'change');
          userObject.openPopupInEdit();
          break;

        case 'addteacher':
          addingElementType = 'teacher';
          changingElement = $(this).attr('num');
          userObject.changePopupContent(addingElementType, $(this).attr('name'), 'change');
          userObject.openPopupInEdit();
          break;
      }      
  });

  //удаление элемента
  $('.deleteButton').on('click', function() {

    switch(addingElementType) {

      case 'hall':
        $('.ourPopup').hide();
        $('.agreePopup').show();
        break;

      case 'teacher':
        userObject.sendDeleteAjax('removeteacher');
        break;
    }
  });

  //соглашение на удаления зала и всех его занятий
  $('body').on('click', '.agreedDeleteHall', function() {
    userObject.sendDeleteAjax('removehall');
    $('.ourPopup, #overlay, .agreePopup').css({'display':'none'});
  });

  //закрыть попап (отмена удаления зала)
  $('body').on('click', '.notAgreedDeleteHall', function() {
    $('.agreePopup').css({'display':'none'});
    $('.ourPopup').show();
  });

  //Вызов попапа добавления зала
  $('.addHall').click( function() {
      userObject.addHall();
  });

  //Вызов попапа добавления препода
  $('.addTeacher').click( function() {
      userObject.addTeacher();
  });

  $('.closeOurPopup').click(function() {
    $('#inputInformation').val('');
    $('.ourPopup, #overlay').css({'display':'none'});
  });

  //переключение таблиц
  $('body').on('click', '.showTable', function() {

    var hallNum = $(this).attr('hallNum');
    $('.hallTable').hide();
    $('.hallsAllTable').hide();
    $('.hallTable[hall=' + hallNum + ']').show();
  });

  //все залы
  $('body').on('click', '.showTableOfAllHalls', function() {
    $('.hallsAllTable').show();
    $('.hallTable').hide();
  });

  $(document).ready(function() {

    if($('#myHalls tr td').length == 0) {
      $('.addLesson').addClass('disabled');
    }
  });
