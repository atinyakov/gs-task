if ($('.js-label-animation').length > 0) {
    /**
     * Анимация элемента label при фокусе полей формы
     */
    $('.js-label-animation').each(function(index, el) {
        const field = $(el).find('input, textarea');

        if ($(field).val().trim() != '') {
            $(el).addClass('is-filled');
        }

        $(field).on('focus', function(event) {
            $(el).addClass('is-filled');
        }).on('blur', function(event) {
            if ($(this).val().trim() === '') {
                $(el).removeClass('is-filled');
            }
        });
    });
}
