/**
 * znResize jQuery plugin
 *
 * @author  Zion Ng <zion@intzone.com>
 * @link    https://github.com/zionsg/zn-jquery/tree/master/znResize
 * @version 1.0.0, 2013-06-25
 */

(function ($) {

    /**
     * Resize image to fit parent container
     *
     * @param   string strategy Default = 'crop'. Strategy for fitting image in container
     * @return  this
     */
    $.fn.znResize = function (options) {
        // Merge default options with user options
        var config = $.extend({
            strategy: 'crop'
        }, options);

        this.each(function () {
            // IE8 and lower do not support naturalWidth and naturalHeight hence the .css() check
            var naturalWidth  = this.naturalWidth || $(this).css('width', 'auto').width(),
                naturalHeight = this.naturalHeight || $(this).css('height', 'auto').height();

            $(this).parent().css('overflow', 'hidden');
            if (naturalWidth >= naturalHeight) {
                $(this).css('height', '100%').css('width', null);
            } else {
                $(this).css('width', '100%').css('height', null);
            }
        });

        return this;
    };

}(jQuery));