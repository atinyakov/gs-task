/**
 * Костыль для обновления xlink у svg-иконок после обновления DOM (для IE)
 * функцию нужно вызывать в событиях, которые вносят изменения в элементы уже после формирования DOM-а
 * (например, после инициализации карусели или открытии попапа)
 *
 * @param  {Element} element элемент, в котором необходимо обновить svg (наприм $('#some-popup'))
 */
function updateSvg(element) {
    let $useElement = element.find('use');

    $useElement.each(function( index ) {
        if ($useElement[index].href && $useElement[index].href.baseVal) {
            $useElement[index].href.baseVal = $useElement[index].href.baseVal; // trigger fixing of href
        }
    });
}