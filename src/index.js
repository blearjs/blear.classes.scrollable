/**
 * 可滚动的
 * 图示
 * ```
 *      _____ ----------> scroller
 *     |    |
 *     |    |
 * ====|====|==== ------> container
 *     |    |
 * ====|====|====
 *     |    |
 *     |    |
 *     -----
 * ```
 * 
 * @author ydr.me
 * @create 2016-04-25 17:07
 */

'use strict';

var Events =    require('blear.classes.events');
var object =    require('blear.utils.object');
var time =      require('blear.utils.time');
var number =    require('blear.utils.number');
var selector =  require('blear.core.selector');
var attribute = require('blear.core.attribute');
var event =     require('blear.core.event');
var layout =    require('blear.core.layout');

var win = window;
var doc = win.document;
var bodyEl = doc.body;
var SCROLL_EVENT_TYPE = 'scroll touchstart touchmove touchend touchcancel';
var defaults = {
    /**
     * 滚动的元素
     * @type HTMLElement|String|null
     */
    scrollerEl: null,

    /**
     * 容器，默认是 document
     * @type HTMLElement|String|null
     */
    containerEl: null
};
var Scrollable = Events.extend({
    className: 'Scrollable',
    constructor: function (options) {
        var the = this;

        options = object.assign(true, {}, defaults, options);
        Scrollable.parent(the, options);

        // init node
        var containerEl = the[_containerEl] = selector.query(options.containerEl)[0] || doc;
        var scrollerEl = selector.query(options.scrollerEl)[0] || bodyEl;
        var lastScrollLeft = 0;
        var lastScrollTop = 0;

        // init event
        event.on(containerEl, SCROLL_EVENT_TYPE, the[_onScroll] = function (ev) {
            var scrollerOuterWidth = layout.outerWidth(scrollerEl);
            var scrollerMarginVertical =
                number.parseFloat(attribute.style(scrollerEl, 'marginTop')) +
                number.parseFloat(attribute.style(scrollerEl, 'marginBottom'));
            var scrollerOuterHeight = layout.outerHeight(scrollerEl) + scrollerMarginVertical;
            var containerWidth = layout.width(containerEl);
            var containerHeight = layout.height(containerEl);
            var maxScrollLeft = scrollerOuterWidth - containerWidth;
            var maxScrollTop = scrollerOuterHeight - containerHeight;
            var scrollLeft = layout.scrollLeft(containerEl);
            var scrollTop = layout.scrollTop(containerEl);
            var meta = {
                scrollLeft: scrollLeft,
                scrollTop: scrollTop,
                maxScrollLeft: maxScrollLeft,
                maxScrollTop: maxScrollTop
            };

            if (scrollTop === 0) {
                the.emit('scrollTop', meta);
            } else if (scrollTop === maxScrollTop) {
                the.emit('scrollBottom', meta);
            }

            if (scrollLeft === 0) {
                the.emit('scrollLeft', meta);
            } else if (scrollLeft === maxScrollLeft) {
                the.emit('scrollRight', meta);
            }

            if (scrollTop > lastScrollTop) {
                the.emit('scrollUp', meta);
            } else if (scrollTop < lastScrollTop) {
                the.emit('scrollDown', meta);
            }

            if (scrollLeft > lastScrollLeft) {
                the.emit('scrollPush', meta);
            } else if (scrollLeft < lastScrollLeft) {
                the.emit('scrollPull', meta);
            }

            the.emit('scroll', meta);
            lastScrollTop = scrollTop;
        });

        time.nextTick(function () {
            the[_onScroll]();
        });
    },


    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        event.un(the[_containerEl], SCROLL_EVENT_TYPE, the[_onScroll]);
        Scrollable.parent.destroy(the);
    }
});
var _onScroll = Scrollable.sole();
var _containerEl = Scrollable.sole();

Scrollable.defaults = defaults;
module.exports = Scrollable;
