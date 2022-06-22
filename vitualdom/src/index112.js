import h from './mysnabbdom/h.js';

const myVnode1 = h('div',{},[
    h('p',{},'1'),
    h('p',{},'2'),
    h('p',{},'3'),
    h('p',{},[
        h('span',{},'芜湖起飞')
    ]),
]);
console.log(myVnode1);
