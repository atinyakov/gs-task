const datepickerDefaultOptions = {
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
let Datepicker = function() {
    let datepicker = $('.js-datepicker');

    datepicker.each(function () {
        let minDate = $(this).data('date-min');
        let maxDate = $(this).data('date-max');

        let itemOptions = {
            minDate: minDate || null,
            maxDate: maxDate || null,
            onSelect: function() {
                $(this).change();
                $(this).closest('.field').addClass('is-filled');
            }
        };

        $.extend(true, itemOptions, datepickerDefaultOptions);

        $(this).datepicker(itemOptions);
    });
};

let datepicker = new Datepicker();






// Диапазон дат
let DatepickerRange = function() {
    let datepickerRange = $('.js-datepicker-range');

    datepickerRange.each(function () {
        let fromItemOptions = {};
        let toItemOptions = {};

        $.extend(true, fromItemOptions, datepickerDefaultOptions);
        $.extend(true, toItemOptions, datepickerDefaultOptions);

        let dateFrom = $(this).find('.js-range-from').datepicker(fromItemOptions);

        let dateTo = $(this).find('.js-range-to').datepicker(toItemOptions);

        dateFrom.on('change', function() {
            dateTo.datepicker('option', 'minDate', getDate(this));

            dateTo.prop('required', true);

            if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
                $(this).parsley().validate();
            }
        });

        dateTo.on('change', function() {
            dateFrom.datepicker('option', 'maxDate', getDate(this));

            dateFrom.prop('required', true);

            if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
                $(this).parsley().validate();
            }
        });
    });

    function getDate(element) {
        let date;

        try {
            date = $.datepicker.parseDate(datepickerDefaultOptions.dateFormat, element.value);
        } catch(error) {
            date = null;
        }

        return date;
    }
};

let datepickerRange = new DatepickerRange();