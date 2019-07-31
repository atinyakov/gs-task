/**
 * Реализует кастомный скроллбар с помощью malihu-custom-scrollbar-plugin
 * @see http://manos.malihu.gr/jquery-custom-content-scroller/
 *
 * @example
 * <div class="some-scroll-block js-scrollbar"></div>
 */
function customizeScrollbar() {
    if ($('.js-scrollbar').length > 0) {
        $('.js-scrollbar').mCustomScrollbar({
            theme: 'custom'
        });
    }

    if ($('.js-scrollbar-horizontal').length > 0) {
        $('.js-scrollbar-horizontal').mCustomScrollbar({
            theme: 'custom',
            autoHideScrollbar: true,
            axis: 'x'
        });
    }
}

$(window).load(function() {
    customizeScrollbar();
});
