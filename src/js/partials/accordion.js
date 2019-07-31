/**
 * UI аккордион
 * @see  http://api.jqueryui.com/accordion/
 */
const accordion = function() {
    $('.js-accordion').accordion({
        header: '.js-accordion-head',
        animate: globalOptions.time,
        heightStyle: 'content',
        beforeActivate: function(event, ui) {
            return !$(event.currentTarget).hasClass('is-disabled');
        }
    });
};

$(window).load(accordion);
