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
let TabSwitcher = function() {
    const self = this;
    const tabs = $('.js-tabs');

    tabs.each(function() {
        $(this).find('.js-tab-link.is-active').next().addClass('is-open');
    });

    tabs.on('click', '.js-tab-link', function(event) {
        self.open($(this), event);

        // return false;
    });

    /**
     * Открывает таб по клику на какой-то другой элемент
     *
     * @example
     * <span data-tab-open="#tab-login">Open login tab</span>
     */
    $(document).on('click', '[data-tab-open]', function(event) {
        const tabElem = $(this).data('tab-open');
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
    self.open = function(elem, event) {
        if (!elem.hasClass('is-active')) {
            event.preventDefault();
            let parentTabs = elem.closest(tabs);
            parentTabs.find('.is-open').removeClass('is-open');

            elem.next().toggleClass('is-open');
            parentTabs.find('.is-active').removeClass('is-active');
            elem.addClass('is-active');
        } else {
            event.preventDefault();
        }
    };
};

let tabSwitcher = new TabSwitcher();
