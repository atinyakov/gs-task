/**
 * Добавляет маски в поля форм
 * @see  https://github.com/RobinHerbots/Inputmask
 *
 * @example
 * <input class="js-phone-mask" type="tel" name="tel" id="tel">
 */
$('.js-phone-mask').inputmask('+7(999) 999-99-99', {
    clearMaskOnLostFocus: true,
    showMaskOnHover: false
});
