/**
 * 可滚动的
 * @author ydr.me
 * @create 2016-04-25 17:07
 */

'use strict';

var Events = require('blear.classes.events');
var object = require('blear.utils.object');
var time = require('blear.utils.time');
var selector = require('blear.core.selector');
var event = require('blear.core.event');
var layout = require('blear.core.layout');

var win = window;
var doc = win.document;
var htmlEl = doc.documentElement;
var bodyEl = doc.body;
var SCROLL_EVENT_TYPE = 'scroll touchstart touchmove touchend touchcancel';
var defaults = {
    /**
     * 滚动的容器元素
     * @type HTMLElement|String|null
     */
    el: null,

    /**
     * 水平偏移值
     * @type Number
     */
    offsetX: 20,

    /**
     * 垂直偏移值
     * @type Number
     */
    offsetY: 20
};
var Scrollable = Events.extend({
    className: 'Scrollable',
    constructor: function (options) {
        var the = this;

        options = object.assign(true, {}, defaults, options);
        Scrollable.parent(the, options);
        the[_maxScrollLeft] = 0;
        the[_maxScrollTop] = 0;

        // init node
        var containerEl = the[_containerEl] = selector.query(options.el)[0] || doc;
        the[_isRootContainerEl] = isRootContainerEl(containerEl);
        var lastScrollLeft = 0;
        var lastScrollTop = 0;

        // init event
        event.on(containerEl, SCROLL_EVENT_TYPE, the[_onScroll] = function (ev) {
            var scrollLeft = layout.scrollLeft(containerEl);
            var scrollTop = layout.scrollTop(containerEl);
            var offsetX = options.offsetX;
            var offsetY = options.offsetY;
            var maxScrollLeft = the[_maxScrollLeft] - offsetX;
            var maxScrollTop = the[_maxScrollTop] - offsetY;

            var meta = {
                scrollLeft: scrollLeft,
                scrollTop: scrollTop,
                maxScrollLeft: maxScrollLeft,
                maxScrollTop: maxScrollTop
            };

            if (scrollTop <= offsetY && scrollTop < lastScrollTop) {
                the.emit('scrollTop', meta);
            } else if (scrollTop >= maxScrollTop && scrollTop > lastScrollTop) {
                the.emit('scrollBottom', meta);
            }

            if (scrollLeft <= offsetX && scrollLeft < lastScrollLeft) {
                the.emit('scrollLeft', meta);
            } else if (scrollLeft >= maxScrollLeft && scrollLeft > lastScrollLeft) {
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
            the.update();
            the[_onScroll]();
        });
    },


    /**
     * 更新位置信息
     * @returns {Scrollable}
     */
    update: function () {
        var the = this;

        if (the[_isRootContainerEl]) {
            the[_maxScrollLeft] = layout.scrollWidth(the[_containerEl]) - layout.width(win);
            the[_maxScrollTop] = layout.scrollHeight(the[_containerEl]) - layout.height(win);
        } else {
            the[_maxScrollLeft] = layout.scrollWidth(the[_containerEl]) - layout.outerWidth(the[_containerEl]);
            the[_maxScrollTop] = layout.scrollHeight(the[_containerEl]) - layout.outerHeight(the[_containerEl]);
        }

        return this;
    },


    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        event.un(the[_containerEl], SCROLL_EVENT_TYPE, the[_onScroll]);
        Scrollable.invoke('destroy', the);
    }
});
var _onScroll = Scrollable.sole();
var _containerEl = Scrollable.sole();
var _isRootContainerEl = Scrollable.sole();
var _maxScrollLeft = Scrollable.sole();
var _maxScrollTop = Scrollable.sole();
var isRootContainerEl = function (el) {
    return el === win || el === doc || el === htmlEl || el === bodyEl;
};


Scrollable.defaults = defaults;
module.exports = Scrollable;
