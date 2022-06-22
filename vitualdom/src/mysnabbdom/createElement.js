export default function createElement(vnode){

    let domNode = document.createElement(vnode.sel);

    if(vnode.text !==''&&(vnode.children ==undefined||vnode.length==0)){
      
        domNode.innerText =vnode.text;
  
    }else if (Array.isArray(vnode.children)&&vnode.children.length>0){
        
        //当h函数的第三个参数为子元素时
        for(let i =0;i<vnode.children.length;i++){

            let ch =vnode.children[i];

            console.log(ch);

            let chDOM = createElement(ch);

            domNode.appendChild(chDOM);
        }
    
    }
    vnode.elm = domNode;
    return vnode.elm;
}