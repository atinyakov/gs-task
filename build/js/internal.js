"use strict";

$(document).ready(function () {
  /**
   * Глобальные переменные, которые используются многократно
   */
  var globalOptions = {
    // Время для анимаций
    time: 200,
    // Контрольные точки адаптива
    desktopXlSize: 1920,
    desktopLgSize: 1600,
    desktopSize: 1280,
    tabletLgSize: 1024,
    tabletSize: 768,
    mobileLgSize: 640,
    mobileSize: 480,
    // Точка перехода попапов на фулскрин
    popupsBreakpoint: 768,
    // Время до сокрытия фиксированных попапов
    popupsFixedTimeout: 5000,
    // Проверка touch устройств
    isTouch: $.browser.mobile,
    lang: $('html').attr('lang')
  }; // Брейкпоинты адаптива
  // @example if (globalOptions.breakpointTablet.matches) {} else {}

  var breakpoints = {
    breakpointDesktopXl: window.matchMedia("(max-width: ".concat(globalOptions.desktopXlSize - 1, "px)")),
    breakpointDesktopLg: window.matchMedia("(max-width: ".concat(globalOptions.desktopLgSize - 1, "px)")),
    breakpointDesktop: window.matchMedia("(max-width: ".concat(globalOptions.desktopSize - 1, "px)")),
    breakpointTabletLg: window.matchMedia("(max-width: ".concat(globalOptions.tabletLgSize - 1, "px)")),
    breakpointTablet: window.matchMedia("(max-width: ".concat(globalOptions.tabletSize - 1, "px)")),
    breakpointMobileLgSize: window.matchMedia("(max-width: ".concat(globalOptions.mobileLgSize - 1, "px)")),
    breakpointMobile: window.matchMedia("(max-width: ".concat(globalOptions.mobileSize - 1, "px)"))
  };
  $.extend(true, globalOptions, breakpoints);
  $(window).load(function () {
    if (globalOptions.isTouch) {
      $('body').addClass('touch').removeClass('no-touch');
    } else {
      $('body').addClass('no-touch').removeClass('touch');
    }

    if ($('textarea').length > 0) {
      autosize($('textarea'));
    }
  });
  /**
   * Подключение js partials
   */

  /* form_style.js должен быть выполнен перед form_validation.js */

  /**
   * Расширение animate.css
   * @param  {String} animationName название анимации
   * @param  {Function} callback функция, которая отработает после завершения анимации
   * @return {Object} объект анимации
   * 
   * @see  https://daneden.github.io/animate.css/
   * 
   * @example
   * $('#yourElement').animateCss('bounce');
   * 
   * $('#yourElement').animateCss('bounce', function() {
   *     // Делаем что-то после завершения анимации
   * });
   */

  $.fn.extend({
    animateCss: function animateCss(animationName, callback) {
      var animationEnd = function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      }(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
        if (typeof callback === 'function') callback();
      });
      return this;
    }
  });
  /**
   * Стилизует селекты с помощью плагина select2
   * https://select2.github.io
   */

  var CustomSelect = function CustomSelect($elem) {
    var self = this;

    self.init = function ($initElem) {
      $initElem.each(function () {
        if ($(this).hasClass('select2-hidden-accessible')) {
          return;
        } else {
          var selectSearch = $(this).data('search');
          var minimumResultsForSearch;

          if (selectSearch) {
            minimumResultsForSearch = 1; // показываем поле поиска
          } else {
            minimumResultsForSearch = Infinity; // не показываем поле поиска
          }

          $(this).select2({
            minimumResultsForSearch: minimumResultsForSearch,
            selectOnBlur: true,
            dropdownCssClass: 'error'
          });
          $(this).on('change', function (e) {
            // нужно для вылидации на лету
            $(this).find("option[value=\"".concat($(this).context.value, "\"]")).click();
          });
        }
      });
    };

    self.update = function ($updateElem) {
      $updateElem.select2('destroy');
      self.init($updateElem);
    };

    self.init($elem);
  };
  /**
   * Стилизует file input
   * http://gregpike.net/demos/bootstrap-file-input/demo.html
   */


  $.fn.customFileInput = function () {
    this.each(function (i, elem) {
      var $elem = $(elem); // Maybe some fields don't need to be standardized.

      if (typeof $elem.attr('data-bfi-disabled') !== 'undefined') {
        return;
      } // Set the word to be displayed on the button


      var buttonWord = 'Browse';
      var className = '';

      if (typeof $elem.attr('title') !== 'undefined') {
        buttonWord = $elem.attr('title');
      }

      if (!!$elem.attr('class')) {
        className = ' ' + $elem.attr('class');
      } // Now we're going to wrap that input field with a button.
      // The input will actually still be there, it will just be float above and transparent (done with the CSS).


      $elem.wrap("<div class=\"custom-file\"><a class=\"btn ".concat(className, "\"></a></div>")).parent().prepend($('<span></span>').html(buttonWord));
    }) // After we have found all of the file inputs let's apply a listener for tracking the mouse movement.
    // This is important because the in order to give the illusion that this is a button in FF we actually need to move the button from the file input under the cursor. Ugh.
    .promise().done(function () {
      // As the cursor moves over our new button we need to adjust the position of the invisible file input Browse button to be under the cursor.
      // This gives us the pointer cursor that FF denies us
      $('.custom-file').mousemove(function (cursor) {
        var input, wrapper, wrapperX, wrapperY, inputWidth, inputHeight, cursorX, cursorY; // This wrapper element (the button surround this file input)

        wrapper = $(this); // The invisible file input element

        input = wrapper.find('input'); // The left-most position of the wrapper

        wrapperX = wrapper.offset().left; // The top-most position of the wrapper

        wrapperY = wrapper.offset().top; // The with of the browsers input field

        inputWidth = input.width(); // The height of the browsers input field

        inputHeight = input.height(); //The position of the cursor in the wrapper

        cursorX = cursor.pageX;
        cursorY = cursor.pageY; //The positions we are to move the invisible file input
        // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle

        moveInputX = cursorX - wrapperX - inputWidth + 20; // Slides the invisible input Browse button to be positioned middle under the cursor

        moveInputY = cursorY - wrapperY - inputHeight / 2; // Apply the positioning styles to actually move the invisible file input

        input.css({
          left: moveInputX,
          top: moveInputY
        });
      });
      $('body').on('change', '.custom-file input[type=file]', function () {
        var fileName;
        fileName = $(this).val(); // Remove any previous file names

        $(this).parent().next('.custom-file__name').remove();

        if (!!$(this).prop('files') && $(this).prop('files').length > 1) {
          fileName = $(this)[0].files.length + ' files';
        } else {
          fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
        } // Don't try to show the name if there is none


        if (!fileName) {
          return;
        }

        var selectedFileNamePlacement = $(this).data('filename-placement');

        if (selectedFileNamePlacement === 'inside') {
          // Print the fileName inside
          $(this).siblings('span').html(fileName);
          $(this).attr('title', fileName);
        } else {
          // Print the fileName aside (right after the the button)
          $(this).parent().after("<span class=\"custom-file__name\">".concat(fileName, " </span>"));
        }
      });
    });
  };

  $('input[type="file"]').customFileInput(); // $('select').customSelect();

  var customSelect = new CustomSelect($('select'));

  if ($('.js-label-animation').length > 0) {
    /**
     * Анимация элемента label при фокусе полей формы
     */
    $('.js-label-animation').each(function (index, el) {
      var field = $(el).find('input, textarea');

      if ($(field).val().trim() != '') {
        $(el).addClass('is-filled');
      }

      $(field).on('focus', function (event) {
        $(el).addClass('is-filled');
      }).on('blur', function (event) {
        if ($(this).val().trim() === '') {
          $(el).removeClass('is-filled');
        }
      });
    });
  }

  var locale = globalOptions.lang == 'ru-RU' ? 'ru' : 'en';
  Parsley.setLocale(locale);
  /* Настройки Parsley */

  $.extend(Parsley.options, {
    trigger: 'blur change',
    // change нужен для select'а
    validationThreshold: '0',
    errorsWrapper: '<div></div>',
    errorTemplate: '<p class="parsley-error-message"></p>',
    classHandler: function classHandler(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $handler;

      if (type == 'checkbox' || type == 'radio') {
        $handler = $element; // то есть ничего не выделяем (input скрыт), иначе выделяет родительский блок
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $handler = $('.select2-selection--single', $element.next('.select2'));
      }

      return $handler;
    },
    errorsContainer: function errorsContainer(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $container;

      if (type == 'checkbox' || type == 'radio') {
        $container = $("[name=\"".concat($element.attr('name'), "\"]:last + label")).next('.errors-placement');
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $container = $element.next('.select2').next('.errors-placement');
      } else if (type == 'file') {
        $container = $element.closest('.custom-file').next('.errors-placement');
      } else if ($element.closest('.js-datepicker-range').length) {
        $container = $element.closest('.js-datepicker-range').next('.errors-placement');
      } else if ($element.attr('name') == 'is_recaptcha_success') {
        $container = $element.parent().next('.g-recaptcha').next('.errors-placement');
      }

      return $container;
    }
  }); // Кастомные валидаторы
  // Только русские буквы, тире, пробелы

  Parsley.addValidator('nameRu', {
    validateString: function validateString(value) {
      return /^[а-яё\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, " ", "-"',
      en: 'Only simbols А-Я, а-я, " ", "-"'
    }
  }); // Только латинские буквы, тире, пробелы

  Parsley.addValidator('nameEn', {
    validateString: function validateString(value) {
      return /^[a-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, " ", "-"',
      en: 'Only simbols A-Z, a-z, " ", "-"'
    }
  }); // Только латинские и русские буквы, тире, пробелы

  Parsley.addValidator('name', {
    validateString: function validateString(value) {
      return /^[а-яёa-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, " ", "-"',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, " ", "-"'
    }
  }); // Только цифры и русские буквы

  Parsley.addValidator('numLetterRu', {
    validateString: function validateString(value) {
      return /^[0-9а-яё]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, 0-9',
      en: 'Only simbols А-Я, а-я, 0-9'
    }
  }); // Только цифры, латинские и русские буквы

  Parsley.addValidator('numLetter', {
    validateString: function validateString(value) {
      return /^[а-яёa-z0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, 0-9',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, 0-9'
    }
  }); // Телефонный номер

  Parsley.addValidator('phone', {
    validateString: function validateString(value) {
      return /^[-+0-9() ]*$/i.test(value);
    },
    messages: {
      ru: 'Некорректный телефонный номер',
      en: 'Incorrect phone number'
    }
  }); // Только цифры

  Parsley.addValidator('number', {
    validateString: function validateString(value) {
      return /^[0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы 0-9',
      en: 'Only simbols 0-9'
    }
  }); // Почта без кириллицы

  Parsley.addValidator('email', {
    validateString: function validateString(value) {
      return /^([A-Za-zА-Яа-я0-9\-](\.|_|-){0,1})+[A-Za-zА-Яа-я0-9\-]\@([A-Za-zА-Яа-я0-9\-])+((\.){0,1}[A-Za-zА-Яа-я0-9\-]){1,}\.[a-zа-я0-9\-]{2,}$/.test(value);
    },
    messages: {
      ru: 'Некорректный почтовый адрес',
      en: 'Incorrect email address'
    }
  }); // Формат даты DD.MM.YYYY

  Parsley.addValidator('date', {
    validateString: function validateString(value) {
      var regTest = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
          regMatch = /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
          min = arguments[2].$element.data('dateMin'),
          max = arguments[2].$element.data('dateMax'),
          minDate,
          maxDate,
          valueDate,
          result;

      if (min && (result = min.match(regMatch))) {
        minDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (max && (result = max.match(regMatch))) {
        maxDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (result = value.match(regMatch)) {
        valueDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      return regTest.test(value) && (minDate ? valueDate >= minDate : true) && (maxDate ? valueDate <= maxDate : true);
    },
    messages: {
      ru: 'Некорректная дата',
      en: 'Incorrect date'
    }
  }); // Файл ограниченного размера

  Parsley.addValidator('fileMaxSize', {
    validateString: function validateString(value, maxSize, parsleyInstance) {
      var files = parsleyInstance.$element[0].files;
      return files.length != 1 || files[0].size <= maxSize * 1024;
    },
    requirementType: 'integer',
    messages: {
      ru: 'Файл должен весить не более, чем %s Kb',
      en: 'File size can\'t be more then %s Kb'
    }
  }); // Ограничения расширений файлов

  Parsley.addValidator('fileExtension', {
    validateString: function validateString(value, formats) {
      var fileExtension = value.split('.').pop();
      var formatsArr = formats.split(', ');
      var valid = false;

      for (var i = 0; i < formatsArr.length; i++) {
        if (fileExtension === formatsArr[i]) {
          valid = true;
          break;
        }
      }

      return valid;
    },
    messages: {
      ru: 'Допустимы только файлы формата %s',
      en: 'Available extensions are %s'
    }
  }); // Создаёт контейнеры для ошибок у нетипичных элементов

  Parsley.on('field:init', function () {
    var $element = this.$element,
        type = $element.attr('type'),
        $block = $('<div/>').addClass('errors-placement'),
        $last;

    if (type == 'checkbox' || type == 'radio') {
      $last = $("[name=\"".concat($element.attr('name'), "\"]:last + label"));

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.hasClass('select2-hidden-accessible')) {
      $last = $element.next('.select2');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if (type == 'file') {
      $last = $element.closest('.custom-file');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.closest('.js-datepicker-range').length) {
      $last = $element.closest('.js-datepicker-range');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.attr('name') == 'is_recaptcha_success') {
      $last = $element.parent().next('.g-recaptcha');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    }
  }); // Инициирует валидацию на втором каледарном поле диапазона

  Parsley.on('field:validated', function () {
    var $element = $(this.element);
  });
  $('form[data-validate="true"]').parsley();
  /**
   * Добавляет маски в поля форм
   * @see  https://github.com/RobinHerbots/Inputmask
   *
   * @example
   * <input class="js-phone-mask" type="tel" name="tel" id="tel">
   */

  $('.js-phone-mask').inputmask('+7(999) 999-99-99', {
    clearMaskOnLostFocus: true,
    showMaskOnHover: false
  });
  /**
   * Костыль для обновления xlink у svg-иконок после обновления DOM (для IE)
   * функцию нужно вызывать в событиях, которые вносят изменения в элементы уже после формирования DOM-а
   * (например, после инициализации карусели или открытии попапа)
   *
   * @param  {Element} element элемент, в котором необходимо обновить svg (наприм $('#some-popup'))
   */

  function updateSvg(element) {
    var $useElement = element.find('use');
    $useElement.each(function (index) {
      if ($useElement[index].href && $useElement[index].href.baseVal) {
        $useElement[index].href.baseVal = $useElement[index].href.baseVal; // trigger fixing of href
      }
    });
  }

  var datepickerDefaultOptions = {
    dateFormat: 'dd.mm.yy',
    showOtherMonths: true
  };
  /**
   * Делает выпадющие календарики
   * @see  http://api.jqueryui.com/datepicker/
   *
   * @example
   * // в data-date-min и data-date-max можно задать дату в формате dd.mm.yyyy
   * <input type="text" name="dateInput" id="" class="js-datepicker" data-date-min="06.11.2015" data-date-max="10.12.2015">
   */

  var Datepicker = function Datepicker() {
    var datepicker = $('.js-datepicker');
    datepicker.each(function () {
      var minDate = $(this).data('date-min');
      var maxDate = $(this).data('date-max');
      var itemOptions = {
        minDate: minDate || null,
        maxDate: maxDate || null,
        onSelect: function onSelect() {
          $(this).change();
          $(this).closest('.field').addClass('is-filled');
        }
      };
      $.extend(true, itemOptions, datepickerDefaultOptions);
      $(this).datepicker(itemOptions);
    });
  };

  var datepicker = new Datepicker(); // Диапазон дат

  var DatepickerRange = function DatepickerRange() {
    var datepickerRange = $('.js-datepicker-range');
    datepickerRange.each(function () {
      var fromItemOptions = {};
      var toItemOptions = {};
      $.extend(true, fromItemOptions, datepickerDefaultOptions);
      $.extend(true, toItemOptions, datepickerDefaultOptions);
      var dateFrom = $(this).find('.js-range-from').datepicker(fromItemOptions);
      var dateTo = $(this).find('.js-range-to').datepicker(toItemOptions);
      dateFrom.on('change', function () {
        dateTo.datepicker('option', 'minDate', getDate(this));
        dateTo.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
      dateTo.on('change', function () {
        dateFrom.datepicker('option', 'maxDate', getDate(this));
        dateFrom.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
    });

    function getDate(element) {
      var date;

      try {
        date = $.datepicker.parseDate(datepickerDefaultOptions.dateFormat, element.value);
      } catch (error) {
        date = null;
      }

      return date;
    }
  };

  var datepickerRange = new DatepickerRange();
  /**
   * Реализует переключение табов
   *
   * @example
   * <ul class="tabs js-tabs">
   *     <li class="tabs__item">
   *         <span class="is-active tabs__link js-tab-link">Tab name</span>
   *         <div class="tabs__cnt">
   *             <p>Tab content</p>
   *         </div>
   *     </li>
   * </ul>
   */

  var TabSwitcher = function TabSwitcher() {
    var self = this;
    var tabs = $('.js-tabs');
    tabs.each(function () {
      $(this).find('.js-tab-link.is-active').next().addClass('is-open');
    });
    tabs.on('click', '.js-tab-link', function (event) {
      self.open($(this), event); // return false;
    });
    /**
     * Открывает таб по клику на какой-то другой элемент
     *
     * @example
     * <span data-tab-open="#tab-login">Open login tab</span>
     */

    $(document).on('click', '[data-tab-open]', function (event) {
      var tabElem = $(this).data('tab-open');
      self.open($(tabElem), event);

      if ($(this).data('popup') == undefined) {
        return false;
      }
    });
    /**
     * Открывает таб
     * @param  {Element} elem элемент .js-tab-link, на который нужно переключить
     *
     * @example
     * // вызов метода open, откроет таб
     * tabSwitcher.open($('#some-tab'));
     */

    self.open = function (elem, event) {
      if (!elem.hasClass('is-active')) {
        event.preventDefault();
        var parentTabs = elem.closest(tabs);
        parentTabs.find('.is-open').removeClass('is-open');
        elem.next().toggleClass('is-open');
        parentTabs.find('.is-active').removeClass('is-active');
        elem.addClass('is-active');
      } else {
        event.preventDefault();
      }
    };
  };

  var tabSwitcher = new TabSwitcher();
  /**
   * Скрывает элемент hiddenElem при клике за пределами элемента targetElem
   *
   * @param  {Element}   targetElem
   * @param  {Element}   hiddenElem
   * @param  {Function}  [optionalCb] отрабатывает сразу не дожидаясь завершения анимации
   */

  function onOutsideClickHide(targetElem, hiddenElem, optionalCb) {
    $(document).bind('mouseup touchend', function (e) {
      if (!targetElem.is(e.target) && $(e.target).closest(targetElem).length == 0) {
        hiddenElem.stop(true, true).fadeOut(globalOptions.time);

        if (optionalCb) {
          optionalCb();
        }
      }
    });
  }
  /**
   * Хэлпер для показа, скрытия или чередования видимости элементов
   *
   * @example
   * <button type="button" data-visibility="show" data-show="#elemId1"></button>
   *
   * или
   * <button type="button" data-visibility="hide" data-hide="#elemId2"></button>
   *
   * или
   * <button type="button" data-visibility="toggle" data-toggle="#elemId3"></button>
   *
   * или
   * <button type="button" data-visibility="show" data-show="#elemId1|#elemId3"></button>
   *
   * или
   * // если есть атрибут data-queue="show", то будет сначала скрыт элемент #elemId2, а потом показан #elemId1
   * <button type="button" data-visibility="show" data-show="#elemId1" data-visibility="hide" data-hide="#elemId2" data-queue="show"></button>
   *
   * <div id="elemId1" style="display: none;">Text</div>
   * <div id="elemId2">Text</div>
   * <div id="elemId3" style="display: none;">Text</div>
   */


  var visibilityControl = function visibilityControl() {
    var settings = {
      types: ['show', 'hide', 'toggle']
    };

    if ($('[data-visibility]').length > 0) {
      /**
       * Устанавливает видимость
       * @param {String}  visibilityType тип отображения
       * @param {Array}   list массив элементов, с которым работаем
       * @param {Number}  delay задержка при показе элемента в ms
       */
      var setVisibility = function setVisibility(visibilityType, list, delay) {
        for (var i = 0; i < list.length; i++) {
          if (visibilityType == settings.types[0]) {
            $(list[i]).delay(delay).fadeIn(globalOptions.time);
          }

          if (visibilityType == settings.types[1]) {
            $(list[i]).fadeOut(globalOptions.time);
          }

          if (visibilityType == settings.types[2]) {
            if ($(list[i]).is(':visible')) {
              $(list[i]).fadeOut(globalOptions.time);
            } else {
              $(list[i]).fadeIn(globalOptions.time);
            }
          }
        }
      };

      $(document).on('click', '[data-visibility]', function () {
        var dataType;

        for (var i = 0; i < settings.types.length; i++) {
          dataType = settings.types[i];

          if ($(this).data(dataType)) {
            var visibilityList = $(this).data(dataType).split('|'),
                delay = 0;

            if ($(this).data('queue') == 'show') {
              delay = globalOptions.time;
            } else {
              delay = 0;
            }

            setVisibility(dataType, visibilityList, delay);
          }
        }

        if (!$(this).hasClass('tabs__link') && $(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox') {
          return false;
        }
      });
    }
  };

  visibilityControl();
  /* include('accordion.js')
  include('custom_scrollbar.js') */

  /**
   * Делает слайдер
   * @see  http://api.jqueryui.com/slider/
   *
   * @example
   * // в data-min и data-max задаются минимальное и максимальное значение
   * // в data-step шаг,
   * // в data-values дефолтные значения "min, max"
   * <div class="slider js-range">
   *      <div class="slider__range" data-min="0" data-max="100" data-step="1" data-values="10, 55"></div>
   * </div>
   */

  var Slider = function Slider() {
    var slider = $('.js-range');
    var min, max, step, values;
    slider.each(function () {
      var self = $(this),
          range = self.find('.slider__range');
      min = range.data('min');
      max = range.data('max');
      step = range.data('step');
      values = range.data('values').split(', ');
      range.slider({
        range: true,
        min: min || null,
        max: max || null,
        step: step || 1,
        values: values,
        slide: function slide(event, ui) {
          self.find('.ui-slider-handle').children('span').remove();
          self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(ui.values[0], "</span>"));
          self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(ui.values[1], "</span>"));
        }
      });
      self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(range.slider('values', 0), "</span>"));
      self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(range.slider('values', 1), "</span>"));
    });
  };

  var slider = new Slider(); // include('popups.js')
  // include('tooltip.js')

  $('.carousel').slick({
    dots: true,
    slidesPerRow: 3,
    rows: 2,
    responsive: [{
      breakpoint: 478,
      settings: {
        slidesPerRow: 1,
        rows: 1
      }
    }]
  });
  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wWGxTaXplIiwiZGVza3RvcExnU2l6ZSIsImRlc2t0b3BTaXplIiwidGFibGV0TGdTaXplIiwidGFibGV0U2l6ZSIsIm1vYmlsZUxnU2l6ZSIsIm1vYmlsZVNpemUiLCJwb3B1cHNCcmVha3BvaW50IiwicG9wdXBzRml4ZWRUaW1lb3V0IiwiaXNUb3VjaCIsImJyb3dzZXIiLCJtb2JpbGUiLCJsYW5nIiwiYXR0ciIsImJyZWFrcG9pbnRzIiwiYnJlYWtwb2ludERlc2t0b3BYbCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJicmVha3BvaW50RGVza3RvcExnIiwiYnJlYWtwb2ludERlc2t0b3AiLCJicmVha3BvaW50VGFibGV0TGciLCJicmVha3BvaW50VGFibGV0IiwiYnJlYWtwb2ludE1vYmlsZUxnU2l6ZSIsImJyZWFrcG9pbnRNb2JpbGUiLCJleHRlbmQiLCJsb2FkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImxlbmd0aCIsImF1dG9zaXplIiwiZm4iLCJhbmltYXRlQ3NzIiwiYW5pbWF0aW9uTmFtZSIsImNhbGxiYWNrIiwiYW5pbWF0aW9uRW5kIiwiZWwiLCJhbmltYXRpb25zIiwiYW5pbWF0aW9uIiwiT0FuaW1hdGlvbiIsIk1vekFuaW1hdGlvbiIsIldlYmtpdEFuaW1hdGlvbiIsInQiLCJzdHlsZSIsInVuZGVmaW5lZCIsImNyZWF0ZUVsZW1lbnQiLCJvbmUiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsImhhc0NsYXNzIiwic2VsZWN0U2VhcmNoIiwiZGF0YSIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsIm9uIiwiZSIsImZpbmQiLCJjb250ZXh0IiwidmFsdWUiLCJjbGljayIsInVwZGF0ZSIsIiR1cGRhdGVFbGVtIiwiY3VzdG9tRmlsZUlucHV0IiwiaSIsImVsZW0iLCJidXR0b25Xb3JkIiwiY2xhc3NOYW1lIiwid3JhcCIsInBhcmVudCIsInByZXBlbmQiLCJodG1sIiwicHJvbWlzZSIsImRvbmUiLCJtb3VzZW1vdmUiLCJjdXJzb3IiLCJpbnB1dCIsIndyYXBwZXIiLCJ3cmFwcGVyWCIsIndyYXBwZXJZIiwiaW5wdXRXaWR0aCIsImlucHV0SGVpZ2h0IiwiY3Vyc29yWCIsImN1cnNvclkiLCJvZmZzZXQiLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJwYWdlWCIsInBhZ2VZIiwibW92ZUlucHV0WCIsIm1vdmVJbnB1dFkiLCJjc3MiLCJmaWxlTmFtZSIsInZhbCIsIm5leHQiLCJyZW1vdmUiLCJwcm9wIiwiZmlsZXMiLCJzdWJzdHJpbmciLCJsYXN0SW5kZXhPZiIsInNlbGVjdGVkRmlsZU5hbWVQbGFjZW1lbnQiLCJzaWJsaW5ncyIsImFmdGVyIiwiY3VzdG9tU2VsZWN0IiwiaW5kZXgiLCJmaWVsZCIsInRyaW0iLCJldmVudCIsImxvY2FsZSIsIlBhcnNsZXkiLCJzZXRMb2NhbGUiLCJvcHRpb25zIiwidHJpZ2dlciIsInZhbGlkYXRpb25UaHJlc2hvbGQiLCJlcnJvcnNXcmFwcGVyIiwiZXJyb3JUZW1wbGF0ZSIsImNsYXNzSGFuZGxlciIsImluc3RhbmNlIiwiJGVsZW1lbnQiLCJ0eXBlIiwiJGhhbmRsZXIiLCJlcnJvcnNDb250YWluZXIiLCIkY29udGFpbmVyIiwiY2xvc2VzdCIsImFkZFZhbGlkYXRvciIsInZhbGlkYXRlU3RyaW5nIiwidGVzdCIsIm1lc3NhZ2VzIiwicnUiLCJlbiIsInJlZ1Rlc3QiLCJyZWdNYXRjaCIsIm1pbiIsImFyZ3VtZW50cyIsIm1heCIsIm1pbkRhdGUiLCJtYXhEYXRlIiwidmFsdWVEYXRlIiwicmVzdWx0IiwibWF0Y2giLCJEYXRlIiwibWF4U2l6ZSIsInBhcnNsZXlJbnN0YW5jZSIsInNpemUiLCJyZXF1aXJlbWVudFR5cGUiLCJmb3JtYXRzIiwiZmlsZUV4dGVuc2lvbiIsInNwbGl0IiwicG9wIiwiZm9ybWF0c0FyciIsInZhbGlkIiwiJGJsb2NrIiwiJGxhc3QiLCJlbGVtZW50IiwicGFyc2xleSIsImlucHV0bWFzayIsImNsZWFyTWFza09uTG9zdEZvY3VzIiwic2hvd01hc2tPbkhvdmVyIiwidXBkYXRlU3ZnIiwiJHVzZUVsZW1lbnQiLCJocmVmIiwiYmFzZVZhbCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJEYXRlcGlja2VyUmFuZ2UiLCJkYXRlcGlja2VyUmFuZ2UiLCJmcm9tSXRlbU9wdGlvbnMiLCJ0b0l0ZW1PcHRpb25zIiwiZGF0ZUZyb20iLCJkYXRlVG8iLCJnZXREYXRlIiwiaXNWYWxpZCIsInZhbGlkYXRlIiwiZGF0ZSIsInBhcnNlRGF0ZSIsImVycm9yIiwiVGFiU3dpdGNoZXIiLCJ0YWJzIiwib3BlbiIsInRhYkVsZW0iLCJwcmV2ZW50RGVmYXVsdCIsInBhcmVudFRhYnMiLCJ0b2dnbGVDbGFzcyIsInRhYlN3aXRjaGVyIiwib25PdXRzaWRlQ2xpY2tIaWRlIiwidGFyZ2V0RWxlbSIsImhpZGRlbkVsZW0iLCJvcHRpb25hbENiIiwiYmluZCIsImlzIiwidGFyZ2V0Iiwic3RvcCIsImZhZGVPdXQiLCJ2aXNpYmlsaXR5Q29udHJvbCIsInNldHRpbmdzIiwidHlwZXMiLCJzZXRWaXNpYmlsaXR5IiwidmlzaWJpbGl0eVR5cGUiLCJsaXN0IiwiZGVsYXkiLCJmYWRlSW4iLCJkYXRhVHlwZSIsInZpc2liaWxpdHlMaXN0IiwiU2xpZGVyIiwic2xpZGVyIiwic3RlcCIsInZhbHVlcyIsInJhbmdlIiwic2xpZGUiLCJ1aSIsImNoaWxkcmVuIiwiYXBwZW5kIiwic2xpY2siLCJkb3RzIiwic2xpZGVzUGVy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QURZO0FBSkssR0FBckI7QUFhRztBQUVOLENBdjNCRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSwg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINC80L3QvtCz0L7QutGA0LDRgtC90L5cclxuICAgICAqL1xyXG4gICAgbGV0IGdsb2JhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxyXG4gICAgICAgIHRpbWU6ICAyMDAsXHJcblxyXG4gICAgICAgIC8vINCa0L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXHJcbiAgICAgICAgZGVza3RvcFhsU2l6ZTogMTkyMCxcclxuICAgICAgICBkZXNrdG9wTGdTaXplOiAxNjAwLFxyXG4gICAgICAgIGRlc2t0b3BTaXplOiAgIDEyODAsXHJcbiAgICAgICAgdGFibGV0TGdTaXplOiAgIDEwMjQsXHJcbiAgICAgICAgdGFibGV0U2l6ZTogICAgIDc2OCxcclxuICAgICAgICBtb2JpbGVMZ1NpemU6ICAgNjQwLFxyXG4gICAgICAgIG1vYmlsZVNpemU6ICAgICA0ODAsXHJcblxyXG4gICAgICAgIC8vINCi0L7Rh9C60LAg0L/QtdGA0LXRhdC+0LTQsCDQv9C+0L/QsNC/0L7QsiDQvdCwINGE0YPQu9GB0LrRgNC40L1cclxuICAgICAgICBwb3B1cHNCcmVha3BvaW50OiA3NjgsXHJcblxyXG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQviDRgdC+0LrRgNGL0YLQuNGPINGE0LjQutGB0LjRgNC+0LLQsNC90L3Ri9GFINC/0L7Qv9Cw0L/QvtCyXHJcbiAgICAgICAgcG9wdXBzRml4ZWRUaW1lb3V0OiA1MDAwLFxyXG5cclxuICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwIHRvdWNoINGD0YHRgtGA0L7QudGB0YLQslxyXG4gICAgICAgIGlzVG91Y2g6ICQuYnJvd3Nlci5tb2JpbGUsXHJcblxyXG4gICAgICAgIGxhbmc6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJylcclxuICAgIH07XHJcblxyXG4gICAgLy8g0JHRgNC10LnQutC/0L7QuNC90YLRiyDQsNC00LDQv9GC0LjQstCwXHJcbiAgICAvLyBAZXhhbXBsZSBpZiAoZ2xvYmFsT3B0aW9ucy5icmVha3BvaW50VGFibGV0Lm1hdGNoZXMpIHt9IGVsc2Uge31cclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0ge1xyXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wWGw6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFhsU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTGdTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50RGVza3RvcDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50TW9iaWxlTGdTaXplOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZUxnU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVTaXplIC0gMX1weClgKVxyXG4gICAgfTtcclxuXHJcbiAgICAkLmV4dGVuZCh0cnVlLCBnbG9iYWxPcHRpb25zLCBicmVha3BvaW50cyk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgJCh3aW5kb3cpLmxvYWQoKCkgPT4ge1xyXG4gICAgICAgIGlmIChnbG9iYWxPcHRpb25zLmlzVG91Y2gpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCd0b3VjaCcpLnJlbW92ZUNsYXNzKCduby10b3VjaCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbm8tdG91Y2gnKS5yZW1vdmVDbGFzcygndG91Y2gnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKCd0ZXh0YXJlYScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgYXV0b3NpemUoJCgndGV4dGFyZWEnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC00LrQu9GO0YfQtdC90LjQtSBqcyBwYXJ0aWFsc1xyXG4gICAgICovXHJcbiAgICAvKiBmb3JtX3N0eWxlLmpzINC00L7Qu9C20LXQvSDQsdGL0YLRjCDQstGL0L/QvtC70L3QtdC9INC/0LXRgNC10LQgZm9ybV92YWxpZGF0aW9uLmpzICovXHJcbiAgICAvKipcclxuICAgICAqINCg0LDRgdGI0LjRgNC10L3QuNC1IGFuaW1hdGUuY3NzXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGFuaW1hdGlvbk5hbWUg0L3QsNC30LLQsNC90LjQtSDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sg0YTRg9C90LrRhtC40Y8sINC60L7RgtC+0YDQsNGPINC+0YLRgNCw0LHQvtGC0LDQtdGCINC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogXHJcbiAgICAgKiBAc2VlICBodHRwczovL2RhbmVkZW4uZ2l0aHViLmlvL2FuaW1hdGUuY3NzL1xyXG4gICAgICogXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJyk7XHJcbiAgICAgKiBcclxuICAgICAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICogICAgIC8vINCU0LXQu9Cw0LXQvCDRh9GC0L4t0YLQviDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIH0pO1xyXG4gICAgICovXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgYW5pbWF0ZUNzczogZnVuY3Rpb24oYW5pbWF0aW9uTmFtZSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkVuZCA9IChmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBPQW5pbWF0aW9uOiAnb0FuaW1hdGlvbkVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgTW96QW5pbWF0aW9uOiAnbW96QW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKS5vbmUoYW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIg0YHQtdC70LXQutGC0Ysg0YEg0L/QvtC80L7RidGM0Y4g0L/Qu9Cw0LPQuNC90LAgc2VsZWN0MlxyXG4gICAgICogaHR0cHM6Ly9zZWxlY3QyLmdpdGh1Yi5pb1xyXG4gICAgICovXHJcbiAgICBsZXQgQ3VzdG9tU2VsZWN0ID0gZnVuY3Rpb24oJGVsZW0pIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCRpbml0RWxlbSkge1xyXG4gICAgICAgICAgICAkaW5pdEVsZW0uZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RTZWFyY2ggPSAkKHRoaXMpLmRhdGEoJ3NlYXJjaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdFNlYXJjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IDE7IC8vINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gSW5maW5pdHk7IC8vINC90LUg0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogbWluaW11bVJlc3VsdHNGb3JTZWFyY2gsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90YPQttC90L4g0LTQu9GPINCy0YvQu9C40LTQsNGG0LjQuCDQvdCwINC70LXRgtGDXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZChgb3B0aW9uW3ZhbHVlPVwiJHskKHRoaXMpLmNvbnRleHQudmFsdWV9XCJdYCkuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGUgPSBmdW5jdGlvbigkdXBkYXRlRWxlbSkge1xyXG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHNlbGYuaW5pdCgkdXBkYXRlRWxlbSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5pbml0KCRlbGVtKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIgZmlsZSBpbnB1dFxyXG4gICAgICogaHR0cDovL2dyZWdwaWtlLm5ldC9kZW1vcy9ib290c3RyYXAtZmlsZS1pbnB1dC9kZW1vLmh0bWxcclxuICAgICAqL1xyXG4gICAgJC5mbi5jdXN0b21GaWxlSW5wdXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsZW0pIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1heWJlIHNvbWUgZmllbGRzIGRvbid0IG5lZWQgdG8gYmUgc3RhbmRhcmRpemVkLlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mICRlbGVtLmF0dHIoJ2RhdGEtYmZpLWRpc2FibGVkJykgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB0aGUgd29yZCB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIGJ1dHRvblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uV29yZCA9ICdCcm93c2UnO1xyXG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gJyc7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mICRlbGVtLmF0dHIoJ3RpdGxlJykgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Xb3JkID0gJGVsZW0uYXR0cigndGl0bGUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCEhJGVsZW0uYXR0cignY2xhc3MnKSkge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gJyAnICsgJGVsZW0uYXR0cignY2xhc3MnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTm93IHdlJ3JlIGdvaW5nIHRvIHdyYXAgdGhhdCBpbnB1dCBmaWVsZCB3aXRoIGEgYnV0dG9uLlxyXG4gICAgICAgICAgICAvLyBUaGUgaW5wdXQgd2lsbCBhY3R1YWxseSBzdGlsbCBiZSB0aGVyZSwgaXQgd2lsbCBqdXN0IGJlIGZsb2F0IGFib3ZlIGFuZCB0cmFuc3BhcmVudCAoZG9uZSB3aXRoIHRoZSBDU1MpLlxyXG4gICAgICAgICAgICAkZWxlbS53cmFwKGA8ZGl2IGNsYXNzPVwiY3VzdG9tLWZpbGVcIj48YSBjbGFzcz1cImJ0biAke2NsYXNzTmFtZX1cIj48L2E+PC9kaXY+YCkucGFyZW50KCkucHJlcGVuZCgkKCc8c3Bhbj48L3NwYW4+JykuaHRtbChidXR0b25Xb3JkKSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gQWZ0ZXIgd2UgaGF2ZSBmb3VuZCBhbGwgb2YgdGhlIGZpbGUgaW5wdXRzIGxldCdzIGFwcGx5IGEgbGlzdGVuZXIgZm9yIHRyYWNraW5nIHRoZSBtb3VzZSBtb3ZlbWVudC5cclxuICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCBiZWNhdXNlIHRoZSBpbiBvcmRlciB0byBnaXZlIHRoZSBpbGx1c2lvbiB0aGF0IHRoaXMgaXMgYSBidXR0b24gaW4gRkYgd2UgYWN0dWFsbHkgbmVlZCB0byBtb3ZlIHRoZSBidXR0b24gZnJvbSB0aGUgZmlsZSBpbnB1dCB1bmRlciB0aGUgY3Vyc29yLiBVZ2guXHJcbiAgICAgICAgLnByb21pc2UoKS5kb25lKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgLy8gQXMgdGhlIGN1cnNvciBtb3ZlcyBvdmVyIG91ciBuZXcgYnV0dG9uIHdlIG5lZWQgdG8gYWRqdXN0IHRoZSBwb3NpdGlvbiBvZiB0aGUgaW52aXNpYmxlIGZpbGUgaW5wdXQgQnJvd3NlIGJ1dHRvbiB0byBiZSB1bmRlciB0aGUgY3Vyc29yLlxyXG4gICAgICAgICAgICAvLyBUaGlzIGdpdmVzIHVzIHRoZSBwb2ludGVyIGN1cnNvciB0aGF0IEZGIGRlbmllcyB1c1xyXG4gICAgICAgICAgICAkKCcuY3VzdG9tLWZpbGUnKS5tb3VzZW1vdmUoZnVuY3Rpb24oY3Vyc29yKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0LCB3cmFwcGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXJYLCB3cmFwcGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFdpZHRoLCBpbnB1dEhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JYLCBjdXJzb3JZO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd3JhcHBlciBlbGVtZW50ICh0aGUgYnV0dG9uIHN1cnJvdW5kIHRoaXMgZmlsZSBpbnB1dClcclxuICAgICAgICAgICAgICAgIHdyYXBwZXIgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGludmlzaWJsZSBmaWxlIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGlucHV0ID0gd3JhcHBlci5maW5kKCdpbnB1dCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGxlZnQtbW9zdCBwb3NpdGlvbiBvZiB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgd3JhcHBlclggPSB3cmFwcGVyLm9mZnNldCgpLmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgdG9wLW1vc3QgcG9zaXRpb24gb2YgdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgIHdyYXBwZXJZID0gd3JhcHBlci5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgd2l0aCBvZiB0aGUgYnJvd3NlcnMgaW5wdXQgZmllbGRcclxuICAgICAgICAgICAgICAgIGlucHV0V2lkdGggPSBpbnB1dC53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGhlaWdodCBvZiB0aGUgYnJvd3NlcnMgaW5wdXQgZmllbGRcclxuICAgICAgICAgICAgICAgIGlucHV0SGVpZ2h0ID0gaW5wdXQuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAvL1RoZSBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yIGluIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICBjdXJzb3JYID0gY3Vyc29yLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yWSA9IGN1cnNvci5wYWdlWTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1RoZSBwb3NpdGlvbnMgd2UgYXJlIHRvIG1vdmUgdGhlIGludmlzaWJsZSBmaWxlIGlucHV0XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgMjAgYXQgdGhlIGVuZCBpcyBhbiBhcmJpdHJhcnkgbnVtYmVyIG9mIHBpeGVscyB0aGF0IHdlIGNhbiBzaGlmdCB0aGUgaW5wdXQgc3VjaCB0aGF0IGN1cnNvciBpcyBub3QgcG9pbnRpbmcgYXQgdGhlIGVuZCBvZiB0aGUgQnJvd3NlIGJ1dHRvbiBidXQgc29tZXdoZXJlIG5lYXJlciB0aGUgbWlkZGxlXHJcbiAgICAgICAgICAgICAgICBtb3ZlSW5wdXRYID0gY3Vyc29yWCAtIHdyYXBwZXJYIC0gaW5wdXRXaWR0aCArIDIwO1xyXG4gICAgICAgICAgICAgICAgLy8gU2xpZGVzIHRoZSBpbnZpc2libGUgaW5wdXQgQnJvd3NlIGJ1dHRvbiB0byBiZSBwb3NpdGlvbmVkIG1pZGRsZSB1bmRlciB0aGUgY3Vyc29yXHJcbiAgICAgICAgICAgICAgICBtb3ZlSW5wdXRZID0gY3Vyc29yWSAtIHdyYXBwZXJZIC0gKGlucHV0SGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgdGhlIHBvc2l0aW9uaW5nIHN0eWxlcyB0byBhY3R1YWxseSBtb3ZlIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dFxyXG4gICAgICAgICAgICAgICAgaW5wdXQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBtb3ZlSW5wdXRYLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogbW92ZUlucHV0WVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjaGFuZ2UnLCAnLmN1c3RvbS1maWxlIGlucHV0W3R5cGU9ZmlsZV0nLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSA9ICQodGhpcykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBwcmV2aW91cyBmaWxlIG5hbWVzXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLm5leHQoJy5jdXN0b20tZmlsZV9fbmFtZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhJCh0aGlzKS5wcm9wKCdmaWxlcycpICYmICQodGhpcykucHJvcCgnZmlsZXMnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSAkKHRoaXMpWzBdLmZpbGVzLmxlbmd0aCArICcgZmlsZXMnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyhmaWxlTmFtZS5sYXN0SW5kZXhPZignXFxcXCcpICsgMSwgZmlsZU5hbWUubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEb24ndCB0cnkgdG8gc2hvdyB0aGUgbmFtZSBpZiB0aGVyZSBpcyBub25lXHJcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50ID0gJCh0aGlzKS5kYXRhKCdmaWxlbmFtZS1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50ID09PSAnaW5zaWRlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByaW50IHRoZSBmaWxlTmFtZSBpbnNpZGVcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdzcGFuJykuaHRtbChmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCd0aXRsZScsIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUHJpbnQgdGhlIGZpbGVOYW1lIGFzaWRlIChyaWdodCBhZnRlciB0aGUgdGhlIGJ1dHRvbilcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFmdGVyKGA8c3BhbiBjbGFzcz1cImN1c3RvbS1maWxlX19uYW1lXCI+JHtmaWxlTmFtZX0gPC9zcGFuPmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAkKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpLmN1c3RvbUZpbGVJbnB1dCgpO1xyXG4gICAgLy8gJCgnc2VsZWN0JykuY3VzdG9tU2VsZWN0KCk7XHJcbiAgICB2YXIgY3VzdG9tU2VsZWN0ID0gbmV3IEN1c3RvbVNlbGVjdCgkKCdzZWxlY3QnKSk7XHJcblxyXG4gICAgaWYgKCQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JDQvdC40LzQsNGG0LjRjyDRjdC70LXQvNC10L3RgtCwIGxhYmVsINC/0YDQuCDRhNC+0LrRg9GB0LUg0L/QvtC70LXQuSDRhNC+0YDQvNGLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gJChlbCkuZmluZCgnaW5wdXQsIHRleHRhcmVhJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJChmaWVsZCkudmFsKCkudHJpbSgpICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoZmllbGQpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgIH0pLm9uKCdibHVyJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2NhbGUgPSBnbG9iYWxPcHRpb25zLmxhbmcgPT0gJ3J1LVJVJyA/ICdydScgOiAnZW4nO1xyXG5cclxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XHJcblxyXG4gICAgLyog0J3QsNGB0YLRgNC+0LnQutC4IFBhcnNsZXkgKi9cclxuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xyXG4gICAgICAgIHRyaWdnZXI6ICdibHVyIGNoYW5nZScsIC8vIGNoYW5nZSDQvdGD0LbQtdC9INC00LvRjyBzZWxlY3Qn0LBcclxuICAgICAgICB2YWxpZGF0aW9uVGhyZXNob2xkOiAnMCcsXHJcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcclxuICAgICAgICBlcnJvclRlbXBsYXRlOiAnPHAgY2xhc3M9XCJwYXJzbGV5LWVycm9yLW1lc3NhZ2VcIj48L3A+JyxcclxuICAgICAgICBjbGFzc0hhbmRsZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXI7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICRlbGVtZW50OyAvLyDRgtC+INC10YHRgtGMINC90LjRh9C10LPQviDQvdC1INCy0YvQtNC10LvRj9C10LwgKGlucHV0INGB0LrRgNGL0YIpLCDQuNC90LDRh9C1INCy0YvQtNC10LvRj9C10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INCx0LvQvtC6XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkKCcuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScsICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGhhbmRsZXI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCkubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkY29udGFpbmVyO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRXFwtIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lRW4nLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlthLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosIFwiIFwiLCBcIi1cIicsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCBcIiBcIiwgXCItXCInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0Ysg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bMC050LAt0Y/RkV0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgMC05JyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YssINC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtejAtOV0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOScsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcigncGhvbmUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXHJcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IHBob25lIG51bWJlcidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOV0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIDAtOScsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQn9C+0YfRgtCwINCx0LXQtyDQutC40YDQuNC70LvQuNGG0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdlbWFpbCcsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXShcXC58X3wtKXswLDF9KStbQS1aYS160JAt0K/QsC3RjzAtOVxcLV1cXEAoW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKSsoKFxcLil7MCwxfVtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSl7MSx9XFwuW2EtetCwLdGPMC05XFwtXXsyLH0kLy50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC/0L7Rh9GC0L7QstGL0Lkg0LDQtNGA0LXRgScsXHJcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGVtYWlsIGFkZHJlc3MnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdkYXRlJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxyXG4gICAgICAgICAgICAgICAgcmVnTWF0Y2ggPSAvKFxcZHsxLDJ9KVxcLihcXGR7MSwyfSlcXC4oXFxkezR9KS8sXHJcbiAgICAgICAgICAgICAgICBtaW4gPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1pbicpLFxyXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcclxuICAgICAgICAgICAgICAgIG1pbkRhdGUsIG1heERhdGUsIHZhbHVlRGF0ZSwgcmVzdWx0O1xyXG5cclxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcclxuICAgICAgICAgICAgICAgIG1pbkRhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xyXG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVnVGVzdC50ZXN0KHZhbHVlKSAmJiAobWluRGF0ZSA/IHZhbHVlRGF0ZSA+PSBtaW5EYXRlIDogdHJ1ZSkgJiYgKG1heERhdGUgPyB2YWx1ZURhdGUgPD0gbWF4RGF0ZSA6IHRydWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdCw0Y8g0LTQsNGC0LAnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBkYXRlJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyDQpNCw0LnQuyDQvtCz0YDQsNC90LjRh9C10L3QvdC+0LPQviDRgNCw0LfQvNC10YDQsFxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVNYXhTaXplJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IHBhcnNsZXlJbnN0YW5jZS4kZWxlbWVudFswXS5maWxlcztcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVzLmxlbmd0aCAhPSAxICB8fCBmaWxlc1swXS5zaXplIDw9IG1heFNpemUgKiAxMDI0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVxdWlyZW1lbnRUeXBlOiAnaW50ZWdlcicsXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcclxuICAgICAgICAgICAgZW46ICdGaWxlIHNpemUgY2FuXFwndCBiZSBtb3JlIHRoZW4gJXMgS2InXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjRjyDRgNCw0YHRiNC40YDQtdC90LjQuSDRhNCw0LnQu9C+0LJcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgZm9ybWF0cykge1xyXG4gICAgICAgICAgICBsZXQgZmlsZUV4dGVuc2lvbiA9IHZhbHVlLnNwbGl0KCcuJykucG9wKCk7XHJcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcclxuICAgICAgICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChmaWxlRXh0ZW5zaW9uID09PSBmb3JtYXRzQXJyW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9CU0L7Qv9GD0YHRgtC40LzRiyDRgtC+0LvRjNC60L4g0YTQsNC50LvRiyDRhNC+0YDQvNCw0YLQsCAlcycsXHJcbiAgICAgICAgICAgIGVuOiAnQXZhaWxhYmxlIGV4dGVuc2lvbnMgYXJlICVzJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDppbml0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcy4kZWxlbWVudCxcclxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgJGJsb2NrID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2Vycm9ycy1wbGFjZW1lbnQnKSxcclxuICAgICAgICAgICAgJGxhc3Q7XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LjRgNGD0LXRgiDQstCw0LvQuNC00LDRhtC40Y4g0L3QsCDQstGC0L7RgNC+0Lwg0LrQsNC70LXQtNCw0YDQvdC+0Lwg0L/QvtC70LUg0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgJGVsZW1lbnQgPSAkKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdmb3JtW2RhdGEtdmFsaWRhdGU9XCJ0cnVlXCJdJykucGFyc2xleSgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC+0LHQsNCy0LvRj9C10YIg0LzQsNGB0LrQuCDQsiDQv9C+0LvRjyDRhNC+0YDQvFxyXG4gICAgICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL1JvYmluSGVyYm90cy9JbnB1dG1hc2tcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogPGlucHV0IGNsYXNzPVwianMtcGhvbmUtbWFza1wiIHR5cGU9XCJ0ZWxcIiBuYW1lPVwidGVsXCIgaWQ9XCJ0ZWxcIj5cclxuICAgICAqL1xyXG4gICAgJCgnLmpzLXBob25lLW1hc2snKS5pbnB1dG1hc2soJys3KDk5OSkgOTk5LTk5LTk5Jywge1xyXG4gICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxyXG4gICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGB0YLRi9C70Ywg0LTQu9GPINC+0LHQvdC+0LLQu9C10L3QuNGPIHhsaW5rINGDIHN2Zy3QuNC60L7QvdC+0Log0L/QvtGB0LvQtSDQvtCx0L3QvtCy0LvQtdC90LjRjyBET00gKNC00LvRjyBJRSlcclxuICAgICAqINGE0YPQvdC60YbQuNGOINC90YPQttC90L4g0LLRi9C30YvQstCw0YLRjCDQsiDRgdC+0LHRi9GC0LjRj9GFLCDQutC+0YLQvtGA0YvQtSDQstC90L7RgdGP0YIg0LjQt9C80LXQvdC10L3QuNGPINCyINGN0LvQtdC80LXQvdGC0Ysg0YPQttC1INC/0L7RgdC70LUg0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPIERPTS3QsFxyXG4gICAgICogKNC90LDQv9GA0LjQvNC10YAsINC/0L7RgdC70LUg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LrQsNGA0YPRgdC10LvQuCDQuNC70Lgg0L7RgtC60YDRi9GC0LjQuCDQv9C+0L/QsNC/0LApXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gZWxlbWVudCDRjdC70LXQvNC10L3Rgiwg0LIg0LrQvtGC0L7RgNC+0Lwg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L7QsdC90L7QstC40YLRjCBzdmcgKNC90LDQv9GA0LjQvCAkKCcjc29tZS1wb3B1cCcpKVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVTdmcoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCAkdXNlRWxlbWVudCA9IGVsZW1lbnQuZmluZCgndXNlJyk7XHJcblxyXG4gICAgICAgICR1c2VFbGVtZW50LmVhY2goZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICBpZiAoJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYgJiYgJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbCkge1xyXG4gICAgICAgICAgICAgICAgJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbCA9ICR1c2VFbGVtZW50W2luZGV4XS5ocmVmLmJhc2VWYWw7IC8vIHRyaWdnZXIgZml4aW5nIG9mIGhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgIGRhdGVGb3JtYXQ6ICdkZC5tbS55eScsXHJcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC70LDQtdGCINCy0YvQv9Cw0LTRjtGJ0LjQtSDQutCw0LvQtdC90LTQsNGA0LjQutC4XHJcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kYXRlcGlja2VyL1xyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAvLyDQsiBkYXRhLWRhdGUtbWluINC4IGRhdGEtZGF0ZS1tYXgg0LzQvtC20L3QviDQt9Cw0LTQsNGC0Ywg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eVxyXG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxyXG4gICAgICovXHJcbiAgICBsZXQgRGF0ZXBpY2tlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBkYXRlcGlja2VyID0gJCgnLmpzLWRhdGVwaWNrZXInKTtcclxuXHJcbiAgICAgICAgZGF0ZXBpY2tlci5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IG1pbkRhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWluJyk7XHJcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1PcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBpdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vINCU0LjQsNC/0LDQt9C+0L0g0LTQsNGCXHJcbiAgICBsZXQgRGF0ZXBpY2tlclJhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGRhdGVwaWNrZXJSYW5nZSA9ICQoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XHJcblxyXG4gICAgICAgIGRhdGVwaWNrZXJSYW5nZS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGZyb21JdGVtT3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBsZXQgdG9JdGVtT3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgZnJvbUl0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB0b0l0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGVGcm9tID0gJCh0aGlzKS5maW5kKCcuanMtcmFuZ2UtZnJvbScpLmRhdGVwaWNrZXIoZnJvbUl0ZW1PcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkYXRlVG8gPSAkKHRoaXMpLmZpbmQoJy5qcy1yYW5nZS10bycpLmRhdGVwaWNrZXIodG9JdGVtT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBkYXRlRnJvbS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlVG8uZGF0ZXBpY2tlcignb3B0aW9uJywgJ21pbkRhdGUnLCBnZXREYXRlKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkYXRlVG8ucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncGFyc2xleS1lcnJvcicpICYmICQodGhpcykucGFyc2xleSgpLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyc2xleSgpLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGF0ZVRvLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVGcm9tLmRhdGVwaWNrZXIoJ29wdGlvbicsICdtYXhEYXRlJywgZ2V0RGF0ZSh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGF0ZUZyb20ucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncGFyc2xleS1lcnJvcicpICYmICQodGhpcykucGFyc2xleSgpLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyc2xleSgpLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXRlKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGU7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZSA9ICQuZGF0ZXBpY2tlci5wYXJzZURhdGUoZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zLmRhdGVGb3JtYXQsIGVsZW1lbnQudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgZGF0ZXBpY2tlclJhbmdlID0gbmV3IERhdGVwaWNrZXJSYW5nZSgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10LDQu9C40LfRg9C10YIg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGC0LDQsdC+0LJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogPHVsIGNsYXNzPVwidGFicyBqcy10YWJzXCI+XHJcbiAgICAgKiAgICAgPGxpIGNsYXNzPVwidGFic19faXRlbVwiPlxyXG4gICAgICogICAgICAgICA8c3BhbiBjbGFzcz1cImlzLWFjdGl2ZSB0YWJzX19saW5rIGpzLXRhYi1saW5rXCI+VGFiIG5hbWU8L3NwYW4+XHJcbiAgICAgKiAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJzX19jbnRcIj5cclxuICAgICAqICAgICAgICAgICAgIDxwPlRhYiBjb250ZW50PC9wPlxyXG4gICAgICogICAgICAgICA8L2Rpdj5cclxuICAgICAqICAgICA8L2xpPlxyXG4gICAgICogPC91bD5cclxuICAgICAqL1xyXG4gICAgbGV0IFRhYlN3aXRjaGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgdGFicyA9ICQoJy5qcy10YWJzJyk7XHJcblxyXG4gICAgICAgIHRhYnMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuanMtdGFiLWxpbmsuaXMtYWN0aXZlJykubmV4dCgpLmFkZENsYXNzKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRhYnMub24oJ2NsaWNrJywgJy5qcy10YWItbGluaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYub3BlbigkKHRoaXMpLCBldmVudCk7XHJcblxyXG4gICAgICAgICAgICAvLyByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDRgtCw0LEg0L/QviDQutC70LjQutGDINC90LAg0LrQsNC60L7QuS3RgtC+INC00YDRg9Cz0L7QuSDRjdC70LXQvNC10L3RglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAgKiA8c3BhbiBkYXRhLXRhYi1vcGVuPVwiI3RhYi1sb2dpblwiPk9wZW4gbG9naW4gdGFiPC9zcGFuPlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS10YWItb3Blbl0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB0YWJFbGVtID0gJCh0aGlzKS5kYXRhKCd0YWItb3BlbicpO1xyXG4gICAgICAgICAgICBzZWxmLm9wZW4oJCh0YWJFbGVtKSwgZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgncG9wdXAnKSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntGC0LrRgNGL0LLQsNC10YIg0YLQsNCxXHJcbiAgICAgICAgICogQHBhcmFtICB7RWxlbWVudH0gZWxlbSDRjdC70LXQvNC10L3RgiAuanMtdGFiLWxpbmssINC90LAg0LrQvtGC0L7RgNGL0Lkg0L3Rg9C20L3QviDQv9C10YDQtdC60LvRjtGH0LjRgtGMXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAqIC8vINCy0YvQt9C+0LIg0LzQtdGC0L7QtNCwIG9wZW4sINC+0YLQutGA0L7QtdGCINGC0LDQsVxyXG4gICAgICAgICAqIHRhYlN3aXRjaGVyLm9wZW4oJCgnI3NvbWUtdGFiJykpO1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNlbGYub3BlbiA9IGZ1bmN0aW9uKGVsZW0sIGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICghZWxlbS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50VGFicyA9IGVsZW0uY2xvc2VzdCh0YWJzKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudFRhYnMuZmluZCgnLmlzLW9wZW4nKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVsZW0ubmV4dCgpLnRvZ2dsZUNsYXNzKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRUYWJzLmZpbmQoJy5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgdGFiU3dpdGNoZXIgPSBuZXcgVGFiU3dpdGNoZXIoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LrRgNGL0LLQsNC10YIg0Y3Qu9C10LzQtdC90YIgaGlkZGVuRWxlbSDQv9GA0Lgg0LrQu9C40LrQtSDQt9CwINC/0YDQtdC00LXQu9Cw0LzQuCDRjdC70LXQvNC10L3RgtCwIHRhcmdldEVsZW1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSAgIHRhcmdldEVsZW1cclxuICAgICAqIEBwYXJhbSAge0VsZW1lbnR9ICAgaGlkZGVuRWxlbVxyXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259ICBbb3B0aW9uYWxDYl0g0L7RgtGA0LDQsdCw0YLRi9Cy0LDQtdGCINGB0YDQsNC30YMg0L3QtSDQtNC+0LbQuNC00LDRj9GB0Ywg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBvbk91dHNpZGVDbGlja0hpZGUodGFyZ2V0RWxlbSwgaGlkZGVuRWxlbSwgb3B0aW9uYWxDYikge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLmJpbmQoJ21vdXNldXAgdG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0RWxlbS5pcyhlLnRhcmdldCkgJiYgJChlLnRhcmdldCkuY2xvc2VzdCh0YXJnZXRFbGVtKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaGlkZGVuRWxlbS5zdG9wKHRydWUsIHRydWUpLmZhZGVPdXQoZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbENiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxDYigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdGN0LvQv9C10YAg0LTQu9GPINC/0L7QutCw0LfQsCwg0YHQutGA0YvRgtC40Y8g0LjQu9C4INGH0LXRgNC10LTQvtCy0LDQvdC40Y8g0LLQuNC00LjQvNC+0YHRgtC4INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJzaG93XCIgZGF0YS1zaG93PVwiI2VsZW1JZDFcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cImhpZGVcIiBkYXRhLWhpZGU9XCIjZWxlbUlkMlwiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwidG9nZ2xlXCIgZGF0YS10b2dnbGU9XCIjZWxlbUlkM1wiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxfCNlbGVtSWQzXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiAvLyDQtdGB0LvQuCDQtdGB0YLRjCDQsNGC0YDQuNCx0YPRgiBkYXRhLXF1ZXVlPVwic2hvd1wiLCDRgtC+INCx0YPQtNC10YIg0YHQvdCw0YfQsNC70LAg0YHQutGA0YvRgiDRjdC70LXQvNC10L3RgiAjZWxlbUlkMiwg0LAg0L/QvtGC0L7QvCDQv9C+0LrQsNC30LDQvSAjZWxlbUlkMVxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxXCIgZGF0YS12aXNpYmlsaXR5PVwiaGlkZVwiIGRhdGEtaGlkZT1cIiNlbGVtSWQyXCIgZGF0YS1xdWV1ZT1cInNob3dcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkMVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5UZXh0PC9kaXY+XHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkMlwiPlRleHQ8L2Rpdj5cclxuICAgICAqIDxkaXYgaWQ9XCJlbGVtSWQzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlRleHQ8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgbGV0IHZpc2liaWxpdHlDb250cm9sID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICB0eXBlczogW1xyXG4gICAgICAgICAgICAgICAgJ3Nob3cnLFxyXG4gICAgICAgICAgICAgICAgJ2hpZGUnLFxyXG4gICAgICAgICAgICAgICAgJ3RvZ2dsZSdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICgkKCdbZGF0YS12aXNpYmlsaXR5XScpLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS12aXNpYmlsaXR5XScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGFUeXBlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0aW5ncy50eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gc2V0dGluZ3MudHlwZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoZGF0YVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2aXNpYmlsaXR5TGlzdCA9ICQodGhpcykuZGF0YShkYXRhVHlwZSkuc3BsaXQoJ3wnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3F1ZXVlJykgPT0gJ3Nob3cnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheSA9IGdsb2JhbE9wdGlvbnMudGltZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRWaXNpYmlsaXR5KGRhdGFUeXBlLCB2aXNpYmlsaXR5TGlzdCwgZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ3RhYnNfX2xpbmsnKSAmJiAkKHRoaXMpLmF0dHIoJ3R5cGUnKSAhPSAncmFkaW8nICYmICQodGhpcykuYXR0cigndHlwZScpICE9ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINCy0LjQtNC40LzQvtGB0YLRjFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHZpc2liaWxpdHlUeXBlINGC0LjQvyDQvtGC0L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9ICAgbGlzdCDQvNCw0YHRgdC40LIg0Y3Qu9C10LzQtdC90YLQvtCyLCDRgSDQutC+0YLQvtGA0YvQvCDRgNCw0LHQvtGC0LDQtdC8XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgZGVsYXkg0LfQsNC00LXRgNC20LrQsCDQv9GA0Lgg0L/QvtC60LDQt9C1INGN0LvQtdC80LXQvdGC0LAg0LIgbXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldFZpc2liaWxpdHkodmlzaWJpbGl0eVR5cGUsIGxpc3QsIGRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5kZWxheShkZWxheSkuZmFkZUluKGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlT3V0KGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQobGlzdFtpXSkuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZmFkZU91dChnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlSW4oZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHZpc2liaWxpdHlDb250cm9sKCk7XHJcblxyXG4gICAgLyogaW5jbHVkZSgnYWNjb3JkaW9uLmpzJylcclxuICAgIGluY2x1ZGUoJ2N1c3RvbV9zY3JvbGxiYXIuanMnKSAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LvQsNC10YIg0YHQu9Cw0LnQtNC10YBcclxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL3NsaWRlci9cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogLy8g0LIgZGF0YS1taW4g0LggZGF0YS1tYXgg0LfQsNC00LDRjtGC0YHRjyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1XHJcbiAgICAgKiAvLyDQsiBkYXRhLXN0ZXAg0YjQsNCzLFxyXG4gICAgICogLy8g0LIgZGF0YS12YWx1ZXMg0LTQtdGE0L7Qu9GC0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8gXCJtaW4sIG1heFwiXHJcbiAgICAgKiA8ZGl2IGNsYXNzPVwic2xpZGVyIGpzLXJhbmdlXCI+XHJcbiAgICAgKiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZXJfX3JhbmdlXCIgZGF0YS1taW49XCIwXCIgZGF0YS1tYXg9XCIxMDBcIiBkYXRhLXN0ZXA9XCIxXCIgZGF0YS12YWx1ZXM9XCIxMCwgNTVcIj48L2Rpdj5cclxuICAgICAqIDwvZGl2PlxyXG4gICAgICovXHJcbiAgICBsZXQgU2xpZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gJCgnLmpzLXJhbmdlJyk7XHJcbiAgICAgICAgbGV0IG1pbixcclxuICAgICAgICAgICAgbWF4LFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICB2YWx1ZXM7XHJcblxyXG4gICAgICAgIHNsaWRlci5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzZWxmLmZpbmQoJy5zbGlkZXJfX3JhbmdlJyk7XHJcblxyXG4gICAgICAgICAgICBtaW4gPSByYW5nZS5kYXRhKCdtaW4nKTtcclxuICAgICAgICAgICAgbWF4ID0gcmFuZ2UuZGF0YSgnbWF4Jyk7XHJcbiAgICAgICAgICAgIHN0ZXAgPSByYW5nZS5kYXRhKCdzdGVwJyk7XHJcbiAgICAgICAgICAgIHZhbHVlcyA9IHJhbmdlLmRhdGEoJ3ZhbHVlcycpLnNwbGl0KCcsICcpO1xyXG5cclxuICAgICAgICAgICAgcmFuZ2Uuc2xpZGVyKHtcclxuICAgICAgICAgICAgICAgIHJhbmdlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWluOiBtaW4gfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIG1heDogbWF4IHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzdGVwOiBzdGVwIHx8IDEsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHZhbHVlcyxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlJykuY2hpbGRyZW4oJ3NwYW4nKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgyKScpLmFwcGVuZChgPHNwYW4+JHt1aS52YWx1ZXNbMF19PC9zcGFuPmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDMpJykuYXBwZW5kKGA8c3Bhbj4ke3VpLnZhbHVlc1sxXX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMiknKS5hcHBlbmQoYDxzcGFuPiR7cmFuZ2Uuc2xpZGVyKCd2YWx1ZXMnLCAwKX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDMpJykuYXBwZW5kKGA8c3Bhbj4ke3JhbmdlLnNsaWRlcigndmFsdWVzJywgMSl9PC9zcGFuPmApO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbGV0IHNsaWRlciA9IG5ldyBTbGlkZXIoKTtcclxuXHJcbiAgICAvLyBpbmNsdWRlKCdwb3B1cHMuanMnKVxyXG4gICAgLy8gaW5jbHVkZSgndG9vbHRpcC5qcycpXHJcblxyXG5cclxuXHJcbiAgICAkKCcuY2Fyb3VzZWwnKS5zbGljayh7XHJcbiAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICBzbGlkZXNQZXJSb3c6IDMsXHJcbiAgICAgICAgcm93czogMixcclxuICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYnJlYWtwb2ludDogNDc4LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgc2xpZGVzUGVyUm93OiAxLFxyXG4gICAgICAgICAgICByb3dzOiAxLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSk7O1xyXG5cclxufSk7XHJcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==
