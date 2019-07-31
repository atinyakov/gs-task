/*
НАСТРОЙКИ ПОПАПОВ
------

Кнопка для вызова:
<button data-href="#popup-id" data-popup="open">Text</button>
Сам попап:
<div id="popup-id" style="display: none;">Popup content</div>

------

ОТКРЫТЬ/ЗАКРЫТЬ попап из js:
var popup = Popup.prototype.getInstance('popup-id');
popup.open();/popup.close();

Закроет все попапы и модальные окна
<button type="button" data-popup="close">Text</button>

------

Поддерживаемые data-атрибуты:

data-animation="zoom"
Применение к попапу кастомной анимации.
Описание анимаций производится в popups.pcss -> .fancybox-skin.

data-time="500"
Время анимации.
Указывается при значении, отличном от переменной globalOptions.time.

data-wrap-class="fancybox-wrap--fullscreen"
Произвольный вспомогательный класс, вставляющийся в обёртку fancybox.

data-breakpoint="1024"
Точка перехода попапа в полноэкранный режим.
Указывается при отличии от globalOptions.popupsBreakpoint.
Поддерживает значение false, если переход производить не нужно.

data-fullscreen="true"
Полноэкранный попап.
Требует data-wrap-class="fancybox-wrap--fullscreen"

data-aside="true"
Боковой попап.
Требует data-wrap-class="fancybox-wrap--aside-left|right"

data-fixed="true"
Фиксированный сверху попап.
Требует data-wrap-class="fancybox-wrap--fixed"

data-dropdown="true"
Попап по типу дропдауна.
Требует data-wrap-class="fancybox-wrap--dropdown-left|center|right"

data-fixed-timeout="1000"
Время до закрытия фиксированного попапа.
Указывается при отличии от globalOptions.popupsFixedTimeout.

data-overlay="false"
Отключает overlay.

data-parent="#parent-id"
Вкладывает попап внутрь указанного блока.

data-breakpoint-hide="1360"
Закрывает попап на указанной ширине.

data-is-carousel="true"
Идентифицирует попап, как содержащий карусель.
Делает для карусели инициализацию после открытия, т.к. стандартная инициализация не распространяется на изначально скрытые карусели.

data-show-parent-after-close="true"
Покажет родительский попап после закрытия внутреннего.
*/

/**
 * Конструктор попапа
 * @param {Object} data Объект со значениями data-атрибутов
 */
 function Popup(data) {
    let self = this;

    self.data = data;
    self.data.breakpoint = data.breakpoint === undefined ? globalOptions.popupsBreakpoint : data.breakpoint;
    self.data.time = data.time === undefined ? globalOptions.time : data.time;

    self.settings = {
        href: data.id,
        fitToView: false,
        margin: 0,
        padding: 0,
        openEffect: 'none',
        closeEffect: 'none',
        centerOnScroll: data.fixed ? true : false,
        parent: data.parent ? data.parent : 'body',
        autoCenter: data.dropdown ? false : true,
        helpers: {
            title: null,
            overlay: {
                locked: data.fixed || data.dropdown ? false : true,
                closeClick: false // блокируем дефолтное закрытие по оверлею, ниже повешен свой обработчик
            }
        },
        tpl: { // для корректного отрабатывания анимации атрибут указывается в шаблоне, а не в обработчиках
            wrap: '<div class="fancybox-wrap" tabIndex="-1">' +
                      '<div class="fancybox-skin ' + data.animation + '">' +
                          '<div class="fancybox-outer">' +
                              '<div class="fancybox-inner"></div>' +
                          '</div>' +
                      '</div>' +
                  '</div>',
            closeBtn: '<button class="fancybox-item fancybox-close" type="button">' +
                          '<svg class="icon icon--cross"><use xlink:href="#icon-cross"></use></svg>' +
                      '</button>'
        },
        onUpdate: function() {
            autosize.update($('.popup textarea'));
        },
        afterShow: function() {
            autosize.update($('.popup textarea'));

            // Фикс полоски от горизонтального скролла при открытии попапа, который появляется сбоку
            setTimeout(function(){
                $.fancybox.update();
            }, 500);

            // Инициализация скрытого slick
            if (self.data.isCarousel) {
                let $carousel = $(self.data.id).find('.js-carousel');
                $carousel.slick('setPosition');
            }
        },
        beforeShow: function() {
            // Добавление опционального класса для .fancybox-wrap
            if (self.data.wrapClass) {
                $('.fancybox-wrap').addClass(self.data.wrapClass);
            }

            // Отключение overlay
            if (self.data.overlay === false) {
                $('.fancybox-overlay').addClass('is-disabled');
            }

            // Вкладываем попап внутрь указанного родителя
            if (self.data.parent) {
                $(self.data.parent).append($('.fancybox-wrap'));
            }

            $('.fancybox-skin').addClass('animated');

            // Фикс багули с несрабатыванием locked: true (wrap вне overlay)
            if (self.settings.helpers.overlay.locked && !$('.fancybox-wrap').closest('.fancybox-overlay').length) {
                $('.fancybox-overlay').append($('.fancybox-wrap'));
                $('html').addClass('fancybox-margin fancybox-lock');
            }
        },
        beforeClose : function() {
            $('.js-datepicker').datepicker('hide');
        },
        afterClose : function() {
            updateSvg($('body'));

            // Если кнопка вызова попапа имеет тултип, то он отключается при открытии (плагин убирает атрибут title).
            // Т.о. при закрытии попапа у таких элементов нужно обратно включить тултипы
            if (!globalOptions.isTouch) {
                $('.js-tooltip:not([title])').tooltip('enable');
            }

            if (self.data.showParentAfterClose) {
                setTimeout(function() {
                    if (self.data.parentPopup) {
                        self.data.parentPopup.open();
                        self.data.parentPopup = undefined;
                        self.data.showParentAfterClose = null;
                    }
                }, 0);
            }
        }
    };

    self.calcSizes();
};

/**
 * Рассчитывает параметры, относящиеся к размерам попапов
 */
Popup.prototype.calcSizes = function() {
    let width, height, autoSize;

    let popupBreakpoint = null;
    if (this.data.breakpoint !== false) {
        popupBreakpoint = window.matchMedia(`(max-width: ${this.data.breakpoint - 1}px)`);
    }

    if ((this.data.breakpoint !== false && popupBreakpoint.matches) || this.data.fullscreen) {
        width = '100%';
        height = '100%';
        autoSize = false;
    } else if (this.data.aside) {
        width = 'auto';
        height = '100%';
        autoSize = false;
    } else if (this.data.fixed) {
        width = '100%';
        height = 'auto';
        autoSize = false;
    } else if (this.data.dropdown) {
        width = 'auto';
        height = 'auto';
        autoSize = false;
    } else {
        width = 'auto';
        height = 'auto';
        autoSize = true;
    }

    this.settings.width = width;
    this.settings.height = height;
    this.settings.autoSize = autoSize;
}

/**
 * Открывает попап
 */
Popup.prototype.open = function() {
    let self = this;

    if (this.data.dropdown && globalOptions.breakpointTablet.matches) {
        // Не открываем попапы типа дропдаун при ширине < 768
        return;
    }

    this.calcSizes();
    $.fancybox(this.settings);
    updateSvg($(this.data.id));

    // Фиксированные попапы автоматически закрываются через 5 секунд
    if (this.data.fixed && this.data.fixedTimeout !== false) {
        setTimeout(function() {
            // Закрытие через сохранённую в замыкании переменную self,
            // т.к. this в это время может стать другим
            self.close();
        }, this.data.fixedTimeout || globalOptions.popupsFixedTimeout);
    }
};

/**
 * Закрывает все попапы
 * @param {Boolean} isNoAnimate Проигрывать ли анимацию закрытия
 */
Popup.prototype.close = function(isNoAnimate) {
    $('.fancybox-skin').removeClass('animated');

    if (isNoAnimate) {
        $.fancybox.close();
    } else {
        // Ждём пока отработает анимация закрытия
        setTimeout(function() {
            $.fancybox.close();
        }, this.data.time);
    };
}

/**
 * Возвращает объект попапа по его id
 * @param {String} id id попапа (без решетки)
 * @return {Object} Объект попапа
 */
Popup.prototype.getInstance = function(id) {
    let popups = Popup.prototype.popups,
        popup;

    // Находим объект открытого попапа
    $.each(popups, function(index) {
        if (popups[index].data.id == '#' + id) {
            popup = popups[index];

            return false;
        }
    });

    return popup;
}

/**
 * Все объекты попапов, созданные на странице
 */
Popup.prototype.popups = [];

/**
 * Ширина экрана до ресайза
 */
Popup.prototype.windowWidth = $(window).width();

/**
 * Инициализирует попапы с видео
 */
function fancyVideoInit() {
    $('.fancybox-media').fancybox({
        padding: 0,
        helpers: {
            media: {}
        },
        tpl: {
            closeBtn: '<button class="fancybox-item fancybox-close" type="button">' +
                          '<svg class="icon icon--cross"><use xlink:href="#icon-cross"></use></svg>' +
                      '</button>'
        }
    });
}


$(document).on('click', '[data-popup="open"]', function() {
    let id = $(this).attr('href') || $(this).data('href'),
        popup = Popup.prototype.getInstance(id.slice(1)),
        $parent = $(this).closest('.popup'),
        parentPopup;

    popup.data.showParentAfterClose = $(this).data('show-parent-after-close');


    // Убираем курсор с элемента, чтобы не возникало триггеров тултипа при открытии вкладки и т.д.
    if (!globalOptions.isTouch && $(this).hasClass('js-tooltip')) {
        $(this).tooltip('disable');
    }

    if ($parent.length) {
        parentPopup = Popup.prototype.getInstance($parent.attr('id'));
        popup.data.parentPopup = parentPopup;
        setTimeout(function() {
            popup.open();
        }, parentPopup.data.time);

    } else {
        popup.open();
    }

});

$(document).on('click', '[data-popup="close"]', function() {
    let id = $('.fancybox-opened .popup').attr('id'),
        popup = Popup.prototype.getInstance(id);

    popup.close();
});

$(document).on('click', '.fancybox-overlay', function(e) {
    // При клике по оверлею вручную вызываем функцию закрытия, чтобы отработала кастомная анимация
    let id = $('.fancybox-opened .popup').attr('id'),
        popup = Popup.prototype.getInstance(id);

    // Из-за всплытия закрываем попап только в том случае, если клик был вне "тела" попапа
    if (!$(e.target).closest('.fancybox-wrap').length) {
        popup.close();
    }
});

$(window).resize(function() {
    // На ресайзе интересует только открытый попап
    if (!$('.fancybox-opened').length) return null;

    let id = $('.fancybox-opened .popup').attr('id'),
        popup = Popup.prototype.getInstance(id),
        isDiff = false,
        oldSettings = {};

    if (popup.data.dropdown && globalOptions.breakpointTablet.matches) {
        // Закрываем попапы типа дропдаун при ширине < 768
        popup.close(true);
        return null
    }

    $.each(popup.settings, function(key, value) {
        oldSettings[key] = value;
    });

    // Выполняем перерасчёт размеров
    popup.calcSizes();

    if (popup.settings.width != oldSettings.width ||
        popup.settings.height != oldSettings.height ||
        popup.settings.autoSize != oldSettings.autoSize) {
        isDiff = true;
    }

    // И только если настройки поменялись, открываем его заново с новыми параметрами
    if (isDiff) {
        popup.close(true);
        popup.open();

        // Фикс багули с несрабатыванием locked: true (wrap вне overlay)
        $('.fancybox-overlay').append($('.fancybox-wrap'));
        $('html').addClass('fancybox-margin fancybox-lock');
    }

    // Убираем инлайновый display, который перебивает стили из popups.pcss
    $('#' + id).css('display', '');

    // Скрываем попапы со свойством data-breakpoint-hide
    if (popup.data.breakpointHide) {
        let breakpointHide = window.matchMedia(`(max-width: ${popup.data.breakpointHide - 1}px)`);

        if ((breakpointHide.matches && Popup.prototype.windowWidth >= popup.data.breakpointHide) ||
            (!breakpointHide.matches && Popup.prototype.windowWidth < popup.data.breakpointHide)) {
            popup.close();
        }
    }

    Popup.prototype.windowWidth = $(window).width();
});

(function() {
    $('.popup').each(function() {
        let data = {
            id: '#' + $(this).attr('id'),
            breakpoint: $(this).data('breakpoint'),
            animation: $(this).data('animation'),
            time: $(this).data('time'),
            wrapClass: $(this).data('wrap-class'),
            fullscreen: $(this).data('fullscreen'),
            aside: $(this).data('aside'),
            fixed: $(this).data('fixed'),
            fixedTimeout: $(this).data('fixed-timeout'),
            overlay: $(this).data('overlay'),
            dropdown: $(this).data('dropdown'),
            parent: $(this).data('parent'),
            parentId: $(this).data('parent-id'),
            breakpointHide: $(this).data('breakpoint-hide'),
            isCarousel: $(this).data('is-carousel'),
            showParentAfterClose: null
        };

        Popup.prototype.popups.push(new Popup(data));
    });

    fancyVideoInit();
})();

// Fix попапа при ресайзе
let resizePopupTimer;
$(window).resize(function() {
    clearTimeout(resizePopupTimer);
    resizePopupTimer = setTimeout(function(){
        $.fancybox.update();
    }, 500);
});
