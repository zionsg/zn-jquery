/**
 * znResize jQuery plugin
 *
 * @author  Zion Ng <zion@intzone.com>
 * @link    https://github.com/zionsg/zn-jquery/tree/master/znResize for canonical source repository
 * @version 1.1.0, 2013-06-26
 */

(function ($) {

    /**
     * Resize image(s) to fit parent container
     *
     * @see    $.fn.znResize.defaults for available options
     * @return DOMElement
     */
    $.fn.znResize = function (options) {
        var config = $.extend({}, $.fn.znResize.defaults, options), // merge defaults with user options
            strategies = $.fn.znResize.strategies,
            strategy = config.strategy;

        // Ensure strategy is a valid callback
        if ('string' === $.type(strategy) && strategy in $.fn.znResize.strategies) {
            strategy = $.fn.znResize.strategies[strategy];
        }
        if (!strategy || $.type(strategy) !== 'function') {
            return this;
        }

        this.each(function () {
            $(this).parent().css('overflow', 'hidden');
            strategy(this, config);
        });

        return this;
    };

    /**
     * Plugin defaults – added as a property on the plugin function
     *
     * @param string|callback strategy Default = 'crop'. Strategy for fitting image in container
     *                                 Either an existing key in $.fn.znResize.strategies or
     *                                 a user callback with the same method signature
     * @param bool center Default = true. Flag to horizontally align image in the center of parent container
     * @param bool middle Default = true. Flag to vertically align image in the middle of parent container
     */
    $.fn.znResize.defaults = {
        strategy: 'crop',
        center: true,
        middle: true
    };

    /**
     * Strategy callbacks for fitting image in container - added as a property on the plugin function
     *
     * Method signature for callback is as follows:
     * @param  DOMElement element Image element
     * @param  array      config  Merged config options
     * @return void
     */
    $.fn.znResize.strategies = {
        'crop' : function (element, config) {
            if (getNaturalWidth(element) >= getNaturalHeight(element)) {
                $(element).css('height', '100%').css('width', null);
            } else {
                $(element).css('width', '100%').css('height', null);
            }
        },

        'fit' : function (element, config) {
            var $element = $(element),
                $parent = $element.parent();

            if (getNaturalWidth(element) >= getNaturalHeight(element)) {
                $element.css('width', '100%').css('height', null);
            } else {
                $element.css('height', '100%').css('width', null);
            }

            if (config.center) {
                // computing width difference does not work if ancestors have text-align set, hence auto
                $parent.css('text-align', 'center');
                $element.css('margin-left', 'auto');
            }
            if (config.middle) {
                // 'auto' for margin does not work here
                $parent.css('vertical-align', 'middle');
                $element.css('margin-top', ($parent.height() - $element.height()) / 2);
            }
        }
    };

    /**
     * Get natural width of image element - only works if image has completed loading
     *
     * @param  DOMElement element Image element
     * @return int|float
     */
    function getNaturalWidth(element)
    {
        return element.naturalWidth || $(element).css('width', 'auto').width(); // latter to support IE8 and below
    }

    /**
     * Get natural height of image element - only works if image has completed loading
     *
     * @param  DOMElement element Image element
     * @return int|float
     */
    function getNaturalHeight(element)
    {
        return element.naturalHeight || $(element).css('height', 'auto').height(); // latter to support IE8 and below
    }

}(jQuery));
