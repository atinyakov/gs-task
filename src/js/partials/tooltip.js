/**
 * Реализует тултипы
 * @see  http://api.jqueryui.com/tooltip/
 */
// $('.js-tooltip').tooltip({
//     position: {
//         my: 'center top+15',
//         at: 'center bottom',
//         collision: 'flipfit',
//         show: {
//             effect: 'fade',
//             duration: globalOptions.time
//         },
//         using: function(position, feedback) {
//             $(this).css(position).addClass(`${feedback.vertical} ${feedback.horizontal}`);
//         }
//     },
//     content: function () {
//         return $(this).prop('title') || $(this).data('title');
//     }
// });

/**
 * Реализует тултипы
 * @see  http://api.jqueryui.com/tooltip/
 */
class Tooltip {
    constructor($element, options) {
        if (!$element) {
            throw new Error('You need to set element option');
            return;
        } else {
            this.element = $element;
        }

        if (!options) {
            this.options = {};
        } else {
            this.options = $.extend(true, {}, options);
        }
    }

    /**
     * Инициализация
     * @public
     */
    init() {
        let self = this;

        self._checkRequiredOptions();

        self.element.tooltip(self.options);
    }

    /**
     * Destroy
     * @public
     */
    destroy() {
        let self = this;

        self.element.tooltip('destroy');
    }

    /**
     * Устанавливает опцию ui.tooltip 
     * @public
     */
    setOption(option, value) {

    }

    /**
     * Проверяет наличие всех обязательных параметров, устанавливает дефольные значения
     * @private
     */
    _checkRequiredOptions() {
        let self = this;

        if (!self.options.hasOwnProperty('content')) {
            self.options.content = function() {
                return $(this).prop('title') || $(this).data('title');
            }
        }


        if (!self.options.hasOwnProperty('position')) {
            self.options.position = {};
        }

        if (self.options.hasOwnProperty('position') && typeof self.options.position == 'object') {
            if (!self.options.position.hasOwnProperty('using')) {
                self.options.position.using = function(position, feedback) {
                    $(this).css(position).addClass(`${feedback.vertical} ${feedback.horizontal}`);
                };
            }

            if (!self.options.position.hasOwnProperty('show')) {
                self.options.position.show = {
                    effect: 'fade',
                    duration: globalOptions.time
                };
            }

            if (!self.options.position.hasOwnProperty('collision')) {
                self.options.position.collision = 'flipfit';
            }

            if (!self.options.position.hasOwnProperty('my')) {
                self.options.position.my = 'left+16 top-20';
            }

            if (!self.options.position.hasOwnProperty('at')) {
                self.options.position.at = 'right center';
            }
        }
    }
};

let tip = new Tooltip({
    element: $('.js-tooltip')
});


tip.init();