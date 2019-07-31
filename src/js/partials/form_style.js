/**
 * Стилизует селекты с помощью плагина select2
 * https://select2.github.io
 */
let CustomSelect = function($elem) {
    let self = this;

    self.init = function($initElem) {
        $initElem.each(function() {
            if ($(this).hasClass('select2-hidden-accessible')) {
                return;
            } else {
                let selectSearch = $(this).data('search');
                let minimumResultsForSearch;

                if (selectSearch) {
                    minimumResultsForSearch = 1; // показываем поле поиска
                } else {
                    minimumResultsForSearch = Infinity; // не показываем поле поиска
                }

                $(this).select2({
                    minimumResultsForSearch: minimumResultsForSearch,
                    selectOnBlur: true,
                    dropdownCssClass: 'error'
                });

                $(this).on('change', function(e) {
                    // нужно для вылидации на лету
                    $(this).find(`option[value="${$(this).context.value}"]`).click();
                });
            }
        });
        
    };

    self.update = function($updateElem) {
        $updateElem.select2('destroy');
        self.init($updateElem);
    };

    self.init($elem);
};

/**
 * Стилизует file input
 * http://gregpike.net/demos/bootstrap-file-input/demo.html
 */
$.fn.customFileInput = function() {

    this.each(function(i, elem) {

        const $elem = $(elem);

        // Maybe some fields don't need to be standardized.
        if (typeof $elem.attr('data-bfi-disabled') !== 'undefined') {
            return;
        }

        // Set the word to be displayed on the button
        let buttonWord = 'Browse';
        let className = '';

        if (typeof $elem.attr('title') !== 'undefined') {
            buttonWord = $elem.attr('title');
        }

        if (!!$elem.attr('class')) {
            className = ' ' + $elem.attr('class');
        }

        // Now we're going to wrap that input field with a button.
        // The input will actually still be there, it will just be float above and transparent (done with the CSS).
        $elem.wrap(`<div class="custom-file"><a class="btn ${className}"></a></div>`).parent().prepend($('<span></span>').html(buttonWord));
    })

    // After we have found all of the file inputs let's apply a listener for tracking the mouse movement.
    // This is important because the in order to give the illusion that this is a button in FF we actually need to move the button from the file input under the cursor. Ugh.
    .promise().done(function() {

        // As the cursor moves over our new button we need to adjust the position of the invisible file input Browse button to be under the cursor.
        // This gives us the pointer cursor that FF denies us
        $('.custom-file').mousemove(function(cursor) {

            var input, wrapper,
                wrapperX, wrapperY,
                inputWidth, inputHeight,
                cursorX, cursorY;

            // This wrapper element (the button surround this file input)
            wrapper = $(this);
            // The invisible file input element
            input = wrapper.find('input');
            // The left-most position of the wrapper
            wrapperX = wrapper.offset().left;
            // The top-most position of the wrapper
            wrapperY = wrapper.offset().top;
            // The with of the browsers input field
            inputWidth = input.width();
            // The height of the browsers input field
            inputHeight = input.height();
            //The position of the cursor in the wrapper
            cursorX = cursor.pageX;
            cursorY = cursor.pageY;

            //The positions we are to move the invisible file input
            // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
            moveInputX = cursorX - wrapperX - inputWidth + 20;
            // Slides the invisible input Browse button to be positioned middle under the cursor
            moveInputY = cursorY - wrapperY - (inputHeight / 2);

            // Apply the positioning styles to actually move the invisible file input
            input.css({
                left: moveInputX,
                top: moveInputY
            });
        });

        $('body').on('change', '.custom-file input[type=file]', function() {

            let fileName;
            fileName = $(this).val();

            // Remove any previous file names
            $(this).parent().next('.custom-file__name').remove();
            if (!!$(this).prop('files') && $(this).prop('files').length > 1) {
                fileName = $(this)[0].files.length + ' files';
            } else {
                fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
            }

            // Don't try to show the name if there is none
            if (!fileName) {
                return;
            }

            let selectedFileNamePlacement = $(this).data('filename-placement');
            if (selectedFileNamePlacement === 'inside') {
                // Print the fileName inside
                $(this).siblings('span').html(fileName);
                $(this).attr('title', fileName);
            } else {
                // Print the fileName aside (right after the the button)
                $(this).parent().after(`<span class="custom-file__name">${fileName} </span>`);
            }
        });

    });

};

$('input[type="file"]').customFileInput();
// $('select').customSelect();
var customSelect = new CustomSelect($('select'));
