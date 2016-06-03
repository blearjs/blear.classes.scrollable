/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-03 13:00
 */


'use strict';

var Scrollable = require('../src/index.js');

// new Scrollable({
//     el: 'body'
// }).on('scrollTop', function () {
//     console.log('body ===> scrollTop');
// }).on('scrollBottom', function () {
//     console.log('body ===> scrollBottom');
// });


new Scrollable({
    el: '#demo'
}).on('scrollTop', function () {
    console.log('#demo ===> scrollTop');
}).on('scrollBottom', function () {
    console.log('#demo ===> scrollBottom');
});



