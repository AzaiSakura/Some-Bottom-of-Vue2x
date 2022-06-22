import createElement from "./createElement";

export default function patchVnode(newVnode,oldVnode){
   // if (oldVnode === newVnode)return ;

    //判断新vnode有无text属性
    if(newVnode.text !=undefined &&newVnode.children ==undefined||newVnode.children.length==0){
        //说明新vnode有text属性
        if(newVnode.text !=oldVnode.text){
            //说明文本不相同 
           oldVnode.elm.innerText =newVnode.text;
        }

    }else{
        //newVnode没有text属性
        //先判断老的oldVnode有无text属性，有就删除（因为这里已经知道新的没有text属性了）
        //判断老的有没有children属性
        if(oldVnode.children !=undefined && oldVnode.children.length>0){
            //老的children，此时就是最复杂情况，新老都有children 
            //所有未处理节点开头
            let un =0;  
            for(let i = 0;i<newVnode.children.length;i++){
                let ch = newVnode.children[i];
                //看看oldVnode中有没有节点和他是一样的
                let isExist = false;
                for(let j = 0;j<oldVnode.children.length;j++){
                    if(oldVnode.children[j].sel==ch.sel&&oldVnode.children[j].key==ch.key){
                        isExist = true;
                    }
                }
                if(!isExist){
                    console.log(ch,i,un);
                    let dom =createElement(ch)
                    ch.elm = dom;
                    if(un<oldVnode.children.length){
                        oldVnode.elm.insertBefore(dom,oldVnode.children[un].elm);
                    }else{
                        oldVnode.elm.appendChild(dom);
                    }
                }else{
                    un ++;
                 
                }
            }
            
        }else{
            //老的没有children，新的有children
            //清空老节点内容
            oldVnode.elm.innerHTML = '';
            for(let i =0;i<newVnode.children.length;i++){
            let dom = createElement(newVnode.children[i]);
            oldVnode.elm.appendChild(dom);
            };
        };
        
    }
}