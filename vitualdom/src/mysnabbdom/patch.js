import vnode from './vnode.js';
import createElement from './createElement.js';
import patchVnode from './patchVnode.js';
export default function (oldVnode,newVnode){
    //判断传入第一个参数是DOM节点还是虚拟节点
    if(oldVnode.sel ==''||oldVnode.sel ==undefined){
        //说明传入的第一个参数是DOM节点，此时就要包装为虚拟节点
        oldVnode = vnode(oldVnode.tagName.toLowerCase(),{},[],undefined,oldVnode)
    }
    //判断oldVnode 和newVnode是不是同一个节点
    if( oldVnode.key==newVnode.key && oldVnode.sel == newVnode.sel){
        console.log('是同一个节点');
        //当新旧节点没有任何变化时
       patchVnode(oldVnode,newVnode);

    }else{
        console.log('不是同一个节点，暴力删除旧的，插入新的');
       let newVnodeElm = createElement(newVnode);
       //插入到老节点之前
       if(oldVnode.elm.parentNode && newVnodeElm){
            oldVnode.elm.parentNode.insertBefore(newVnodeElm,oldVnode.elm);
       }
       //删除老节点

       //oldVnode.parentNode.removeElement(oldVnode);
    }
};