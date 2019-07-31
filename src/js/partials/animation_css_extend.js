/**
 * Расширение animate.css
 * @param  {String} animationName название анимации
 * @param  {Function} callback функция, которая отработает после завершения анимации
 * @return {Object} объект анимации
 * 
 * @see  https://daneden.github.io/animate.css/
 * 
 * @example
 * $('#yourElement').animateCss('bounce');
 * 
 * $('#yourElement').animateCss('bounce', function() {
 *     // Делаем что-то после завершения анимации
 * });
 */
$.fn.extend({
    animateCss: function(animationName, callback) {
        let animationEnd = (function(el) {
            let animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (let t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    }
});