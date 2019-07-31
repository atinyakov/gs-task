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
let Slider = function() {
    const slider = $('.js-range');
    let min,
        max,
        step,
        values;

    slider.each(function () {

        const self = $(this),
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
            slide: function(event, ui) {
                self.find('.ui-slider-handle').children('span').remove();
                self.find('.ui-slider-handle:nth-child(2)').append(`<span>${ui.values[0]}</span>`);
                self.find('.ui-slider-handle:nth-child(3)').append(`<span>${ui.values[1]}</span>`);
            }
        });

        self.find('.ui-slider-handle:nth-child(2)').append(`<span>${range.slider('values', 0)}</span>`);
        self.find('.ui-slider-handle:nth-child(3)').append(`<span>${range.slider('values', 1)}</span>`);

    });
};

let slider = new Slider();
