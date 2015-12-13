//Easy-table.ru
//costa rassco

userObject = (function() {

  halls: [],
  teachers: [],
  lessons: [],
  mode: 'read',

  addingElementType: '',
  changingElement: '',

  //Changing element in a list
  changeElementInList: function(sendedValue) {

    var link = $('.add' + this.addingElementType + '_' + this.changingElement);
    var str = link.html();
    var newStr = str.substring(str.indexOf('<i'), str.length - 1);
    link.html(sendedValue + newStr);
    link.children().attr('name', sendedValue);
  },

  //adding element to the list
  addElementToList: function(link, addType, index, value) {

    link.append('<div class="box-body ' + addType + '_' + index + '" style="display: block;"><span style="float:left;">' + value + '</span><i class="fa fa-gear changeListElement" num="' + index + '" name="' + value + '" type="' + addType + '"></i></div>');
  },

  //popup settings
  changePopupContent: function (changingValue, type) {

    var textDeleteButton = '';

    switch(this.addingElementType) {

      case 'hall':
        this.fulfillContent('Добавить зал', 'Название зала', changingValue, 'Введите название зала');
        textDeleteButton = 'Удалить зал';
        break;

      case 'teacher':
        this.fulfillContent('Добавить преподавателя', 'ФИО преподавателя', changingValue, 'Введите ФИО преподавателя');
        textDeleteButton = 'Удалить преподавателя';
        break;
    }

    //changing mode
    if(type == 'change') {
      $('.ourButton').text('Сохранить изменение');
      $('.deleteButton').show();
      $('.deleteButton').text(textDeleteButton);

    } else {

      $('.ourButton').text('Добавить');
    }
  },

  //fulfill popup with data
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

    this.mode = 'change';
    $('.ourPopup, #overlay').show();
  }

}());