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

  $(document).ready(function () {
    $('.carousel').slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      rows: 2
    });
  });
  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wWGxTaXplIiwiZGVza3RvcExnU2l6ZSIsImRlc2t0b3BTaXplIiwidGFibGV0TGdTaXplIiwidGFibGV0U2l6ZSIsIm1vYmlsZUxnU2l6ZSIsIm1vYmlsZVNpemUiLCJwb3B1cHNCcmVha3BvaW50IiwicG9wdXBzRml4ZWRUaW1lb3V0IiwiaXNUb3VjaCIsImJyb3dzZXIiLCJtb2JpbGUiLCJsYW5nIiwiYXR0ciIsImJyZWFrcG9pbnRzIiwiYnJlYWtwb2ludERlc2t0b3BYbCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJicmVha3BvaW50RGVza3RvcExnIiwiYnJlYWtwb2ludERlc2t0b3AiLCJicmVha3BvaW50VGFibGV0TGciLCJicmVha3BvaW50VGFibGV0IiwiYnJlYWtwb2ludE1vYmlsZUxnU2l6ZSIsImJyZWFrcG9pbnRNb2JpbGUiLCJleHRlbmQiLCJsb2FkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImxlbmd0aCIsImF1dG9zaXplIiwiZm4iLCJhbmltYXRlQ3NzIiwiYW5pbWF0aW9uTmFtZSIsImNhbGxiYWNrIiwiYW5pbWF0aW9uRW5kIiwiZWwiLCJhbmltYXRpb25zIiwiYW5pbWF0aW9uIiwiT0FuaW1hdGlvbiIsIk1vekFuaW1hdGlvbiIsIldlYmtpdEFuaW1hdGlvbiIsInQiLCJzdHlsZSIsInVuZGVmaW5lZCIsImNyZWF0ZUVsZW1lbnQiLCJvbmUiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsImhhc0NsYXNzIiwic2VsZWN0U2VhcmNoIiwiZGF0YSIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsIm9uIiwiZSIsImZpbmQiLCJjb250ZXh0IiwidmFsdWUiLCJjbGljayIsInVwZGF0ZSIsIiR1cGRhdGVFbGVtIiwiY3VzdG9tRmlsZUlucHV0IiwiaSIsImVsZW0iLCJidXR0b25Xb3JkIiwiY2xhc3NOYW1lIiwid3JhcCIsInBhcmVudCIsInByZXBlbmQiLCJodG1sIiwicHJvbWlzZSIsImRvbmUiLCJtb3VzZW1vdmUiLCJjdXJzb3IiLCJpbnB1dCIsIndyYXBwZXIiLCJ3cmFwcGVyWCIsIndyYXBwZXJZIiwiaW5wdXRXaWR0aCIsImlucHV0SGVpZ2h0IiwiY3Vyc29yWCIsImN1cnNvclkiLCJvZmZzZXQiLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJwYWdlWCIsInBhZ2VZIiwibW92ZUlucHV0WCIsIm1vdmVJbnB1dFkiLCJjc3MiLCJmaWxlTmFtZSIsInZhbCIsIm5leHQiLCJyZW1vdmUiLCJwcm9wIiwiZmlsZXMiLCJzdWJzdHJpbmciLCJsYXN0SW5kZXhPZiIsInNlbGVjdGVkRmlsZU5hbWVQbGFjZW1lbnQiLCJzaWJsaW5ncyIsImFmdGVyIiwiY3VzdG9tU2VsZWN0IiwiaW5kZXgiLCJmaWVsZCIsInRyaW0iLCJldmVudCIsImxvY2FsZSIsIlBhcnNsZXkiLCJzZXRMb2NhbGUiLCJvcHRpb25zIiwidHJpZ2dlciIsInZhbGlkYXRpb25UaHJlc2hvbGQiLCJlcnJvcnNXcmFwcGVyIiwiZXJyb3JUZW1wbGF0ZSIsImNsYXNzSGFuZGxlciIsImluc3RhbmNlIiwiJGVsZW1lbnQiLCJ0eXBlIiwiJGhhbmRsZXIiLCJlcnJvcnNDb250YWluZXIiLCIkY29udGFpbmVyIiwiY2xvc2VzdCIsImFkZFZhbGlkYXRvciIsInZhbGlkYXRlU3RyaW5nIiwidGVzdCIsIm1lc3NhZ2VzIiwicnUiLCJlbiIsInJlZ1Rlc3QiLCJyZWdNYXRjaCIsIm1pbiIsImFyZ3VtZW50cyIsIm1heCIsIm1pbkRhdGUiLCJtYXhEYXRlIiwidmFsdWVEYXRlIiwicmVzdWx0IiwibWF0Y2giLCJEYXRlIiwibWF4U2l6ZSIsInBhcnNsZXlJbnN0YW5jZSIsInNpemUiLCJyZXF1aXJlbWVudFR5cGUiLCJmb3JtYXRzIiwiZmlsZUV4dGVuc2lvbiIsInNwbGl0IiwicG9wIiwiZm9ybWF0c0FyciIsInZhbGlkIiwiJGJsb2NrIiwiJGxhc3QiLCJlbGVtZW50IiwicGFyc2xleSIsImlucHV0bWFzayIsImNsZWFyTWFza09uTG9zdEZvY3VzIiwic2hvd01hc2tPbkhvdmVyIiwidXBkYXRlU3ZnIiwiJHVzZUVsZW1lbnQiLCJocmVmIiwiYmFzZVZhbCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJEYXRlcGlja2VyUmFuZ2UiLCJkYXRlcGlja2VyUmFuZ2UiLCJmcm9tSXRlbU9wdGlvbnMiLCJ0b0l0ZW1PcHRpb25zIiwiZGF0ZUZyb20iLCJkYXRlVG8iLCJnZXREYXRlIiwiaXNWYWxpZCIsInZhbGlkYXRlIiwiZGF0ZSIsInBhcnNlRGF0ZSIsImVycm9yIiwiVGFiU3dpdGNoZXIiLCJ0YWJzIiwib3BlbiIsInRhYkVsZW0iLCJwcmV2ZW50RGVmYXVsdCIsInBhcmVudFRhYnMiLCJ0b2dnbGVDbGFzcyIsInRhYlN3aXRjaGVyIiwib25PdXRzaWRlQ2xpY2tIaWRlIiwidGFyZ2V0RWxlbSIsImhpZGRlbkVsZW0iLCJvcHRpb25hbENiIiwiYmluZCIsImlzIiwidGFyZ2V0Iiwic3RvcCIsImZhZGVPdXQiLCJ2aXNpYmlsaXR5Q29udHJvbCIsInNldHRpbmdzIiwidHlwZXMiLCJzZXRWaXNpYmlsaXR5IiwidmlzaWJpbGl0eVR5cGUiLCJsaXN0IiwiZGVsYXkiLCJmYWRlSW4iLCJkYXRhVHlwZSIsInZpc2liaWxpdHlMaXN0IiwiU2xpZGVyIiwic2xpZGVyIiwic3RlcCIsInZhbHVlcyIsInJhbmdlIiwic2xpZGUiLCJ1aSIsImNoaWxkcmVuIiwiYXBwZW5kIiwic2xpY2siLCJzbGlkZXNUb1Nob3ciLCJz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QVMzRyxLQUFULEVBQWdCNEcsRUFBaEIsRUFBb0I7QUFDdkI5SyxVQUFBQSxJQUFJLENBQUNjLElBQUwsQ0FBVSxtQkFBVixFQUErQmlLLFFBQS9CLENBQXdDLE1BQXhDLEVBQWdEekgsTUFBaEQ7QUFDQXRELFVBQUFBLElBQUksQ0FBQ2MsSUFBTCxDQUFVLGdDQUFWLEVBQTRDa0ssTUFBNUMsaUJBQTRERixFQUFFLENBQUNILE1BQUgsQ0FBVSxDQUFWLENBQTVEO0FBQ0EzSyxVQUFBQSxJQUFJLENBQUNjLElBQUwsQ0FBVSxnQ0FBVixFQUE0Q2tLLE1BQTVDLGlCQUE0REYsRUFBRSxDQUFDSCxNQUFILENBQVUsQ0FBVixDQUE1RDtBQUNIO0FBVlEsT0FBYjtBQWFBM0ssTUFBQUEsSUFBSSxDQUFDYyxJQUFMLENBQVUsZ0NBQVYsRUFBNENrSyxNQUE1QyxpQkFBNERKLEtBQUssQ0FBQ0gsTUFBTixDQUFhLFFBQWIsRUFBdUIsQ0FBdkIsQ0FBNUQ7QUFDQXpLLE1BQUFBLElBQUksQ0FBQ2MsSUFBTCxDQUFVLGdDQUFWLEVBQTRDa0ssTUFBNUMsaUJBQTRESixLQUFLLENBQUNILE1BQU4sQ0FBYSxRQUFiLEVBQXVCLENBQXZCLENBQTVEO0FBRUgsS0ExQkQ7QUEyQkgsR0FsQ0Q7O0FBb0NBLE1BQUlBLE1BQU0sR0FBRyxJQUFJRCxNQUFKLEVBQWIsQ0FqMkJ5QixDQW0yQnpCO0FBQ0E7O0FBQ0E3TixFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDMUJGLElBQUFBLENBQUMsQ0FBQyxXQUFELENBQUQsQ0FBZXNPLEtBQWYsQ0FBcUI7QUFDbkJDLE1BQUFBLFlBQVksRUFBRSxDQURLO0FBRW5CQyxNQUFBQSxjQUFjLEVBQUUsQ0FGRztBQUduQkMsTUFBQUEsSUFBSSxFQUFFO0FBSGEsS0FBckI7QUFLRCxHQU5EO0FBTUc7QUFFTixDQTcyQkQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIC8qKlxyXG4gICAgICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUsINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+XHJcbiAgICAgKi9cclxuICAgIGxldCBnbG9iYWxPcHRpb25zID0ge1xyXG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQu9GPINCw0L3QuNC80LDRhtC40LlcclxuICAgICAgICB0aW1lOiAgMjAwLFxyXG5cclxuICAgICAgICAvLyDQmtC+0L3RgtGA0L7Qu9GM0L3Ri9C1INGC0L7Rh9C60Lgg0LDQtNCw0L/RgtC40LLQsFxyXG4gICAgICAgIGRlc2t0b3BYbFNpemU6IDE5MjAsXHJcbiAgICAgICAgZGVza3RvcExnU2l6ZTogMTYwMCxcclxuICAgICAgICBkZXNrdG9wU2l6ZTogICAxMjgwLFxyXG4gICAgICAgIHRhYmxldExnU2l6ZTogICAxMDI0LFxyXG4gICAgICAgIHRhYmxldFNpemU6ICAgICA3NjgsXHJcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcclxuICAgICAgICBtb2JpbGVTaXplOiAgICAgNDgwLFxyXG5cclxuICAgICAgICAvLyDQotC+0YfQutCwINC/0LXRgNC10YXQvtC00LAg0L/QvtC/0LDQv9C+0LIg0L3QsCDRhNGD0LvRgdC60YDQuNC9XHJcbiAgICAgICAgcG9wdXBzQnJlYWtwb2ludDogNzY4LFxyXG5cclxuICAgICAgICAvLyDQktGA0LXQvNGPINC00L4g0YHQvtC60YDRi9GC0LjRjyDRhNC40LrRgdC40YDQvtCy0LDQvdC90YvRhSDQv9C+0L/QsNC/0L7QslxyXG4gICAgICAgIHBvcHVwc0ZpeGVkVGltZW91dDogNTAwMCxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCB0b3VjaCDRg9GB0YLRgNC+0LnRgdGC0LJcclxuICAgICAgICBpc1RvdWNoOiAkLmJyb3dzZXIubW9iaWxlLFxyXG5cclxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxyXG4gICAgLy8gQGV4YW1wbGUgaWYgKGdsb2JhbE9wdGlvbnMuYnJlYWtwb2ludFRhYmxldC5tYXRjaGVzKSB7fSBlbHNlIHt9XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IHtcclxuICAgICAgICBicmVha3BvaW50RGVza3RvcFhsOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BYbFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcExnU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3A6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0U2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZUxnU2l6ZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcclxuICAgIH07XHJcblxyXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsT3B0aW9ucy5pc1RvdWNoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygndG91Y2gnKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ25vLXRvdWNoJykucmVtb3ZlQ2xhc3MoJ3RvdWNoJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGF1dG9zaXplKCQoJ3RleHRhcmVhJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7QtNC60LvRjtGH0LXQvdC40LUganMgcGFydGlhbHNcclxuICAgICAqL1xyXG4gICAgLyogZm9ybV9zdHlsZS5qcyDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0LLRi9C/0L7Qu9C90LXQvSDQv9C10YDQtdC0IGZvcm1fdmFsaWRhdGlvbi5qcyAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0YHRiNC40YDQtdC90LjQtSBhbmltYXRlLmNzc1xyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhbmltYXRpb25OYW1lINC90LDQt9Cy0LDQvdC40LUg0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQvtGC0YDQsNCx0L7RgtCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g0L7QsdGK0LXQutGCINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIFxyXG4gICAgICogQHNlZSAgaHR0cHM6Ly9kYW5lZGVuLmdpdGh1Yi5pby9hbmltYXRlLmNzcy9cclxuICAgICAqIFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScpO1xyXG4gICAgICogXHJcbiAgICAgKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAqICAgICAvLyDQlNC10LvQsNC10Lwg0YfRgtC+LdGC0L4g0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiB9KTtcclxuICAgICAqL1xyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGFuaW1hdGVDc3M6IGZ1bmN0aW9uKGFuaW1hdGlvbk5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ21vekFuaW1hdGlvbkVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8qKlxyXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCINGB0LXQu9C10LrRgtGLINGBINC/0L7QvNC+0YnRjNGOINC/0LvQsNCz0LjQvdCwIHNlbGVjdDJcclxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cclxuICAgICAqL1xyXG4gICAgbGV0IEN1c3RvbVNlbGVjdCA9IGZ1bmN0aW9uKCRlbGVtKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbigkaW5pdEVsZW0pIHtcclxuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0U2VhcmNoID0gJCh0aGlzKS5kYXRhKCdzZWFyY2gnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RTZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSAxOyAvLyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5OyAvLyDQvdC1INC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3QyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoYG9wdGlvblt2YWx1ZT1cIiR7JCh0aGlzKS5jb250ZXh0LnZhbHVlfVwiXWApLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24oJHVwZGF0ZUVsZW0pIHtcclxuICAgICAgICAgICAgJHVwZGF0ZUVsZW0uc2VsZWN0MignZGVzdHJveScpO1xyXG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCIGZpbGUgaW5wdXRcclxuICAgICAqIGh0dHA6Ly9ncmVncGlrZS5uZXQvZGVtb3MvYm9vdHN0cmFwLWZpbGUtaW5wdXQvZGVtby5odG1sXHJcbiAgICAgKi9cclxuICAgICQuZm4uY3VzdG9tRmlsZUlucHV0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBlbGVtKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYXliZSBzb21lIGZpZWxkcyBkb24ndCBuZWVkIHRvIGJlIHN0YW5kYXJkaXplZC5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAkZWxlbS5hdHRyKCdkYXRhLWJmaS1kaXNhYmxlZCcpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdGhlIHdvcmQgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbldvcmQgPSAnQnJvd3NlJztcclxuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAkZWxlbS5hdHRyKCd0aXRsZScpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uV29yZCA9ICRlbGVtLmF0dHIoJ3RpdGxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghISRlbGVtLmF0dHIoJ2NsYXNzJykpIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcgJyArICRlbGVtLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE5vdyB3ZSdyZSBnb2luZyB0byB3cmFwIHRoYXQgaW5wdXQgZmllbGQgd2l0aCBhIGJ1dHRvbi5cclxuICAgICAgICAgICAgLy8gVGhlIGlucHV0IHdpbGwgYWN0dWFsbHkgc3RpbGwgYmUgdGhlcmUsIGl0IHdpbGwganVzdCBiZSBmbG9hdCBhYm92ZSBhbmQgdHJhbnNwYXJlbnQgKGRvbmUgd2l0aCB0aGUgQ1NTKS5cclxuICAgICAgICAgICAgJGVsZW0ud3JhcChgPGRpdiBjbGFzcz1cImN1c3RvbS1maWxlXCI+PGEgY2xhc3M9XCJidG4gJHtjbGFzc05hbWV9XCI+PC9hPjwvZGl2PmApLnBhcmVudCgpLnByZXBlbmQoJCgnPHNwYW4+PC9zcGFuPicpLmh0bWwoYnV0dG9uV29yZCkpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIEFmdGVyIHdlIGhhdmUgZm91bmQgYWxsIG9mIHRoZSBmaWxlIGlucHV0cyBsZXQncyBhcHBseSBhIGxpc3RlbmVyIGZvciB0cmFja2luZyB0aGUgbW91c2UgbW92ZW1lbnQuXHJcbiAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgYmVjYXVzZSB0aGUgaW4gb3JkZXIgdG8gZ2l2ZSB0aGUgaWxsdXNpb24gdGhhdCB0aGlzIGlzIGEgYnV0dG9uIGluIEZGIHdlIGFjdHVhbGx5IG5lZWQgdG8gbW92ZSB0aGUgYnV0dG9uIGZyb20gdGhlIGZpbGUgaW5wdXQgdW5kZXIgdGhlIGN1cnNvci4gVWdoLlxyXG4gICAgICAgIC5wcm9taXNlKCkuZG9uZShmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEFzIHRoZSBjdXJzb3IgbW92ZXMgb3ZlciBvdXIgbmV3IGJ1dHRvbiB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgcG9zaXRpb24gb2YgdGhlIGludmlzaWJsZSBmaWxlIGlucHV0IEJyb3dzZSBidXR0b24gdG8gYmUgdW5kZXIgdGhlIGN1cnNvci5cclxuICAgICAgICAgICAgLy8gVGhpcyBnaXZlcyB1cyB0aGUgcG9pbnRlciBjdXJzb3IgdGhhdCBGRiBkZW5pZXMgdXNcclxuICAgICAgICAgICAgJCgnLmN1c3RvbS1maWxlJykubW91c2Vtb3ZlKGZ1bmN0aW9uKGN1cnNvcikge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCwgd3JhcHBlcixcclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyWCwgd3JhcHBlclksXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRXaWR0aCwgaW5wdXRIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yWCwgY3Vyc29yWTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHdyYXBwZXIgZWxlbWVudCAodGhlIGJ1dHRvbiBzdXJyb3VuZCB0aGlzIGZpbGUgaW5wdXQpXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBpbnZpc2libGUgZmlsZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHdyYXBwZXIuZmluZCgnaW5wdXQnKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBsZWZ0LW1vc3QgcG9zaXRpb24gb2YgdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgIHdyYXBwZXJYID0gd3JhcHBlci5vZmZzZXQoKS5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHRvcC1tb3N0IHBvc2l0aW9uIG9mIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyWSA9IHdyYXBwZXIub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHdpdGggb2YgdGhlIGJyb3dzZXJzIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICBpbnB1dFdpZHRoID0gaW5wdXQud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBoZWlnaHQgb2YgdGhlIGJyb3dzZXJzIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICBpbnB1dEhlaWdodCA9IGlucHV0LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgLy9UaGUgcG9zaXRpb24gb2YgdGhlIGN1cnNvciBpbiB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgY3Vyc29yWCA9IGN1cnNvci5wYWdlWDtcclxuICAgICAgICAgICAgICAgIGN1cnNvclkgPSBjdXJzb3IucGFnZVk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9UaGUgcG9zaXRpb25zIHdlIGFyZSB0byBtb3ZlIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dFxyXG4gICAgICAgICAgICAgICAgLy8gVGhlIDIwIGF0IHRoZSBlbmQgaXMgYW4gYXJiaXRyYXJ5IG51bWJlciBvZiBwaXhlbHMgdGhhdCB3ZSBjYW4gc2hpZnQgdGhlIGlucHV0IHN1Y2ggdGhhdCBjdXJzb3IgaXMgbm90IHBvaW50aW5nIGF0IHRoZSBlbmQgb2YgdGhlIEJyb3dzZSBidXR0b24gYnV0IHNvbWV3aGVyZSBuZWFyZXIgdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICAgICAgbW92ZUlucHV0WCA9IGN1cnNvclggLSB3cmFwcGVyWCAtIGlucHV0V2lkdGggKyAyMDtcclxuICAgICAgICAgICAgICAgIC8vIFNsaWRlcyB0aGUgaW52aXNpYmxlIGlucHV0IEJyb3dzZSBidXR0b24gdG8gYmUgcG9zaXRpb25lZCBtaWRkbGUgdW5kZXIgdGhlIGN1cnNvclxyXG4gICAgICAgICAgICAgICAgbW92ZUlucHV0WSA9IGN1cnNvclkgLSB3cmFwcGVyWSAtIChpbnB1dEhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGx5IHRoZSBwb3NpdGlvbmluZyBzdHlsZXMgdG8gYWN0dWFsbHkgbW92ZSB0aGUgaW52aXNpYmxlIGZpbGUgaW5wdXRcclxuICAgICAgICAgICAgICAgIGlucHV0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogbW92ZUlucHV0WCxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IG1vdmVJbnB1dFlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2hhbmdlJywgJy5jdXN0b20tZmlsZSBpbnB1dFt0eXBlPWZpbGVdJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSAkKHRoaXMpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgcHJldmlvdXMgZmlsZSBuYW1lc1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5uZXh0KCcuY3VzdG9tLWZpbGVfX25hbWUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGlmICghISQodGhpcykucHJvcCgnZmlsZXMnKSAmJiAkKHRoaXMpLnByb3AoJ2ZpbGVzJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gJCh0aGlzKVswXS5maWxlcy5sZW5ndGggKyAnIGZpbGVzJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHJpbmcoZmlsZU5hbWUubGFzdEluZGV4T2YoJ1xcXFwnKSArIDEsIGZpbGVOYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHNob3cgdGhlIG5hbWUgaWYgdGhlcmUgaXMgbm9uZVxyXG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRGaWxlTmFtZVBsYWNlbWVudCA9ICQodGhpcykuZGF0YSgnZmlsZW5hbWUtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRGaWxlTmFtZVBsYWNlbWVudCA9PT0gJ2luc2lkZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBQcmludCB0aGUgZmlsZU5hbWUgaW5zaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnc3BhbicpLmh0bWwoZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cigndGl0bGUnLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByaW50IHRoZSBmaWxlTmFtZSBhc2lkZSAocmlnaHQgYWZ0ZXIgdGhlIHRoZSBidXR0b24pXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZnRlcihgPHNwYW4gY2xhc3M9XCJjdXN0b20tZmlsZV9fbmFtZVwiPiR7ZmlsZU5hbWV9IDwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgJCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKS5jdXN0b21GaWxlSW5wdXQoKTtcclxuICAgIC8vICQoJ3NlbGVjdCcpLmN1c3RvbVNlbGVjdCgpO1xyXG4gICAgdmFyIGN1c3RvbVNlbGVjdCA9IG5ldyBDdXN0b21TZWxlY3QoJCgnc2VsZWN0JykpO1xyXG5cclxuICAgIGlmICgkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCQ0L3QuNC80LDRhtC40Y8g0Y3Qu9C10LzQtdC90YLQsCBsYWJlbCDQv9GA0Lgg0YTQvtC60YPRgdC1INC/0L7Qu9C10Lkg0YTQvtGA0LzRi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9ICQoZWwpLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQoZmllbGQpLnZhbCgpLnRyaW0oKSAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKGZpZWxkKS5vbignZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICB9KS5vbignYmx1cicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKS50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcclxuXHJcbiAgICBQYXJzbGV5LnNldExvY2FsZShsb2NhbGUpO1xyXG5cclxuICAgIC8qINCd0LDRgdGC0YDQvtC50LrQuCBQYXJzbGV5ICovXHJcbiAgICAkLmV4dGVuZChQYXJzbGV5Lm9wdGlvbnMsIHtcclxuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXHJcbiAgICAgICAgdmFsaWRhdGlvblRocmVzaG9sZDogJzAnLFxyXG4gICAgICAgIGVycm9yc1dyYXBwZXI6ICc8ZGl2PjwvZGl2PicsXHJcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXHJcbiAgICAgICAgY2xhc3NIYW5kbGVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyO1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JzQ29udGFpbmVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgICAgICRjb250YWluZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRhaW5lcjtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQmtCw0YHRgtC+0LzQvdGL0LUg0LLQsNC70LjQtNCw0YLQvtGA0YtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZVJ1Jywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkVxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZUVuJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLINC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXJSdScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOdCwLdGP0ZFdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIDAtOScsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgMC05J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlcicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgFxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bLSswLTkoKSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGC0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YAnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1iZXInLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlswLTldKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZW1haWwnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBlbWFpbCBhZGRyZXNzJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCk0L7RgNC80LDRgiDQtNCw0YLRiyBERC5NTS5ZWVlZXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgbGV0IHJlZ1Rlc3QgPSAvXig/Oig/OjMxKFxcLikoPzowP1sxMzU3OF18MVswMl0pKVxcMXwoPzooPzoyOXwzMCkoXFwuKSg/OjA/WzEsMy05XXwxWzAtMl0pXFwyKSkoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHsyfSkkfF4oPzoyOShcXC4pMD8yXFwzKD86KD86KD86MVs2LTldfFsyLTldXFxkKT8oPzowWzQ4XXxbMjQ2OF1bMDQ4XXxbMTM1NzldWzI2XSl8KD86KD86MTZ8WzI0NjhdWzA0OF18WzM1NzldWzI2XSkwMCkpKSkkfF4oPzowP1sxLTldfDFcXGR8MlswLThdKShcXC4pKD86KD86MD9bMS05XSl8KD86MVswLTJdKSlcXDQoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHs0fSkkLyxcclxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxyXG4gICAgICAgICAgICAgICAgbWluID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNaW4nKSxcclxuICAgICAgICAgICAgICAgIG1heCA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWF4JyksXHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChtaW4gJiYgKHJlc3VsdCA9IG1pbi5tYXRjaChyZWdNYXRjaCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heCAmJiAocmVzdWx0ID0gbWF4Lm1hdGNoKHJlZ01hdGNoKSkpIHtcclxuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnTWF0Y2gpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcclxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZGF0ZSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlTWF4U2l6ZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIG1heFNpemUsIHBhcnNsZXlJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlcy5sZW5ndGggIT0gMSAgfHwgZmlsZXNbMF0uc2l6ZSA8PSBtYXhTaXplICogMTAyNDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0KTQsNC50Lsg0LTQvtC70LbQtdC9INCy0LXRgdC40YLRjCDQvdC1INCx0L7Qu9C10LUsINGH0LXQvCAlcyBLYicsXHJcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCe0LPRgNCw0L3QuNGH0LXQvdC40Y8g0YDQsNGB0YjQuNGA0LXQvdC40Lkg0YTQsNC50LvQvtCyXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZUV4dGVuc2lvbicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcclxuICAgICAgICAgICAgbGV0IGZpbGVFeHRlbnNpb24gPSB2YWx1ZS5zcGxpdCgnLicpLnBvcCgpO1xyXG4gICAgICAgICAgICBsZXQgZm9ybWF0c0FyciA9IGZvcm1hdHMuc3BsaXQoJywgJyk7XHJcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXRzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxyXG4gICAgICAgICAgICBlbjogJ0F2YWlsYWJsZSBleHRlbnNpb25zIGFyZSAlcydcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQodC+0LfQtNCw0ZHRgiDQutC+0L3RgtC10LnQvdC10YDRiyDQtNC70Y8g0L7RiNC40LHQvtC6INGDINC90LXRgtC40L/QuNGH0L3Ri9GFINGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXHJcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXHJcbiAgICAgICAgICAgICRsYXN0O1xyXG5cclxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0JjQvdC40YbQuNC40YDRg9C10YIg0LLQsNC70LjQtNCw0YbQuNGOINC90LAg0LLRgtC+0YDQvtC8INC60LDQu9C10LTQsNGA0L3QvtC8INC/0L7Qu9C1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgUGFyc2xleS5vbignZmllbGQ6dmFsaWRhdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcclxuICAgIC8qKlxyXG4gICAgICog0JTQvtCx0LDQstC70Y/QtdGCINC80LDRgdC60Lgg0LIg0L/QvtC70Y8g0YTQvtGA0LxcclxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XHJcbiAgICAgKi9cclxuICAgICQoJy5qcy1waG9uZS1tYXNrJykuaW5wdXRtYXNrKCcrNyg5OTkpIDk5OS05OS05OScsIHtcclxuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcclxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7RgdGC0YvQu9GMINC00LvRjyDQvtCx0L3QvtCy0LvQtdC90LjRjyB4bGluayDRgyBzdmct0LjQutC+0L3QvtC6INC/0L7RgdC70LUg0L7QsdC90L7QstC70LXQvdC40Y8gRE9NICjQtNC70Y8gSUUpXHJcbiAgICAgKiDRhNGD0L3QutGG0LjRjiDQvdGD0LbQvdC+INCy0YvQt9GL0LLQsNGC0Ywg0LIg0YHQvtCx0YvRgtC40Y/RhSwg0LrQvtGC0L7RgNGL0LUg0LLQvdC+0YHRj9GCINC40LfQvNC10L3QtdC90LjRjyDQsiDRjdC70LXQvNC10L3RgtGLINGD0LbQtSDQv9C+0YHQu9C1INGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyBET00t0LBcclxuICAgICAqICjQvdCw0L/RgNC40LzQtdGALCDQv9C+0YHQu9C1INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC60LDRgNGD0YHQtdC70Lgg0LjQu9C4INC+0YLQutGA0YvRgtC40Lgg0L/QvtC/0LDQv9CwKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0VsZW1lbnR9IGVsZW1lbnQg0Y3Qu9C10LzQtdC90YIsINCyINC60L7RgtC+0YDQvtC8INC90LXQvtCx0YXQvtC00LjQvNC+INC+0LHQvdC+0LLQuNGC0Ywgc3ZnICjQvdCw0L/RgNC40LwgJCgnI3NvbWUtcG9wdXAnKSlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlU3ZnKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgJHVzZUVsZW1lbnQgPSBlbGVtZW50LmZpbmQoJ3VzZScpO1xyXG5cclxuICAgICAgICAkdXNlRWxlbWVudC5lYWNoKGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgaWYgKCR1c2VFbGVtZW50W2luZGV4XS5ocmVmICYmICR1c2VFbGVtZW50W2luZGV4XS5ocmVmLmJhc2VWYWwpIHtcclxuICAgICAgICAgICAgICAgICR1c2VFbGVtZW50W2luZGV4XS5ocmVmLmJhc2VWYWwgPSAkdXNlRWxlbWVudFtpbmRleF0uaHJlZi5iYXNlVmFsOyAvLyB0cmlnZ2VyIGZpeGluZyBvZiBocmVmXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICBkYXRlRm9ybWF0OiAnZGQubW0ueXknLFxyXG4gICAgICAgIHNob3dPdGhlck1vbnRoczogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxyXG4gICAgICogQHNlZSAgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZGF0ZXBpY2tlci9cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogLy8g0LIgZGF0YS1kYXRlLW1pbiDQuCBkYXRhLWRhdGUtbWF4INC80L7QttC90L4g0LfQsNC00LDRgtGMINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXlcclxuICAgICAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkYXRlSW5wdXRcIiBpZD1cIlwiIGNsYXNzPVwianMtZGF0ZXBpY2tlclwiIGRhdGEtZGF0ZS1taW49XCIwNi4xMS4yMDE1XCIgZGF0YS1kYXRlLW1heD1cIjEwLjEyLjIwMTVcIj5cclxuICAgICAqL1xyXG4gICAgbGV0IERhdGVwaWNrZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgZGF0ZXBpY2tlciA9ICQoJy5qcy1kYXRlcGlja2VyJyk7XHJcblxyXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBtaW5EYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1pbicpO1xyXG4gICAgICAgICAgICBsZXQgbWF4RGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1tYXgnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIG1pbkRhdGU6IG1pbkRhdGUgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIG1heERhdGU6IG1heERhdGUgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmZpZWxkJykuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMpLmRhdGVwaWNrZXIoaXRlbU9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgZGF0ZXBpY2tlciA9IG5ldyBEYXRlcGlja2VyKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvLyDQlNC40LDQv9Cw0LfQvtC9INC00LDRglxyXG4gICAgbGV0IERhdGVwaWNrZXJSYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBkYXRlcGlja2VyUmFuZ2UgPSAkKCcuanMtZGF0ZXBpY2tlci1yYW5nZScpO1xyXG5cclxuICAgICAgICBkYXRlcGlja2VyUmFuZ2UuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBmcm9tSXRlbU9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgbGV0IHRvSXRlbU9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIGZyb21JdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgdG9JdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkYXRlRnJvbSA9ICQodGhpcykuZmluZCgnLmpzLXJhbmdlLWZyb20nKS5kYXRlcGlja2VyKGZyb21JdGVtT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGF0ZVRvID0gJCh0aGlzKS5maW5kKCcuanMtcmFuZ2UtdG8nKS5kYXRlcGlja2VyKHRvSXRlbU9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgZGF0ZUZyb20ub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZVRvLmRhdGVwaWNrZXIoJ29wdGlvbicsICdtaW5EYXRlJywgZ2V0RGF0ZSh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGF0ZVRvLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3BhcnNsZXktZXJyb3InKSAmJiAkKHRoaXMpLnBhcnNsZXkoKS5pc1ZhbGlkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcnNsZXkoKS52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRhdGVUby5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlRnJvbS5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWF4RGF0ZScsIGdldERhdGUodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRhdGVGcm9tLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3BhcnNsZXktZXJyb3InKSAmJiAkKHRoaXMpLnBhcnNsZXkoKS5pc1ZhbGlkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcnNsZXkoKS52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0ZShlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRlO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSAkLmRhdGVwaWNrZXIucGFyc2VEYXRlKGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucy5kYXRlRm9ybWF0LCBlbGVtZW50LnZhbHVlKTtcclxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgZGF0ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IGRhdGVwaWNrZXJSYW5nZSA9IG5ldyBEYXRlcGlja2VyUmFuZ2UoKTtcclxuICAgIC8qKlxyXG4gICAgICog0KDQtdCw0LvQuNC30YPQtdGCINC/0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIDx1bCBjbGFzcz1cInRhYnMganMtdGFic1wiPlxyXG4gICAgICogICAgIDxsaSBjbGFzcz1cInRhYnNfX2l0ZW1cIj5cclxuICAgICAqICAgICAgICAgPHNwYW4gY2xhc3M9XCJpcy1hY3RpdmUgdGFic19fbGluayBqcy10YWItbGlua1wiPlRhYiBuYW1lPC9zcGFuPlxyXG4gICAgICogICAgICAgICA8ZGl2IGNsYXNzPVwidGFic19fY250XCI+XHJcbiAgICAgKiAgICAgICAgICAgICA8cD5UYWIgY29udGVudDwvcD5cclxuICAgICAqICAgICAgICAgPC9kaXY+XHJcbiAgICAgKiAgICAgPC9saT5cclxuICAgICAqIDwvdWw+XHJcbiAgICAgKi9cclxuICAgIGxldCBUYWJTd2l0Y2hlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHRhYnMgPSAkKCcuanMtdGFicycpO1xyXG5cclxuICAgICAgICB0YWJzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLXRhYi1saW5rLmlzLWFjdGl2ZScpLm5leHQoKS5hZGRDbGFzcygnaXMtb3BlbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0YWJzLm9uKCdjbGljaycsICcuanMtdGFiLWxpbmsnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBzZWxmLm9wZW4oJCh0aGlzKSwgZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntGC0LrRgNGL0LLQsNC10YIg0YLQsNCxINC/0L4g0LrQu9C40LrRgyDQvdCwINC60LDQutC+0Lkt0YLQviDQtNGA0YPQs9C+0Lkg0Y3Qu9C10LzQtdC90YJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgICogPHNwYW4gZGF0YS10YWItb3Blbj1cIiN0YWItbG9naW5cIj5PcGVuIGxvZ2luIHRhYjwvc3Bhbj5cclxuICAgICAgICAgKi9cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtdGFiLW9wZW5dJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgdGFiRWxlbSA9ICQodGhpcykuZGF0YSgndGFiLW9wZW4nKTtcclxuICAgICAgICAgICAgc2VsZi5vcGVuKCQodGFiRWxlbSksIGV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3BvcHVwJykgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7RgtC60YDRi9Cy0LDQtdGCINGC0LDQsVxyXG4gICAgICAgICAqIEBwYXJhbSAge0VsZW1lbnR9IGVsZW0g0Y3Qu9C10LzQtdC90YIgLmpzLXRhYi1saW5rLCDQvdCwINC60L7RgtC+0YDRi9C5INC90YPQttC90L4g0L/QtdGA0LXQutC70Y7Rh9C40YLRjFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAgKiAvLyDQstGL0LfQvtCyINC80LXRgtC+0LTQsCBvcGVuLCDQvtGC0LrRgNC+0LXRgiDRgtCw0LFcclxuICAgICAgICAgKiB0YWJTd2l0Y2hlci5vcGVuKCQoJyNzb21lLXRhYicpKTtcclxuICAgICAgICAgKi9cclxuICAgICAgICBzZWxmLm9wZW4gPSBmdW5jdGlvbihlbGVtLCBldmVudCkge1xyXG4gICAgICAgICAgICBpZiAoIWVsZW0uaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudFRhYnMgPSBlbGVtLmNsb3Nlc3QodGFicyk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRUYWJzLmZpbmQoJy5pcy1vcGVuJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtLm5leHQoKS50b2dnbGVDbGFzcygnaXMtb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50VGFicy5maW5kKCcuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgbGV0IHRhYlN3aXRjaGVyID0gbmV3IFRhYlN3aXRjaGVyKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC60YDRi9Cy0LDQtdGCINGN0LvQtdC80LXQvdGCIGhpZGRlbkVsZW0g0L/RgNC4INC60LvQuNC60LUg0LfQsCDQv9GA0LXQtNC10LvQsNC80Lgg0Y3Qu9C10LzQtdC90YLQsCB0YXJnZXRFbGVtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gICB0YXJnZXRFbGVtXHJcbiAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSAgIGhpZGRlbkVsZW1cclxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgW29wdGlvbmFsQ2JdINC+0YLRgNCw0LHQsNGC0YvQstCw0LXRgiDRgdGA0LDQt9GDINC90LUg0LTQvtC20LjQtNCw0Y/RgdGMINC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gb25PdXRzaWRlQ2xpY2tIaWRlKHRhcmdldEVsZW0sIGhpZGRlbkVsZW0sIG9wdGlvbmFsQ2IpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5iaW5kKCdtb3VzZXVwIHRvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldEVsZW0uaXMoZS50YXJnZXQpICYmICQoZS50YXJnZXQpLmNsb3Nlc3QodGFyZ2V0RWxlbSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIGhpZGRlbkVsZW0uc3RvcCh0cnVlLCB0cnVlKS5mYWRlT3V0KGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uYWxDYikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsQ2IoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KXRjdC70L/QtdGAINC00LvRjyDQv9C+0LrQsNC30LAsINGB0LrRgNGL0YLQuNGPINC40LvQuCDRh9C10YDQtdC00L7QstCw0L3QuNGPINCy0LjQtNC40LzQvtGB0YLQuCDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJoaWRlXCIgZGF0YS1oaWRlPVwiI2VsZW1JZDJcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiI2VsZW1JZDNcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInNob3dcIiBkYXRhLXNob3c9XCIjZWxlbUlkMXwjZWxlbUlkM1wiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogLy8g0LXRgdC70Lgg0LXRgdGC0Ywg0LDRgtGA0LjQsdGD0YIgZGF0YS1xdWV1ZT1cInNob3dcIiwg0YLQviDQsdGD0LTQtdGCINGB0L3QsNGH0LDQu9CwINGB0LrRgNGL0YIg0Y3Qu9C10LzQtdC90YIgI2VsZW1JZDIsINCwINC/0L7RgtC+0Lwg0L/QvtC60LDQt9Cw0L0gI2VsZW1JZDFcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInNob3dcIiBkYXRhLXNob3c9XCIjZWxlbUlkMVwiIGRhdGEtdmlzaWJpbGl0eT1cImhpZGVcIiBkYXRhLWhpZGU9XCIjZWxlbUlkMlwiIGRhdGEtcXVldWU9XCJzaG93XCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICogPGRpdiBpZD1cImVsZW1JZDFcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+VGV4dDwvZGl2PlxyXG4gICAgICogPGRpdiBpZD1cImVsZW1JZDJcIj5UZXh0PC9kaXY+XHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkM1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5UZXh0PC9kaXY+XHJcbiAgICAgKi9cclxuICAgIGxldCB2aXNpYmlsaXR5Q29udHJvbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgdHlwZXM6IFtcclxuICAgICAgICAgICAgICAgICdzaG93JyxcclxuICAgICAgICAgICAgICAgICdoaWRlJyxcclxuICAgICAgICAgICAgICAgICd0b2dnbGUnXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoJCgnW2RhdGEtdmlzaWJpbGl0eV0nKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtdmlzaWJpbGl0eV0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhVHlwZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0dGluZ3MudHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZSA9IHNldHRpbmdzLnR5cGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKGRhdGFUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmlzaWJpbGl0eUxpc3QgPSAkKHRoaXMpLmRhdGEoZGF0YVR5cGUpLnNwbGl0KCd8JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdxdWV1ZScpID09ICdzaG93Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXkgPSBnbG9iYWxPcHRpb25zLnRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VmlzaWJpbGl0eShkYXRhVHlwZSwgdmlzaWJpbGl0eUxpc3QsIGRlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCd0YWJzX19saW5rJykgJiYgJCh0aGlzKS5hdHRyKCd0eXBlJykgIT0gJ3JhZGlvJyAmJiAkKHRoaXMpLmF0dHIoJ3R5cGUnKSAhPSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQstC40LTQuNC80L7RgdGC0YxcclxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICB2aXNpYmlsaXR5VHlwZSDRgtC40L8g0L7RgtC+0LHRgNCw0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSAgIGxpc3Qg0LzQsNGB0YHQuNCyINGN0LvQtdC80LXQvdGC0L7Qsiwg0YEg0LrQvtGC0L7RgNGL0Lwg0YDQsNCx0L7RgtCw0LXQvFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gIGRlbGF5INC30LDQtNC10YDQttC60LAg0L/RgNC4INC/0L7QutCw0LfQtSDRjdC70LXQvNC10L3RgtCwINCyIG1zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRWaXNpYmlsaXR5KHZpc2liaWxpdHlUeXBlLCBsaXN0LCBkZWxheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHlUeXBlID09IHNldHRpbmdzLnR5cGVzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZGVsYXkoZGVsYXkpLmZhZGVJbihnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHlUeXBlID09IHNldHRpbmdzLnR5cGVzWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZmFkZU91dChnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHlUeXBlID09IHNldHRpbmdzLnR5cGVzWzJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGxpc3RbaV0pLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmZhZGVPdXQoZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZmFkZUluKGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB2aXNpYmlsaXR5Q29udHJvbCgpO1xyXG5cclxuICAgIC8qIGluY2x1ZGUoJ2FjY29yZGlvbi5qcycpXHJcbiAgICBpbmNsdWRlKCdjdXN0b21fc2Nyb2xsYmFyLmpzJykgKi9cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC70LDQtdGCINGB0LvQsNC50LTQtdGAXHJcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9zbGlkZXIvXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIC8vINCyIGRhdGEtbWluINC4IGRhdGEtbWF4INC30LDQtNCw0Y7RgtGB0Y8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtVxyXG4gICAgICogLy8g0LIgZGF0YS1zdGVwINGI0LDQsyxcclxuICAgICAqIC8vINCyIGRhdGEtdmFsdWVzINC00LXRhNC+0LvRgtC90YvQtSDQt9C90LDRh9C10L3QuNGPIFwibWluLCBtYXhcIlxyXG4gICAgICogPGRpdiBjbGFzcz1cInNsaWRlciBqcy1yYW5nZVwiPlxyXG4gICAgICogICAgICA8ZGl2IGNsYXNzPVwic2xpZGVyX19yYW5nZVwiIGRhdGEtbWluPVwiMFwiIGRhdGEtbWF4PVwiMTAwXCIgZGF0YS1zdGVwPVwiMVwiIGRhdGEtdmFsdWVzPVwiMTAsIDU1XCI+PC9kaXY+XHJcbiAgICAgKiA8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgbGV0IFNsaWRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9ICQoJy5qcy1yYW5nZScpO1xyXG4gICAgICAgIGxldCBtaW4sXHJcbiAgICAgICAgICAgIG1heCxcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgdmFsdWVzO1xyXG5cclxuICAgICAgICBzbGlkZXIuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHJhbmdlID0gc2VsZi5maW5kKCcuc2xpZGVyX19yYW5nZScpO1xyXG5cclxuICAgICAgICAgICAgbWluID0gcmFuZ2UuZGF0YSgnbWluJyk7XHJcbiAgICAgICAgICAgIG1heCA9IHJhbmdlLmRhdGEoJ21heCcpO1xyXG4gICAgICAgICAgICBzdGVwID0gcmFuZ2UuZGF0YSgnc3RlcCcpO1xyXG4gICAgICAgICAgICB2YWx1ZXMgPSByYW5nZS5kYXRhKCd2YWx1ZXMnKS5zcGxpdCgnLCAnKTtcclxuXHJcbiAgICAgICAgICAgIHJhbmdlLnNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICByYW5nZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbjogbWluIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBtYXg6IG1heCB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgc3RlcDogc3RlcCB8fCAxLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZScpLmNoaWxkcmVuKCdzcGFuJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMiknKS5hcHBlbmQoYDxzcGFuPiR7dWkudmFsdWVzWzBdfTwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgzKScpLmFwcGVuZChgPHNwYW4+JHt1aS52YWx1ZXNbMV19PC9zcGFuPmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDIpJykuYXBwZW5kKGA8c3Bhbj4ke3JhbmdlLnNsaWRlcigndmFsdWVzJywgMCl9PC9zcGFuPmApO1xyXG4gICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgzKScpLmFwcGVuZChgPHNwYW4+JHtyYW5nZS5zbGlkZXIoJ3ZhbHVlcycsIDEpfTwvc3Bhbj5gKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBzbGlkZXIgPSBuZXcgU2xpZGVyKCk7XHJcblxyXG4gICAgLy8gaW5jbHVkZSgncG9wdXBzLmpzJylcclxuICAgIC8vIGluY2x1ZGUoJ3Rvb2x0aXAuanMnKVxyXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICAgJCgnLmNhcm91c2VsJykuc2xpY2soe1xyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogNCxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogNCxcclxuICAgICAgICByb3dzOiAyXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7O1xyXG5cclxufSk7XHJcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==
