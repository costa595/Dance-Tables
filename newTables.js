(function ($, AdminLTE) {

  //************************************************ My Code ****************

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
            window.location.href = "http://localhost:8000";
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
            window.location.href = "http://localhost:8000";
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

              window.location.href = "http://localhost:8000";
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


  //***************************************************************************
  //***************************************************************************
  //***************************************************************************
  //***************************************************************************
  //***************************************************************************
  //***************************************************************************
  //***************************************************************************
  //***************************************************************************
  //***************************************************************************
  //****************** AdminLTE CODE *******************

  var my_skins = [
    "skin-blue",
    "skin-black",
    "skin-red",
    "skin-yellow",
    "skin-purple",
    "skin-green",
    "skin-blue-light",
    "skin-black-light",
    "skin-red-light",
    "skin-yellow-light",
    "skin-purple-light",
    "skin-green-light"
  ];

  //Create the new tab
  var tab_pane = $("<div />", {
    "id": "control-sidebar-theme-demo-options-tab",
    "class": "tab-pane active"
  });

  //Create the tab button
  var tab_button = $("<li />", {"class": "active"})
          .html("<a href='#control-sidebar-theme-demo-options-tab' data-toggle='tab'>"
                  + "<i class='fa fa-wrench'></i>"
                  + "</a>");

  //Add the tab button to the right sidebar tabs
  $("[href='#control-sidebar-home-tab']")
          .parent()
          .before(tab_button);

  //Create the menu
  var demo_settings = $("<div />");

  //Layout options
  demo_settings.append(
          "<h4 class='control-sidebar-heading'>"
          + "Опции оформления"
          + "</h4>"
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "<input type='checkbox' data-layout='layout-boxed'class='pull-right'/> "
          + "Границы"
          + "</label>"
          + "<p>Активирует границы</p>"
          + "</div>"
          //Sidebar Toggle
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "<input type='checkbox' data-layout='sidebar-collapse' class='pull-right'/> "
          + "Переключатель левого доп. меню"
          + "</label>"
          + "<p>Переключает левое меню в свернутое / развернутое положение</p>"
          + "</div>"
          //Sidebar mini expand on hover toggle
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "<input type='checkbox' data-enable='expandOnHover' class='pull-right'/> "
          + "Расширение левого меню при наведении"
          + "</label>"
          + "<p>Расширяет свернутое левое меню при наведении</p>"
          + "</div>"
          //Control Sidebar Toggle
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "<input type='checkbox' data-controlsidebar='control-sidebar-open' class='pull-right'/> "
          + "Переключатель правой стороны таблицы"
          + "</label>"
          + "<p>Переключает положение правой стороны таблицы из свернутого от правого меню или лежащим под ним</p>"
          + "</div>"
          //Control Sidebar Skin Toggle
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "<input type='checkbox' data-sidebarskin='toggle' class='pull-right'/> "
          + "Изменение стиля правого меню"
          + "</label>"
          + "<p>Переключает стиль правого меню</p>"
          + "</div>"
          );
  var skins_list = $("<ul />", {"class": 'list-unstyled clearfix'});

  //Dark sidebar skins
  var skin_blue =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-blue' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px; background: #367fa9;'></span><span class='bg-light-blue' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin'>Синий</p>");
  skins_list.append(skin_blue);
  var skin_black =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-black' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div style='box-shadow: 0 0 2px rgba(0,0,0,0.1)' class='clearfix'><span style='display:block; width: 20%; float: left; height: 7px; background: #fefefe;'></span><span style='display:block; width: 80%; float: left; height: 7px; background: #fefefe;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #222;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin'>Черный</p>");
  skins_list.append(skin_black);
  var skin_purple =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-purple' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-purple-active'></span><span class='bg-purple' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin'>Фиолетовый</p>");
  skins_list.append(skin_purple);
  var skin_green =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-green' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-green-active'></span><span class='bg-green' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin'>Зеленый</p>");
  skins_list.append(skin_green);
  var skin_red =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-red' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-red-active'></span><span class='bg-red' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin'>Красный</p>");
  skins_list.append(skin_red);
  var skin_yellow =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-yellow' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-yellow-active'></span><span class='bg-yellow' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin'>Желтый</p>");
  skins_list.append(skin_yellow);

  //Light sidebar skins
  var skin_blue_light =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-blue-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px; background: #367fa9;'></span><span class='bg-light-blue' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin' style='font-size: 12px'>Светло-синий</p>");
  skins_list.append(skin_blue_light);
  var skin_black_light =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-black-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div style='box-shadow: 0 0 2px rgba(0,0,0,0.1)' class='clearfix'><span style='display:block; width: 20%; float: left; height: 7px; background: #fefefe;'></span><span style='display:block; width: 80%; float: left; height: 7px; background: #fefefe;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin' style='font-size: 12px'>Светло-черный</p>");
  skins_list.append(skin_black_light);
  var skin_purple_light =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-purple-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-purple-active'></span><span class='bg-purple' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin' style='font-size: 12px'>Светло-фиолетовый</p>");
  skins_list.append(skin_purple_light);
  var skin_green_light =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-green-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-green-active'></span><span class='bg-green' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin' style='font-size: 12px'>Светло-зеленый</p>");
  skins_list.append(skin_green_light);
  var skin_red_light =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-red-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-red-active'></span><span class='bg-red' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin' style='font-size: 12px'>Светло-красный</p>");
  skins_list.append(skin_red_light);
  var skin_yellow_light =
          $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
          .append("<a href='javascript:void(0);' data-skin='skin-yellow-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-yellow-active'></span><span class='bg-yellow' style='display:block; width: 80%; float: left; height: 7px;'></span></div>"
                  + "<div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div>"
                  + "</a>"
                  + "<p class='text-center no-margin' style='font-size: 12px;'>Светло-желтый</p>");
  skins_list.append(skin_yellow_light);

  demo_settings.append("<h4 class='control-sidebar-heading'>Стили</h4>");
  demo_settings.append(skins_list);

  tab_pane.append(demo_settings);
  $("#control-sidebar-home-tab").after(tab_pane);

  setup();

  /**
   * Toggles layout classes
   * 
   * @param String cls the layout class to toggle
   * @returns void
   */
  function change_layout(cls) {
    $("body").toggleClass(cls);
    AdminLTE.layout.fixSidebar();
    //Fix the problem with right sidebar and layout boxed
    if (cls == "layout-boxed")
      AdminLTE.controlSidebar._fix($(".control-sidebar-bg"));
    if ($('body').hasClass('fixed') && cls == 'fixed') {
      AdminLTE.pushMenu.expandOnHover();
      AdminLTE.controlSidebar._fixForFixed($('.control-sidebar'));
      AdminLTE.layout.activate();
    }
  }

  /**
   * Replaces the old skin with the new skin
   * @param String cls the new skin class
   * @returns Boolean false to prevent link's default action
   */
  function change_skin(cls) {
    $.each(my_skins, function (i) {
      $("body").removeClass(my_skins[i]);
    });

    $("body").addClass(cls);
    store('skin', cls);
    return false;
  }

  /**
   * Store a new settings in the browser
   * 
   * @param String name Name of the setting
   * @param String val Value of the setting
   * @returns void
   */
  function store(name, val) {
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem(name, val);
    } else {
      alert('Please use a modern browser to properly view this template!');
    }
  }

  /**
   * Get a prestored setting
   * 
   * @param String name Name of of the setting
   * @returns String The value of the setting | null
   */
  function get(name) {
    if (typeof (Storage) !== "undefined") {
      return localStorage.getItem(name);
    } else {
      alert('Please use a modern browser to properly view this template!');
    }
  }

  /**
   * Retrieve default settings and apply them to the template
   * 
   * @returns void
   */
  function setup() {
    var tmp = get('skin');
    if (tmp && $.inArray(tmp, my_skins))
      change_skin(tmp);

    //Add the change skin listener
    $("[data-skin]").on('click', function (e) {
      e.preventDefault();
      change_skin($(this).data('skin'));
    });

    //Add the layout manager
    $("[data-layout]").on('click', function () {
      change_layout($(this).data('layout'));
    });

    $("[data-controlsidebar]").on('click', function () {
      change_layout($(this).data('controlsidebar'));
      var slide = !AdminLTE.options.controlSidebarOptions.slide;
      AdminLTE.options.controlSidebarOptions.slide = slide;
      if (!slide)
        $('.control-sidebar').removeClass('control-sidebar-open');
    });

    $("[data-sidebarskin='toggle']").on('click', function () {
      var sidebar = $(".control-sidebar");
      if (sidebar.hasClass("control-sidebar-dark")) {
        sidebar.removeClass("control-sidebar-dark")
        sidebar.addClass("control-sidebar-light")
      } else {
        sidebar.removeClass("control-sidebar-light")
        sidebar.addClass("control-sidebar-dark")
      }
    });
    
    $("[data-enable='expandOnHover']").on('click', function () {
      $(this).attr('disabled', true);      
      AdminLTE.pushMenu.expandOnHover();
      if(!$('body').hasClass('sidebar-collapse'))
        $("[data-layout='sidebar-collapse']").click();
    });
    
    // Reset options
    if($('body').hasClass('fixed')) {
      $("[data-layout='fixed']").attr('checked', 'checked');
    }
    if($('body').hasClass('layout-boxed')) {
      $("[data-layout='layout-boxed']").attr('checked', 'checked');
    }
    if($('body').hasClass('sidebar-collapse')) {
      $("[data-layout='sidebar-collapse']").attr('checked', 'checked');
    }
    
  }
})(jQuery, $.AdminLTE);

