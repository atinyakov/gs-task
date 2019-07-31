$(document).ready(function() {
    /**
     * Глобальные переменные, которые используются многократно
     */
    let globalOptions = {
        // Время для анимаций
        time:  200,

        // Контрольные точки адаптива
        desktopXlSize: 1920,
        desktopLgSize: 1600,
        desktopSize:   1280,
        tabletLgSize:   1024,
        tabletSize:     768,
        mobileLgSize:   640,
        mobileSize:     480,

        // Точка перехода попапов на фулскрин
        popupsBreakpoint: 768,

        // Время до сокрытия фиксированных попапов
        popupsFixedTimeout: 5000,

        // Проверка touch устройств
        isTouch: $.browser.mobile,

        lang: $('html').attr('lang')
    };

    // Брейкпоинты адаптива
    // @example if (globalOptions.breakpointTablet.matches) {} else {}
    const breakpoints = {
        breakpointDesktopXl: window.matchMedia(`(max-width: ${globalOptions.desktopXlSize - 1}px)`),
        breakpointDesktopLg: window.matchMedia(`(max-width: ${globalOptions.desktopLgSize - 1}px)`),
        breakpointDesktop: window.matchMedia(`(max-width: ${globalOptions.desktopSize - 1}px)`),
        breakpointTabletLg: window.matchMedia(`(max-width: ${globalOptions.tabletLgSize - 1}px)`),
        breakpointTablet: window.matchMedia(`(max-width: ${globalOptions.tabletSize - 1}px)`),
        breakpointMobileLgSize: window.matchMedia(`(max-width: ${globalOptions.mobileLgSize - 1}px)`),
        breakpointMobile: window.matchMedia(`(max-width: ${globalOptions.mobileSize - 1}px)`)
    };

    $.extend(true, globalOptions, breakpoints);




    $(window).load(() => {
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
    @@include('partials/partials.js');

});
