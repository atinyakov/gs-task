var locale = globalOptions.lang == 'ru-RU' ? 'ru' : 'en';

Parsley.setLocale(locale);

/* Настройки Parsley */
$.extend(Parsley.options, {
    trigger: 'blur change', // change нужен для select'а
    validationThreshold: '0',
    errorsWrapper: '<div></div>',
    errorTemplate: '<p class="parsley-error-message"></p>',
    classHandler: function(instance) {
        const $element = instance.$element;
        let type = $element.attr('type'),
            $handler;
        if (type == 'checkbox' || type == 'radio') {
            $handler = $element; // то есть ничего не выделяем (input скрыт), иначе выделяет родительский блок
        }
        else if ($element.hasClass('select2-hidden-accessible')) {
            $handler = $('.select2-selection--single', $element.next('.select2'));
        }

        return $handler;
    },
    errorsContainer: function(instance) {
        const $element = instance.$element;
        let type = $element.attr('type'),
            $container;
            
        if (type == 'checkbox' || type == 'radio') {
            $container = $(`[name="${$element.attr('name')}"]:last + label`).next('.errors-placement');
        }
        else if ($element.hasClass('select2-hidden-accessible')) {
            $container = $element.next('.select2').next('.errors-placement');
        }
        else if (type == 'file') {
            $container = $element.closest('.custom-file').next('.errors-placement');
        }
        else if ($element.closest('.js-datepicker-range').length) {
            $container = $element.closest('.js-datepicker-range').next('.errors-placement');
        }
        else if ($element.attr('name') == 'is_recaptcha_success') {
            $container = $element.parent().next('.g-recaptcha').next('.errors-placement');
        }

        return $container;
    }
});

// Кастомные валидаторы

// Только русские буквы, тире, пробелы
Parsley.addValidator('nameRu', {
    validateString: function(value) {
        return /^[а-яё\- ]*$/i.test(value);
    },
    messages: {
        ru: 'Cимволы А-Я, а-я, " ", "-"',
        en: 'Only simbols А-Я, а-я, " ", "-"'
    }
});

// Только латинские буквы, тире, пробелы
Parsley.addValidator('nameEn', {
    validateString: function(value) {
        return /^[a-z\- ]*$/i.test(value);
    },
    messages: {
        ru: 'Cимволы A-Z, a-z, " ", "-"',
        en: 'Only simbols A-Z, a-z, " ", "-"'
    }
});

// Только латинские и русские буквы, тире, пробелы
Parsley.addValidator('name', {
    validateString: function(value) {
        return /^[а-яёa-z\- ]*$/i.test(value);
    },
    messages: {
        ru: 'Cимволы A-Z, a-z, А-Я, а-я, " ", "-"',
        en: 'Only simbols A-Z, a-z, А-Я, а-я, " ", "-"'
    }
});

// Только цифры и русские буквы
Parsley.addValidator('numLetterRu', {
    validateString: function(value) {
        return /^[0-9а-яё]*$/i.test(value);
    },
    messages: {
        ru: 'Cимволы А-Я, а-я, 0-9',
        en: 'Only simbols А-Я, а-я, 0-9'
    }
});

// Только цифры, латинские и русские буквы
Parsley.addValidator('numLetter', {
    validateString: function(value) {
        return /^[а-яёa-z0-9]*$/i.test(value);
    },
    messages: {
        ru: 'Cимволы A-Z, a-z, А-Я, а-я, 0-9',
        en: 'Only simbols A-Z, a-z, А-Я, а-я, 0-9'
    }
});

// Телефонный номер
Parsley.addValidator('phone', {
    validateString: function(value) {
        return /^[-+0-9() ]*$/i.test(value);
    },
    messages: {
        ru: 'Некорректный телефонный номер',
        en: 'Incorrect phone number'
    }
});

// Только цифры
Parsley.addValidator('number', {
    validateString: function(value) {
        return /^[0-9]*$/i.test(value);
    },
    messages: {
        ru: 'Cимволы 0-9',
        en: 'Only simbols 0-9'
    }
});

// Почта без кириллицы
Parsley.addValidator('email', {
    validateString: function(value) {
        return /^([A-Za-zА-Яа-я0-9\-](\.|_|-){0,1})+[A-Za-zА-Яа-я0-9\-]\@([A-Za-zА-Яа-я0-9\-])+((\.){0,1}[A-Za-zА-Яа-я0-9\-]){1,}\.[a-zа-я0-9\-]{2,}$/.test(value);
    },
    messages: {
        ru: 'Некорректный почтовый адрес',
        en: 'Incorrect email address'
    }
});

// Формат даты DD.MM.YYYY
Parsley.addValidator('date', {
    validateString: function(value) {
        let regTest = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
            regMatch = /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
            min = arguments[2].$element.data('dateMin'),
            max = arguments[2].$element.data('dateMax'),
            minDate, maxDate, valueDate, result;

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
});


// Файл ограниченного размера
Parsley.addValidator('fileMaxSize', {
    validateString: function(value, maxSize, parsleyInstance) {
        let files = parsleyInstance.$element[0].files;
        return files.length != 1  || files[0].size <= maxSize * 1024;
    },
    requirementType: 'integer',
    messages: {
        ru: 'Файл должен весить не более, чем %s Kb',
        en: 'File size can\'t be more then %s Kb'
    }
});

// Ограничения расширений файлов
Parsley.addValidator('fileExtension', {
    validateString: function(value, formats) {
        let fileExtension = value.split('.').pop();
        let formatsArr = formats.split(', ');
        let valid = false;

        for (let i = 0; i < formatsArr.length; i++) {
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
});

// Создаёт контейнеры для ошибок у нетипичных элементов
Parsley.on('field:init', function() {
    let $element = this.$element,
        type = $element.attr('type'),
        $block = $('<div/>').addClass('errors-placement'),
        $last;

    if (type == 'checkbox' || type == 'radio') {
        $last = $(`[name="${$element.attr('name')}"]:last + label`);
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
});

// Инициирует валидацию на втором каледарном поле диапазона
Parsley.on('field:validated', function() {
    let $element = $(this.element);
});

$('form[data-validate="true"]').parsley();