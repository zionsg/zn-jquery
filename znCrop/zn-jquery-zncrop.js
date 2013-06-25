/**
 * znCrop jQuery plugin
 *
 * @author  Zion Ng <zion@intzone.com>
 * @link    https://github.com/zionsg/zn-jquery/tree/master/znCrop
 * @version 1.0.0, 2013-06-25
 */

(function ($) {

    /**
     * Resize and crop <img> children to fill their parent containers
     *
     * @example $('div.thumbnail').znCrop();
     * @param   bool firstLevel Default = true. Flag to restrict to 1st level <img> only.
     * @return  this
     */
    $.fn.znCrop = function (options) {
        // Merge default options with user options
        var config = $.extend({
            firstLevel: true
        }, options);

        this.css('overflow', 'hidden');
        (config.firstLevel ? this.children('img') : this.find('img')).each(function () {
            var naturalWidth  = this.naturalWidth || $(this).css('width', 'auto').width(),
                naturalHeight = this.naturalHeight || $(this).css('height', 'auto').height();
            if (naturalWidth >= naturalHeight) {
                $(this).css('height', '100%').css('width', null);
            } else {
                $(this).css('width', '100%').css('height', null);
            }
        });

        return this;
    };

}(jQuery));
