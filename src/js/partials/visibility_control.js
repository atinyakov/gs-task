/**
 * Скрывает элемент hiddenElem при клике за пределами элемента targetElem
 *
 * @param  {Element}   targetElem
 * @param  {Element}   hiddenElem
 * @param  {Function}  [optionalCb] отрабатывает сразу не дожидаясь завершения анимации
 */
function onOutsideClickHide(targetElem, hiddenElem, optionalCb) {
    $(document).bind('mouseup touchend', function(e) {
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
let visibilityControl = function() {
    let settings = {
        types: [
            'show',
            'hide',
            'toggle'
        ]
    };

    if ($('[data-visibility]').length > 0) {

        $(document).on('click', '[data-visibility]', function() {
            let dataType;
            for (let i = 0; i < settings.types.length; i++) {
                dataType = settings.types[i];

                if ($(this).data(dataType)) {
                    let visibilityList = $(this).data(dataType).split('|'),
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

        /**
         * Устанавливает видимость
         * @param {String}  visibilityType тип отображения
         * @param {Array}   list массив элементов, с которым работаем
         * @param {Number}  delay задержка при показе элемента в ms
         */
        function setVisibility(visibilityType, list, delay) {
            for (let i = 0; i < list.length; i++) {
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
        }

    }
};

visibilityControl();
