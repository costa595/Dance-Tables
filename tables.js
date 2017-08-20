(function ($, AdminLTE) {

  //************************************************ My Code ****************

  // myTableObject.rowNum = 4;
  // myTableObject.colNum = 5;

  //ОБЪЕКТ ПРИХОДИТ
  var myTableObject = new Object();

  $.get( "/api/table", ajaxSuccess);

function ajaxSuccess(data) {

  myTableObject = JSON.parse(data);

  //ГЛАВНЫЙ ОБЪЕКТ
  var Table = {

    stateTable: 'read', //режим
    rowDelete: false,
    columnDelete: false,

    deleteRowClicked: false,
    previousTables: [],

    initTable: function() {

      //HEAD
      var tmpStr = '';
      for(var i = 0; i < myTableObject['TH'].length; i++) {
        tmpStr += '<th >' + myTableObject['TH'][i] + '</th>';
      }
      var tHeadContent = '<tr>' + tmpStr + '</tr>';
      // tHeadContent += '<th class="control" style="border:none;"><button type="button" class="btn btn-sm btn-default">Добавить столбец</button></th>'  + '</tr>';
      $('#myData thead').append(tHeadContent);

      //BODY
      tmpStr = '';
      var thLength = myTableObject['TH'].length;
      var columnCounter = 0;
      for(var i = 0; i < myTableObject['TD'].length; i++) {
        tmpStr += '<td >' + myTableObject['TD'][i] + '</td>';
        columnCounter++;
        if(columnCounter == thLength) {
          tmpStr += (i != myTableObject['TD'].length - 1) ? '</tr><tr>' : '</tr>'; //чтобы не было лишней строки
          columnCounter = 0;
        }
      }

      var tBodyContent = '<tr>' + tmpStr + '</tr>';
      $('#myData tbody').append(tBodyContent);

    },
    //РАБОТА С ТАБЛИЦЕЙ
    workWithTable: function(tableId) {

      myTableObject = new Object();
      var myObj = this;

      switch(this.stateTable) {
        case 'change':
          $(tableId + ' td, ' + tableId + ' th').each(function() {
            var value = $(this).text();
            var tag = $(this)[0].tagName;
            myObj.logObject(tag, value);
            $(this).html('<input type="text" class="form-control" value="' + value + '">');
          });

          this.saveObject();

          break;

        case 'read':
          $(tableId + ' td,  ' + tableId + ' th').each(function() {
            var value = $(this).children().val();
            var tag = $(this)[0].tagName;
            myObj.logObject(tag, value);
            $(this).html(value);
          });

          this.saveObject();

          break;
      }
    },
    //ДОБАВЛЯЕМ СТРОЧКУ
    addRow: function() {

      var num = myTableObject['TH'].length;
      var str = '', myObj = this;
      var addStr = (myObj.stateTable == 'read') ? '<td ></td>' : '<td ><input type="text" class="form-control"></td>';
      for(var i = 0; i < num; i++) {
        str += addStr;
      }
      $('#myData tbody').append('<tr>' + str + '</tr>');

      this.checkChanges();

    },
    //ДОБАВЛЯЕМ СТОЛБЕЦ
    addColumn: function() {

      var myObj = this, alreadyEntered = false;

      var addStrTh = (myObj.stateTable == 'read') ? '<th ></th>' : '<th ><input type="text" class="form-control"></th>';
      var addStrTd = (myObj.stateTable == 'read') ? '<td ></td>' : '<td ><input type="text" class="form-control"></td>';

      $('#myData').find('tr').each(function() {
        var row = $(this);
        if(row.index() === 0 && !alreadyEntered) {
          row.append(addStrTh);
          alreadyEntered = true;
        } else {
          row.append(addStrTd);
        }
      });

      this.checkChanges();

    },
    //УДАЛЯЕМ СТРОЧКУ
    deleteRow: function() {
      this.rowDelete = true;
      var myObj = this;
      this.hoverDelete();

      $('#myData tbody tr').click(function() {
        $(this).remove();
        myObj.rowDelete = false;
        $('#myData tbody tr').unbind();
        myObj.checkChanges();
      }); 

    },
    //УДАЛЯЕМ СТОЛБЕЦ
    deleteColumn: function() {
      this.columnDelete = true;
      var myObj = this;
      this.hoverDelete();

      $('#myData td, th').click(function() {
        var index = this.cellIndex;
        $(this).closest('#myData').find('tr').each(function() {
            this.removeChild(this.cells[index]);
        });
        myObj.columnDelete = false;
        $('#myData td, th').unbind();
        myObj.checkChanges();
      });

    },
    //ПЕРЕКРАШИВАЕМ
    hoverDelete: function() {

      if(this.rowDelete) {

        $('#myData tbody tr').mouseenter(function() {
          $(this).css({'background' : 'red'});
        });
        $('#myData tbody tr').mouseleave(function() {
          $(this).css({'background' : 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box'});
        });

      } else if(this.columnDelete) {

        $('#myData td, th').mouseenter(function() {
          var index = this.cellIndex;
          $('#myData td, th').filter(":nth-child(" + (index + 1) + ")").css({'background' : 'red'});
        });
        $('#myData td, th').mouseleave(function() {
          var index = this.cellIndex;
          $('#myData td, th').filter(":nth-child(" + (index + 1) + ")").css({'background' : 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box'});
        });
      }

    },
    //ПЕРЕДАЧА ДАННЫХ В ЛОГ
    checkChanges: function() {
      var myObj = this;
      myTableObject = {};

      $('#myData td,  #myData th').each(function() {
        var value = (myObj.stateTable == 'read') ? $(this).text() : $(this).children().val();

        var tag = $(this)[0].tagName;
        myObj.logObject(tag, value);

      });

      console.log(myTableObject)

      this.saveObject();
    },
    //ЛОГИРОВАНИЕ ОБЪЕКТА
    logObject: function(tag, value) {

      if(myTableObject[tag] == null) {
        myTableObject[tag] = new Array();
      }
      myTableObject[tag].push(value);
    },
    getPreviousTable: function() {

      if(this.previousTables[this.previousTables.length - 1] != null) {
        myTableObject = this.previousTables[this.previousTables.length - 1];
        $('#myData tr').remove();
        this.initTable();
        this.previousTables.splice(-1,1);
      }
    },
    //ОТПРАВКА НА СЕРВАК
    saveObject: function() {

      $('#status').html('Сохранение... ');
      var myStathem = JSON.stringify(myTableObject);
      this.previousTables.push(myTableObject);
      console.log(myStathem);
      $.ajax({
        type: "POST",
        url: '/api/updatetable',
        data: { table : myStathem },
        // dataType: "json",
        success: function(mes) {
          console.log(mes);
          if(mes == 'ok') {
            setTimeout(function() { 
              $('#status').html('Сохранено') },
              1000);
          } else {
            setTimeout(function() {
              $('#status').html('Не удалось сохранить');
            }, 1000);
          }
        },
        error: function(mes) {
          console.log(mes);
          if(mes.responseText == 'ok') {
            setTimeout(function() { 
              $('#status').html('Сохранено') },
              1000);
          } else {
            setTimeout(function() {
              $('#status').html('Не удалось сохранить');
            }, 1000);
          }
        }
      });
    }

  };

  //ЗАГРУЗКА ТАБЛИЦЫ
  Table.initTable();

// ИЗМЕНЕНИЕ РЕЖИМА РАБОТЫ С ТАБЛИЦЕЙ
  $('.stateButton').on('click', function () {

    if(Table.stateTable == 'read') {
      Table.stateTable = 'change';
      $('.stateButton').text('Сохранить');
    } else {
      Table.stateTable = 'read';
      $('.stateButton').text('Изменить');
    }

    Table.workWithTable('#myData');
  });

// ДОБАВЛЕНИЕ СТРОКИ ТАБЛИЦЫ
  $('#addRow').on('click', function() {
    Table.addRow();
  });

// ДОБАВЛЕНИЕ СТОЛБЦА ТАБЛИЦЫ
  $('#addColumn').on('click', function() {
    Table.addColumn();
  });

// УДАЛЕНИЕ СТРОКИ ТАБЛИЦЫ
  $('#deleteRow').on('click', function() {
    Table.deleteRow();
    Table.deleteRowClicked = true;
  });

// УДАЛЕНИЕ СТОЛБЦА ТАБЛИЦЫ
  $('#deleteColumn').on('click', function() {
    Table.deleteColumn();
  });

  $('#getPreviousTable').on('click', function() {
    Table.getPreviousTable();
  });

}

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

