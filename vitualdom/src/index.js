import h from './mysnabbdom/h.js'
import patch from './mysnabbdom/patch.js'

const myVnode1 = h('section',{},[
    h('p',{key:'A'},'A'),
    h('p',{key:'B'},'B'),
    h('p',{key:'C'},'C')
]);
//  const myVnode1 = h('h1',{},'111')
const container  = document.getElementById('container')
const btn = document.getElementById('btn');

patch(container,myVnode1);

const Vnode2 = h('section',{},[
    h('p',{key:'A'},'A'),
    h('p',{key:'B'},'B'),
    h('p',{key:'M'},'M'),
    h('p',{key:'N'},'N'),
    h('p',{key:'C'},'C')

])

btn.onclick= function(){
    patch(myVnode1,Vnode2);
}